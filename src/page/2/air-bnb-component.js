import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
export default function AirBnbComponent(props) {
  AirBnbComponent.propTypes = {
    Item: PropTypes.shape({
      id: PropTypes.number.isRequired,
      img: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
      your_rating: PropTypes.number,
      date: PropTypes.string.isRequired,
      cost: PropTypes.string.isRequired,
      open_spots: PropTypes.number.isRequired,
      liked: PropTypes.number.isRequired,
      Invited: PropTypes.number
    }),
    pageInfo: PropTypes.func
  };
  let [rating, setRating] = React.useState({ yourRating: '' });
  let [order, setOrder] = React.useState(props.Item.Invited);
  let handlerChangeRating = async (event) => {
    setRating(() => {
      return {
        [event.target.name]: event.target.value
      };
    });
  };
  let sendRating = async () => {
    if (rating.yourRating === '') {
      return;
    } else {
      const pathName = window.location.pathname.split('/').pop();
      await fetch('http://localhost:9000/rating', {
        method: 'post',
        body: JSON.stringify({
          rating: rating.yourRating,
          cookie: document.cookie,
          name: pathName
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      });
      props.pageInfo();
    }
  };
  let changeRating = () => {
    rating.yourRating = 0;
    props.pageInfo();
  };
  let bookvalue = () => {
    setOrder((prevOrder) => !prevOrder);
  };

  let book = async () => {
    const pathName = window.location.pathname.split('/').pop();
    await fetch('http://localhost:9000/book', {
      method: 'post',
      body: JSON.stringify({
        book: order,
        cookie: document.cookie,
        name: pathName,
        free: props.Item.open_spots,
        invited: props.Item.Invited
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    });
  };
  useEffect(() => {
    sendRating();
  }, [handlerChangeRating]);
  useEffect(() => {
    if (order != null) {
      book();
    }
  }, [order]);

  return (
    <div>
      <img src={props.Item.img} />
      <h1> Name : {props.Item.name}</h1>
      <h1> Remaining Places : {props.Item.open_spots}</h1>
      <h1>Place rating : {props.Item.rating}</h1>
      <h1>People who liked the place : {props.Item.liked}</h1>
      <h1 className="your-rating">
        Your Rating :
        {props.Item.your_rating ? (
          <div onClick={changeRating} style={{ marginLeft: '10px' }}>
            {props.Item.your_rating}
          </div>
        ) : (
          <>
            <div className="checkbox-rating">
              <label>1</label>
              <input
                onClick={handlerChangeRating}
                type="radio"
                name="yourRating"
                value="1"
                id="radio"
              />
            </div>
            <div className="checkbox-rating">
              <label>2</label>
              <input
                onClick={handlerChangeRating}
                type="radio"
                name="yourRating"
                value="2"
                id="radio"
              />
            </div>
            <div className="checkbox-rating">
              <label>3</label>
              <input
                onClick={handlerChangeRating}
                type="radio"
                name="yourRating"
                value="3"
                id="radio"
              />
            </div>
            <div className="checkbox-rating">
              <label>4</label>
              <input
                onClick={handlerChangeRating}
                type="radio"
                name="yourRating"
                value="4"
                id="radio"
              />
            </div>
            <div className="checkbox-rating">
              <label>5</label>
              <input
                onClick={handlerChangeRating}
                type="radio"
                name="yourRating"
                value="5"
                id="radio"
              />
            </div>
          </>
        )}
      </h1>
      <div>
        {props.Item.Invited === 1 && props.Item.open_spots === 0 ? (
          <button onClick={bookvalue}>Cancel book</button>
        ) : props.Item.open_spots === 0 ? (
          <h1 style={{ color: 'red' }}>The place is not available</h1>
        ) : (
          <button onClick={bookvalue}>{props.Item.Invited != 1 ? 'Book' : 'Cancel book'}</button>
        )}
      </div>
    </div>
  );
}
// props.Item.open_spots === 0 ? (
//   <h1 style={{ color: 'red' }}>The place is not available</h1>
// ) : (
//   <button onClick={bookvalue}>{order > 0 ? 'Book' : 'Cancel book'}</button>
// )}
