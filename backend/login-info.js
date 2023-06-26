require('dotenv').config();
let express = require('express');
let app = express();
let PORT = 9000;
let uuid = require('uuid');
let mysql = require('mysql2');
let cors = require('cors');
let bcrypt = require('bcrypt');
console.log( process.env.DATABASE_HOST);
let db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME
});
db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    return;
  }
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.listen(PORT, () => {
  console.log(`Your PORT is ${PORT}`);
});
app.get('/user-list', () => {
  let select = 'SELECT * FROM website;';
  db.query(select, (err) => {
    if (err) {
      console.log(err);
    } else {
      return;
    }
  });
});
app.post('/user-list2', (req, res) => {
  let { userName, password } = req.body;
  let select = 'SELECT * FROM website;';
  db.query(select, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      let matchIndex = result.findIndex((obj) => {
        return bcrypt.compareSync(password, obj.password) && obj.user_name === userName;
      });
      if (matchIndex !== -1) {
        res.status(200).send(result[matchIndex]);
      } else {
        res.status(200).send({ check: false });
      }
    }
  });
});

app.post('/user-list', async (req, res) => {
  let { signUpUser, password, gender } = req.body;
  let select = 'SELECT * FROM website;';
  db.query(select, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      let check = result.find(
        (info) =>
          (info.user_name === signUpUser && info.password === password) ||
          (info.user_name === signUpUser && info.gender === gender)
      );
      if (check === undefined) {
        let cookie = uuid.v4();
        bcrypt.hash(password, 10, (err, hashPassword) => {
          if (err) {
            console.log(err);
          } else {
            signUpUser = hashPassword;
            let insert = `INSERT INTO website(user_name, gender, password,cookie) VALUES('${signUpUser}','${gender}','${password}','${req.body.cookie}')`;

            db.query(insert, (err) => {
              if (err) {
                console.log(err);
              } else {
                let select = `SELECT * FROM airbnb_data WHERE id<= 10`;
                db.query(select, (err, result) => {
                  if (err) {
                    console.log(err);
                  } else {
                    let table = result;
                    let counter = 0;
                    table.forEach((data) => {
                      if (counter < 11) {
                        let insert = `INSERT INTO airbnb_data(cookie,img,name,rating,date,cost,open_spots,liked) 
                        VALUES('${cookie}','${data.img}','${data.name}',${data.rating},'${data.date}','${data.cost}',${data.open_spots},${data.liked})`;
                        db.query(insert, (err) => {
                          if (err) {
                            console.log(err);
                          } else {
                            counter++;
                          }
                        });
                      } else {
                        return;
                      }
                    });
                  }
                });
              }
            });
            res.status(201);
          }
        });
      } else {
        res.status(500).send('Username already in use');
      }
    }
  });
});

app.get('/data', (req, res) => {
  let select = `SELECT * FROM airbnb_data`;
  db.query(select, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send();
    } else {
      res.status(200).send(result);
    }
  });
});
app.post('/data-user', (req, res) => {
  let { cookie } = req.body;
  let select = `SELECT * FROM airbnb_data WHERE cookie = '${cookie}'`;
  db.query(select, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send();
    } else {
      res.status(200).send(result);
    }
  });
});
app.post('/data', (req, res) => {
  let { cookie, value, id } = req.body;
  if (req.body.value === true) {
    req.body.value = 1;
  } else {
    req.body.value = 0;
  }
  let select = `UPDATE  airbnb_data SET liked = ${value} WHERE name = '${id}' AND cookie = '${cookie}' `;
  db.query(select, (err) => {
    if (err) {
      console.log(err);
      res.status(500).send();
    } else {
      res.status(200).send();
    }
  });
});

app.post('/data-list', (req, res) => {
  let { cookie } = req.body;
  let select = `SELECT * FROM airbnb_data WHERE liked=1 AND cookie = '${cookie}'`;
  db.query(select, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send();
    } else {
      res.status(200).send(result);
    }
  });
});
app.post('/airbnb-info', (req, res) => {
  let { pathName, cookie } = req.body;
  if (cookie === '') {
    res.sendStatus(500);
  } else {
    let select = `
      SELECT 
        id, img, name, rating, your_rating, date, cost, open_spots, Invited, liked,
        (SELECT SUM(liked) FROM airbnb_data WHERE name = '${pathName}') AS totalLiked
      FROM airbnb_data
      WHERE name = '${pathName}' AND cookie = '${cookie}'`;

    db.query(select, (err, result) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        if (result.length > 0) {
          const row = result[0];
          row.liked = parseInt(row.liked);
          row.totalLiked = parseInt(row.totalLiked);
          res.status(200).json([row]);
        } else {
          res.status(500).json(false);
        }
      }
    });
  }
});
app.post('/rating', (req, res) => {
  let { rating, cookie, name } = req.body;
  let updateYourRating = `UPDATE airbnb_data SET your_rating = ${rating} WHERE cookie = '${cookie}' AND name = '${name}'`;
  db.query(updateYourRating, (err) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      let updateAvgRating = `UPDATE airbnb_data AS a
        INNER JOIN (
          SELECT AVG(your_rating) AS avg_rating
          FROM airbnb_data
          WHERE name = '${name}'
        ) AS subquery
        ON a.name = '${name}'
        SET a.rating = subquery.avg_rating;`;

      db.query(updateAvgRating, (err) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
    }
  });
});

app.post('/book', async (req, res) => {
  let { book, name, cookie, free, invited } = req.body;
  let update = `UPDATE airbnb_data SET Invited = ${book} WHERE name = '${name}' AND cookie = '${cookie}'`;
  db.query(update, (err) => {
    if (err) {
      console.log(err);
    } else {
      if (invited === 1 && free === 0 && book === false) {
        let update = `UPDATE airbnb_data SET open_spots = open_spots + 1 WHERE name ='${name}';`;
        db.query(update, (err) => {
          if (err) {
            console.log(err);
          } else {
            let update2 = `UPDATE airbnb_data SET invited = 0 WHERE cookie = '${cookie} AND name= ${name}';`;
            db.query(update2, (err) => {
              if (err) {
                console.log(err);
              } else {
                res.status(200).send('+');
              }
            });
          }
        });
      } else if (book === false) {
        let update = `UPDATE airbnb_data SET open_spots = open_spots +  1  WHERE name ='${name}';`;
        db.query(update, (err) => {
          if (err) {
            console.log(err);
          } else {
            let update2 = `UPDATE airbnb_data SET invited = 0 WHERE cookie = '${cookie} AND name= ${name}';`;
            db.query(update2, (err) => {
              if (err) {
                console.log(err);
              } else {
                res.status(200).send('+');
              }
            });
          }
        });
      } else if (book === true) {
        let update = `UPDATE airbnb_data SET open_spots = open_spots - 1  WHERE name ='${name}';`;
        db.query(update, (err) => {
          if (err) {
            console.log(err);
          } else {
            let update2 = `UPDATE airbnb_data SET invited = 1 WHERE cookie = '${cookie} AND name= ${name}';`;
            db.query(update2, (err) => {
              if (err) {
                console.log(err);
              } else {
                res.status(200).send('-');
              }
            });
          }
        });
      }
    }
  });
});

app.post('/user', (req, res) => {
  let { cookie } = req.body;
  let select = `Select * FROM website WHERE cookie = '${cookie}'`;
  db.query(select, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send(result);
    }
  });
});
