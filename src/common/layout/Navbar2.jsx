import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faHouse, faHeart, faBoxesStacked, faUser } from "@fortawesome/free-solid-svg-icons";
import { useMemo, useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useCart } from "../context/CartContext";
import { GetUser } from "../../services/AdminService/UserService";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const FALLBACK_AVATAR = "src/assets/profile.png";

const AuthMenuItems = ({ isAuthenticated, logout }) => {
    const getMenuItemClass = useCallback(
        (focus) => classNames(
            focus ? "bg-slate-800" : "",
            "block px-4 py-2 text-sm text-gray-200 transition-colors duration-200"
        ),
        []
    );

    return isAuthenticated ? (
        <>
            <MenuItem>
                {({ focus }) => (
                    <NavLink to="/profile" className={getMenuItemClass(focus)}>
                        Your Profile
                    </NavLink>
                )}
            </MenuItem>
            <MenuItem>
                {({ focus }) => (
                    <button 
                        onClick={logout} 
                        className={classNames(
                            getMenuItemClass(focus), 
                            "w-full text-left text-rose-400 hover:text-rose-300"
                        )}
                    >
                        Sign out
                    </button>
                )}
            </MenuItem>
        </>
    ) : (
        <>
            <MenuItem>
                {({ focus }) => (
                    <NavLink to="/login" className={getMenuItemClass(focus)}>
                        Login
                    </NavLink>
                )}
            </MenuItem>
            <MenuItem>
                {({ focus }) => (
                    <NavLink to="/register" className={getMenuItemClass(focus)}>
                        Register
                    </NavLink>
                )}
            </MenuItem>
        </>
    );
};

const NavLinkItem = ({ item, cartCount }) => {
    const location = useLocation();
    const isActive = location.pathname === item.href || 
                    (item.href !== "/" && location.pathname.startsWith(item.href));

    return (
        <NavLink
            to={item.href}
            className={classNames(
                isActive ? "text-white" : "text-gray-300 hover:text-white",
                "px-4 py-2 text-sm font-medium flex items-center relative transition-all duration-300 group overflow-hidden"
            )}
        >
            <FontAwesomeIcon 
                icon={item.icon} 
                className={classNames(
                    isActive ? "text-cyan-400" : "text-gray-400 group-hover:text-cyan-300",
                    "mr-3 transition-colors duration-200"
                )} 
            />
            <span className="relative">
                {item.name}
                {/* Animated underline */}
                <span className={classNames(
                    "absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300 group-hover:w-full",
                    isActive ? "w-full" : ""
                )} />
            </span>
            
            {item.name === "Cart" && cartCount > 0 && (
                <span className="ml-2 bg-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {cartCount}
                </span>
            )}
        </NavLink>
    );
};

