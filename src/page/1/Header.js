import React from 'react';
import PropTypes from 'prop-types';
export default function Header(props) {
  const [menuHover, setMenuHover] = React.useState(false);
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
  let userPages = (event) => {
    window.open(`${location.protocol}//${location.host}/${event.currentTarget.textContent}`);
  };
  return (
    <div>
      <div className="header-row">
        <div className="icon-airbnb">
          <img
            onClick={openHomePage}
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/512px-Airbnb_Logo_B%C3%A9lo.svg.png?20230603231949"
          />
        </div>
        <div onClick={menu} className="flex-column">
          <div onClick={menu} className="flex-items">
            <img
              onClick={menu}
              src="https://icon-library.com/images/hamburger-menu-icon-png/hamburger-menu-icon-png-10.jpg"
            />
          </div>
          <div onClick={menu} className="user-name">
            {props.userInfo[0] && props.userInfo[0].user_name}
          </div>
        </div>
        <div
          style={menuHover ? { display: 'flex' } : { display: 'none' }}
          className="user-info-container"
        >
          <div onClick={userPages}>Wishlists</div>
          <div onClick={userPages}>Trips</div>
          <div onClick={logOut}>Log Out</div>
        </div>
      </div>
    </div>
  );
}
