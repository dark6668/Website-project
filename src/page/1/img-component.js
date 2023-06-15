import React from 'react';
import PropTypes from 'prop-types';
export default function Img(props) {
  Img.propTypes = {
    openSpots: PropTypes.number.isRequired,
    item: PropTypes.shape({
      id: PropTypes.number.isRequired,
      img: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      date: PropTypes.string.isRequired,
      cost: PropTypes.string.isRequired,
      openSpots: PropTypes.number.isRequired,
      liked: PropTypes.bool.isRequired
    }).isRequired,
    toggle: PropTypes.func.isRequired,
    airbnbPage: PropTypes.func.isRequired
  };
  let freePlaces;
  if (props.openSpots === 1) {
    freePlaces = `Remaining ${props.item.openSpots} Place`;
  } else {
    freePlaces = `Remaining ${props.item.openSpots} Places`;
  }
  let [imgStar, setImgStar] = React.useState(props.item.liked);
  let star = async () => {
    setImgStar((prevImgStar) => (prevImgStar = !prevImgStar));
    const updatedImgStar = !imgStar;
    await props.toggle(props.item.name, updatedImgStar);
  };
  let airbnbPage = () => {
    props.airbnbPage(props.item.name);
  };
  let imageStar = imgStar
    ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Gold_Star.svg/1024px-Gold_Star.svg.png'
    : 'https://cdn3.iconfinder.com/data/icons/sympletts-free-sampler/128/star-512.png';
  let styles = props.item.openSpots < 5 ? { color: 'red' } : { color: 'black' };
  return (
    <div className="containerContact">
      <img onClick={airbnbPage} className="imgContent" src={props.item.img} alt="Img" />
      {freePlaces && (
        <div className="soldOut" style={styles}>
          {freePlaces}
        </div>
      )}
      <section>
        <div className="containerContactImg">
          <img id="star" onClick={star} src={imageStar} alt="img-star" />

          <div>{props.item.name} </div>
        </div>
        <div className="containerContactInfo">
          <div> {props.item.date.split('T')[0]} </div>
          <div> {props.item.cost} </div>
        </div>
      </section>
    </div>
  );
}
