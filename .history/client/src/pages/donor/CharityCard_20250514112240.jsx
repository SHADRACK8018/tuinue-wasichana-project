import React from "react";

const CharityCard = ({ charity, isFavorite, onToggleFavorite }) => {
  return (
    <li className="charity-card">
      <h3>{charity?.name || "Test Charity"}</h3>
      <p>{charity?.description || "Test Description"}</p>
      <button
        className={`favorite-button ${isFavorite ? "favorited" : ""}`}
        onClick={onToggleFavorite}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? "★" : "☆"}
      </button>
    </li>
  );
};

export default CharityCard;
