import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const popularSearches = [
  'Packaged Drinking Water Ltr',
  'All Veggies',
  'Sczhewan And Cheese',
  'Crispy Corn',
  'Potato Fries',
  'Roti',
];

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // You can add your search logic here
  };

  return (
    <div className="flex flex-col p-4 h-[100vh]">
      <div className="flex items-center mb-4">
        <div className="flex items-center justify-center w-full relative">

          <svg
            className="w-6 h-6 w-1/6 absolute right-0 top-[25%]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="px-4 py-2 shadow-md pr-10 w-full rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="mb-4">
        <h2 className="text-sm font-semibold mb-2">Popular searches</h2>
        <ul className="flex flex-wrap">
          {popularSearches.map((search, index) => (
            <li
              key={index}
              className="m-1 bg-gray-100 px-4 py-1 rounded text-xs text-gray-500"
            >
              {search}
            </li>
          ))}
        </ul>
      </div>
      <div className=' absolute left-0 bottom-0 w-full p-4'>

        <div onClick={() => {
          window.history.back();
        }} className="w-full block bg-gray-100 text-center py-2 px-4 rounded-md border-2 border-black">
          BACK
        </div>
      </div>
    </div>
  );
};

export default Search;