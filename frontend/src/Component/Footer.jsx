import React,{useEffect,useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import groceryshop from "../images/Grocerylogo.png";
import amazonpay from "../images/amazonpay.svg";
import american from "../images/american-express.svg";
import mastercard from "../images/mastercard.svg";
import paypal from "../images/paypal.svg";
import visa from "../images/visa.svg";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";
import { Trans } from 'react-i18next';
import API_BASE_URL from "../config";



const Footer = () => {
  const { t, i18n } = useTranslation('footer');
  let date = new Date();
  let year = date.getFullYear();
  const [categories,setCategories] = useState([]);
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  const navigate = useNavigate()
  
   // Update currentLang when the language is changed
        useEffect(() => {
          setCurrentLang(i18n.language);
        }, [i18n.language]);

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

  const handleCategoryClick = (category) => {
    const categoryName = currentLang === "en" ? category.name_en : category.name_ar;
  
    // Navigate to the shop page with the selected category as a query parameter
    navigate(`/Shop`, { state: { displayedCategory: categoryName } });
  };

  return (
    <div>
      <>
        <footer className="footer mt-8">
          <div className="overlay" />
          <div className="container">
            <div className="row footer-row">
              <div className="col-sm-6 col-lg-3 mb-30">
                <div className="footer-widget">
                  <div className="footer-logo">
                    <Link to="/">
                      <img
                        src={groceryshop}
                        style={{ width: 300, padding: 20, marginLeft: "-30px" }}
                        alt="logo"
                      />
                    </Link>
                  </div>
                  <p className="mb-30">
                    We deliver more than your expectations and help you to grow
                    your business exponentially by providing customized
                    applications. So, don’t just think, get ready to convert
                    your ideas into reality.
                  </p>
                </div>
                <div className="dimc-protect">
                  <div className="col-lg-5 text-lg-start text-center mb-2 mb-lg-0">
                    <h4>Payment Partners</h4>
                    <ul className="list-inline d-flex mb-0">
                      <li className="list-inline-item">
                        <Link to="#!">
                          <img src={amazonpay} alt="footerfreshcart" />
                        </Link>
                      </li>
                      <li className="list-inline-item">
                        <Link to="#!">
                          <img src={american} alt="footerfreshcart" />
                        </Link>
                      </li>
                      <li className="list-inline-item">
                        <Link to="#!">
                          <img src={mastercard} alt="footerfreshcart" />
                        </Link>
                      </li>
                      <li className="list-inline-item">
                        <Link to="#!">
                          <img src={paypal} alt="footerfreshcart" />
                        </Link>
                      </li>
                      <li className="list-inline-item">
                        <Link to="#!">
                          <img src={visa} alt="footerfreshcart" />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-3 mb-30">
                <div className="footer-widget mb-0">
                  <h4>{t("all_category")}</h4>
                  <div className="line-footer" />
                  <div className="row">
                    <div className="col">
                      <ul className="footer-link mb-0">
                        {categories.slice(0, 10).map((category) => (
                          <li key={category.id}>
                            <a onClick={() => handleCategoryClick(category)} style={{ cursor: "pointer" }}>
                              <span>
                                <i className="fa fa-angle-right" />
                              </span>{" "}
                              {currentLang === 'en' ? category.name_en : category.name_ar}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-3 mb-30">
                <div className="footer-widget mb-0">
                  <h4>{t("for_consumers")}</h4>
                  <div className="line-footer" />
                  <div className="row">
                    <div className="col">
                      <ul className="footer-link mb-0">
                        <li>
                          <Link to=" ">
                            <span>
                              <i className="fa fa-angle-right" />
                            </span>{" "}
                            {t("careers")}
                          </Link>
                        </li>
                        <li>
                          <Link to="*">
                            <span>
                              <i className="fa fa-angle-right" />
                            </span>{" "}
                            {t("promos_coupons")}
                          </Link>
                        </li>
                        <li>
                          <Link to="/MyAccountAddress">
                            <span>
                              <i className="fa fa-angle-right" />
                            </span>
                            {t("shipping")}
                          </Link>
                        </li>
                        {/* <li>
                          <Link to="/MyAccountOrder">
                            <span>
                              <i className="fa fa-angle-right" />
                            </span>{" "}
                            {t("product_returns")}
                          </Link>
                        </li> */}
                        <li>
                          <Link to="/MyAcconutPaymentMethod">
                            <span>
                              <i className="fa fa-angle-right" />
                            </span>{" "}
                            {t("payments")}
                          </Link>
                        </li>
                        <li>
                          <Link to="*">
                            <span>
                              <i className="fa fa-angle-right" />
                            </span>{" "}
                            {t("faq")}
                          </Link>
                        </li>
                        {!isAuthenticated && (
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
                                          {t("are_you_wholesaler")}
                                        </Link>
                                        <div
                                          className="dropdown-menu sm-menu"
                                          aria-labelledby="navbarDropdown"
                                        >
                                          <Link className="dropdown-item" to="/WholesalerAccountSignIn">
                                          {t("sign_in")}
                                          </Link>
                                          {/* <Link className="dropdown-item" to="pages/store-grid.html">
                                            Store Grid
                                          </Link> */}
                                          <Link className="dropdown-item" to="/WholesalerAccountSignUp">
                                          {t("signup")}
                                          </Link>
                                        </div>
                                      </li>
                                      )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-3 mb-30">
                <div className="footer-widget mb-0">
                  <h4>{t("get_to_know_us")}</h4>
                  <div className="line-footer" />
                  <div className="row">
                    <div className="col">
                      <ul className="footer-link mb-0">
                        <li>
                          <Link to="*">
                            <span>
                              <i className="fa fa-angle-right" />
                            </span>{" "}
                            {t("company")}
                          </Link>
                        </li>
                        <li>
                          <Link to="*">
                            <span>
                              <i className="fa fa-angle-right" />
                            </span>{" "}
                            {t("about")}
                          </Link>
                        </li>
                        <li>
                          <Link to="*">
                            <span>
                              <i className="fa fa-angle-right" />
                            </span>{" "}
                            {t("blog")}
                          </Link>
                        </li>
                        <li>
                          <Link to="*">
                            <span>
                              <i className="fa fa-angle-right" />{" "}
                            </span>{" "}
                            {t("help_center")}
                          </Link>
                        </li>
                        <li>
                          <Link to="*">
                            <span>
                              <i className="fa fa-angle-right" />
                            </span>{" "}
                            {t("our_value")}
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="footer-widget mt-8">
                  <div className="newsletter-item">
                    <input
                      type="email"
                      id="email"
                      placeholder="Your Email"
                      className="form-control form-control-lg"
                      required
                    />
                    <button type="submit">
                      <i className="fa fa-paper-plane" />
                    </button>
                  </div>
                  <ul
                    className="social-media"
                    style={{ display: "flex", gap: 10 }}
                  >
                    <li>
                      <Link to="#" className="facebook ">
                        <i className="bx bxl-facebook"></i>
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="twitter">
                        <i className="bx bxl-twitter"></i>
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="instagram ">
                        <i className="bx bxl-instagram"></i>
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="linkedin">
                        <i className="bx bxl-linkedin"></i>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bar ">
            <div className="container text-center">
              <div className="footer-copy">
                <div className="copyright">
                {t("all_rights_reserved")}
                  {/* <Link to="https://github.com/Mohamed0400" target="_blank">
                    @Mohamed Megahed
                  </Link> */}
                </div>
              </div>
            </div>
          </div>
        </footer>
      </>
    </div>
  );
};

export default Footer;
