import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { Link} from "react-router-dom";
// import Swal from "sweetalert2";
import axios from "axios";
import { useTranslation } from "react-i18next";

const ProductItem = () => {
  const{t,i18n} = useTranslation('productItem');

  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const [variants, setVariants] = useState([])
  const navigate = useNavigate()

  // Update currentLang when the language is changed
    useEffect(() => {
      setCurrentLang(i18n.language);
    }, [i18n.language]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await axios.get("http://127.0.0.1:8000/products/");
        console.log('products',productsResponse.data)
        setProducts(productsResponse.data);
        setVariants(productsResponse.data.variants)
        setDisplayedProducts(productsResponse.data.slice(0, 12));
        // console.log("products",productsResponse.data)
        
      } catch (err) {
        
        console.error(err);
      } finally {
        
      }
    };

    fetchData();
  }, []);


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

  
  return (
    <div>
      {/* Popular Products Start*/}
      <section className="my-lg-14 my-8">
        <div className="container">
          <div className="row">
            <div className="col-12 mb-6">
              <div className="section-head text-center mt-8">
                <h3 className="h3style" data-title="Popular Products">
                  {t('popular_products')}
                </h3>
                <div className="wt-separator bg-primarys"></div>
                <div className="wt-separator2 bg-primarys"></div>
                {/* <p>Connecting with entrepreneurs online, is just a few clicks away.</p> */}
              </div>
            </div>
          </div>
          <div className="row g-4 row-cols-lg-5 row-cols-2 row-cols-md-3">
          {displayedProducts.slice(0,12).map((product) => (
          <div className="col-lg-3 col-md-4 col-sm-6 fade-zoom" key={product.id}>
            <div className="card card-product">
              <div className="card-body">
                <div className="text-center position-relative">
                  {product?.is_in_campaign && (
                    <div className="position-absolute top-0 start-0">
                      <span className="badge bg-danger">{t('campaign')}</span>
                    </div>
                  )}
                  <a href="#!">
                  <img
                    src={
                      product?.variants?.[0]?.variant_images?.[0]?.image_url || 
                      "https://via.placeholder.com/150"
                    }
                    alt={product?.product_name}
                    style={{ width: "120px", height: "120px", margin: "5px" }}
                  />
                  </a>
                  <div className="card-product-action">
                    <a
                      // href="#!"
                      className="btn-action"
                      // data-bs-toggle="modal"
                      // data-bs-target="#quickViewModal"
                    >
                      <i
                        className="bi bi-eye"
                        data-bs-toggle="tooltip"
                        data-bs-html="true"
                        title="Quick View"
                        onClick={() => navigate(`/productDetails/${product?.id}`)}
                      />
                    </a>
                  </div>
                </div>
                <div className="text-small mb-1">
                  <a
                    href="#!"
                    className="text-decoration-none text-muted"
                  >
                    <small>{currentLang === "en" ? product?.category.name_en : product?.category.name_ar}</small>
                  </a>
                </div>
                <h2 className="fs-6">
                  <a
                    href="#!"
                    className="text-inherit text-decoration-none"
                  >
                    {currentLang === "en" ? product?.product_name_en : product?.product_name_ar}
                  </a>
                </h2>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div>
                    <span className="text-dark">{t('original_price_label')}: {product?.variants[0].price} {t('kd')}</span>{" "}
                    <br/>
                      <span className="text-decoration-line-through text-muted">
                      {t('original_price_label')}:{((Number(product?.variants?.[0].price) + (Number(product?.variants?.[0].price) * 10) / 100).toFixed(2))} {t('kd')}
                      </span>
                  </div>
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
                      {t('add')}
                    </a>
                  </div>
                </div>
                <div>
                  <span style={{ color: 'red' }}>{t('campaign_price_label')}: {(product?.variants?.[0].price * (100 - product?.variants?.[0].campaign_discount_percentage)) / 100} {t('kd')}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
        </div>
      </section>
      {/* Popular Products End*/}
    </div>
  );
};

export default ProductItem;