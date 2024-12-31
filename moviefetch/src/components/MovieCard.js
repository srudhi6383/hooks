import React from "react";

const MovieCard = ({ movie, isFavorite, onToggleFavorite }) => {
  const posterURL = movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/200";

  return (
    <div className="movie-card">
      <img src={posterURL} alt={movie.Title} />
      <h3>{movie.Title}</h3>
      <button onClick={() => onToggleFavorite(movie)}>
        {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      </button>
    </div>
  );
};

export default MovieCard;
