import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

const ProductItem = () => {
  const{t, i18n} = useTranslation('home_wh')
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState(i18n.language);

  const navigate = useNavigate();

  // Update currentLang when the language is changed
  useEffect(() => {
    setCurrentLang(i18n.language);
  }, [i18n.language]);
  


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const wholesalerEmail = localStorage.getItem("email");
        const response = await axios.get("http://127.0.0.1:8000/wholesaler/products/", {
          params: { email: wholesalerEmail },
        });
        console.log("wholesaler products", response.data)
        setProducts(response.data);
        setDisplayedProducts(response.data.slice(0, 12));
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle the edit button (update functionality)
  const handleUpdateProduct = (product) => {
    // Navigate to the edit page of the product (replace with the actual route for editing)
    navigate(`/edit-product/${product.id}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Popular Products Start*/}
      <section className="my-lg-14 my-8">
        <div className="container">
          <div className="row">
            <div className="col-12 mb-6">
              <div className="section-head text-center mt-8">
                <h3 className="h3style" data-title="Popular Products">
                  {t('yourProducts')}
                </h3>
                <div className="wt-separator bg-primarys"></div>
                <div className="wt-separator2 bg-primarys"></div>
              </div>
            </div>
          </div>
          <div className="row g-4 row-cols-lg-5 row-cols-2 row-cols-md-3">
            {displayedProducts.map((product) => (
              <div className="col-lg-3 col-md-4 col-sm-6 fade-zoom" key={product.id}>
                <div className="card card-product">
                  <div className="card-body">
                    <div className="text-center position-relative">
                      {product.is_in_campaign && (
                        <div className="position-absolute top-0 start-0">
                          <span className="badge bg-danger">{t('campaign')}</span>
                        </div>
                      )}
                      <a href="#!">
                      <img
                          src={
                            product.first_variant_image_url
                              ? product.first_variant_image_url
                              : "https://via.placeholder.com/150"
                          }
                          alt={product.product_name}
                          style={{ width: "120px", height: "120px", margin: "5px" }}
                        />
                      </a>
                    </div>
                    <div className="text-small mb-1">
                      <a href="#!" className="text-decoration-none text-muted">
                        <small>{product.category}</small>
                      </a>
                    </div>
                    <h2 className="fs-6">
                      <a href="#!" className="text-inherit text-decoration-none">
                      {currentLang === "en" ? product.product_name_en : product.product_name_ar}
                      </a>
                    </h2>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div>
                        <span className="text-dark">{t('price')} : {product.first_variant.price} {t('kd')}</span>{" "}
                        <br/>
                        <span className="text-decoration-line-through text-muted">
                          {t('price')}: {((Number(product.first_variant.price) + (Number(product.first_variant.price) * 10) / 100).toFixed(2))} {t('kd')}
                        </span>
                      </div>
                      <div>
                        <a
                          href="#!"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleUpdateProduct(product)} // Navigate to the edit page
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus">
                            <line x1={12} y1={5} x2={12} y2={19} />
                            <line x1={5} y1={12} x2={19} y2={12} />
                          </svg>{" "}
                         {t('update')}
                        </a>
                      </div>
                    </div>
                    <div>
                      <span style={{ color: "red" }}>
                        {t('campaignPrice')}: {(product.first_variant.price * (100 - product.first_variant.campaign_discount_percentage)) / 100} {t('kd')}
                      </span>
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
