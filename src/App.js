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
    cart: [],
    setCart: (value) => {
        set({ cart: value });
    },
    tableId: null,
    setTableId: (value) => {
        set({ tableId: value });
    },
}));

const useQuery = () => {
    return new URLSearchParams(window.location.search);
};

function App() {
    const seData = GlobalProductData((state) => state.seData);
    const setTableId = GlobalCart((state) => state.setTableId);

    const intervalRef = React.useRef(null);
    const query = useQuery();

    if (query.get('tableId')) {
        setTableId(query.get('tableId'));
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
