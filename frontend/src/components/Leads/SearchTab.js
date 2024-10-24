import React from 'react';

function SearchTab({ searchQuery, setSearchQuery, handleSearch }) {
  return (
    <div>
      <input
        type="text"
        placeholder="Name"
        value={searchQuery.name}
        onChange={(e) => setSearchQuery({ ...searchQuery, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={searchQuery.email}
        onChange={(e) => setSearchQuery({ ...searchQuery, email: e.target.value })}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default SearchTab;
