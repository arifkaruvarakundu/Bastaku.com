import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useTranslation } from "react-i18next";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { t: tCommon } = useTranslation('accounts_common');
  const { t: tProduct } = useTranslation('add_added_edit_prod');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const wholesalerEmail = localStorage.getItem("email");
        const response = await axios.get("http://127.0.0.1:8000/wholesaler/products/", {
          params: { email: wholesalerEmail },
        });
        setProducts(response.data);
      } catch (err) {
        setError("Failed to load products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
                      <i className="fas fa-shopping-bag me-2" /> {tCommon("your_orders")}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/MyAccountSetting">
                      <i className="fas fa-cog me-2" /> {tCommon("settings")}
                    </Link>
                  </li>
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
                {products.length > 0 ? (
                  products.map((product) => (
                    <div className="col-md-4" key={product.id}>
                      <div className="card card-product">
                        <div className="card-body">
                          <div className="text-center position-relative">
                            <Link to={`/edit-product/${product.id}`}>
                            <img
                    src={
                      product.product_images?.length > 0
                        ? `${product.product_images[0].image_url}`
                        : "https://via.placeholder.com/150"
                    }
                    alt={product.product_name}
                    style={{ width: "120px", height: "120px", margin: "5px" }}
                  />
                            </Link>
                            <div className="card-product-action">
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
                            </div>
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
                              {product.product_name}
                            </Link>
                          </h2>
                          <div className="text-warning">
                            <small>
                              <i className="bi bi-star-fill" />
                              <i className="bi bi-star-fill" />
                              <i className="bi bi-star-fill" />
                              <i className="bi bi-star-fill" />
                              <i className="bi bi-star-half" />
                            </small>
                            <span className="text-muted small"> 4.5 (39)</span>
                          </div>
                          <div className="d-flex justify-content-between mt-4">
                            <div>
                              <span className="text-dark">{product.actual_price} {tCommon("currency_kd")}</span>
                            </div>
                            <div>
                              <Link to={`/EditProduct/${product.id}`} className="btn btn-primary btn-sm">
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductsList;
