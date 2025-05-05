import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useTranslation } from "react-i18next";
import API_BASE_URL from '../../config'

const ProductsList = () => {
  const{t, i18n} = useTranslation('add_added_edit_prod')
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const [displayedProducts, setDisplayedProducts] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);

  const { t: tCommon } = useTranslation('accounts_common');
  const { t: tProduct } = useTranslation('add_added_edit_prod');

  const itemsPerPage = 12;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = displayedProducts.slice(indexOfFirstItem, indexOfLastItem);

    // Update currentLang when the language is changed
    useEffect(() => {
      setCurrentLang(i18n.language);
    }, [i18n.language]);

    useEffect(() => {
      console.log("Fetching products...");
      const fetchProducts = async () => {
        try {
          const wholesalerEmail = localStorage.getItem("email");
          const token = localStorage.getItem("access_token");
          const response = await axios.get(`${API_BASE_URL}/wholesaler/products/`, {
            params: { email: wholesalerEmail },
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
    
          console.log("Response:", response.data);  // Check the response
          setProducts(response.data);
          setDisplayedProducts(response.data); // Set the displayed products to the fetched products
        } catch (err) {
          setError("Failed to load products");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
    
      fetchProducts();
    }, []);

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
    

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {/* Section */}
      <section>
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-4 col-12 border-end d-none d-md-block">
              <div className="pt-10 pe-lg-10">
                {/* Navigation */}
                <ul className="nav flex-column nav-pills nav-pills-dark">
                  <li className="nav-item">
                    <Link className="nav-link" to="/MyAccountOrder">
                      <i className="fas fa-shopping-bag me-2"/> {tCommon("your_orders")}
                    </Link>
                  </li>
                  {/* <li className="nav-item">
                    <Link className="nav-link" to="/MyAccountSetting">
                      <i className="fas fa-cog me-2" /> {tCommon("settings")}
                    </Link>
                  </li> */}
                  <li className="nav-item">
                    <Link className="nav-link" to="/MyAccountAddress">
                      <i className="fas fa-map-marker-alt me-2" /> {tCommon("address")}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/MyAcconutPaymentMethod">
                      <i className="fas fa-credit-card me-2" /> {tCommon("payment_method")}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/MyAcconutNotification">
                      <i className="fas fa-bell me-2" /> {tCommon("notification")}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/AddProducts">
                      <i className="bi bi-plus-circle me-2" /> {tCommon('add_products')}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link active" to="/AddedProducts">
                      <i className="bi bi-card-list me-2" /> {tCommon('added_products')}
                    </Link>
                  </li>
                  {localStorage.getItem("company_name") && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/WholesalerCampaigns">
                      <i className="bi bi-collection-fill me-2" />{tCommon("campaigns")}
                    </Link>
                  </li>
                  )}
                  {localStorage.getItem("user_name") && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/MyCampaigns">
                      <i className="bi bi-collection-fill me-2" /> {tCommon("campaigns")}
                    </Link>
                  </li>
                  )}
                  <li className="nav-item">
                    <Link className="nav-link" to="/Grocery-react/">
                      <i className="fas fa-sign-out-alt me-2" /> {tCommon("home")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Product List */}
            <div className="col-md-9 mt-6">
              <div className="row g-3">
                {currentProducts.length > 0 ? (
                  currentProducts.map((product) => (
                    <div className="col-md-4" key={product.id}>
                      <div className="card card-product">
                        <div className="card-body">
                          <div className="text-center position-relative">
                            <Link to={`/edit-product/${product.id}`}>
                            <img
                              src={product.first_variant_image_url || "https://via.placeholder.com/150"}
                              alt={product.product_name}
                              style={{ width: "120px", height: "120px", margin: "5px" }}
                            />
                            </Link>
                            {/* <div className="card-product-action">
                              <Link
                                to={`/product/${product.id}`}
                                className="btn-action"
                                data-bs-toggle="tooltip"
                                title="Quick View"
                              >
                                <i className="bi bi-eye" />
                              </Link>
                              <Link
                                to="#"
                                className="btn-action"
                                data-bs-toggle="tooltip"
                                title="Wishlist"
                              >
                                <i className="bi bi-heart" />
                              </Link>
                              <Link
                                to="#"
                                className="btn-action"
                                data-bs-toggle="tooltip"
                                title="Compare"
                              >
                                <i className="bi bi-arrow-left-right" />
                              </Link>
                            </div> */}
                          </div>
                          <div className="text-small mb-1">
                            <Link to="#" className="text-decoration-none text-muted">
                              <small>{product.category || "Category"}</small>
                            </Link>
                          </div>
                          <h2 className="fs-6">
                            <Link
                              to={`/edit-product/${product.id}`}
                              className="text-inherit text-decoration-none"
                            >
                              {currentLang === "en" ? product.product_name_en : product.product_name_ar}
                            </Link>
                          </h2>
                          {/* <div className="text-warning">
                            <small>
                              <i className="bi bi-star-fill" />
                              <i className="bi bi-star-fill" />
                              <i className="bi bi-star-fill" />
                              <i className="bi bi-star-fill" />
                              <i className="bi bi-star-half" />
                            </small>
                            <span className="text-muted small"> 4.5 (39)</span>
                          </div> */}
                          <div className="d-flex justify-content-between mt-4">
                            <div>
                              <span className="text-dark">{product.first_variant.price} {tCommon("currency_kd")}</span>
                            </div>
                            <div>
                              <Link to={`/edit-product/${product.id}`} className="btn btn-primary btn-sm">
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
                                </svg>
                                {tProduct("update")}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>{tProduct("no_products_found")}</p>
                )}
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
        
      </section>
       
    </div>
  );
};

export default ProductsList;
