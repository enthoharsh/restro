import React, { useState } from 'react';
import { GlobalCart } from '../../App';

const MenuItem = ({ name, price, description, customizable, onAddProduct, product }) => {
  const cart = GlobalCart((state) => state.cart);
  const setCart = GlobalCart((state) => state.setCart);
  const [isInclude, setIsInclude] = useState(
    cart.some((item) => (item._id == product?._id && item.quantity >= 1)) ? true : false
  )
  const prod = cart.filter((item) => (item._id == product?._id))[0]
  const handleQuantityChange = (id, action) => {
    setCart(
      cart.map((product) =>
        product._id === id
          ? {
            ...product,
            quantity:
              action === 'add'
                ? product.quantity + 1
                : product.quantity > 1
                  ? product.quantity - 1
                  : 0,
          }
          : product
      ).filter((elm) => elm.quantity !== 0)
    )
  }
  const handleQuantity = (action) => {
    if (action === 'add') {
      handleQuantityChange(product._id, 'add')
    } else if (action === 'subtract') {
      handleQuantityChange(product._id, 'subtract')
    }
  }
  return (
    <div className="flex items-start justify-between py-4" style={{ borderBottom: '1px dashed gray' }}>
      <div className='flex flex-col items-start'>
        <h3 className="text-sm font-semibold leading-8">{name}</h3>
        <span className="text-sm font-semibold leading-8">₹{price}</span>
        {description && <p className="text-sm text-gray-600 leading-8">{description}</p>}
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        {product.image_urls && product.image_urls.length > 0 ? <img className='w-14 h-14 rounded' src={product.image_urls[0].url} alt='...' /> : ''}
        {
          (cart.some((item) => (item._id == product?._id && item.quantity >= 1)) ? true : false) ? <div className='flex items-center mt-2'>
            <button
              disabled={prod?.kot_sent_quantity >= prod?.quantity}
              className="rounded-full bg-gray-200 p-2"
              onClick={() => handleQuantity('subtract')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '24px',
                width: '24px',
                opacity: (prod?.kot_sent_quantity >= prod?.quantity) ? '0.3' : 1
              }}
            >
              <svg
                width={8}
                height={8}
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span style={{
              opacity: (prod?.kot_sent_quantity >= prod?.quantity) ? ' 0.4' : 1
            }} className="mx-2">{cart.filter((elem) => elem._id == product._id)[0]?.quantity}</span>
            <button
              className="rounded-full bg-gray-200 p-2"
              onClick={() => handleQuantity('add')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '24px',
                width: '24px',
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div> :
            <button onClick={() => onAddProduct(product)} className="px-4 py-2 bg-white shadow-md text-black font-light rounded-md active:bg-gray-200 transition-colors duration-200">
              ADD
            </button>
        }
      </div>
    </div>
  );
};


export default MenuItem;