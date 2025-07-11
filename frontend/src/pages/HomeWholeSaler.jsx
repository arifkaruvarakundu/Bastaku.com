// import slider1 from "../images/slide-1.jpg";
import carousel1 from "../images/carousel1.jpg";
import carousel_ar1 from "../images/carousel_ar1.jpg"
import carousel_ar2 from "../images/carousel_ar2.jpg"
import slider2_en from "../images/slider-2.jpg";
import slider2 from "../images/slider-2.jpg";
import add_product from "../images/add_product.jpeg";
import address_image from "../images/address_image.jpeg"
import add_bank from "../images/add_bank.jpeg";
import order2 from "../images/order2.jpeg";
import campaigns from "../images/campaigns.jpeg";
import { Link,useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from 'axios'
import { Slide, Zoom } from "react-awesome-reveal";
import { useEffect } from "react";
import { MagnifyingGlass } from "react-loader-spinner";
import ProductItemWholesaler from "../ProductList/ProductItemWholesaler";
import { useTranslation } from "react-i18next";
import API_BASE_URL from '../config'


const HomeWholesaler = () => {
  const {t,i18n} = useTranslation('home_wh')
  const [isVisible, setIsVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [currentLang, setCurrentLang] = useState(i18n.language);

  // const navigate = useNavigate();

  

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
        console.log(categoriesResponse.data)
      } catch (err) {
        // setError("Failed to load data");
        console.error(err);
      } finally {
        // setLoading(false);
      }
    };

    fetchData();
  }, []);

  // const handleCategoryClick = (category) => {
  //   // setSelectedCategory(category.name);
  //   // setdisplayedCategory(category.name);
  
  //   // Navigate to the shop page with the selected category as a query parameter
  //   navigate(`/Shop`, { state: { displayedCategory: category.name } });
  // };


  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };


  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);


  const settings1 = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 1,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    autoplay: true,
    autoplaySpeed: 2000,
  };
  const settings2 = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 2,
    initialSlide: 1,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    autoplay: true,
    autoplaySpeed: 2000,
  };

  useEffect(() => {
    setTimeout(() => {
      setLoaderStatus(false);
    }, 1500);
  }, []);

  return (
    <div>
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
              <div className="scroll-to-top">
                <button
                  onClick={scrollToTop}
                  className={`scroll-to-top-button ${isVisible ? "show" : ""}`}
                >
                  ↑
                </button>
              </div>
              <section className="hero-section">
                <div className="container mt-8">
                  <div
                    id="carouselExampleFade"
                    className="carousel slide carousel-fade"
                    data-bs-ride="carousel"
                  >
                    <div className="carousel-inner">
                  {/* First Carousel Item */}
                  <div className="carousel-item active">
                    <div
                      style={{
                        background: `url(${currentLang === "en" ? carousel1 : carousel_ar1}) no-repeat`,
                        backgroundSize: "cover",
                        borderRadius: ".5rem",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="ps-lg-12 py-lg-16 col-xxl-5 col-md-7 py-14 px-8 text-xs-center">
                        <span className="badge text-bg-warning">
                          B to B
                        </span>
                        <h2 className="text-dark display-5 fw-bold mt-4">{t("expand_reach")}</h2>
                        <p className="lead">{t("join_platform")}</p>
                      </div>
                    </div>
                  </div>

                  {/* Second Carousel Item */}
                  <div className="carousel-item">
                    <div
                      style={{
                        background: `url(${currentLang === "en" ? slider2_en : carousel_ar2}) no-repeat`,
                        backgroundSize: "contain",
                        borderRadius: ".5rem",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="ps-lg-12 py-lg-16 col-xxl-5 col-md-7 py-14 px-8 text-xs-center">
                        <span className="badge text-bg-warning">Free Shipping - orders over $100</span>
                        <h2 className="text-dark display-5 fw-bold mt-4">
                          Free Shipping on <br /> orders over <span className="text-primary">$100</span>
                        </h2>
                        <p className="lead">
                          Free Shipping to First-Time Customers Only, After promotions and discounts are applied.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                    <Link
                      className="carousel-control-prev"
                      to="#carouselExampleFade"
                      role="button"
                      data-bs-slide="prev"
                    >
                      <span
                        className="carousel-control-prev-icon"
                        aria-hidden="true"
                      />
                      <span className="visually-hidden">Previous</span>
                    </Link>
                    <Link
                      className="carousel-control-next"
                      to="#carouselExampleFade"
                      role="button"
                      data-bs-slide="next"
                    >
                      <span
                        className="carousel-control-next-icon"
                        aria-hidden="true"
                      />
                      <span className="visually-hidden">Next</span>
                    </Link>
                  </div>
                </div>
              </section>
            </>
            <>
              {/* section */}
              <section className="mt-10">
                <div className="container">
                  {/* row */}
                  <div className="row">
                    <div className="col-lg-4 col-md-6 col-12 fade-in-left">
                      <Slide direction="left">
                        <div className=" banner mb-3">
                          {/* Banner Content */}
                          <div className="position-relative">
                            {/* Banner Image */}
                            <img
                              src={add_product}
                              alt="ad-banner"
                              className="w-full h-[20px] rounded-3"
                              style={{ maxHeight: "263px", height: "auto", width: "100%" }}
                            />
                            <div className="banner-text">
                              <h3 className="mb-0 fw-bold">
                                {t('add_products_here')}
                                
                              </h3>
                              <div className="mt-4 mb-5 fs-5">
                              <p className="mb-0" style={{ color: "lightyellow" }}>
                                {t('add_variety_products')}
                              </p>
                                <span>
                                  {/* Code:{" "} */}
                                  <span className="fw-bold text-dark">
                                    {/* CARE12 */}
                                  </span>
                                </span>
                              </div>
                              <Link to="/AddProducts" className="btn btn-dark mt-2">
                                {t('add_products')}
                              </Link>
                            </div>
                            {/* Banner Content */}
                          </div>
                        </div>
                      </Slide>
                    </div>

                    <div className="col-lg-4 col-md-6  col-12 slide-in-top">
                      <Zoom>
                        <div className="banner mb-3 ">
                          {/* Banner Content */}
                          <div className="position-relative">
                            {/* Banner Image */}
                            <img
                              src={address_image}
                              alt="ad-banner-2"
                              className="w-full h-[20px] rounded-3"
                              style={{ maxHeight: "263px", height: "auto", width: "100%" }}
                            />
                            <div className="banner-text text-white">
                              {/* Banner Content */}
                              <h3 className=" fw-bold mb-2 text-white">
                                {t('add_address_connect')}{" "}
                              </h3>
                              <p className="fs-5">
                                {/* Refresh your day <br />
                                the fruity way */}
                              </p>
                              <Link to="/MyAccountAddress" className="btn btn-dark mt-2">
                                {t('add_address')}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </Zoom>
                    </div>
                    <div className="col-lg-4 col-12 fade-in-left ">
                      <Slide direction="right">
                        <div className="banner mb-3">
                          <div className="banner-img">
                            {/* Banner Image */}
                            <img
                              src={add_bank}
                              alt="ad-banner-3"
                              className="w-full h-[20px] rounded-3"
                              style={{ maxHeight: "263px", height: "auto", width: "100%" }}
                            />
                            {/* Banner Content */}
                            <div className="banner-text">
                              <h3 className="fs-2 fw-bold lh-1 mb-2">
                                {t('add_bank_details')}{" "}
                              </h3>
                              <p className="fs-5">
                                {t("add_bank_here")}
                                <br />
                                
                              </p>
                              <Link to="/MyAcconutPaymentMethod" className="btn btn-dark">
                                {t('add_bank')}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </Slide>
                    </div>
                  </div>
                </div>
              </section>
              {/* section */}
            </>
            {/* <> */}
              {/* section category */}
              {/* <section className="my-lg-14 my-8">
                <div className="container">
                  <div className="row">
                    <div className="col-12">
                      <div className="mb-6"> */}
                        {/* heading */}
                        {/* <div className="section-head text-center mt-8">
                          <h3 className="h3style" data-title="Shop Popular Categories">
                            {t('popular_categories')}
                          </h3>
                          <div className="wt-separator bg-primarys"></div>
                          <div className="wt-separator2 bg-primarys"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    {categories.map((category) => (
                      <div className="col-lg-2 col-md-4 col-6 fade-zoom" key={category.id}>
                        <Zoom>
                          <div className="text-center mb-10"> */}
                            {/* img */}
                            {/* <div onClick={() => handleCategoryClick(category)}>
                              <img
                                src={`http://127.0.0.1:8000${category.category_image}`}
                                alt={category.name}
                                className="card-image rounded-circle"
                              />
                            </div>
                            <div className="mt-4"> */}
                              {/* text */}
                              {/* <h5 className="fs-6 mb-0">
                                <Link to={`/category/${category.id}`} className="text-inherit">
                                  {category.name}
                                </Link>
                              </h5>
                            </div>
                          </div>
                        </Zoom>
                      </div>
                    ))}
                  </div>
                </div>
              </section> */}
              {/* section */}
            {/* </> */}
            <>
              {/* section coming soon */}
              <section>
                <div className="container ">
                  <div className="row">
                    <div className="col-12 col-lg-6 mb-3 mb-lg-0  fade-in-left">
                      <Slide direction="left">
                        <div>
                          <div
                            className="py-10 px-8 rounded-3"
                            style={{
                              background: `url(${order2}) no-repeat`,
                              backgroundSize: "100% 100%",
                              backgroundPosition: "center",
                            }}
                          >
                            <div>
                              <h3 className="fw-bold mb-1">
                                {t('see_orders')}
                              </h3>
                              <p className="mb-4">
                               {t('all_orders_listed')}{" "}
                              
                              </p>
                              <Link to="/MyAccountOrder" className="btn btn-dark">
                                {t('orders')}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </Slide>
                    </div>
                    <div className="col-12 col-lg-6 fade-in-left ">
                      <Slide direction="right">
                        <div>
                          <div
                            className="py-10 px-8 rounded-3"
                            style={{
                              background: `url(${campaigns}) no-repeat`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          >
                            <div>
                              <h3 className="fw-bold mb-1">
                                {t('ongoing_campaigns')}
                              </h3>
                              <p className="mb-4">
                                {t('increase_sales_campaigns')}{" "}
                              </p>
                              <Link to="/WholesalerCampaigns" className="btn btn-dark">
                                {t('campaigns')}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </Slide>
                    </div>
                  </div>
                </div>
              </section>
            </>
            <>
              <ProductItemWholesaler />
            </>
            {/* <> */}
              {/* cta section */}
              {/* <section>
                <div className="coming-soon">{t('coming_soon')}</div>
                <div
                  className="container"
                  style={{
                    background: `url(${map})no-repeat`,
                    backgroundSize: "cover",
                  }}
                > */}
                  {/* <hr className="my-lg-14 my-8"> */}
                  {/* row */}
                  {/* <div className="row align-items-center text-center justify-content-center">
                    <div className=" col-lg-6 col-md-6 fade-in-left">
                      <Slide direction="left">
                        <div className="mb-6">
                          <div className="mb-7"> */}
                            {/* heading */}
                            {/* <h1>{t('get_app')}</h1>
                            <h5 className="mb-0">
                              {t('send_link_download')}
                            </h5>
                          </div>
                          <div className="mb-5"> */}
                            {/* form check */}
                            {/* <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="flexRadioDefault"
                                id="flexRadioDefault1"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexRadioDefault1"
                              >
                                Email
                              </label>
                            </div> */}
                            {/* form check */}
                            {/* <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="flexRadioDefault"
                                id="flexRadioDefault2"
                                defaultChecked
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexRadioDefault2"
                              >
                                Phone
                              </label>
                            </div>
                           
                          </div>
                          <div>
                            

                            <ul className="list-inline mb-0 mt-2 "> */}
                              {/* list item */}
                              {/* <li className="list-inline-item"> */}
                                {/* img */}
                                {/* <Link to="#!">
                                  {" "}
                                  <img
                                    src={appstore}
                                    alt="appstore"
                                    style={{ width: 140 }}
                                  />
                                </Link>
                              </li>
                              <li className="list-inline-item"> */}
                                {/* img */}
                                {/* <Link to="#!">
                                  {" "}
                                  <img
                                    src={googleplay}
                                    alt="googleplay"
                                    style={{ width: 140 }}
                                  />
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </Slide>
                    </div>
                    <div className=" offset-lg-2 col-lg-4 col-md-6 fade-zoom">
                      <Slide direction="right">
                        <div className="text-lg-start"> */}
                          {/* img */}
                          {/* <img
                            src={iphone}
                            alt="iphone"
                            className=" img-fluid"
                          />
                        </div>
                      </Slide>
                    </div>
                  </div> */}
                  {/* <hr className="my-lg-14 my-8"> */}
                {/* </div>
              </section>
            </> */}
            
            
            {/* <>
              <div className="container">
                <Slider {...settings2}>
                  
                  <div className="m-1">
                    <div className="partner-list">
                      <img
                        src={product1}
                        style={{ objectFit: "cover" }}
                        className="img-fluid "
                        alt="product"
                      />
                      <h6 class="card-title partner">
                        <div>Baby Care</div>
                      </h6>
                    </div>
                  </div>
                  <div className="m-1">
                    <div className="partner-list">
                      <img
                        src={product2}
                        style={{ objectFit: "cover" }}
                        className="img-fluid"
                        alt="product"
                      />
                      <h6 class="card-title">
                        <div>Atta, Rice &amp; Dal</div>
                      </h6>
                    </div>
                  </div>
                  <div className="m-1">
                    <div className="partner-list">
                      <img
                        src={product3}
                        style={{ objectFit: "cover" }}
                        className="img-fluid"
                        alt="product"
                      />
                      <h6 class="card-title">
                        <div>Bakery &amp; Biscuits</div>
                      </h6>
                    </div>
                  </div>
                  <div className="m-1">
                    <div className="partner-list">
                      <img
                        src={product4}
                        style={{ objectFit: "cover" }}
                        className="img-fluid"
                        alt="product"
                      />
                      <h6 class="card-title">
                        <div>Chicken, Meat &amp; Fish</div>
                      </h6>
                    </div>
                  </div>
                  <div className="m-1">
                    <div className="partner-list">
                      <img
                        src={product5}
                        style={{ objectFit: "cover" }}
                        className="img-fluid"
                        alt="product"
                      />
                      <h6 class="card-title">
                        <div>Cleaning Essentials</div>
                      </h6>
                    </div>
                  </div>
                  <div className="m-1">
                    <div className="partner-list">
                      <img
                        src={product6}
                        style={{ objectFit: "cover" }}
                        className="img-fluid"
                        alt="product"
                      />
                      <h6 class="card-title">
                        <div>Dairy, Bread &amp; Eggs</div>
                      </h6>
                    </div>
                  </div>
                  <div className="m-1">
                    <div className="partner-list">
                      <img
                        src={product7}
                        style={{ objectFit: "cover" }}
                        className="img-fluid"
                        alt="product"
                      />
                      <h6 class="card-title">
                        <div>Instant Food</div>
                      </h6>
                    </div>
                  </div>
                  <div className="m-1">
                    <div className="partner-list">
                      <img
                        src={product8}
                        style={{ objectFit: "cover" }}
                        className="img-fluid"
                        alt="product"
                      />
                      <h6 class="card-title">
                        <div>Pet Care</div>
                      </h6>
                    </div>
                  </div>
                  <div className="m-1">
                    <div className="partner-list">
                      <img
                        src={product9}
                        style={{ objectFit: "cover" }}
                        className="img-fluid"
                        alt="product"
                      />
                      <h6 class="card-title">
                        <div>Snack &amp; Munchies</div>
                      </h6>
                    </div>
                  </div>
                  <div className="m-1">
                    <div className="partner-list">
                      <img
                        src={product10}
                        style={{ objectFit: "cover" }}
                        className="img-fluid"
                        alt="product"
                      />
                      <h6 class="card-title">
                        <div>Tea, Coffee &amp; Drinks</div>
                      </h6>
                    </div>
                  </div>
                </Slider>
              </div>
            </> */}
          </>
        )}
      </div>
    </div>
  );
};

export default HomeWholesaler;
