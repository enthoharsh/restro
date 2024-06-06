import React from 'react';
import { __ } from "../lang/setup";
import Card from "../components/common/Card";
import Header from '../components/common/Header';
import { Link } from 'react-router-dom';

const Home = () => {
    const menuItems = [
        {
            id: 1,
            title: 'Beer Buddies',
            imageSrc: 'https://plus.unsplash.com/premium_photo-1671377379627-d317cdac55a4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c291cHxlbnwwfHwwfHx8MA%3D%3D',
        },
        {
            id: 2,
            title: 'Soup',
            imageSrc: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
        },
        {
            id: 3,
            title: 'Salads and Cold Plates',
            imageSrc: 'https://plus.unsplash.com/premium_photo-1690489323642-6e057faf3c7d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2FsYWR8ZW58MHx8MHx8fDA%3D',
        },
        {
            id: 4,
            title: 'Mediteranian Specials',
            imageSrc: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWVkZXRlcmFuaWFuJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D',
        },
        {
            id: 5,
            title: 'Dirty Fries',
            imageSrc: 'https://images.unsplash.com/photo-1606755456206-b25206cde27e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZnJlbmNoJTIwZnJpZXN8ZW58MHx8MHx8fDA%3D',
        },
        {
            id: 6,
            title: 'Small Plates',
            imageSrc: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWVkZXRlcmFuaWFuJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D',
        },
        {
            id: 1,
            title: 'Beer Buddies',
            imageSrc: 'https://plus.unsplash.com/premium_photo-1671377379627-d317cdac55a4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c291cHxlbnwwfHwwfHx8MA%3D%3D',
        },
        {
            id: 2,
            title: 'Soup',
            imageSrc: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
        },
        {
            id: 3,
            title: 'Salads and Cold Plates',
            imageSrc: 'https://plus.unsplash.com/premium_photo-1690489323642-6e057faf3c7d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2FsYWR8ZW58MHx8MHx8fDA%3D',
        },
        {
            id: 4,
            title: 'Mediteranian Specials',
            imageSrc: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWVkZXRlcmFuaWFuJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D',
        },
        {
            id: 5,
            title: 'Dirty Fries',
            imageSrc: 'https://images.unsplash.com/photo-1606755456206-b25206cde27e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZnJlbmNoJTIwZnJpZXN8ZW58MHx8MHx8fDA%3D',
        },
        {
            id: 6,
            title: 'Small Plates',
            imageSrc: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWVkZXRlcmFuaWFuJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D',
        },
    ];

    return (
        <>
            {/* // <div className="min-h-screen flex items-center justify-center text-white  bg-gray-900">
        //     <div className={""}>
        //         <h1 className={"capitalize text-4xl"}>{__("hello world")}</h1>
        //         <h2 className={"capitalize"}>{__('here some examples for using the common components')}</h2>
        //         <section className={"flex items-between justify-center"}>
        //             <p>
        //                 <Card classes={"text-gray-900"} title={__("card title")}/>
        //             </p>
        //         </section>
        //     </div>
        // </div> */}
        <Header/>
            <div className='p-4'>

                <h4 className='mt-5 sticky'>What would you like to order?</h4>
                <div className="grid grid-cols-2 gap-4 mt-5 overflow-auto h-[80vh]">
                    {menuItems.map((item) => (
                        <Link to={`all-products?category=${item.title}`} key={item.id} className="relative">
                            <div className="relative h-52 overflow-hidden rounded-lg">
                                <img
                                    src={item.imageSrc}
                                    alt={item.title}
                                />
                                <div className="absolute inset-0" style={{backgroundImage:'linear-gradient(0deg, #00000087 22%, transparent)'}}></div>
                            </div>
                            <div className="absolute inset-0 flex items-end p-2 justify-start text-white text-xl font-bold">
                                {item.title}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </>

    );
};

export default Home;
