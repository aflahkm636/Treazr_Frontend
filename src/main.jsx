// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./common/context/AuthProvider.jsx";
import { StrictMode } from "react";
import { CartProvider } from "./common/context/CartContext.jsx";
import { WishlistProvider } from "./common/context/WishlistContext.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <CartProvider>
                    <WishlistProvider>
                        <App />
                    </WishlistProvider>
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
);
