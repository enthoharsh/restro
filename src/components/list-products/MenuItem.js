import React from 'react';

const MenuItem = ({ name, price, description, customizable,onAddProduct,product }) => {
  return (
    <div className="flex items-start justify-between py-4" style={{borderBottom:'1px dashed gray'}}>
      <div className='flex flex-col items-start'>
        <h3 className="text-sm font-semibold leading-8">{name}</h3>
        <span className="text-sm font-semibold leading-8">₹{price}</span>
        {description && <p className="text-sm text-gray-600 leading-8">{description}</p>}
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <img className='w-14 h-14 rounded' src={product.image_urls[0].url} alt='...' />
        <button onClick={()=>onAddProduct(product)} className="px-4 py-2 bg-white shadow-md text-black font-light rounded-md active:bg-gray-200 transition-colors duration-200">
          ADD
        </button>
      </div>
    </div>
  );
};


export default MenuItem;