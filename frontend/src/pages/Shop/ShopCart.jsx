import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setCart, removeFromCart } from "../../redux/cartSlice";
import API_BASE_URL from "../../config";

const ShopCart = () => {
  // const [cartItems, setCartItems] = useState([]);
  // const [totalPrice, setTotalPrice] = useState(0);
  const [loaderStatus, setLoaderStatus] = useState(true);
  const cartItems = useSelector((state) => state.cart.cartItems); 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {t} = useTranslation("cart_check")

  // useEffect(() => {
  //   const fetchCart = () => {
  //     const cart = JSON.parse(localStorage.getItem("cart")) || [];
  //     setCartItems(cart);
  //     calculateTotals(cart);
  //     setLoaderStatus(false);
  //   };
  //   fetchCart();
  // }, []);

  useEffect(() => {
    // Load cart from local storage when the component mounts
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    dispatch(setCart(storedCart));
    setLoaderStatus(false);
  }, [dispatch]);

  // Calculate total price dynamically
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.variant.price * item.quantity,
    0
  );

   // Update quantity in Redux
   const updateQuantity = (variantId, newQuantity) => {
    const updatedCart = cartItems.map((item) =>
      item.variant.id === variantId
        ? { ...item, quantity: newQuantity > 1 ? newQuantity : 1 } // Ensure quantity is at least 1
        : item
    );

    dispatch(setCart(updatedCart)); // Update Redux
  };

  // Remove item from Redux
  const removeItem = (variantId) => {
    dispatch(removeFromCart({id: variantId})); // Remove item from Redux state
  };

  const handleCheckout = () => {
    navigate("/ShopCheckOut");
  };

  return (
    <div>
      {loaderStatus ? (
        <div className="loader-container">
          <MagnifyingGlass
            visible={true}
            height="100"
            width="100"
            ariaLabel="magnifying-glass-loading"
            glassColor="#c0efff"
            color="#0aad0a"
          />
        </div>
      ) : (
        <>
          <ScrollToTop />
          <section className="mb-lg-14 mb-8 mt-8">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="card py-1 border-0 mb-8">
                    <h1 className="fw-bold">{t("shop_cart")}</h1>
                    {/* <p className="mb-0">Shopping in 382480</p> */}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-8 col-md-7">
                  <div className="py-3">
                    {cartItems.length > 0 ? (
                      <>
                        {/* <div className="alert alert-danger p-2" role="alert">
                          You’ve got FREE delivery. Start{" "}
                          <Link to="#!" className="alert-link">
                            checkout now!
                          </Link>
                        </div> */}
                        <ul className="list-group list-group-flush">
                          {cartItems.map((item) => (
                            <li
                              key={item.variant.id}
                              className="list-group-item py-3 py-lg-0 px-0 border-top"
                            >
                              <div className="row align-items-center">
                                <div className="col-3 col-md-2">
                                <img
                                    src={
                                      item.variant.variant_images && item.variant.variant_images?.length > 0
                                        ? item.variant.variant_images[0].image_url // Cloudinary image URL
                                        : "https://via.placeholder.com/150" // Fallback image if no image exists
                                    }
                                    alt={item.variant.product_name}
                                    className="img-fluid"
                                  />
                                </div>
                                <div className="col-4 col-md-6">
                                  <h6 className="mb-0">{item.variant.product_name}</h6>
                                  <span>
                                    <small className="text-muted">
                                    {t("currency_kd")}: {Number(item.variant.price).toFixed(3)} {t("per_unit")}
                                    </small>
                                  </span>
                                  <div className="mt-2 small">
                                    <Link
                                      to="#!"
                                      className="text-decoration-none text-inherit"
                                      onClick={() => removeItem(item.variant.id)}
                                    >
                                      <span className="me-1 align-text-bottom">
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
                                          className="feather feather-trash-2 text-success"
                                        >
                                          <polyline points="3 6 5 6 21 6" />
                                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                          <line x1={10} y1={11} x2={10} y2={17} />
                                          <line x1={14} y1={11} x2={14} y2={17} />
                                        </svg>
                                      </span>
                                      <span className="text-muted">{t("remove")}</span>
                                    </Link>
                                  </div>
                                </div>
                                <div className="col-3 col-md-3 col-lg-2">
                                  <div className="input-group flex-nowrap justify-content-center">
                                    <button
                                      className="button-minus form-control text-center px-0"
                                      onClick={() =>
                                        updateQuantity(item.variant.id, item.quantity - 1)
                                      }
                                    >
                                      -
                                    </button>
                                    <input
                                      type="number"
                                      step={1}
                                      max={10}
                                      value={item.quantity}
                                      onChange={(e) =>
                                        updateQuantity(
                                          item.variant.id,
                                          parseInt(e.target.value) || 0
                                        )
                                      }
                                      className="quantity-field form-control text-center px-0"
                                    />
                                    <button
                                      className="button-plus form-control text-center px-0"
                                      onClick={() =>
                                        updateQuantity(item.variant.id, item.quantity + 1)
                                      }
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                                <div className="col-2 text-lg-end text-start text-md-end col-md-2">
                                  <span className="fw-bold">
                                  {t("currency_kd")}: {(item.variant.price * item.quantity).toFixed(3)}
                                  </span>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                        <div className="d-flex justify-content-between mt-4">
                          <Link to="/Shop" className="btn btn-primary">
                            {t("continue_shopping")}
                          </Link>
                          {/* <Link to="#!" className="btn btn-dark">
                            Update Cart
                          </Link> */}
                        </div>
                      </>
                    ) : (
                      <p>{t("cart_empty")}</p>
                    )}
                  </div>
                </div>
                <div className="col-12 col-lg-4 col-md-5">
                  <div className="mb-5 card mt-6">
                    <div className="card-body p-6">
                      <h2 className="h5 mb-4">{t("summary")}</h2>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between align-items-start">
                          <div className="me-auto">
                            <div>{t("item_subtotal")} </div>
                          </div>
                          <span> {t("currency_kd")}: {totalPrice.toFixed(3)}</span>
                        </li>
                      </ul>
                      <div className="d-grid mb-1 mt-4">
                        <button
                          className="btn btn-primary btn-lg d-flex justify-content-between align-items-center"
                          onClick={handleCheckout}
                        >
                          {t("go_to_checkout")} <span className="fw-bold">{t("currency_kd")}: {totalPrice.toFixed(3)}</span>
                        </button>
                      </div>
                      <p>
                        {/* <small>
                          By placing your order, you agree to the{" "}
                          <Link to="#!">Terms of Service</Link> and{" "}
                          <Link to="#!">Privacy Policy.</Link>
                        </small> */}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default ShopCart;