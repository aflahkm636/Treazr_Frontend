import { Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";
import NavBar2 from "./common/layout/Navbar2";
import Footer from "./common/layout/Footer";
import ScrollToTop from "./common/components/ScrollTop";
import { useAuth } from "./common/context/AuthProvider";
import Loading from "./common/components/Loading";
import Order from "./pages/Order/order";
import OrderSuccess from "./pages/Order/orderSuccess";

// Lazy-loaded components
const Landing = lazy(() => import("./pages/landing/Landing"));
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const ErrorResponse = lazy(() => import("./pages/Errorresponse"));
const TopRated = lazy(() => import("./pages/landing/Toprated"));
const Newest = lazy(() => import("./pages/landing/Newest"));
const Products = lazy(() => import("./pages/products/Products"));
const ProductList = lazy(() => import("./pages/products/ProductList"));
const DiecastCars = lazy(() => import("./pages/products/DiecastCars"));
const ActionFigures = lazy(() => import("./pages/products/ActionFigures"));
const Comics = lazy(() => import("./pages/products/Comics"));
const TradingCards = lazy(() => import("./pages/products/TradingCards"));
const CategoryProducts = lazy(() => import("./pages/landing/CategoryProducts"));
const ProductDetails = lazy(() => import("./common/components/ProductDetails"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Cart = lazy(() => import("./pages/Cart"));
const CheckOut = lazy(() => import("./pages/Order/CheckOut"));
const Profile = lazy(() => import("./common/components/Profile"));
const BuyNow = lazy(() => import("./common/components/BuyNow"));
const OrderStatus = lazy(() => import("./pages/Order/OrderStatus"));
const ViewOrders = lazy(() => import("./common/components/ViewOrders"));
const OrderDetails = lazy(() => import("./pages/Order/OrderDetails"));

// Admin components
const AdminLayout = lazy(() => import("./admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./admin/Admindashboard"));
const ManageUser = lazy(() => import("./admin/ManageUser"));
const UserDetails = lazy(() => import("./admin/UserDetails"));
const ProductManage = lazy(() => import("./admin/ProductManage"));
const OrderManage = lazy(() => import("./admin/OrderManage"));

// --- Route wrappers ---
const ProtectedRoute = ({ adminOnly = false }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />;

    return <Outlet />;
};

const PublicRoute = () => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

// --- Main Router ---
const RoutesWrapper = () => {
    const location = useLocation();

    const hideNavbar = ["/login", "/register"].includes(location.pathname) || location.pathname.startsWith("/admin");
    const hideFooter =
        ["/login", "/register", "/cart", "/wishlist", "/profile", "/checkout"].includes(location.pathname) ||
        location.pathname.startsWith("/admin") ||
        location.pathname.startsWith("/productdetails/");

    return (
        <>
            {!hideNavbar && <NavBar2 />}
            <main>
                <Suspense
                    fallback={
                        <div className="text-center py-10">
                            <Loading />
                        </div>
                    }
                >
                    <ScrollToTop />
                    <Routes>
                        {/* Public routes */}
                        <Route element={<PublicRoute />}>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                        </Route>

                        {/* Admin routes */}
                        <Route element={<ProtectedRoute adminOnly />}>
                            <Route path="/admin" element={<AdminLayout />}>
                                <Route index element={<AdminDashboard />} />
                                <Route path="users" element={<ManageUser />} />
                                <Route path="users-details/:userId" element={<UserDetails />} />
                                <Route path="products" element={<ProductManage />} />
                                <Route path="orders" element={<OrderManage />} />
                            </Route>
                        </Route>

                        {/* User-protected routes */}
                        <Route element={<ProtectedRoute />}>
                            {/* Landing & Products */}
                            <Route path="/" element={<Landing />}>
                                <Route index element={<TopRated />} />
                                <Route path="top-rated" element={<TopRated />} />
                                <Route path="newest" element={<Newest />} />
                            </Route>

                            <Route path="/products" element={<Products />}>
                                <Route index element={<ProductList />} />
                                <Route path="all" element={<ProductList />} />
                                <Route path="diecast-cars" element={<DiecastCars />} />
                                <Route path="action-figures" element={<ActionFigures />} />
                                <Route path="comics" element={<Comics />} />
                                <Route path="trading-cards" element={<TradingCards />} />
                            </Route>

                            <Route path="/category/:categoryName" element={<CategoryProducts />} />
                            <Route path="/productdetails/:id" element={<ProductDetails />} />

                            {/* User-specific */}
                            <Route path="/wishlist" element={<Wishlist />} />
                            <Route path="/cart" element={<Cart />} />
                            {/* <Route path="/checkout" element={<CheckOut />} /> */}
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/buy-now" element={<BuyNow />} />
                            {/* <Route path="/orderstatus/:orderId" element={<OrderStatus />} /> */}
                            <Route path="/vieworder" element={<ViewOrders />} />
                            {/* <Route path="/order-details" element={<OrderDetails />} /> */}
                            <Route path="/order" element={<Order />} />
                            <Route path="/order-success" element={<OrderSuccess />} />
                        </Route>

                        {/* Catch-all */}
                        <Route path="/*" element={<ErrorResponse />} />
                    </Routes>
                </Suspense>
            </main>
            {!hideFooter && <Footer />}
        </>
    );
};

export default RoutesWrapper;
