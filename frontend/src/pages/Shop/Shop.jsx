import React, { useEffect, useState} from "react";
import { MagnifyingGlass } from "react-loader-spinner";
import assortment from "../../images/assortment-citrus-fruits.png";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ScrollToTop from "../ScrollToTop";
import { useLocation } from "react-router-dom";

function Dropdown() {
  const [openDropdowns, setOpenDropdowns] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [displayedCategory, setdisplayedCategory] = useState(" ");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const itemsPerPage = 12;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = displayedProducts.slice(indexOfFirstItem, indexOfLastItem);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (location.state && location.state.displayedCategory) {
      setSelectedCategory(location.state.displayedCategory);
      setdisplayedCategory(location.state.displayedCategory);

      // If a specific category is selected from location state, filter the products accordingly
      if (location.state.displayedCategory !== "All") {
        setDisplayedProducts(
          products.filter((product) => product.category === location.state.displayedCategory)
        );
      } else {
        setDisplayedProducts(products); // Show all products if "All" is passed in state
      }
    }
  }, [location, products, setDisplayedProducts]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await axios.get("http://127.0.0.1:8000/products/");
        const categoriesResponse = await axios.get("http://127.0.0.1:8000/productcategories/");
        setProducts(productsResponse.data);
        setDisplayedProducts(productsResponse.data);
        console.log("productsResponse",productsResponse.data)
        console.log("categories",categoriesResponse.data)
        setCategories([{ id: "All", name: "All" }, ...categoriesResponse.data]); // Include "All" category
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  

  const handleCategoryClick = (category) => {
    setSelectedCategory(category.name);
    setdisplayedCategory(category.name);
    if (category.name === "All") {
      setDisplayedProducts(products);
    } else {
      setDisplayedProducts(
        products.filter((product) => product.category === category.name)
      );
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [displayedProducts]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(displayedProducts.length / itemsPerPage);

  // Inline styles
  const commonStyles = {
    backgroundColor: "white",
    border: "2px solid green",
    color: "black",
  };

  const hoverStyles = {
    backgroundColor: "green",
    color: "white",
  };

  const activeStyles = {
    backgroundColor: "green",
    borderColor: "green",
    color: "white",
  };

  const disabledStyles = {
    backgroundColor: "#f8f9fa",
    borderColor: "green",
    color: "gray",
    pointerEvents: "none",
  };

  const paginationButtons = Array.from({ length: totalPages }, (_, index) => (
    <li key={index + 1} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
      <Link
        className="page-link mx-1 rounded-3"
        to="#"
        onClick={() => handlePageChange(index + 1)}
        style={currentPage === index + 1 ? activeStyles : commonStyles}
        onMouseOver={(e) => Object.assign(e.target.style, hoverStyles)}
        onMouseOut={(e) => Object.assign(e.target.style, currentPage === index + 1 ? activeStyles : commonStyles)}
      >
        {index + 1}
      </Link>
    </li>
  ));


    // Add to cart handler
    const handleAddToCart = (product) => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingItemIndex = cart.findIndex((item) => item.product.id === product.id);
  
      if (existingItemIndex > -1) {
        // If the product already exists in the cart, update its quantity
        cart[existingItemIndex].quantity += quantity;
      } else {
        // Otherwise, add the new product to the cart
        cart.push({ product, quantity });
      }
  
      // Save the updated cart to localStorage
      localStorage.setItem("cart", JSON.stringify(cart));
  
      alert("Product added to cart successfully!");
      navigate("/ShopCart"); // Redirect to cart page
    };



  const toggleDropdown = (index) => {
    if (openDropdowns.includes(index)) {
      setOpenDropdowns(openDropdowns.filter((item) => item !== index));
    } else {
      setOpenDropdowns([...openDropdowns, index]);
    }
  };

  // loading
  const [loaderStatus, setLoaderStatus] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoaderStatus(false);
    }, 1500);
  }, []);

  return (
    <div>
      {loaderStatus ? (
        <div className="loader-container">
          {/* <PulseLoader loading={loaderStatus} size={50} color="#0aad0a" /> */}
          <MagnifyingGlass
            visible={true}
            height="100"
            width="100"
            ariaLabel="magnifying-glass-loading"
            wrapperStyle={{}}
            wrapperclassName="magnifying-glass-wrapper"
            glassColor="#c0efff"
            color="#0aad0a"
          />
        </div>
      ) : (
        <>
          <>
            <ScrollToTop />
          </>
          <div className="container ">
            <div className="row">
              {/* Vertical Dropdowns Column */}
              <h5 className="mb-3 mt-8">Categories</h5>
              <div className="col-md-3">
              {categories && categories.length > 0 ? (
                categories.map((category, index) => (
                  <ul className="nav flex-column" key={index}>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="#"
                        // onClick={() => toggleDropdown(index)}
                        aria-expanded={
                          openDropdowns.includes(index) ? "true" : "false"
                        }
                        aria-controls={`categoryFlush${index + 1}`}
                        onClick={() => handleCategoryClick(category)}
                      >
                        {category.name} 
                      </Link>
                      <div
                        className={`collapse ${
                          openDropdowns.includes(index) ? "show" : ""
                        }`}
                        id={`categoryFlush${index + 1}`}
                      >
                        {/* <div>
                          <ul className="nav flex-column ms-3">
                            {category.items && category.items.length > 0 ? (
                              category.items.map((item, itemIndex) => (
                                <li className="nav-item" key={itemIndex}>
                                  <Link className="nav-link" to="#">
                                    {item}
                                  </Link>
                                </li>
                              ))
                            ) : (
                              <li className="nav-item">
                                <span className="nav-link">No sub-items</span>
                              </li>
                            )}
                          </ul>
                        </div> */}
                      </div>
                    </li>
                  </ul>
                ))
              ) : (
                <p>No categories available</p>
              )}
                <div>
                  <div className="py-4">
                    {/* <h5 className="mb-3">Stores</h5>
                    <div className="my-4"> */}
                      {/* input */}
                      {/* <input
                        type="search"
                        className="form-control"
                        placeholder="Search by store"
                      />
                    </div> */}
                    {/* form check */}
                    {/* <div className="form-check mb-2"> */}
                      {/* input */}
                      {/* <input
                        className="form-check-input"
                        type="checkbox"
                        defaultValue
                        id="eGrocery"
                        defaultChecked
                      />
                      <label className="form-check-label" htmlFor="eGrocery">
                        E-Grocery
                      </label>
                    </div> */}
                    {/* form check */}
                    {/* <div className="form-check mb-2"> */}
                      {/* input */}
                      {/* <input
                        className="form-check-input"
                        type="checkbox"
                        defaultValue
                        id="DealShare"
                      />
                      <label className="form-check-label" htmlFor="DealShare">
                        DealShare
                      </label>
                    </div> */}
                    {/* form check */}
                    {/* <div className="form-check mb-2"> */}
                      {/* input */}
                      {/* <input
                        className="form-check-input"
                        type="checkbox"
                        defaultValue
                        id="Dmart"
                      />
                      <label className="form-check-label" htmlFor="Dmart">
                        DMart
                      </label>
                    </div> */}
                    {/* form check */}
                    {/* <div className="form-check mb-2"> */}
                      {/* input */}
                      {/* <input
                        className="form-check-input"
                        type="checkbox"
                        defaultValue
                        id="Blinkit"
                      />
                      <label className="form-check-label" htmlFor="Blinkit">
                        Blinkit
                      </label>
                    </div> */}
                    {/* form check */}
                    {/* <div className="form-check mb-2"> */}
                      {/* input */}
                      {/* <input
                        className="form-check-input"
                        type="checkbox"
                        defaultValue
                        id="BigBasket"
                      />
                      <label className="form-check-label" htmlFor="BigBasket">
                        BigBasket
                      </label>
                    </div> */}
                    {/* form check */}
                    {/* <div className="form-check mb-2"> */}
                      {/* input */}
                      {/* <input
                        className="form-check-input"
                        type="checkbox"
                        defaultValue
                        id="StoreFront"
                      />
                      <label className="form-check-label" htmlFor="StoreFront">
                        StoreFront
                      </label>
                    </div> */}
                    {/* form check */}
                    {/* <div className="form-check mb-2"> */}
                      {/* input */}
                      {/* <input
                        className="form-check-input"
                        type="checkbox"
                        defaultValue
                        id="Spencers"
                      />
                      <label className="form-check-label" htmlFor="Spencers">
                        Spencers
                      </label>
                    </div> */}
                    {/* form check */}
                    {/* <div className="form-check mb-2"> */}
                      {/* input */}
                      {/* <input
                        className="form-check-input"
                        type="checkbox"
                        defaultValue
                        id="onlineGrocery"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="onlineGrocery"
                      >
                        Online Grocery
                      </label>
                    </div> */}
                  </div>
                  {/* <div className="py-4"> */}
                    {/* price */}
                    {/* <h5 className="mb-3">Price</h5>
                    <div> */}
                      {/* range */}
                      {/* <div id="priceRange" className="mb-3" />
                      <small className="text-muted">Price:</small>{" "}
                      <span id="priceRange-value" className="small" />
                    </div>
                  </div> */}
                  {/* rating */}
                  {/* <div className="py-4">
                    <h5 className="mb-3">Rating</h5>
                    <div> */}
                      {/* form check */}
                      {/* <div className="form-check mb-2"> */}
                        {/* input */}
                        {/* <input
                          className="form-check-input"
                          type="checkbox"
                          defaultValue
                          id="ratingFive"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="ratingFive"
                        >
                          <i className="bi bi-star-fill text-warning" />
                          <i className="bi bi-star-fill text-warning " />
                          <i className="bi bi-star-fill text-warning " />
                          <i className="bi bi-star-fill text-warning " />
                          <i className="bi bi-star-fill text-warning " />
                        </label>
                      </div> */}
                      {/* form check */}
                      {/* <div className="form-check mb-2"> */}
                        {/* input */}
                        {/* <input
                          className="form-check-input"
                          type="checkbox"
                          defaultValue
                          id="ratingFour"
                          defaultChecked
                        />
                        <label
                          className="form-check-label"
                          htmlFor="ratingFour"
                        >
                          <i className="bi bi-star-fill text-warning" />
                          <i className="bi bi-star-fill text-warning " />
                          <i className="bi bi-star-fill text-warning " />
                          <i className="bi bi-star-fill text-warning " />
                          <i className="bi bi-star text-warning" />
                        </label>
                      </div> */}
                      {/* form check */}
                      {/* <div className="form-check mb-2"> */}
                        {/* input */}
                        {/* <input
                          className="form-check-input"
                          type="checkbox"
                          defaultValue
                          id="ratingThree"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="ratingThree"
                        >
                          <i className="bi bi-star-fill text-warning" />
                          <i className="bi bi-star-fill text-warning " />
                          <i className="bi bi-star-fill text-warning " />
                          <i className="bi bi-star text-warning" />
                          <i className="bi bi-star text-warning" />
                        </label>
                      </div> */}
                      {/* form check */}
                      {/* <div className="form-check mb-2"> */}
                        {/* input */}
                        {/* <input
                          className="form-check-input"
                          type="checkbox"
                          defaultValue
                          id="ratingTwo"
                        />
                        <label className="form-check-label" htmlFor="ratingTwo">
                          <i className="bi bi-star-fill text-warning" />
                          <i className="bi bi-star-fill text-warning" />
                          <i className="bi bi-star text-warning" />
                          <i className="bi bi-star text-warning" />
                          <i className="bi bi-star text-warning" />
                        </label>
                      </div> */}
                      {/* form check */}
                      {/* <div className="form-check mb-2"> */}
                        {/* input */}
                        {/* <input
                          className="form-check-input"
                          type="checkbox"
                          defaultValue
                          id="ratingOne"
                        />
                        <label className="form-check-label" htmlFor="ratingOne">
                          <i className="bi bi-star-fill text-warning" />
                          <i className="bi bi-star text-warning" />
                          <i className="bi bi-star text-warning" />
                          <i className="bi bi-star text-warning" />
                          <i className="bi bi-star text-warning" />
                        </label>
                      </div>
                    </div>
                  </div> */}
                  {/* <div className="py-4"> */}
                    {/* Banner Design */}
                    {/* Banner Content */}
                    {/* <div className="position-absolute p-5 py-8">
                      <h3 className="mb-0">Fresh Fruits </h3>
                      <p>Get Upto 25% Off</p>
                      <Link to="#" className="btn btn-dark">
                        Shop Now
                        <i className="feather-icon icon-arrow-right ms-1" />
                      </Link>
                    </div> */}
                    {/* Banner Content */}
                    {/* Banner Image */}
                    {/* img */}
                    {/* <img
                      src={assortment}
                      alt="assortment"
                      className="img-fluid rounded-3"
                    /> */}
                    {/* Banner Image */}
                  {/* </div> */}
                  {/* Banner Design */}
                </div>
              </div>
              {/* Cards Column */}
              <div className="col-lg-9 col-md-8">
                {/* card */}
                <div className="card mb-4 bg-light border-0">
                  {/* card body */}
                  <div className=" card-body p-9">
                    <h1 className="mb-0">{displayedCategory}</h1>
                  </div>
                </div>
                {/* list icon */}
                <div className="d-md-flex justify-content-between align-items-center">
                  <div>
                    <p className="mb-3 mb-md-0">
                      {" "}
                      <span className="text-dark"></span> Products found{" "}
                    </p>
                  </div>
                  {/* icon */}
                  <div className="d-flex justify-content-between align-items-center">
                    {/* <Link to="/ShopListCol" className="text-muted me-3">
                      <i className="bi bi-list-ul" />
                    </Link>
                    <Link to="/ShopGridCol3" className=" me-3 active">
                      <i className="bi bi-grid" />
                    </Link>
                    <Link to="/Shop" className="me-3 text-muted">
                      <i className="bi bi-grid-3x3-gap" />
                    </Link> */}
                    {/* <div className="me-2"> */}
                      {/* select option */}
                      {/* <select
                        className="form-select"
                        aria-label="Default select example"
                      >
                        <option selected>Show: 50</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={30}>30</option>
                      </select>
                    </div>
                    <div> */}
                      {/* select option */}
                      {/* <select
                        className="form-select"
                        aria-label="Default select example"
                      >
                        <option selected>Sort by: Featured</option>
                        <option value="Low to High">Price: Low to High</option>
                        <option value="High to Low"> Price: High to Low</option>
                        <option value="Release Date"> Release Date</option>
                        <option value="Avg. Rating"> Avg. Rating</option>
                      </select>
                    </div> */}
                  </div>
                </div>
                {/* row */}
                <div className="row g-4 row-cols-xl-4 row-cols-lg-3 row-cols-2 row-cols-md-2 mt-2">
                  {currentProducts.map((product) => (
                    <div key={product.id} className="col">
                      {/* Product Card */}
                      <div className="card card-product">
                        <div className="card-body">
                          {/* Badge */}
                          <div className="text-center position-relative">
                            {product.is_in_campaign && (
                            <div className="position-absolute top-0 start-0">
                              <span className="badge bg-danger">Campaign</span>
                            </div>
                            )}
                            <Link to="#!">
                              {/* Image */}
                              <img
                                src={
                                  product.product_images?.length > 0
                                    ? product.product_images[0].image_url
                                    : "https://via.placeholder.com/150"
                                }
                                alt={product.product_name}
                                className="mb-3 img-fluid"
                                style={{ width: "120px", height: "120px", margin: "5px" }}
                              />
                            </Link>
                            {/* Action Buttons */}
                            <div className="card-product-action">
                              <Link
                                to={`/productDetails/${product.id}`}
                                className="btn-action"
                                // data-bs-toggle="modal"
                                // data-bs-target="#quickViewModal"
                              >
                                <i className="bi bi-eye" data-bs-toggle="tooltip" data-bs-html="true" title="Quick View"/>
                              </Link>
                              {/* <Link to="shop-wishlist.html" className="btn-action" data-bs-toggle="tooltip" data-bs-html="true" title="Wishlist">
                                <i className="bi bi-heart" />
                              </Link>
                              <Link to="#!" className="btn-action" data-bs-toggle="tooltip" data-bs-html="true" title="Compare">
                                <i className="bi bi-arrow-left-right" />
                              </Link> */}
                            </div>
                          </div>

                          {/* Product Details */}
                          <div className="text-small mb-1">
                            <Link to="#!" className="text-decoration-none text-muted">
                              <small>{product.category}</small>
                            </Link>
                          </div>
                          <h2 className="fs-6">
                            <Link to="#!" className="text-inherit text-decoration-none">
                              {product.product_name}
                            </Link>
                          </h2>

                          {/* Rating */}
                          {/* <div>
                            <small className="text-warning">
                              
                              {" "}
                              <i className="bi bi-star-fill" />
                              <i className="bi bi-star-fill" />
                              <i className="bi bi-star-fill" />
                              <i className="bi bi-star-fill" />
                              <i className="bi bi-star-half" />
                            </small>{" "}
                            <span className="text-muted small">4.5(149)</span>
                          </div> */}

                          {/* Price */}
                          <div className="d-flex justify-content-between align-items-center mt-3">
                            <div>
                              <span className="text-dark">{product.actual_price} KD</span>{" "}
                              <span className="text-decoration-line-through text-muted">
                              KD:{((Number(product.actual_price) + (Number(product.actual_price) * 10) / 100).toFixed(2))}
                              </span>
                            </div>
                            {/* Add Button */}
                            <div>
                            <a
                                  href="#!"
                                  className="btn btn-primary btn-sm"
                                  onClick={() => handleAddToCart(product)} // Correct usage
                                >
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
                                  className="feather feather-plus"
                                >
                                  <line x1={12} y1={5} x2={12} y2={19} />
                                  <line x1={5} y1={12} x2={19} y2={12} />
                                </svg>{" "}
                                Add
                                </a>
                            </div>
                          </div>
                          <div>
                            <span style={{ color: 'red' }}>Campaign Price: KD {(product.actual_price * (100 - product.campaign_discount_percentage)) / 100}</span>
                          </div>
                        </div>
                      </div>
                    </div>))}
                </div>
                <div className="row mt-8">
                  <div className="col">
                    <nav>
                      <ul className="pagination">
                        {/* Previous Button */}
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                          <Link
                            className="page-link mx-1 rounded-3"
                            to="#"
                            aria-label="Previous"
                            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                            style={currentPage === 1 ? disabledStyles : commonStyles}
                            onMouseOver={(e) => currentPage > 1 && Object.assign(e.target.style, hoverStyles)}
                            onMouseOut={(e) => Object.assign(e.target.style, currentPage === 1 ? disabledStyles : commonStyles)}
                          >
                            <i className="fa fa-chevron-left" />
                          </Link>
                        </li>

                        {/* Pagination Buttons */}
                        {paginationButtons}

                        {/* Next Button */}
                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                          <Link
                            className="page-link mx-1 rounded-3"
                            to="#"
                            aria-label="Next"
                            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                            style={currentPage === totalPages ? disabledStyles : commonStyles}
                            onMouseOver={(e) => currentPage < totalPages && Object.assign(e.target.style, hoverStyles)}
                            onMouseOut={(e) => Object.assign(e.target.style, currentPage === totalPages ? disabledStyles : commonStyles)}
                          >
                            <i className="fa fa-chevron-right" />
                          </Link>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


export default Dropdown;
