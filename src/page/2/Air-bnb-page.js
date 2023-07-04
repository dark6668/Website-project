import React from 'react';
import AirBnbComponent from './air-bnb-component';
import Header from '../1/Header';
import { useEffect } from 'react';
export default function AirbnbPage() {
  let [airbnbId, setAirbnbId] = React.useState('');
  let [userInfo, setUserInfo] = React.useState('');
  let [listPlaces, setListPlace] = React.useState([]);
  useEffect(() => {
    if (document.cookie) {
      pageInfo();
      cookie();
    } else {
      return;
    }
  }, [cookie]);
  async function cookie() {
    let cookieUser = {
      cookie: document.cookie
    };
    listOfdata();
    async function listOfdata() {
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
    }
    try {
      let response = await fetch('http://localhost:9000/user', {
        method: 'POST',
        body: JSON.stringify(cookieUser),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      });
      let info = await response.json();
      info[0].user_name = info[0].user_name.charAt(0).toUpperCase();
      setUserInfo(info);
    } catch (err) {
      console.log(err);
    }
  }
  let exportData = () => {
    // if (listPlaces.length === 0) {
    //   alert('You dont have a list');
    // } else {
    //   const csvContent = listPlaces;
    //   const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent);
    //   window.open(encodedUri);
    // }
  };

  async function pageInfo() {
    const pathName = window.location.pathname.split('/').pop();
    let res = await fetch('http://localhost:9000/airbnb-info', {
      method: 'POST',
      body: JSON.stringify({ pathName, cookie: document.cookie }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    });
    setAirbnbId(await res.json());
  }
  if (airbnbId != false && document.cookie) {
    return (
      <div>
        <Header exportData={exportData} list={listPlaces} userInfo={userInfo} />
        <div className="airbnb-component-container">
          <AirBnbComponent Item={airbnbId[0]} pageInfo={pageInfo} />
        </div>
      </div>
    );
  } else {
    return;
  }
}
