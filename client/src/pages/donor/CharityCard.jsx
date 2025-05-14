import React from "react";

const CharityCard = ({ charity, isFavorite, onToggleFavorite, onDelete }) => {
  return (
    <li className="charity-card">
      <h3>{charity?.name}</h3>
      <p>{charity?.description}</p>
      <button
        className={`favorite-button ${isFavorite ? "favorited" : ""}`}
        onClick={onToggleFavorite}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? "★" : "☆"}
      </button>
      {onDelete && (
        <button
          className="delete-button bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 ml-4"
          onClick={() => {
            if (onDelete) {
              console.log("Delete button clicked for charity id:", charity.id);
              onDelete(charity.id);
            }
          }}
        >
          Delete
        </button>
      )}
    </li>
  );
};

export default CharityCard;
