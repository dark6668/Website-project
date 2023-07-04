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
      imgList();
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
    console.log(likedPage.length);

    for (let i = 0; i < likedPage.length; i++) {
      console.log(i);
      console.log(likedPage[i]);

      list.push(<img src={likedPage[i].img} key={i} />);
    }
    setArrayOfimg(() => list);
  }
  if (document.cookie) {
    return (
      <div>
        <Header userInfo={userInfo} />
        <WishlistsProps item={arrayOfimg} />
      </div>
    );
  } else {
    return;
  }
}
