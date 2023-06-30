import React from 'react';
import PropTypes from 'prop-types';
export default function WishlistsProps(prop) {
  WishlistsProps.propTypes = {
    likedPage: PropTypes.arrayOf(
      PropTypes.shape({
        img: PropTypes.string.isRequired
      })
    )
  };
  return (
    <div>
      {prop.item ? (
        <img src={prop.item} />
      ) : (
        <div>
          <h1>No saves yet.</h1>
          <p>
            As you search, click the heart icon to save your favorite places and experiences to a
            wishlist.
          </p>
        </div>
      )}
    </div>
  );
}
