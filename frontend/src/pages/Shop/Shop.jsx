import React, { useEffect, useState} from "react";
import { MagnifyingGlass } from "react-loader-spinner";
// import assortment from "../../images/assortment-citrus-fruits.png";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ScrollToTop from "../ScrollToTop";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import {toast} from 'react-toastify'
import API_BASE_URL from '../../config';

function Shop() {
  const { t,i18n } = useTranslation('shop');
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
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const itemsPerPage = 12;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = displayedProducts.slice(indexOfFirstItem, indexOfLastItem);
  
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
   // Update currentLang when the language is changed
      useEffect(() => {
        setCurrentLang(i18n.language);
      }, [i18n.language]);

      useEffect(() => {
        if (location.state && location.state.displayedCategory) {
            const categoryName = location.state.displayedCategory;
            setSelectedCategory(categoryName);
            setdisplayedCategory(categoryName);
    
            if (categoryName !== "All") {
                // Find the category object based on name
                const matchedCategory = categories.find(cat => 
                    (currentLang === "en" ? cat.name_en : cat.name_ar) === categoryName
                );
    
                if (matchedCategory) {
                    setDisplayedProducts(
                        products.filter(product => product.category === matchedCategory.id)
                    );
                } else {
                    setDisplayedProducts([]); // No matching category found
                }
            } else {
                setDisplayedProducts(products);
            }
        }
    }, [location, products, categories, currentLang]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await axios.get(`${API_BASE_URL}/products/`);
        const categoriesResponse = await axios.get(`${API_BASE_URL}/productcategories/`);
        setProducts(productsResponse.data);
        setDisplayedProducts(productsResponse.data);
        
        setCategories([{ id: "All", name_en: "All", name_ar: "الكل" }, ...categoriesResponse.data]);
        
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
    const categoryName = currentLang === "en" ? category.name_en : category.name_ar;

    setSelectedCategory(categoryName);
    setdisplayedCategory(categoryName);

    if (category.id === "All") {
      setDisplayedProducts(products);
    } else {
      const filteredProducts = products.filter((product) => product.category === category.id);
      setDisplayedProducts(filteredProducts);
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

    const handleAddToCart = (variant, quantity) => {
      dispatch(addToCart({ variant, quantity })); // Dispatch action to Redux
      toast.info("Item Added to Cart")
      // navigate("/ShopCart"); // Redirect to cart page
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
              <h5 className="mb-3 mt-8">{t("categories")}</h5>
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
                        {currentLang === 'en' ? category.name_en : category.name_ar} 
                      </Link>
                      <div
                        className={`collapse ${
                          openDropdowns.includes(index) ? "show" : ""
                        }`}
                        id={`categoryFlush${index + 1}`}
                      >
                        
                      </div>
                    </li>
                  </ul>
                ))
              ) : (
                <p>{t("no_categories_available")}</p>
              )}
                <div>
                  <div className="py-4">
                    
                  </div>
                  
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
                      <span className="text-dark"></span> {t("products_found")}{" "}
                    </p>
                  </div>
                  {/* icon */}
                  <div className="d-flex justify-content-between align-items-center">
                  
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
                              <span className="badge bg-danger">{t("campaign")}</span>
                            </div>
                            )}
                            <Link to="#!">
                              {/* Image */}
                              <img
                                src={
                                  product.variants[0].variant_images?.length > 0
                                    ? product.variants[0].variant_images[0].image_url
                                    : "https://via.placeholder.com/150"
                                }
                                alt={product.product_name}
                                className="mb-3 img-fluid"
                                style={{ width: "150px", height: "150px", margin: "5px" }}
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
                              <small>{currentLang === "en" ? product.category.name_en : product.category.name_ar}</small>
                            </Link>
                          </div>
                          <h2 className="fs-6">
                            <Link to="#!" className="text-inherit text-decoration-none">
                            {currentLang === "en" ? product.product_name_en : product.product_name_ar}
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
                              <span className="text-dark">{t('price')}: {product.variants[0].price} {t('kd')}</span>{" "}
                              <span className="text-decoration-line-through text-muted">
                              {t('price')}: {((Number(product.variants[0].price) + (Number(product.variants[0].price) * 10) / 100).toFixed(2))} {t('kd')}
                              </span>
                            </div>
                            {/* Add Button */}
                            <div>
                            <a
                                  href="#!"
                                  className="btn btn-primary btn-sm"
                                  onClick={() => handleAddToCart(product.variants[0],1)} // Correct usage
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
                                {t("add", { ns: "shop" })}
                                </a>
                            </div>
                          </div>
                          <div>
                            <span style={{ color: 'red' }}>{t('campaign_price')}: {((product.variants[0].price * (100 - product.variants[0].campaign_discount_percentage)) / 100).toFixed(3)} {t('kd')}</span>
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

export default Shop;