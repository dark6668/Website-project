import React from 'react';
import PropTypes from 'prop-types';
import AirbnbLogo from '../../Airbnb-Logo.png';
export default function Header(props) {
  if (document.cookie) {
    let [menuHover, setMenuHover] = React.useState(false);
    let [popup, setPopup] = React.useState(false);
    Header.propTypes = {
      userInfo: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          gender: PropTypes.string.isRequired,
          user_name: PropTypes.string.isRequired,
          password: PropTypes.string.isRequired
        })
      ),
      exportData: PropTypes.func,
      list: PropTypes.array
    };
    let menu = () => {
      setMenuHover((menuHover) => !menuHover);
    };
    let openHomePage = () => {
      window.close();
      window.open('http://localhost:3000/home-page');
    };
    let listArray = () => {
      setPopup((popup) => !popup);
    };
    let logOut = async () => {
      let cookiePairs = document.cookie.split(';');
      document.cookie = `${cookiePairs}; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
      try {
        await fetch('http://localhost:9000/pop-user', {
          method: 'GET'
        });
        window.close();
      } catch (err) {
        console.log(err);
      }
    };
    return (
      <div>
        <div className="header-row">
          <div className="img-header">
            <img onClick={openHomePage} src={AirbnbLogo} />
          </div>
          <div onClick={menu} className="flex-column">
            <div className="flex-column-items"></div>
            <div className="flex-column-items"></div>
            <div className="flex-column-items"></div>
          </div>
          <div
            style={menuHover ? { display: 'flex' } : { display: 'none' }}
            className="user-info-container">
            <div onClick={menu} className="flex-column">
              <div className="flex-column-items"></div>
              <div className="flex-column-items"></div>
              <div className="flex-column-items"></div>
            </div>
            <img
              id="user-img"
              src={
                !props.userInfo
                  ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc7ZIHfPTIXGBgil22j80qHIFyMFleSO1tOw&usqp=CAU'
                  : props.userInfo[0].gender === 'male'
                  ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvHn4h1O_ciu6ZJFYud7adF82Hg1XSJFOfGw&usqp=CAU'
                  : props.userInfo[0].gender === 'female'
                  ? 'https://cdn3.iconfinder.com/data/icons/user-avatars-1/512/users-14-512.png'
                  : 'https://d1nhio0ox7pgb.cloudfront.net/_img/g_collection_png/standard/512x512/users5.png'
              }
            />
            {props.userInfo ? props.userInfo[0].user_name : <div>User Name</div>}

            <button onClick={listArray}>Your List</button>
            <button onClick={props.exportData}>Export</button>
            <button onClick={logOut}>Log Out</button>
          </div>
        </div>
        {popup && (
          <div className="popup">
            <div className="user-info-popup">
              Hi {props.userInfo[0].user_name}
              <div>this is your list:</div>
              <section>
                {props.list.length > 0 ? <div> {props.list} </div> : 'Nothing on the list'}
              </section>
            </div>
            <div className="popup-x" onClick={listArray}>
              X
            </div>
            <div className="popup-item"></div>
          </div>
        )}
      </div>
    );
  }
}