export default function NavBar() {
    const { user: authUser, isAuthenticated, logout } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch user data when authenticated
    useEffect(() => {
        const fetchUserData = async () => {
            if (isAuthenticated) {
                setLoading(true);
                try {
                    const userResponse = await GetUser();
                    setUserData(userResponse.data);
                } catch (error) {
                    console.error("Failed to fetch user data:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setUserData(null);
            }
        };

        fetchUserData();
    }, [isAuthenticated]);

    // Calculate cart count from user data or local cart context
    const cartCount = useMemo(() => {
        // If we have user data with cart items, use that count
        if (userData?.cart?.items?.length > 0) {
            return userData.cart.items.length;
        }
        // Otherwise fall back to local cart context
        return cart?.length || 0;
    }, [userData, cart]);

    const navigation = useMemo(
        () => [
            { name: "Home", href: "/", icon: faHouse },
            { name: "Products", href: "/products", icon: faBoxesStacked },
            ...(isAuthenticated ? [{ name: "Wishlist", href: "/wishlist", icon: faHeart }] : []),
            { name: "Cart", href: "/cart", icon: faCartShopping },
        ],
        [isAuthenticated]
    );

    const handleLoginClick = () => {
        navigate("/login");
    };

    // Get user's first name for display
    const displayName = useMemo(() => {
        if (userData?.name) {
            return userData.name.split(' ')[0];
        }
        if (authUser?.name) {
            return authUser.name.split(' ')[0];
        }
        return "User";
    }, [userData, authUser]);

    return (
        <Disclosure as="nav" className="fixed top-0 w-full z-50 bg-gradient-to-b from-slate-950 to-black shadow-xl border-b border-slate-800">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            {/* Left side - Logo and Nav */}
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white">
                                            T
                                        </div>
                                        <span className="text-white font-black text-xl">
                                            Treazr
                                        </span>
                                    </div>
                                </div>
                                <div className="hidden sm:ml-8 sm:block">
                                    <div className="flex space-x-2">
                                        {navigation.map((item) => (
                                            <NavLinkItem
                                                key={item.name}
                                                item={item}
                                                cartCount={item.name === "Cart" ? cartCount : 0}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right side - Profile or Login */}
                            <div className="flex items-center">
                                {isAuthenticated ? (
                                    <>
                                        <div className="hidden sm:block mr-4">
                                            <span className="text-cyan-200 text-sm font-medium">
                                                {loading ? "Loading..." : `Welcome, ${displayName}`}
                                            </span>
                                        </div>

                                        {/* Profile dropdown */}
                                        <Menu as="div" className="relative">
                                            <MenuButton className="flex rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200">
                                                <img
                                                    className="h-8 w-8 rounded-full border-2 border-cyan-500/50 hover:border-cyan-400 transition-colors duration-200"
                                                    src={userData?.avatar || FALLBACK_AVATAR}
                                                    alt="User profile"
                                                    width={32}
                                                    height={32}
                                                    onError={(e) => {
                                                        e.target.src = FALLBACK_AVATAR;
                                                    }}
                                                />
                                            </MenuButton>
                                            <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-slate-900 shadow-lg ring-1 ring-slate-700 focus:outline-none overflow-hidden backdrop-blur-sm">
                                                <AuthMenuItems isAuthenticated={isAuthenticated} logout={logout} />
                                            </MenuItems>
                                        </Menu>
                                    </>
                                ) : (
                                    <>
                                        {/* Login button - desktop */}
                                        <button
                                            onClick={handleLoginClick}
                                            className="hidden sm:flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-gradient-to-r from-cyan-600 to-purple-600 text-white hover:from-cyan-500 hover:to-purple-500 shadow-md hover:shadow-cyan-500/20"
                                        >
                                            <FontAwesomeIcon icon={faUser} className="mr-2 text-cyan-100" />
                                            Login
                                        </button>
                                    </>
                                )}

                                {/* Mobile menu button */}
                                <div className="sm:hidden ml-4">
                                    <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-slate-800 hover:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500 transition-colors duration-200">
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                            <XMarkIcon className="block h-6 w-6" />
                                        ) : (
                                            <Bars3Icon className="block h-6 w-6" />
                                        )}
                                    </DisclosureButton>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    <DisclosurePanel className="sm:hidden bg-gradient-to-b from-slate-950 to-black shadow-xl border-b border-slate-800">
                        <div className="space-y-1 px-2 pb-3 pt-2">
                            {navigation.map((item) => (
                                <DisclosureButton
                                    key={item.name}
                                    as={NavLink}
                                    to={item.href}
                                    className={({ isActive }) =>
                                        classNames(
                                            isActive ? "text-cyan-400 border-l-4 border-cyan-500" : "text-gray-300 border-l-4 border-transparent",
                                            "block px-4 py-3 text-base font-medium flex items-center relative transition-all duration-200 hover:text-cyan-400 hover:bg-slate-800/50 rounded-r-md"
                                        )
                                    }
                                >
                                    <FontAwesomeIcon 
                                        icon={item.icon} 
                                        className={classNames(
                                            location.pathname === item.href ? "text-cyan-400" : "text-gray-400",
                                            "mr-4"
                                        )} 
                                    />
                                    {item.name}
                                    {item.name === "Cart" && cartCount > 0 && (
                                        <span className="ml-auto bg-rose-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                                            {cartCount}
                                        </span>
                                    )}
                                </DisclosureButton>
                            ))}
                            {isAuthenticated ? (
                                <div className="pt-4 pb-2 border-t border-slate-700">
                                    <div className="flex items-center px-4 py-3">
                                        <img
                                            className="h-10 w-10 rounded-full border-2 border-cyan-500"
                                            src={userData?.avatar || FALLBACK_AVATAR}
                                            alt="User profile"
                                            onError={(e) => {
                                                e.target.src = FALLBACK_AVATAR;
                                            }}
                                        />
                                        <div className="ml-3">
                                            <div className="text-sm font-medium text-white">
                                                {loading ? "Loading..." : userData?.name || displayName}
                                            </div>
                                            <div className="text-xs text-cyan-300">Active</div>
                                        </div>
                                    </div>
                                    <div className="mt-2 space-y-1">
                                        <DisclosureButton
                                            as={NavLink}
                                            to="/profile"
                                            className="block px-4 py-2 text-sm text-gray-300 hover:text-cyan-400 hover:bg-slate-800/50 rounded-md transition-colors duration-200 border-l-4 border-transparent hover:border-cyan-500"
                                        >
                                            Your Profile
                                        </DisclosureButton>
                                        <DisclosureButton
                                            as="button"
                                            onClick={logout}
                                            className="block w-full text-left px-4 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-slate-800/50 rounded-md transition-colors duration-200 border-l-4 border-transparent hover:border-rose-500"
                                        >
                                            Sign out
                                        </DisclosureButton>
                                    </div>
                                </div>
                            ) : (
                                <div className="pt-2 border-t border-slate-700 space-y-2">
                                    <DisclosureButton
                                        as={NavLink}
                                        to="/login"
                                        className="block w-full px-4 py-3 text-sm font-medium text-white rounded-md bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 transition-all duration-200 text-center"
                                    >
                                        Login
                                    </DisclosureButton>
                                    <DisclosureButton
                                        as={NavLink}
                                        to="/register"
                                        className="block w-full px-4 py-3 text-sm font-medium text-cyan-100 rounded-md bg-slate-800/50 hover:bg-slate-700/50 transition-colors duration-200 text-center"
                                    >
                                        Create Account
                                    </DisclosureButton>
                                </div>
                            )}
                        </div>
                    </DisclosurePanel>
                </>
            )}
        </Disclosure>
    );
}