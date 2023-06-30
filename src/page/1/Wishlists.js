import React, { useEffect } from 'react';
import Header from './Header';
import WishlistsProps from './Wishlists-prop';
export default function Wishlists() {
  const [userInfo, setUserInfo] = React.useState('');
  const [likedPage, setLikedPlace] = React.useState('');
  const [arrayOfimg, setArrayOfimg] = React.useState([]);
  useEffect(() => {
    if (document.cookie) {
      cookie();
      likedPlace();
    }
    return;
  });
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
      info[0].user_name = info[0].user_name.charAt(0).toUpperCase();
      setUserInfo(info);
    } catch (err) {
      console.log(err);
    }
  }
  async function likedPlace() {
    try {
      let response = await fetch('http://localhost:9000/Wishlists', {
        method: 'POST',
        body: JSON.stringify({ cookie: document.cookie }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      });
      let img = await response.json();
      if (img === undefined) {
        return;
      }
      setLikedPlace(img);
    } catch (err) {
      console.log(err);
    }
  }
  function imgList() {
    let list = [];
    list.push(likedPage);
    console.log(list);
    setArrayOfimg(() => {
      return list.map((item, index) => {
        return <WishlistsProps key={index} item={item.img} />;
      });
    });
  }
  if (document.cookie) {
    return (
      <div>
        <Header userInfo={userInfo} />
        {arrayOfimg}
        <button onClick={imgList}></button>
      </div>
    );
  } else {
    return;
  }
}
