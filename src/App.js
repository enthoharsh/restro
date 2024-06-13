import './assets/css/App.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation
} from "react-router-dom";

import { routes } from "./routes";
import { create } from 'zustand';
import React, { useEffect } from 'react';
import axios from 'axios';

export const GlobalProductData = create((set, get) => ({
    data: {
        ItemCategories: [],
        data: []
    },
    seData: (value) => {
        set({ data: value });
    },
}))

export const GlobalCart = create((set, get) => ({
    cart: typeof window !== 'undefined' ? (window?.localStorage.getItem('cart') ? JSON.parse(window.localStorage.getItem('cart')) : []) : [],
    setCart: (value) => {
        set((state) => {
            console.log('state', state);
            return { ...state, cart: value };
        });
        if (typeof window !== 'undefined') {
            setTimeout(() => {
                localStorage.setItem('cart', JSON.stringify(get().cart));
            }, 0);
        }
    },
    SupportNumber:'',
    setSupportNumber:(value)=>{
        set((state)=>{
            return{...state,SupportNumber:value}
        })
    },
    orderId:'',
    setOrderId:(value)=>{
        set((state)=>{
            return{...state,orderId:value}
        })
    },
    tableId: localStorage.getItem('tableId') || null,
    setTableId: (value) => {
        set({ tableId: value });
        localStorage.setItem('tableId', value);
    },
    tableName: localStorage.getItem('tableName') || null,
    setTableName: (value) => {
        set({ tableName: value });
        localStorage.setItem('tableName', value);
    },
}));

const useQuery = () => {
    return new URLSearchParams(window.location.search);
};

function App() {
    const seData = GlobalProductData((state) => state.seData);
    const setSupportNumber = GlobalCart((state) => state.setSupportNumber);
    const tableId = GlobalCart((state) => state.tableId);
    const setTableId = GlobalCart((state) => state.setTableId);
    const setTableName = GlobalCart((state) => state.setTableName);
    const setCart = GlobalCart((state) => state.setCart);
    const setOrderId = GlobalCart((state) => state.setOrderId);
    const cart = GlobalCart((state) => state.cart);

    const intervalRef = React.useRef(null);
    const getOrders = async () => {
        try {
            const response = await axios.post(
                'https://accounting-new.inkapps.io/api/shop/getTableDetailsWithOrder',
                { "search": "", "minPrice": "", "maxPrice": "", "page": 1, "perPage": 100000, "meta": {},"table_id":"6662c30f72eee8389a3d8ce5" },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'hosturl': 'affy-demo.inkapps.io'
                    }
                });
                setOrderId(response?.data?.order?._id)
                if (response?.data?.order==null) {
                    console.log("clear cart");
                    setCart([])
                }
                setSupportNumber(response?.data?.data?.phone)
                setCart([...response.data.order.line_items.map((elm,i)=>{
                    return {
                        _id: elm.item._id,
                        name: `${elm.item.name}`,
                        description: elm.item.description,
                        price: elm.item_price,
                        old_qty:elm.quantity,
                        quantity: elm.quantity,
                        src: elm.item.image_urls && elm.item.image_urls.length > 0 ? elm.item.image_urls[0]?.url : '',
                        isEditable:elm.kot_status=='Pending'?false:true
                        // meta: product?.meta,
                        // parent_meta: product?.parent_meta,
                    }
                })])
                // console.log(response.data.order);
        } catch (error) {
            console.error(error);
        }
    }
    const getProducts = async () => {
        try {
            const response = await axios.post(
                'https://accounting-new.inkapps.io/api/shop/getProducts',
                { "search": "", "minPrice": "", "maxPrice": "", "page": 1, "perPage": 100000, "meta": {} },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'hosturl': 'affy-demo.inkapps.io'
                    }
                });
            seData(response.data.data);
        } catch (error) {
            console.error(error);
        }
    }
    const query = useQuery();

    useEffect(() => {
        getProducts();
        getOrders();
        intervalRef.current = setInterval(() => {
            getOrders();
            getProducts();
        }, 50000);

        if (query.get('tableId') && tableId != query.get('tableId')) {
            setTableId(query.get('tableId'));
        }

        if (query.get('tableName') && tableId != query.get('tableName')) {
            setTableName(query.get('tableName'));
        }

        return () => {
            clearInterval(intervalRef.current);
        }
    }, []);

    if (tableId) {
        return (
            <Router>
                <Routes>
                    {routes.map((route, index) => <Route key={index.toString()} {...route} />)}
                </Routes>
            </Router>
        );
    }

    return (<>
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <h1 className="text-2xl font-bold">Please scan the QR code available on the table</h1>
                <p className="text-lg mt-5">If you are unable to scan the QR code, please contact the staff</p>
            </div>
        </div>
    </>);
}

export default App;
