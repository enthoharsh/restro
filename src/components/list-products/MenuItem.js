import React from 'react';

const MenuItem = ({ name, price, description, customizable,onAddProduct,product }) => {
  return (
    <div className="flex items-center justify-between py-4" style={{borderBottom:'1px dashed gray'}}>
      <div>
        <h3 className="text-sm font-semibold">{name}</h3>
        <span className="text-sm font-semibold">₹{price}</span>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </div>
      <div className="flex items-center">
        <button onClick={()=>onAddProduct(product)} className="ml-4 px-4 py-2 bg-white shadow-md text-black font-light rounded-md active:bg-gray-200 transition-colors duration-200">
          ADD
        </button>
      </div>
    </div>
  );
};


export default MenuItem;