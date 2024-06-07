import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GlobalProductData } from '../App';
import MenuItem from '../components/list-products/MenuItem';
import { Drawer } from 'antd';

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
  const [searchResult, setSearchResult] = useState([])
  const data = GlobalProductData((state) => state.data.data);
  const [open, setOpen] = useState(false);
  const [drawerProduct, setDrawerProduct] = useState(null)
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // You can add your search logic here
  };
  const showDrawer = () => {
    setOpen(true);
};

const onClose = () => {
    setOpen(false);
};
  useEffect(() => {
    if (searchQuery === '') {
        setSearchResult([]);
    } else {
        const filteredResults = data.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResult(filteredResults);
    }
}, [searchQuery, data]);
const onAddProduct = (product) => {
    setDrawerProduct(product);
    showDrawer()
}
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
      {/* <div className="mb-4">
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
      </div> */}
      {searchResult.map((item, index) => {
                    return (
                        <MenuItem
                            key={index}
                            name={item.name}
                            price={item.mrp_rate}
                            description={item.description}
                            customizable={true}
                            product={item}
                            onAddProduct={onAddProduct}
                        />
                    )
                })}
                <Drawer
                title={drawerProduct?.name}
                placement={'bottom'}
                closable={false}
                onClose={onClose}
                open={open}
                key={'bottom'}
            >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Drawer>
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