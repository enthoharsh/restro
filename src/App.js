import './assets/css/App.css';
import {
    BrowserRouter as Router,
    Routes,
    Route
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
    tableId: null,
    setTableId: (value) => {
        set({ tableId: value });
    },
}))

function App() {
    const seData = GlobalProductData((state) => state.seData);
    const intervalRef = React.useRef(null);

    const getProducts = async () => {
        try {
            const response = await axios.post(
                'https://accounting-new.inkapps.io/api/shop/getProducts',
                { "search": "", "minPrice": "", "maxPrice": "", "page": 1, "perPage": 100000, "meta": {} },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'hosturl': 'ikaki.inkapps.io'
                    }
                });
            seData(response.data.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getProducts();
        intervalRef.current = setInterval(() => {
            getProducts();
        }, 50000);

        return () => {
            clearInterval(intervalRef.current);
        }
    }, []);

    return (
        <Router>
            <Routes>
                {routes.map(route => <Route {...route} />)}
            </Routes>
        </Router>
    );
}

export default App;
