import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import MovieCard from "./components/MovieCard";
import "./App.css";

const API_URL = "http://www.omdbapi.com/?i=tt3896198&apikey=228bf541";

function App() {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  });

  const handleSearch = async (query) => {
    if (!query) return;
    const response = await fetch(`${API_URL}&s=${query}`);
    const data = await response.json();
    if (data.Search) {
      setMovies(data.Search);
    }
  };

  const toggleFavorite = (movie) => {
    const isFavorited = favorites.some((fav) => fav.imdbID === movie.imdbID);
    const updatedFavorites = isFavorited
      ? favorites.filter((fav) => fav.imdbID !== movie.imdbID)
      : [...favorites, movie];
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="app">
      <h1>Movie Library</h1>
      <SearchBar onSearch={handleSearch} />
      <div className="movies-container">
        {movies.map((movie) => (
          <MovieCard
            key={movie.imdbID}
            movie={movie}
            isFavorite={favorites.some((fav) => fav.imdbID === movie.imdbID)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
      <h2>Favorites</h2>
      <div className="movies-container">
        {favorites.map((movie) => (
          <MovieCard
            key={movie.imdbID}
            movie={movie}
            isFavorite
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
