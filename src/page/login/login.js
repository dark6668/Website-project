import React from 'react';
import '../page1.css';
import dog from '/home/david/repos/project/Website-project/src/dog.png';
import { useEffect } from 'react';
export default function Login() {
  let [checkbox, setCheckbox] = React.useState(false);
  let [signUpcheckbox, setSignUpcheckbox] = React.useState(false);
  let [signUpValue, setSignUpValue] = React.useState(false);
  let [signUpInput, setSignUpInput] = React.useState({
    signUpUser: '',
    signUpPassword: '',
    gender: ''
  });
  let [input, setInput] = React.useState({ userName: '', password: '' });
  let submit = async (event) => {
    event.preventDefault();
    try {
      let response = await fetch('http://localhost:9000/user-list2', {
        method: 'POST',
        body: JSON.stringify(input),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      });
      let name = await response.json();
      if (name.check === false) {
        alert('Username does not exist, please sign up ');
      } else {
        if (document.cookie === name.cookie) {
          window.open('http://localhost:3000/home-page');
        } else {
          document.cookie = name.cookie;
          window.open('http://localhost:3000/home-page');
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  let handlerChange = (event) => {
    setInput((prevInput) => {
      return {
        ...prevInput,
        [event.target.name]: event.target.value
      };
    });
  };

  let show = () => {
    setCheckbox((prevCheckbox) => !prevCheckbox);
  };

  let signUp = () => {
    setSignUpValue((prevSignUpValue) => !prevSignUpValue);
    setSignUpInput(() => {
      return {
        signUpUser: '',
        signUpPassword: '',
        gender: ''
      };
    });
  };
  let showSignUp = () => {
    setSignUpcheckbox((pervSignUpShow) => !pervSignUpShow);
  };
  let handlerChangeSignUp = (event) => {
    setSignUpInput((prevSignUpInput) => {
      return {
        ...prevSignUpInput,
        [event.target.name]: event.target.value
      };
    });
  };
  let formsignUp = async (event) => {
    event.preventDefault();
    if (
      signUpInput.signUpPassword.length === 0 ||
      signUpInput.signUpUser.length === 0 ||
      !signUpInput.gender
    ) {
      alert('Must fill in all sections');
    } else {
      try {
        let response = await fetch('http://localhost:9000/user-list', {
          method: 'POST',
          body: JSON.stringify(signUpInput),
          headers: {
            'Content-type': 'application/json; charset=UTF-8'
          }
        });

        let name = await response.text();
        if (name === 'Created') {
          alert(`Welcome ${signUpInput.signUpUser} `);
          setSignUpValue();
          setSignUpInput(() => {
            return {
              signUpUser: '',
              signUpPassword: '',
              gender: ''
            };
          });
        } else {
          alert(name);
        }
      } catch (err) {
        alert(err);
      }
    }
  };
  useEffect(() => {
    cookie();
  });
  let cookie = () => {
    if (document.cookie) {
      // window.open('http://localhost:3000/home-page');
    } else {
      return;
    }
  };
  return (
    <div>
      <div className="flex-center">
        <form onSubmit={submit} className="form-flex">
          <img
            className="img"
            src={checkbox ? 'https://media.tenor.com/xsHGvPE_tyYAAAAM/eye-roll-dog.gif' : dog}
            alt="icon"
          />
          <div className="info">
            <div className="user-info">
              <label>User Name</label>

              <input onChange={handlerChange} name="userName" placeholder="User Name" required />
              <div className="password-info">
                <label>Password</label>
              </div>
              <input
                id="checkbox"
                type={checkbox ? 'text' : 'password'}
                onChange={handlerChange}
                name="password"
                placeholder="Password"
                required
              />

              <div className="checkbox">
                {' '}
                <input onClick={show} type="checkbox" value={'Show'} />
                <div>Show Password</div>
              </div>
              <button className="button">Login</button>
              <div className="dont-have-a-user" onClick={signUp}>
                dont have a user
              </div>
            </div>
          </div>
        </form>
        <div className="sign-up"></div>

        {signUpValue && (
          <div className="sign-up-pop">
            <div onClick={signUp} className="sign-up-pop-x">
              X
            </div>
            <form className="sign-up-form">
              <label>New User</label>
              <input onChange={handlerChangeSignUp} type="text" name="signUpUser" required />

              <label>New Password</label>
              <input
                onChange={handlerChangeSignUp}
                type={signUpcheckbox ? 'text' : 'password'}
                name="signUpPassword"
                required
              />

              <div className="checkbox">
                <input onClick={showSignUp} type="checkbox" value={'Show'} />
                Show Password
              </div>
              <div className="gender">
                <input
                  onChange={handlerChangeSignUp}
                  type="radio"
                  name="gender"
                  value="male"
                  id="male-radio"
                />
                <label htmlFor="male-radio">Male</label>
                <input
                  onChange={handlerChangeSignUp}
                  type="radio"
                  name="gender"
                  value="female"
                  id="female-radio"
                />
                <label htmlFor="female-radio">Female</label>
                <input
                  onChange={handlerChangeSignUp}
                  type="radio"
                  name="gender"
                  value="other"
                  id="Other-radio"
                />
                <label htmlFor="Other-radio">Other</label>
              </div>
              <button onClick={formsignUp}>Sign Up</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
