import AllProducts from "./pages/AllProducts";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Search from "./pages/Search";
import ThankYou from "./pages/ThankYou";
//list your routes here
export const routes = [
    { path: "/", element: <Home /> },
    { path: "/search", element: <Search /> },
    { path: "/all-products", element: <AllProducts /> },
    { path: "/thank-you", element: <ThankYou /> },
    { path: "*", element: <NotFound /> },
]
