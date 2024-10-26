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
import { Realtime } from 'ably';

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
    SupportNumber: '',
    setSupportNumber: (value) => {
        set((state) => {
            return { ...state, SupportNumber: value }
        })
    },
    orderId: '',
    setOrderId: (value) => {
        set((state) => {
            return { ...state, orderId: value }
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
    orgId: localStorage.getItem('orgId') || null,
    setOrgId: (value) => {
        set({ orgId: value });
        localStorage.setItem('orgId', value);
    },
    sessionExpiryDate: localStorage.getItem('sessionExpiryDate') || null,
    setSessionExpiryDate: (value) => {
        set({ sessionExpiryDate: value });
        localStorage.setItem('sessionExpiryDate', value);
    },
}));

const useQuery = () => {
    return new URLSearchParams(window.location.search);
};

function App() {
    const seData = GlobalProductData((state) => state.seData);
    const setSupportNumber = GlobalCart((state) => state.setSupportNumber);
    const tableId = GlobalCart((state) => state.tableId);
    const orgId = GlobalCart((state) => state.orgId);
    const setOrgId = GlobalCart((state) => state.setOrgId);
    const setTableId = GlobalCart((state) => state.setTableId);
    const setTableName = GlobalCart((state) => state.setTableName);
    const setCart = GlobalCart((state) => state.setCart);
    const setOrderId = GlobalCart((state) => state.setOrderId);
    const cart = GlobalCart((state) => state.cart);
    const sessionExpiryDate = GlobalCart((state) => state.sessionExpiryDate);
    const setSessionExpiryDate = GlobalCart((state) => state.setSessionExpiryDate);

    const intervalRef = React.useRef(null);

    const getOrders = async () => {
        if(!orgId || !tableId) {
            return;
        }

        try {
            const response = await axios.post(
                'https://accounting-new.inkapps.io/api/shop/getTableDetailsWithOrder',
                { "search": "", "minPrice": "", "maxPrice": "", "page": 1, "perPage": 100000, "meta": {}, "table_id": tableId },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'hosturl': 'jamee.inkapps.io',
                        'orgid': orgId
                    }
                });

            setOrderId(response?.data?.order?._id)
            setSupportNumber(response?.data?.data?.phone)

            if (response?.data?.order == null) {
                setCart([])
            } else {
                setCart([...response.data.order.line_items.map((elm, i) => {
                    return {
                        _id: elm.item._id,
                        name: `${elm.item.name}`,
                        description: elm.item.description,
                        price: elm.item_price,
                        old_qty: elm.quantity,
                        quantity: elm.quantity,
                        kot_sent_quantity: elm.kot_sent_quantity,
                        src: elm.item.image_urls && elm.item.image_urls.length > 0 ? elm.item.image_urls[0]?.url : '',
                    }
                })])
            }

            // console.log(response.data.order);
        } catch (error) {
            console.error(error);
        }
    }

    const getProducts = async () => {
        if(!orgId) {
            return;
        }

        try {
            const response = await axios.post(
                'https://accounting-new.inkapps.io/api/shop/getProducts',
                { "search": "", "minPrice": "", "maxPrice": "", "page": 1, "perPage": 100000, "meta": {} },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'hosturl': 'jamee.inkapps.io',
                        'orgid': orgId
                    }
                });
            seData(response.data.data);
        } catch (error) {
            console.error(error);
        }
    }

    const query = useQuery();

    useEffect(() => {
        const ably = new Realtime({ key: 'x9wJ8g.bezGYQ:d2wpDTn_w_8xkNUbKz2pQcrB-DHPmaRv4ml5zMuuNzs' });
        const channel = ably.channels.get('table-' + tableId);

        channel.subscribe('update', (message) => {
            getOrders();
        });

        getOrders();

        return () => {
            channel.unsubscribe();
        }
    }, [tableId]);

    useEffect(() => {
        if (query.get('tableId') && tableId != query.get('tableId')) {
            setTableId(query.get('tableId'));
        }

        if (query.get('tableName') && tableId != query.get('tableName')) {
            setTableName(query.get('tableName'));
        }

        if (query.get('orgId') && orgId != query.get('orgId')) {
            setOrgId(query.get('orgId'));
        }

        if (sessionExpiryDate) {
            const interval = setInterval(() => {
                const now = new Date();
                const expiryDate = new Date(sessionExpiryDate);
                if (now >= expiryDate) {
                    setTableId(null);
                    setTableName(null);
                    setOrgId(null);
                    setSessionExpiryDate(null);
                    localStorage.removeItem('tableId');
                    localStorage.removeItem('tableName');
                    localStorage.removeItem('orgId');
                    localStorage.removeItem('sessionExpiryDate');

                    window.location.href = '/';
                }
            }, 1000);
            intervalRef.current = interval;
        } 
    }, []);

    useEffect(() => {
        const now = new Date();
        const expiryDate = new Date(now.getTime() + 45 * 60000);
        setSessionExpiryDate(expiryDate);
        
        getProducts();
    }, [orgId]);
    

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
