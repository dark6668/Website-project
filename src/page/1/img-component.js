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
    ? 'https://png.pngtree.com/png-vector/20220428/ourmid/pngtree-smooth-glossy-heart-vector-file-ai-and-png-png-image_4557871.png'
    : 'https://static.thenounproject.com/png/1742987-200.png';
  let styles = props.item.openSpots < 5 ? { color: 'red' } : { color: 'black' };
  return (
    <div className="containerContact">
      <img onClick={airbnbPage} className="imgContent" src={props.item.img} alt="Img" />
      {freePlaces && (
        <div className="soldOUt-countainer">
          <div className="soldOut" style={styles}>
            {freePlaces}
          </div>
          <img id="heart" onClick={star} src={imageStar} alt="heart" />
        </div>
      )}

      <div className="containerContactImg">
        <h2>{props.item.name} </h2>
        <h2 className="rating">
          <img src="https://shorturl.at/cjzV4" alt="star" />
          <div>{props.item.rating && props.item.rating}</div>
        </h2>
        <div>
          <div style={{ color: 'gray' }}>{props.item.date.split('T')[0]}</div>
          <div id="cost">
            <h2> {props.item.cost.substring(0, props.item.cost.indexOf('n'))}</h2>
            {props.item.cost.substring(props.item.cost.indexOf('n'))}
          </div>
        </div>
      </div>
    </div>
  );
}
