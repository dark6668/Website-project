require('dotenv').config();
let express = require('express');
let app = express();
let PORT = 9000;
let uuid = require('uuid');
let mysql = require('mysql2');
let cors = require('cors');
let bcrypt = require('bcrypt');
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
  let select = 'SELECT * FROM website;';
  db.query(select, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      let matchIndex = result.findIndex((obj) => {
        return (
          bcrypt.compareSync(req.body.password, obj.password) && obj.user_name === req.body.userName
        );
      });
      if (matchIndex != -1) {
        res.send(result[matchIndex]);
      } else {
        res.send({ check: false });
      }
    }
  });
});

app.post('/user-list', async (req, res) => {
  let select = 'SELECT * FROM website;';
  db.query(select, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      let check = result.find(
        (info) =>
          (info.user_name === req.body.signUpUser && info.password === req.body.password) ||
          (info.user_name === req.body.signUpUser && info.gender === req.body.gender)
      );
      if (check === undefined) {
        let cookie = uuid.v4();
        bcrypt.hash(req.body.signUpPassword, 10, (err, hashPassword) => {
          if (err) {
            console.log(err);
          } else {
            req.body.signUpPassword = hashPassword;
            let insert = `INSERT INTO website(user_name, gender, password,cookie) VALUES('${req.body.signUpUser}','${req.body.gender}','${req.body.signUpPassword}','${cookie}')`;

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
            res.sendStatus(201);
          }
        });
      } else {
        res.send('Username already in use');
      }
    }
  });
});

app.post('/user', (req, res) => {
  let select = `Select * FROM website WHERE cookie = '${req.body.cookie}'`;
  db.query(select, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});
app.get('/data', (req, res) => {
  let select = `SELECT * FROM airbnb_data`;
  db.query(select, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});
app.post('/data-user', (req, res) => {
  let select = `SELECT * FROM airbnb_data WHERE cookie = '${req.body.cookie}'`;
  db.query(select, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post('/data', (req, res) => {
  if (req.body.value === true) {
    req.body.value = 1;
  } else {
    req.body.value = 0;
  }
  let select = `UPDATE  airbnb_data SET liked = ${req.body.value} WHERE name = '${req.body.id}' AND cookie = '${req.body.cookie}' `;
  db.query(select, (err) => {
    if (err) {
      res.status(500).send();
      console.log(err);
    } else {
      res.status(200).send();
    }
  });
});

app.post('/data-list', (req, res) => {
  let select = `SELECT * FROM airbnb_data WHERE liked=1 AND cookie = '${req.body.cookie}'`;
  db.query(select, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});
app.post('/airbnb-info', (req, res) => {
  if (req.body.cookie === '') {
    res.sendStatus(500);
  } else {
    let select = `SELECT id, img, name, rating, your_rating  ,date, cost, open_spots,Invited,liked FROM airbnb_data WHERE name = '${req.body.pathName}'  AND cookie = '${req.body.cookie}';`;
    let select2 = `SELECT SUM(liked) FROM airbnb_data WHERE name = '${req.body.pathName}';`;
    let list = [];
    db.query(select, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        list.push(result[0]);
        db.query(select2, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            let sum = result[0];
            if (sum['SUM(liked)'] != null || undefined) {
              list[0].liked = parseInt(sum['SUM(liked)']);

              res.json(list);
            } else {
              res.json(false);
            }
          }
        });
      }
    });
  }
});
app.post('/rating', (req, res) => {
  let update = `UPDATE airbnb_data SET your_rating = ${req.body.rating} WHERE cookie = '${req.body.cookie}' AND name = '${req.body.name}'`;
  db.query(update, (err) => {
    if (err) {
      console.log(err);
    } else {
      let update2 = `UPDATE airbnb_data
    SET rating = (
      SELECT avg_rating
      FROM (
        SELECT AVG(your_rating) AS avg_rating
        FROM airbnb_data
        WHERE name = '${req.body.name}'
      ) AS subquery
    )
    WHERE name = '${req.body.name}';`;
      db.query(update2, (err) => {
        if (err) {
          console.log(err);
        } else {
          res.sendStatus(200);
        }
      });
    }
  });
});
app.post('/book', (req, res) => {
  let update = `UPDATE airbnb_data SET Invited = ${req.body.book} WHERE name = '${req.body.name}' AND cookie = '${req.body.cookie}'`;
  db.query(update, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('good');
      if (req.body.book === false) {
        let update = `UPDATE airbnb_data SET open_spots = open_spots + 1 WHERE name ='${req.body.name}';`;
        db.query(update, (err) => {
          if (err) {
            console.log(err);
          } else res.sendStatus(200);
        });
      } else if (req.body.book === true) {
        let update = `UPDATE airbnb_data SET open_spots = open_spots - 1 WHERE name ='${req.body.name}';`;
        db.query(update, (err) => {
          if (err) {
            console.log(err);
          } else res.sendStatus(200);
        });
      }
    }
  });
});
