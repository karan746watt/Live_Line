import React from 'react'

// coming form Chat.jsx
function SearchBar({handleSearch}) {

  const labelStyle = {
    fontSize: "20px",
    fontWeight: "bolder",
    marginRight: "1rem"
  };

   const inputStyle = {
     fontSize: "20px",
    padding:"2px"
   };
  const formStyle=
  { border: "2px solid black", margin: "24px 0 0 0",padding:"4px"}

  return (
    <form
      action=""
      style={formStyle}
      onSubmit={(e)=> e.preventDefault()}
    >
      <label htmlFor="searchBar" style={labelStyle}>
        Find User
      </label>
      <input
        type="text"
        id="searchBar"
        onChange={handleSearch}
        style={inputStyle}
      />
    </form>
  );
}

export default SearchBar