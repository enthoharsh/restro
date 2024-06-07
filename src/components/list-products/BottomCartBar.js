import React from 'react'
import { ShoppingCartOutlined } from '@ant-design/icons';
import { GlobalCart } from '../../App';
import { Badge } from 'antd';
const BottomCartBar = ({showDrawer}) => {

    const cart = GlobalCart((state) => state.cart);
    const totalPrice = cart.reduce((total, product) => total + product.price * product.quantity, 0)
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white px-4 py-2">
      <div className="flex items-center justify-between">
        <div className='flex gap-4'>

        <div className="relative">
          <ShoppingCartOutlined
            style={{ fontSize: '20px' }}
            className="mr-2"
          />
          <span className="absolute bottom-4 left-3.5 ">
            <Badge size="small" count={cart.length} />
          </span>
        </div>
        <span>₹{totalPrice}</span>
        </div>
        <button className="bg-transparent text-white px-4 py-2 " onClick={()=>showDrawer()}>VIEW CART →</button>
      </div>
    </div>
  )
}

export default BottomCartBar
