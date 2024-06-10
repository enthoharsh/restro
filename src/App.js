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
    const tableId = GlobalCart((state) => state.tableId);
    const setTableId = GlobalCart((state) => state.setTableId);
    const setTableName = GlobalCart((state) => state.setTableName);

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
            console.log(response.data.data);
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
