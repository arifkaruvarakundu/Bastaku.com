import React, { useState,useEffect,useRef } from "react";
import Grocerylogo from "../images/logo basta ku 2.png";
import productimage1 from "../images/product-img-1.jpg";
import productimage2 from "../images/product-img-2.jpg";
import productimage3 from "../images/product-img-3.jpg";
import productimage4 from "../images/product-img-4.jpg";
import productimage5 from "../images/product-img-5.jpg";
import { Link,useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { setAuthenticated } from '../redux/authSlice';
import axios from "axios";
import Language_selector from "./Language_selector";
import { Trans } from "react-i18next";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import { toast } from 'react-toastify';
import API_BASE_URL from "../config";

const Header = ({onSearch}) => {
  const [isOpen, setIsOpen] = useState(false);
  // const [cartItems, setCartItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [displayedCategory, setDisplayedCategory] = useState(" ");
  // const [displayedProducts, setDisplayedProducts] = useState([]);
  // const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState({
    products: [], // Default empty array for products
    categories: [], // Default empty array for categories
  });
  const [notificationCount,setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  const { t } = useTranslation();

  console.log("language",i18n.language)

  const isArabic = i18n.language === "ar";

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    dispatch(setAuthenticated(null)); // Reset the authenticated state
    toast.success("Successfully logged out");
    navigate("/");
  };
  const cartItems = useSelector((state) => state.cart.cartItems);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const productsResponse = await axios.get("http://127.0.0.1:8000/products/");
        const categoriesResponse = await axios.get(`${API_BASE_URL}/productcategories/`);

        // setProducts(productsResponse.data);
        // setDisplayedProducts(productsResponse.data.slice(0, 12));
        setCategories(categoriesResponse.data);
        
      } catch (err) {
        // setError("Failed to load data");
        console.error(err);
      } finally {
        // setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const email = localStorage.getItem("email");
        const token = localStorage.getItem("access_token");
        if (!email || !token) return;

        const response = await axios.get(`${API_BASE_URL}/notifications/`, {
          headers: {
            "Content-Type": "application/json",
            email: email,
            Authorization: `Bearer ${token}`,
          },
        });

        // Filter unread notifications and update state
        const unreadNotifications = response.data.filter((notification) => !notification.is_read);
        console.log("notifications",unreadNotifications)

        setNotifications((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(unreadNotifications)) {
            return unreadNotifications;
          }
          return prev;
        });
  
        setNotificationCount(unreadNotifications.length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
  
    fetchNotifications();
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = () => {
    setNotificationDropdownOpen(!notificationDropdownOpen);
  };

  const handleNotificationMessageClick = (campaignId) => {
    // Redirect to user_profile with campaignId as a query parameter
    navigate("/MyAccountOrder");
  };

   // Sync cartItems with localStorage
  //  useEffect(() => {
  //   // Function to fetch the cart data from localStorage and update state
  //   const updateCart = () => {
  //     const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
  //     setCartItems(storedCart);
  //   };

  //   // Run updateCart function once when the component mounts
  //   updateCart();

  //   // Listen for changes to the cart in localStorage
  //   const intervalId = setInterval(updateCart, 1000); // Check every second for changes

  //   // Cleanup interval on component unmount
  //   return () => clearInterval(intervalId);
  // }, []);

  // useEffect(() => {
  //   const updateCart = () => {
  //     const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
  //     setCartItems((prev) => (JSON.stringify(prev) !== JSON.stringify(storedCart) ? storedCart : prev));
  //   };
  
  //   updateCart();
  
  //   window.addEventListener("storage", updateCart); 
  //   return () => window.removeEventListener("storage", updateCart);
  // }, []);
 
  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
  
    if (value.length >= 4) {
      try {
        const response = await axios.get(`${API_BASE_URL}/search/?query=${value}`);

        console.log("response",response.data)
        
        const products = Array.isArray(response.data?.products) ? response.data.products : [];
        const categories = Array.isArray(response.data?.categories) ? response.data.categories : [];
        
        // Set suggestions state with valid arrays
        setSuggestions({
          products,
          categories,
        });

      } catch (error) {
        console.error("Error fetching search suggestions:", error);
        setSuggestions({ products: [], categories: [] }); // Ensure suggestions are cleared on error
      }
    } else {
      setSuggestions({ products: [], categories: [] });
    }
  };
  
  const handleSuggestionClick = (item, type) => {
    setQuery(item.name || item.product_name); // Set the search input to either the category name or product name
    setSuggestions({ products: [], categories: [] }); // Clear suggestions when an item is selected
  
    if (type === "product") {
      navigate(`/productDetails/${item.id}`);  // Navigate to the product details page
    } else if (type === "category") {
      // Handle category click to navigate to the shop page with the selected category
      setSelectedCategory(item.name);  // Update the selected category state
      setDisplayedCategory(item.name); // Update the displayed category state
      
      if (item.name === "All") {
        // If "All" category is selected, navigate to the shop page without filtering by category
        navigate('/shop'); // Navigate to the shop page showing all products
      } else {
        // Navigate to the shop page and pass the category in the URL to filter products
        navigate(`/Shop`, { state: { displayedCategory: item.name } }); // Pass the category in the URL
      }
    }
  }
  
  return (
    <div>
      <>
        <div className="border-bottom pb-5">
          <div className="bg-light py-1">
            <div className="container">
              <div className="row">
                <Language_selector />
                <div className="col-md-10 col-12 d-flex" style={{ alignItems: "center" }}>
                  {/* <span> Super Value Deals - Save more with coupons</span> */}
                </div>

                <div className="col-md-2 col-xxl-1 text-end d-none d-lg-block" style={{ marginLeft: "20px" }}>
                  <div className="list-inline">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        position: "relative", 
                      }}
                    >
                      {/* Notification Icon (only for authenticated users) */}
                      {isAuthenticated && (
                        <div style={{ position: "relative" }}>
                          <i
                            ref={notificationRef}
                            className="bi bi-bell notification-icon"
                            onClick={handleNotificationClick}
                            style={{
                              fontSize: "20px",
                              position: "relative",
                              cursor: "pointer",
                            }}
                          >
                            {notificationCount > 0 && (
                              <span
                                style={{
                                  position: "absolute",
                                  top: "-5px",
                                  right: "-5px",
                                  backgroundColor: "green",
                                  color: "white",
                                  borderRadius: "50%",
                                  padding: "2px 6px",
                                  fontSize: "12px",
                                  fontWeight: "bold",
                                  lineHeight: "1",
                                }}
                              >
                                {notificationCount}
                              </span>
                            )}
                          </i>

                          {/* === Notification Dropdown === */}
                          {notificationDropdownOpen && (
                            <div
                              ref={dropdownRef}
                              style={{
                                position: "absolute",
                                top: "30px",
                                right: "0",
                                backgroundColor: "#fff",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                width: "300px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                zIndex: 9999,
                                padding: "10px",
                              }}
                            >
                              {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                  <div
                                    key={notification.id}
                                    style={{
                                      padding: "8px",
                                      borderBottom: "1px solid #eee",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleNotificationMessageClick(notification.campaign_id)}
                                  >
                                    {notification.message}
                                  </div>
                                ))
                              ) : (
                                <div style={{ padding: "10px", textAlign: "center" }}>
                                  No new notifications
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Cart Icon (shown if NOT authenticated wholesaler) */}
                      {localStorage.getItem("user_type") !== "wholesaler" && (
                        <Link
                          className="text-muted position-relative"
                          to="/shopCart"
                          role="button"
                          aria-controls="offcanvasRight"
                          style={{ cursor: "pointer" }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={20}
                            height={20}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-shopping-bag"
                          >
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                            <line x1={3} y1={6} x2={21} y2={6} />
                            <path d="M16 10a4 4 0 0 1-8 0" />
                          </svg>

                          <span
                            style={{
                              position: "absolute",
                              top: "-5px",
                              right: "-10px",
                              backgroundColor: "green",
                              color: "white",
                              borderRadius: "50%",
                              padding: "2px 6px",
                              fontSize: "12px",
                              fontWeight: "bold",
                            }}
                          >
                            {cartItems.length}
                          </span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>

      <>
        <div className="container  displaydesign">
          <div className="row g-4">
          <div
              className="col-8 col-sm-4 col-lg-9 py-2"
              style={{
                position: window.innerWidth <= 480 ? "relative" : "static",
                right: window.innerWidth <= 480 ? "0" : "auto",
                width: window.innerWidth <= 480 ? "100%" : "auto",
                marginInlineStart: window.innerWidth > 480 ? (isArabic ? "0" : "1rem") : "0",
              }}

            >
              <input
                type="search"
                className="form-control"
                style={{
                  width: "100%",
                  borderBottom: window.innerWidth <= 480 ? "1px solid #e9edec" : "none",
                  marginTop: window.innerWidth <= 480 ? "2.875rem" : "0",
                  padding: window.innerWidth <= 480 ? "1.25rem" : "0.375rem 0.75rem",
                  WebkitAppearance: "textfield",
                  outlineOffset: "-2px",
                  display: window.innerWidth <= 768 ? "none" : "block",
                }}
                list="datalistOptions"
                id="exampleDataList"
                placeholder={t("search_placeholder", { ns: "header" })}
              />
            </div>
            <div
              className="col-4 col-sm-4 col-lg-3 py-2 d-flex"
              style={{ justifyContent: "center" }}
            >
              
              <div className="list-inline">
                <div className="list-inline-item">
                  <Link
                    to="/ShopWishList"
                    className="text-muted position-relative"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-heart"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                      5<span className="visually-hidden">unread messages</span>
                    </span>
                  </Link>
                </div>
                <div className="list-inline-item">
                  <Link
                    to="#!"
                    className="text-muted"
                    data-bs-toggle="modal"
                    data-bs-target="#userModal"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-user"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx={12} cy={7} r={4} />
                    </svg>
                  </Link>
                </div>
                <div className="list-inline-item">
                  <Link
                    className="text-muted position-relative "
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasRight"
                    to="#offcanvasExample"
                    role="button"
                    aria-controls="offcanvasRight"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-shopping-bag"
                    >
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                      <line x1={3} y1={6} x2={21} y2={6} />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                      1<span className="visually-hidden">unread messages</span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
      <nav className="navbar navbar-expand-lg navbar-light sticky-top">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img
              src={Grocerylogo}
              style={{ width: 150, marginBottom: 10, marginLeft: "-15px" }}
              alt="eCommerce HTML Template"
            />
          </Link>
          <div
            style={{
              position: "relative",
              marginInlineEnd: isArabic ? "1rem" : "0", // shifts it left in RTL
            }}
          >
            <input
              className="form-control"
              style={{ width: "200%" }}
              list="datalistOptions"
              id="exampleDataList"
              placeholder={t("search_placeholder", { ns: "header" })}
              value={query}
              onChange={handleInputChange}
            />
            {suggestions.products.length > 0 || suggestions.categories.length > 0 ? (
              <div
                className="suggestions-dropdown"
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  width: "200%",
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  zIndex: 1000,
                  maxHeight: "200px",
                  overflowY: "auto",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                {suggestions.products.length > 0 && (
                  <div>
                    <h5 style={{marginLeft: 10}}><Trans i18nKey="products" ns="header">Products</Trans></h5>
                    {suggestions.products.map((product) => (
                      <div
                        key={product.id}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(product, "product")}
                        style={{
                          padding: "10px",
                          cursor: "pointer",
                          borderBottom: "1px solid #eee",
                          transition: "background 0.2s",
                        }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#f8f9fa")}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                      >
                        <img
                          src={product.variants[0].variant_images[0].image_url} // Fallback to default image if product image is not available
                          alt={product.product_name || "Product"} // Fallback to a generic name if product name is missing
                          style={{
                            width: "30px", // Adjust the size as needed
                            height: "30px",
                            marginRight: "10px", // Add some space between image and text
                            objectFit: "cover", // Ensure image aspect ratio is maintained
                            borderRadius: "4px", // Optional: add some border radius to the image
                          }}
                        />
                        {product.product_name}
                      </div>
                    ))}
                  </div>
                )}
                {suggestions.categories.length > 0 && (
                  <div>
                    <h5 style={{marginLeft:10}}><Trans i18nKey="categories" ns="header">Categories</Trans></h5>
                    {suggestions.categories.map((category) => (
                      <div
                        key={category.id}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(category, "category")}
                        style={{
                          padding: "10px",
                          cursor: "pointer",
                          borderBottom: "1px solid #eee",
                          transition: "background 0.2s",
                        }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#f8f9fa")}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                      >
                        <img
                          src={`http://127.0.0.1:8000${category.category_image}`} // Fallback to default image if product image is not available
                          alt={category.name || "Product"} // Fallback to a generic name if product name is missing
                          style={{
                            width: "30px", // Adjust the size as needed
                            height: "30px",
                            marginRight: "10px", // Add some space between image and text
                            objectFit: "cover", // Ensure image aspect ratio is maintained
                            borderRadius: "4px", // Optional: add some border radius to the image
                          }}
                        />
                        {category.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#mobile_nav"
            aria-controls="mobile_nav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <div
              className={`containerr ${isOpen ? "change" : ""}`}
              onClick={handleClick}
            >
              <div className="bar1"></div>
              <div className="bar2"></div>
              <div className="bar3"></div>
            </div>
          </button>

          <div className="collapse navbar-collapse" id="mobile_nav">
            <ul className="navbar-nav mr-auto mt-2 mt-lg-0 float-md-right"></ul>
            <ul className="navbar-nav navbar-light">
              {/* <li className="nav-item">
                <li className="nav-item dmenu dropdown">

                  <Link
                    className="nav-link dropdown-toggle"
                    to=""
                    id="navbarDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <span class="me-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-grid"
                      >
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                      </svg>
                    </span>{" "}
                    All Departments
                  </Link>

                  <div className="dropdown-menu sm-menu" aria-labelledby="navbarDropdown">
                  
                  {categories.map((category) => (
                    <Link key={category.id} className="dropdown-item" to={`/Shop/${category.id}`}>
                      {category.name}
                    </Link>
                  ))}
                </div>
                </li>
              </li> */}
              <li className="nav-item">
                <Link className="nav-link" to="/">
                <Trans i18nKey="home" ns="header">Home</Trans>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/Campaigns">
                  <Trans i18nKey="campaigns" ns ="header">Campaigns</Trans>
                </Link>
              </li>
              <li className="nav-item dmenu dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <Trans i18nKey="about" ns="header">About</Trans>
                </Link>
                <div
                  className="dropdown-menu sm-menu"
                  aria-labelledby="navbarDropdown"
                >
                  {/* <Link class="dropdown-item" to="/Blog">
                    Blog
                  </Link> */}
                  {/* <Link className="dropdown-item" to="pages/blog-single.html">
                    Blog Single
                  </Link> */}
                  {/* <Link className="dropdown-item" to="/BlogCategory">
                    Blog Category
                  </Link> */}
                  <Link className="dropdown-item" to="/AboutUs">
                    <Trans i18nKey="about_us" ns="header">About us</Trans>
                  </Link>
                  {/* <Link className="dropdown-item" to="pages/404error.html">
                    404 Error
                  </Link> */}
                  <Link className="dropdown-item" to="*">
                    <Trans i18nKey="contact" ns="header">Contact</Trans>
                  </Link>
                </div>
              </li>
              {!localStorage.getItem("company_name") && (
              <li className="nav-item dmenu dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <Trans i18nKey="shop" ns="header">
                  Shop
                  </Trans>
                </Link>
                <div
                  className="dropdown-menu sm-menu"
                  aria-labelledby="navbarDropdown"
                >
                  <Link className="dropdown-item" to="/Shop">
                  <Trans i18nKey="shop" ns="header">
                    Shop
                  </Trans>
                  </Link>
                  {/* <Link className="dropdown-item" to="/ShopWishList">
                    Shop Wishlist
                  </Link> */}
                  <Link className="dropdown-item" to="/ShopCart">
                    <Trans i18nKey="shop_cart" ns="header">Shop Cart</Trans>
                  </Link>
                  <Link className="dropdown-item" to="/ShopCheckOut">
                  <Trans i18nKey="shop_checkout" ns="header">
                    Shop Checkout
                  </Trans>
                  </Link>
                </div>
              </li>
              )}

              {/* <li className="nav-item dmenu dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Stores
                </Link>
                <div
                  className="dropdown-menu sm-menu"
                  aria-labelledby="navbarDropdown"
                >
                  <Link className="dropdown-item" to="/StoreList">
                    Store List
                  </Link> */}
                  {/* <Link className="dropdown-item" to="pages/store-grid.html">
                    Store Grid
                  </Link> */}
                  {/* <Link className="dropdown-item" to="/SingleShop">
                    Single Store
                  </Link>
                </div>
              </li> */}
              {/* <li className="nav-item dmenu dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Pages
                </Link>
                <div
                  className="dropdown-menu sm-menu"
                  aria-labelledby="navbarDropdown"
                >
                  <Link class="dropdown-item" to="pages/blog.html">
                    Blog
                  </Link>
                  <div>
                    <Link className="dropdown-item" to="pages/blog-single.html">
                      Blog Single
                    </Link>
                    <Link
                      className="dropdown-item"
                      to="pages/blog-category.html"
                    >
                      Blog Category
                    </Link>
                    <Link className="dropdown-item" to="pages/about.html">
                      About us
                    </Link>
                    <Link className="dropdown-item" to="pages/404error.html">
                      404 Error
                    </Link>
                    <Link className="dropdown-item" to="pages/contact.html">
                      Contact
                    </Link>
                  </div>
                </div>
              </li> */}

              {/* <li className="nav-item dropdown megamenu-li dmenu">
                <Link
                  className="nav-link dropdown-toggle"
                  to="/Shop"
                  id="dropdown01"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  All Services
                </Link>
                <div
                  className="dropdown-menu megamenu sm-menu border-top"
                  aria-labelledby="dropdown01"
                >
                  <div className="row">
                    <div className="col-sm-6 col-lg-3 border-right mb-4">
                      <div>
                        <h6 className="text-primary ps-3">
                          Dairy, Bread &amp; Eggs
                        </h6>
                        <Link className="dropdown-item" to="/Shop">
                          Butter
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          Milk Drinks
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          Curd &amp; Yogurt
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          Eggs
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          Buns &amp; Bakery
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          Cheese
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          Condensed Milk
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          Dairy Products
                        </Link>
                      </div>
                    </div>
                    <div className="col-sm-6 col-lg-3 border-right mb-4">
                      <div>
                        <h6 className="text-primary ps-3">
                          Breakfast &amp; Instant Food
                        </h6>
                        <Link className="dropdown-item" to="/Shop">
                          Breakfast Cereal
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          {" "}
                          Noodles, Pasta &amp; Soup
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          Frozen Veg Snacks
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          {" "}
                          Frozen Non-Veg Snacks
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          {" "}
                          Vermicelli
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          {" "}
                          Instant Mixes
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          {" "}
                          Batter
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          {" "}
                          Fruit and Juices
                        </Link>
                      </div>
                    </div>
                    <div className="col-sm-6 col-lg-3 mb-4">
                      <div>
                        <h6 className="text-primary ps-3">
                          Cold Drinks &amp; Juices
                        </h6>
                        <Link className="dropdown-item" to="/Shop">
                          Soft Drinks
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          Fruit Juices
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          Coldpress
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          Water &amp; Ice Cubes
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          Soda &amp; Mixers
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          Health Drinks
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          Herbal Drinks
                        </Link>
                        <Link className="dropdown-item" to="/Shop">
                          Milk Drinks
                        </Link>
                      </div>
                    </div>

                    {/* <div className="row"> */}
                    {/* <div className="col-sm-6 col-lg-3 border-right mb-4">
                      <div className="card border-0">
                        <img
                          src={menubanner}
                          style={{ width: "90%" }}
                          alt="eCommerce HTML Template"
                          className="img-fluid rounded-3"
                        />
                        <div className="position-absolute ps-6 mt-8">
                          <h5 className=" mb-0 ">
                            Dont miss this <br />
                            offer today.
                          </h5>
                          <Link
                            to="/Shop"
                            className="btn btn-primary btn-sm mt-3"
                          >
                            Shop Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </li> */} 

              <li className="nav-item dmenu dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to=""
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {localStorage.getItem("company_name") ? (
                    localStorage.getItem("company_name")
                  ) : (
                    localStorage.getItem("user_name") || <Trans i18nKey="account" ns="header">Account</Trans>
                  )}
                </Link>
                <div
                  className="dropdown-menu sm-menu"
                  aria-labelledby="navbarDropdown"
                >
                  <div>
                    <div>
                    {!isAuthenticated && (
                      <>
                      <Link className="dropdown-item" to="/MyAccountSignIn">
                      <Trans i18nKey="sign_in" ns="header">
                        Sign in
                      </Trans>
                      </Link>
                      <Link className="dropdown-item" to="/MyAccountSignUp">
                      <Trans i18nKey="sign_up" ns="header">
                        Signup
                      </Trans>
                      </Link>
                      {/* <Link
                        className="dropdown-item"
                        to="/MyAccountForgetPassword"
                      >
                        Forgot Password
                      </Link> */}
                      </>
                    )}
                      
                      {isAuthenticated && (
                        <>
                        <button
                          className="dropdown-item"
                          onClick={handleLogout}
                        >
                          <Trans i18nKey="logout" ns="header">
                            Logout
                          </Trans>
                        </button>
                        {/* <Link className="dropdown-item" to="/MyAccountSetting">
                        <Trans i18nKey="settings" ns="header">
                        Settings
                        </Trans>
                        </Link> */}
                        <Link className="dropdown-item" to="/MyAccountAddress">
                          <Trans i18nKey="address" ns="header">
                            Address
                          </Trans>
                        </Link>
                        <Link
                        className="dropdown-item"
                        to="/MyAcconutPaymentMethod"
                        >
                        <Trans i18nKey="bank_details" ns="header">
                        Bank Details
                        </Trans>
                        </Link>
                        <Link
                        className="dropdown-item"
                        to="/MyAcconutNotification"
                        >
                        <Trans i18nKey="notifications" ns="header">
                        Notification
                        </Trans>
                        </Link>
                        <Link
                        className="dropdown-item"
                        to="/MyAccountOrder"
                        >
                        <Trans i18nKey="your_orders" ns="header">
                        Your Orders
                        </Trans>
                        </Link>
                        {localStorage.getItem('user_name') && (
                        <>
                        <Link
                        className="dropdown-item"
                        to="/MyCampaigns"
                        >
                        <Trans i18nKey="campaigns" ns="header">
                        Campaigns
                        </Trans>
                        </Link>
                        </>
                        )}
                        {/* Add Wholesaler-specific Options */}
                          {localStorage.getItem('company_name') && (
                            <>
                              <Link className="dropdown-item" to="/AddProducts">
                              <Trans i18nKey="add_products" ns="header">
                                Add Products
                              </Trans>
                              </Link>
                              <Link className="dropdown-item" to="/AddedProducts">
                              <Trans i18nKey="added_products" ns="header">
                                Added Products
                              </Trans>
                              </Link>
                              <Link className="dropdown-item" to="/WholesalerCampaigns">
                              <Trans i18nKey="campaigns" ns="header">
                                Campaigns
                                </Trans>
                              </Link>
                            </>
                          )}
                        </>
                      )}
                    </div>
                    </div>
                  </div>
                </li>
                {/* {!isAuthenticated && (
              <li className="nav-item dmenu dropdown">
                
                <Link
                  className="nav-link dropdown-toggle"
                  to="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Are you wholesaler ?
                </Link>
                <div
                  className="dropdown-menu sm-menu"
                  aria-labelledby="navbarDropdown"
                >
                  <Link className="dropdown-item" to="/WholesalerAccountSignIn">
                    Sign in
                  </Link> */}
                  {/* <Link className="dropdown-item" to="pages/store-grid.html">
                    Store Grid
                  </Link> */}
                  {/* <Link className="dropdown-item" to="/WholesalerAccountSignUp">
                    Signup
                  </Link>
                </div>
              </li>
              )} */}
              {/* <li className="nav-item">
                <Link className="nav-link" to="">
                  Contact us
                </Link>
              </li> */}
            </ul>
          </div>
          {/* <div className="col-md-2 col-xxl-1 text-end d-none d-lg-block">
            
          </div> */}
        </div>
      </nav>
      <>
        <div>
          {/* Modal */}
          <div
            className="modal fade"
            id="userModal"
            tabIndex={-1}
            aria-labelledby="userModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content p-4">
                <div className="modal-header border-0">
                  <h5 className="modal-title fs-3 fw-bold" id="userModalLabel">
                    <Trans i18nKey="sign_up" ns="header">
                    Sign Up
                    </Trans>
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label htmlFor="fullName" className="form-label">
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="fullName"
                        placeholder="Enter Your Name"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email address
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Enter Email address"
                        required
                      />
                    </div>
                    <div className="mb-5">
                      <label htmlFor="password" className="form-label">
                        Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Enter Password"
                        required
                      />
                      <small className="form-text">
                        By Signup, you agree to our{" "}
                        <Link to="#!">Terms of Service</Link> &amp;{" "}
                        <Link to="#!">Privacy Policy</Link>
                      </small>
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Sign Up
                    </button>
                  </form>
                </div>
                <div className="modal-footer border-0 justify-content-center">
                  Already have an account?{" "}
                  <Link to="/MyAccountSignIn">Sign in</Link>
                </div>
              </div>
            </div>
          </div>
          {/* Shop Cart */}
          <div
            className="offcanvas offcanvas-end"
            tabIndex={-1}
            id="offcanvasRight"
            aria-labelledby="offcanvasRightLabel"
          >
            <div className="offcanvas-header border-bottom">
              <div className="text-start">
                <h5 id="offcanvasRightLabel" className="mb-0 fs-4">
                  Shop Cart
                </h5>
                <small>Location in 382480</small>
              </div>
              <button
                type="button"
                className="btn-close text-reset"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              />
            </div>
            <div className="offcanvas-body">
              <div className="alert alert-danger" role="alert">
                You’ve got FREE delivery. Start checkout now!
              </div>
              <div>
                <div className="py-3">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item py-3 px-0 border-top">
                      <div className="row align-items-center">
                        <div className="col-2">
                          <img
                            src={productimage1}
                            alt="Ecommerce"
                            className="img-fluid"
                          />
                        </div>
                        <div className="col-5">
                          <h6 className="mb-0">Organic Banana</h6>
                          <span>
                            <small className="text-muted">.98 / lb</small>
                          </span>
                          <div className="mt-2 small">
                            {" "}
                            <Link to="#!" className="text-decoration-none">
                              {" "}
                              <span className="me-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={16}
                                  height={16}
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="feather feather-trash-2"
                                >
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                  <line x1={10} y1={11} x2={10} y2={17} />
                                  <line x1={14} y1={11} x2={14} y2={17} />
                                </svg>
                              </span>
                              Remove
                            </Link>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className="input-group  flex-nowrap justify-content-center  ">
                            <input
                              type="button"
                              defaultValue="-"
                              className="button-minus form-control  text-center flex-xl-none w-xl-30 w-xxl-10 px-0  "
                              data-field="quantity"
                            />
                            <input
                              type="number"
                              step={1}
                              max={10}
                              defaultValue={1}
                              name="quantity"
                              className="quantity-field form-control text-center flex-xl-none w-xl-30 w-xxl-10 px-0 "
                            />
                            <input
                              type="button"
                              defaultValue="+"
                              className="button-plus form-control  text-center flex-xl-none w-xl-30  w-xxl-10 px-0  "
                              data-field="quantity"
                            />
                          </div>
                        </div>
                        <div className="col-2 text-end">
                          <span className="fw-bold">$35.00</span>
                        </div>
                      </div>
                    </li>
                    <li className="list-group-item py-3 px-0">
                      <div className="row row align-items-center">
                        <div className="col-2">
                          <img
                            src={productimage2}
                            alt="Ecommerce"
                            className="img-fluid"
                          />
                        </div>
                        <div className="col-5">
                          <h6 className="mb-0">Fresh Garlic, 250g</h6>
                          <span>
                            <small className="text-muted">250g</small>
                          </span>
                          <div className="mt-2 small">
                            {" "}
                            <Link to="#!" className="text-decoration-none">
                              {" "}
                              <span className="me-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={16}
                                  height={16}
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="feather feather-trash-2"
                                >
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                  <line x1={10} y1={11} x2={10} y2={17} />
                                  <line x1={14} y1={11} x2={14} y2={17} />
                                </svg>
                              </span>
                              Remove
                            </Link>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className="input-group  flex-nowrap justify-content-center  ">
                            <input
                              type="button"
                              defaultValue="-"
                              className="button-minus form-control  text-center flex-xl-none w-xl-30 w-xxl-10 px-0  "
                              data-field="quantity"
                            />
                            <input
                              type="number"
                              step={1}
                              max={10}
                              defaultValue={1}
                              name="quantity"
                              className="quantity-field form-control text-center flex-xl-none w-xl-30 w-xxl-10 px-0 "
                            />
                            <input
                              type="button"
                              defaultValue="+"
                              className="button-plus form-control  text-center flex-xl-none w-xl-30  w-xxl-10 px-0  "
                              data-field="quantity"
                            />
                          </div>
                        </div>
                        <div className="col-2 text-end">
                          <span className="fw-bold">$20.97</span>
                          <span className="text-decoration-line-through text-muted small">
                            $26.97
                          </span>
                        </div>
                      </div>
                    </li>
                    <li className="list-group-item py-3 px-0">
                      <div className="row row align-items-center">
                        <div className="col-2">
                          <img
                            src={productimage3}
                            alt="Ecommerce"
                            className="img-fluid"
                          />
                        </div>
                        <div className="col-5">
                          <h6 className="mb-0">Fresh Onion, 1kg</h6>
                          <span>
                            <small className="text-muted">1 kg</small>
                          </span>
                          <div className="mt-2 small">
                            {" "}
                            <Link to="#!" className="text-decoration-none">
                              {" "}
                              <span className="me-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={16}
                                  height={16}
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="feather feather-trash-2"
                                >
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                  <line x1={10} y1={11} x2={10} y2={17} />
                                  <line x1={14} y1={11} x2={14} y2={17} />
                                </svg>
                              </span>
                              Remove
                            </Link>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className="input-group  flex-nowrap justify-content-center  ">
                            <input
                              type="button"
                              defaultValue="-"
                              className="button-minus form-control  text-center flex-xl-none w-xl-30 w-xxl-10 px-0  "
                              data-field="quantity"
                            />
                            <input
                              type="number"
                              step={1}
                              max={10}
                              defaultValue={1}
                              name="quantity"
                              className="quantity-field form-control text-center flex-xl-none w-xl-30 w-xxl-10 px-0 "
                            />
                            <input
                              type="button"
                              defaultValue="+"
                              className="button-plus form-control  text-center flex-xl-none w-xl-30  w-xxl-10 px-0  "
                              data-field="quantity"
                            />
                          </div>
                        </div>
                        <div className="col-2 text-end">
                          <span className="fw-bold">$25.00</span>
                          <span className="text-decoration-line-through text-muted small">
                            $45.00
                          </span>
                        </div>
                      </div>
                    </li>
                    <li className="list-group-item py-3 px-0">
                      <div className="row row align-items-center">
                        <div className="col-2">
                          <img
                            src={productimage4}
                            alt="Ecommerce"
                            className="img-fluid"
                          />
                        </div>
                        <div className="col-5">
                          <h6 className="mb-0">Fresh Ginger</h6>
                          <span>
                            <small className="text-muted">250g</small>
                          </span>
                          <div className="mt-2 small">
                            {" "}
                            <Link to="#!" className="text-decoration-none">
                              {" "}
                              <span className="me-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={16}
                                  height={16}
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="feather feather-trash-2"
                                >
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                  <line x1={10} y1={11} x2={10} y2={17} />
                                  <line x1={14} y1={11} x2={14} y2={17} />
                                </svg>
                              </span>
                              Remove
                            </Link>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className="input-group  flex-nowrap justify-content-center  ">
                            <input
                              type="button"
                              defaultValue="-"
                              className="button-minus form-control  text-center flex-xl-none w-xl-30 w-xxl-10 px-0  "
                              data-field="quantity"
                            />
                            <input
                              type="number"
                              step={1}
                              max={10}
                              defaultValue={1}
                              name="quantity"
                              className="quantity-field form-control text-center flex-xl-none w-xl-30 w-xxl-10 px-0 "
                            />
                            <input
                              type="button"
                              defaultValue="+"
                              className="button-plus form-control  text-center flex-xl-none w-xl-30  w-xxl-10 px-0  "
                              data-field="quantity"
                            />
                          </div>
                        </div>
                        <div className="col-2 text-end">
                          <span className="fw-bold">$39.87</span>
                          <span className="text-decoration-line-through text-muted small">
                            $45.00
                          </span>
                        </div>
                      </div>
                    </li>
                    <li className="list-group-item py-3 px-0 border-bottom">
                      <div className="row row align-items-center">
                        <div className="col-2">
                          <img
                            src={productimage5}
                            alt="Ecommerce"
                            className="img-fluid"
                          />
                        </div>
                        <div className="col-5">
                          <h6 className="mb-0">
                            Apple Royal Gala, 4 Pieces Box
                          </h6>
                          <span>
                            <small className="text-muted">4 Apple</small>
                          </span>
                          <div className="mt-2 small">
                            {" "}
                            <Link to="#!" className="text-decoration-none">
                              {" "}
                              <span className="me-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={16}
                                  height={16}
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="feather feather-trash-2"
                                >
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                  <line x1={10} y1={11} x2={10} y2={17} />
                                  <line x1={14} y1={11} x2={14} y2={17} />
                                </svg>
                              </span>
                              Remove
                            </Link>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className="input-group  flex-nowrap justify-content-center  ">
                            <input
                              type="button"
                              defaultValue="-"
                              className="button-minus form-control  text-center flex-xl-none w-xl-30 w-xxl-10 px-0  "
                              data-field="quantity"
                            />
                            <input
                              type="number"
                              step={1}
                              max={10}
                              defaultValue={1}
                              name="quantity"
                              className="quantity-field form-control text-center flex-xl-none w-xl-30 w-xxl-10 px-0 "
                            />
                            <input
                              type="button"
                              defaultValue="+"
                              className="button-plus form-control  text-center flex-xl-none w-xl-30  w-xxl-10 px-0  "
                              data-field="quantity"
                            />
                          </div>
                        </div>
                        <div className="col-2 text-end">
                          <span className="fw-bold">$39.87</span>
                          <span className="text-decoration-line-through text-muted small">
                            $45.00
                          </span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="d-grid">
                  <button
                    className="btn btn-primary btn-lg d-flex justify-content-between align-items-center"
                    type="submit"
                  >
                    {" "}
                    Go to Checkout <span className="fw-bold">$120.00</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Modal */}
          <div
            className="modal fade"
            id="locationModal"
            tabIndex={-1}
            aria-labelledby="locationModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-sm modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-body p-6">
                  <div className="d-flex justify-content-between align-items-start ">
                    <div>
                      <h5 className="mb-1" id="locationModalLabel">
                        Choose your Delivery Location
                      </h5>
                      <p className="mb-0 small">
                        Enter your address and we will specify the offer you
                        area.{" "}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    />
                  </div>
                  <div className="my-5">
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Search your area"
                    />
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0">Select Location</h6>
                    <Link
                      to="#"
                      className="btn btn-outline-gray-400 text-muted btn-sm"
                    >
                      Clear All
                    </Link>
                  </div>
                  <div>
                    <div data-simplebar style={{ height: 300 }}>
                      <div className="list-group list-group-flush">
                        <Link
                          to="#"
                          className="list-group-item d-flex justify-content-between align-items-center px-2 py-3 list-group-item-action active"
                        >
                          <span>Alabama</span>
                          <span>Min:$20</span>
                        </Link>
                        <Link
                          to="#"
                          className="list-group-item d-flex justify-content-between align-items-center px-2 py-3 list-group-item-action"
                        >
                          <span>Alaska</span>
                          <span>Min:$30</span>
                        </Link>
                        <Link
                          to="#"
                          className="list-group-item d-flex justify-content-between align-items-center px-2 py-3 list-group-item-action"
                        >
                          <span>Arizona</span>
                          <span>Min:$50</span>
                        </Link>
                        <Link
                          to="#"
                          className="list-group-item d-flex justify-content-between align-items-center px-2 py-3 list-group-item-action"
                        >
                          <span>California</span>
                          <span>Min:$29</span>
                        </Link>
                        <Link
                          to="#"
                          className="list-group-item d-flex justify-content-between align-items-center px-2 py-3 list-group-item-action"
                        >
                          <span>Colorado</span>
                          <span>Min:$80</span>
                        </Link>
                        <Link
                          to="#"
                          className="list-group-item d-flex justify-content-between align-items-center px-2 py-3 list-group-item-action"
                        >
                          <span>Florida</span>
                          <span>Min:$90</span>
                        </Link>
                        <Link
                          to="#"
                          className="list-group-item d-flex justify-content-between align-items-center px-2 py-3 list-group-item-action"
                        >
                          <span>Arizona</span>
                          <span>Min:$50</span>
                        </Link>
                        <Link
                          to="#"
                          className="list-group-item d-flex justify-content-between align-items-center px-2 py-3 list-group-item-action"
                        >
                          <span>California</span>
                          <span>Min:$29</span>
                        </Link>
                        <Link
                          to="#"
                          className="list-group-item d-flex justify-content-between align-items-center px-2 py-3 list-group-item-action"
                        >
                          <span>Colorado</span>
                          <span>Min:$80</span>
                        </Link>
                        <Link
                          to="#"
                          className="list-group-item d-flex justify-content-between align-items-center px-2 py-3 list-group-item-action"
                        >
                          <span>Florida</span>
                          <span>Min:$90</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default Header;
