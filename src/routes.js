import AllProducts from "./pages/AllProducts";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Search from "./pages/Search";
//list your routes here
export const routes = [
    {path: "/", element: <Home/>},
    {path: "/search", element: <Search/>},
    {path: "/all-products", element: <AllProducts/>},
    {path: "*", element: <NotFound/>},
]
