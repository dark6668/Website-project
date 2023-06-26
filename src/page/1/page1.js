import React, { useEffect } from 'react';
import Header from './Header';
import Img from './img-component';
import AirbnbPage from '../2/Air-bnb-page';
export default function HomePage() {
  const [listPlaces, setListPlace] = React.useState([]);
  const [userInfo, setUserInfo] = React.useState('');
  const [imgData, setImgData] = React.useState('');
  const [toggleCount, setToggleCount] = React.useState(0);
  useEffect(() => {
    if (document.cookie) {
      cookie();
      data();
    }
    return;
  }, [data, cookie]);
  useEffect(() => {
    listdata();
  }, [toggleCount]);

  async function data() {
    let cookieUser = {
      cookie: document.cookie
    };
    try {
      let response = await fetch('http://localhost:9000/data-user', {
        method: 'POST',
        body: JSON.stringify(cookieUser),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      });
      let name = await response.json();
      setImgData(name);
    } catch (err) {
      console.log(err);
    }
  }
  let list = [];
  for (const key in imgData) {
    const item = imgData[key];
    let map = [
      {
        id: item.id,
        img: item.img,
        name: item.name,
        rating: item.rating,
        date: item.date,
        cost: item.cost,
        openSpots: item.open_spots,
        liked: item.liked === 0 ? false : true
      }
    ];
    list.push(map);
  }
  async function toggle(id, value) {
    try {
      await fetch('http://localhost:9000/data', {
        method: 'POST',
        body: JSON.stringify({ id: id, value: value, cookie: document.cookie }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      }).then(setToggleCount((prevCount) => prevCount + 1));
    } catch (err) {
      console.log(err);
    }
  }
  let listdata = async () => {
    try {
      let res = await fetch('http://localhost:9000/data-list', {
        method: 'post',
        body: JSON.stringify({ cookie: document.cookie }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      });
      let arrayList = await res.json();
      setListPlace(
        arrayList.map((item) => {
          return <p key={item.id}>{item.name}</p>;
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  let airbnbPage = (id) => {
    console.log(id);
    window.open(`http://localhost:3000/home-page/${id}`);
    return <AirbnbPage id={id} />;
  };

  let img = list.flatMap((array) => {
    return array.map((image) => {
      return (
        <Img
          key={image.id}
          item={image}
          toggle={toggle}
          openSpots={image.openSpots}
          airbnbPage={airbnbPage}
        />
      );
    });
  });
  let exportData = () => {
    // if (listPlaces.length === 0) {
    //   alert('You dont have a list');
    // } else {
    //   const csvContent = listPlaces;
    //   const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent);
    //   window.open(encodedUri);
    // }
  };
  async function cookie() {
    let cookieUser = {
      cookie: document.cookie
    };
    try {
      let response = await fetch('http://localhost:9000/user', {
        method: 'POST',
        body: JSON.stringify(cookieUser),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      });
      let info = await response.json();

      setUserInfo(info);
    } catch (err) {
      console.log(err);
    }
  }
  if (document.cookie) {
    return (
      <div>
        <Header
          exportData={exportData}
          list={listPlaces}
          userInfo={userInfo}
          airbnbPage={airbnbPage}
        />
        <div className="containerContainerContact">{img}</div>
      </div>
    );
  } else {
    return;
  }
}
