import { Drawer } from 'antd';
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import MenuItem from '../components/list-products/MenuItem';
import { GlobalProductData } from '../App';


const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const items = [
    {
        name: 'Potato fries',
        price: 295,
        description: 'Classic / Periperi',
        customizable: true,
    },
    {
        name: 'Agarwal Chickpeas',
        price: 225,
        description: 'Fried crisp, inhouse spice mix, chaat masala',
        customizable: false,
    },
];

const AllProducts = () => {
    const query = useQuery();
    const category = query.get('category');
    const categoryName = query.get('name');

    const data = GlobalProductData((state) => state.data);
    const ItemCategories = data.ItemCategories;

    const [selectdCategory, setSelectedCategory] = useState(category || ItemCategories[0]._id);

    const [isVegOnly, setIsVegOnly] = useState(true);
    const [open, setOpen] = useState(false);
    const [drawerProduct, setDrawerProduct] = useState(null)

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const toggleVegOnly = () => {
        setIsVegOnly(!isVegOnly);
    };

    const onAddProduct = (product) => {
        setDrawerProduct(product);
        showDrawer()
    }
    console.log('data',data.data);
    return (
        <div>
            <div className=" flex items-center justify-between px-4 pt-4 pb-2">
                <div className="flex items-center">
                    <div onClick={() => {
                        window.history.back();
                    }}>
                        <svg
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                    </div>
                </div>
                <div className="flex items-center">
                    <label
                        htmlFor="veg-only"
                        className="mr-2 text-sm font-semibold tracking-wide"
                    >
                        Veg only
                    </label>
                    <div
                        className={`relative w-8 h-4 rounded-full transition-colors duration-300 ${isVegOnly ? 'bg-green-200' : 'bg-gray-200'
                            }`}
                        onClick={toggleVegOnly}
                    >
                        <div
                            style={{
                                // top:'2px',
                            }}
                            className={`absolute w-4 h-4 rounded-full transition-transform duration-300 ${isVegOnly ? 'translate-x-5 bg-green-800' : 'translate-x-0 bg-black'
                                }`}
                        />
                    </div>
                </div>
                <div className="flex items-center">
                    <Link to={`/search`} className="relative">
                        <svg
                            className="h-5 w-5 mr-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </Link>
                </div>
            </div>
            <div className="flex overflow-x-auto shadow-md pb-2">
                {ItemCategories.map((category, index) => (
                    <span
                        onClick={() => setSelectedCategory(category._id)}
                        style={{ whiteSpace: 'nowrap' }}
                        key={index}
                        className={`m-1 rounded-[20px] w-auto p-2 py-1 ${category._id == selectdCategory ? 'bg-black text-white' : 'text-gray-600'
                            }`}
                    >
                        {category.name}
                    </span>
                ))}
            </div>
            <div className="rounded-md p-6">
                <div className='flex justify-center'>

                    <h2 className="text-md font-bold mb-4 category-name">{categoryName}</h2>
                </div>
                {data.data.map((item, index) => {
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
            </div>
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
        </div>
    )
}

export default AllProducts
