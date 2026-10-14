// src/components/SearchBar.js
import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    onSearch(query); // Arama yapıldığında üst bileşene query gönder
    setQuery(""); // Arama sonrasında inputu temizle
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Makale ara..."
      />
      <button onClick={handleSearch}>Ara</button>
    </div>
  );
};

export default SearchBar;