import React from 'react';
import { __ } from "../lang/setup";
import Card from "../components/common/Card";
import Header from '../components/common/Header';
import { Link } from 'react-router-dom';
import { GlobalProductData } from '../App';

const Home = () => {
    const data = GlobalProductData((state) => state.data);
    const ItemCategories = data.ItemCategories;

    return (
        <>
            <Header />
            <div className='p-4'>

                <h4 className='mt-5 sticky'>What would you like to order?</h4>
                <div className="grid grid-cols-2 gap-4 mt-5 overflow-auto h-[80vh]">
                    {ItemCategories.map((item) => (
                        <Link to={`all-products?category=${item._id}&name=${item.name}`} key={item._id} className="relative">
                            <div className="relative h-52 overflow-hidden rounded-lg">
                                <img
                                    src={item.image_url}
                                    alt={item.name}
                                    style={{
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                                <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(0deg, #00000087 22%, transparent)' }}></div>
                            </div>
                            <div className="absolute inset-0 flex items-end p-2 justify-start text-white text-xl font-bold">
                                {item.name}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </>

    );
};

export default Home;
