import React from 'react';
import { Link } from "react-router-dom";
import { __ } from "../lang/setup";

const ThankYou = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <h1 className="text-2xl font-bold">Thank You</h1>
                <p className="text-lg mt-5">Your order has been placed successfully and will be served shortly.</p>
                <Link to="/"
                    className="mt-4 capitalize block px-6 border py-2 bg-gray-800 rounded">
                    {__("home page")}
                </Link>
            </div>
        </div>
        // <div className="min-h-screen bg-gray-900 text-white   flex items-center justify-center">
        //     <div className="flex flex-col md:flex-row items-center justify-center px-5 text-white">
        //         <div className="max-w-md">
        //             <div className="text-2xl mb-4 font-dark font-bold text-center">
        //                 Thank You
        //             </div>
        //             <p className="text-xl md:text-3xl font-light leading-normal text-center">
        //                 Your order has been placed successfully and will be served shortly.
        //             </p>
        //             <div className={"flex justify-center"}>
        //                 <Link to="/"
        //                     className="mt-4 capitalize block px-6 border py-2 bg-gray-800 rounded">
        //                     {__("home page")}
        //                 </Link>
        //             </div>

        //         </div>
        //     </div>
        // </div>
    );
};

export default ThankYou;
