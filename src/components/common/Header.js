import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalCart } from '../../App';
import { PhoneOutlined } from '@ant-design/icons';

const Header = () => {
  const tableName = GlobalCart((state) => state.tableName);
  const SupportNumber = GlobalCart((state) => state.SupportNumber);

  const navigate = useNavigate();

  const handleSearchClick = () => {
    navigate('/search')
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center">
            <button
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={handleSearchClick}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          <a href={`tel:${SupportNumber}`} className='ml-auto mr-2'>
          <PhoneOutlined /> Call & Support
          </a>
          <div className="text-gray-700 font-semibold">Table No: {tableName}</div>
        </div>
      </div>
      <div className="shadow-sm"></div>
    </header>
  );
};

export default Header;