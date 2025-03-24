import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

const MyAccountOrder = () => {
  // loading
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [orders, setOrders] = useState([]);
  const [campaignOrders, setCampaignOrders] = useState([]);

  const {t: tCommon} = useTranslation('accounts_common')
  const {t: tAccounts} = useTranslation('accounts_others')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const email = localStorage.getItem("email");
        const token = localStorage.getItem("access_token");
        const companyName = localStorage.getItem("company_name");
  
        if (!email) {
          console.error("No email found in local storage");
          return;
        }
  
        if (!token) {
          console.error("No token found in local storage");
          return;
        }
  
        const headers = {
          "Content-Type": "application/json",
          email: email,
          'Authorization': `Bearer ${token}`
        };
  
        let response;
  
        if (companyName) {
          // Fetch orders for wholesaler
          response = await axios.get("http://127.0.0.1:8000/wholesaler/orders/", {
            headers: {
              ...headers,
              company_name: companyName,
            },
          });
        } else {
          // Fetch orders for regular user
          response = await axios.get("http://127.0.0.1:8000/user_orders/", {
            headers: {
              ...headers,
              // Authorization: `Bearer ${token}`,
            },
          });
        }
  
        console.log("orders",response.data);
        setOrders(response.data.orders);
        setCampaignOrders(response.data.campaign_orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
  
    fetchOrders();
  }, []);
  

  const handlePayment = (orderId) => {
    console.log(`Processing payment for order: ${orderId}`);
    // Here, you can trigger a payment API request
  };
  
  useEffect(() => {
    setTimeout(() => {
      setLoaderStatus(false);
    }, 1500);
  }, []);

  return (
    <div>
      <>
        <ScrollToTop />
      </>
      <>
        {/* section */}
        <section>
          <div className="container">
            {/* row */}
            <div className="row">
              {/* col */}

              {/* <div> */}
              <div className="col-12">
                <div className="p-6 d-flex justify-content-between align-items-center d-md-none">
                  {/* heading */}
                  <h3 className="fs-5 mb-0">{tCommon('account_settings')}</h3>
                  {/* button */}
                  <button
                    className="btn btn-outline-gray-400 text-muted d-md-none"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasAccount"
                    aria-controls="offcanvasAccount"
                  >
                    <i className="fas fa-bars"></i>
                  </button>
                </div>
              </div>
              {/* col */}
              <div className="col-lg-3 col-md-4 col-12 border-end  d-none d-md-block">
                <div className="pt-10 pe-lg-10">
                  {/* nav */}
                  <ul className="nav flex-column nav-pills nav-pills-dark">
                    {/* nav item */}
                    <li className="nav-item">
                      <Link
                        className="nav-link active"
                        aria-current="page"
                        to="/MyAccountOrder"
                      >
                        <i className="fas fa-shopping-bag me-2" />
                        {tCommon('your_orders')}
                      </Link>
                    </li>
                    {/* nav item */}
                    {/* <li className="nav-item">
                      <Link className="nav-link" to="/MyAccountSetting">
                        <i className="fas fa-cog me-2" />
                        {tCommon('settings')}
                      </Link>
                    </li> */}
                    {/* nav item */}
                    <li className="nav-item">
                      <Link className="nav-link" to="/MyAccountAddress">
                        <i className="fas fa-map-marker-alt me-2" />
                        {tCommon('address')}
                      </Link>
                    </li>
                    {/* nav item */}
                    <li className="nav-item">
                      <Link className="nav-link" to="/MyAcconutPaymentMethod">
                        <i className="fas fa-credit-card me-2" />
                        {tCommon('payment_method')}
                      </Link>
                    </li>
                    {/* nav item */}
                    <li className="nav-item">
                      <Link className="nav-link" to="/MyAcconutNotification">
                        <i className="fas fa-bell me-2" />
                        {tCommon('notification')}
                      </Link>
                    </li>
                    {/* nav item */}
                    {localStorage.getItem('company_name') && (
                      <li className="nav-item">
                        <Link className="nav-link" to="/AddProducts">
                          <i className="bi bi-plus-circle" style={{ marginRight: '8px' }}/>
                          {tCommon('add_products')}
                        </Link>
                      </li>
                    )}
                    {localStorage.getItem('company_name') && (
                      <>
                      <li className="nav-item">
                      <Link className="nav-link" to="/AddedProducts">
                        <i className="bi bi-card-list " style={{ marginRight: '8px' }}/>
                        {tCommon('added_products')}
                      </Link>
                      </li>
                      <li className="nav-item">
                    <Link className="nav-link" to="/WholesalerCampaigns">
                    <i className="bi bi-collection-fill" style={{ marginRight: '8px' }}/>
                    {tCommon('campaigns')}
                    </Link>
                    </li> 
                      </>
                    )}
                    {/* nav item */}
                    {localStorage.getItem('user_name') && (
                    <li className="nav-item">
                    <Link className="nav-link" to="/MyCampaigns">
                    <i className="bi bi-collection-fill" style={{ marginRight: '8px' }}/>
                    {tCommon('campaigns')}
                    </Link>
                    </li>    
                    )}                 
                    {/* nav item */}
                    <li className="nav-item">
                      <Link className="nav-link " to="/Grocery-react/">
                        <i className="fas fa-sign-out-alt me-2" />
                        {tCommon('home')}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              {/* </div> */}

              <div className="col-lg-9 col-md-8 col-12">
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
                      <div className="p-6 p-lg-10">
                        {/* heading */}
                        <h2 className="mb-6">{tCommon('your_orders')}</h2>
                        <div className="table-responsive border-0">
                          {/* Table */}
                          
                          <table className="table mb-0 text-nowrap">
                            {/* Table Head */}
                            <thead className="table-light">
                              <tr>
                                <th className="border-0">&nbsp;</th>
                                <th className="border-0">{tAccounts('product')}</th>
                                <th className="border-0">{tAccounts('order')}</th>
                                <th className="border-0">{tAccounts('date')}</th>
                                <th className="border-0">{tAccounts('quantity')}</th>
                                <th className="border-0">{tAccounts('status')}</th>
                                <th className="border-0">{tAccounts('amount')}</th>
                                <th className="border-0">{tAccounts('action')}</th>
                                <th className="border-0" />
                              </tr>
                            </thead>
                            <tbody>
                              {campaignOrders.map((order) => (
                                <tr key={order.id}>
                                  <td className="align-middle border-top-0 w-0">
                                    <Link to="#">
                                      <img
                                        src={order.product.product_images[0].image_url}
                                        alt="Ecommerce"
                                        className="icon-shape icon-xl"
                                      />
                                    </Link>
                                  </td>
                                  <td className="align-middle border-top-0">
                                    <Link to="#" className="fw-semi-bold text-inherit">
                                      <h6 className="mb-0">{order.product_name}</h6>
                                    </Link>
                                    <span>
                                      {/* <small className="text-muted">{order.quantity}</small> */}
                                    </span>
                                  </td>
                                  <td className="align-middle border-top-0">
                                    <Link to="#" className="text-inherit">
                                      #{order.id}
                                    </Link>
                                  </td>
                                  <td className="align-middle border-top-0">
                                    {new Date(order.created_at).toLocaleDateString()}
                                  </td>
                                  <td className="align-middle border-top-0">{order.quantity}</td>
                                  <td className="align-middle border-top-0">
                                    <span className={`badge bg-${order.payment_status === 'Processing' ? 'warning' : 'success'}`}>
                                      {order.payment_status}
                                    </span>
                                  </td>
                                  <td className="align-middle border-top-0">{order.total_price} KD</td>
                                  {!localStorage.getItem("company_name") && (
                                  <td className="align-middle border-top-0">
                                    {order.payment_status !== 'full_paid' ? (
                                      <button
                                        className="btn btn-outline-success btn-sm"  // ✅ Green border, white background, black text
                                        onClick={() => handlePayment(order.id)}
                                      >
                                        {tAccounts('pay')}
                                      </button>
                                    ) : (
                                      <button className="btn btn-success btn-sm" disabled>
                                        {tAccounts('paid')}
                                      </button>
                                    )}
                                  </td>
                                  )}
                                  <td className="text-muted align-middle border-top-0">
                                    <Link to="#" className="text-inherit">
                                      <i className="feather-icon icon-eye" />
                                    </Link>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
      <>
        {/* modal */}
        <div
          className="offcanvas offcanvas-start"
          tabIndex={-1}
          id="offcanvasAccount"
          aria-labelledby="offcanvasAccountLabel"
        >
          {/* offcanvas header */}
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasAccountLabel">
              My Account
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            />
          </div>
          {/* offcanvas body */}
          <div className="offcanvas-body">
            <ul className="nav flex-column nav-pills nav-pills-dark">
              {/* nav item */}
              <li className="nav-item">
                <a
                  className="nav-link active"
                  aria-current="page"
                  href="/MyAccountOrder"
                >
                  <i className="fas fa-shopping-bag me-2" />
                  Your Orders
                </a>
              </li>
              {/* nav item */}
              <li className="nav-item">
                <a className="nav-link " href="/MyAccountSetting">
                  <i className="fas fa-cog me-2" />
                  Settings
                </a>
              </li>
              {/* nav item */}
              <li className="nav-item">
                <a className="nav-link" href="/MyAccountAddress">
                  <i className="fas fa-map-marker-alt me-2" />
                  Address
                </a>
              </li>
              {/* nav item */}
              <li className="nav-item">
                <a className="nav-link" href="/MyAcconutPaymentMethod">
                  <i className="fas fa-credit-card me-2" />
                  Payment Method
                </a>
              </li>
              {/* nav item */}
              <li className="nav-item">
                <a className="nav-link" href="/MyAcconutNotification">
                  <i className="fas fa-bell me-2" />
                  Notification
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/AddProducts">
                  <i className="fas fa-bell me-2" />
                  Add Products
                </a>
              </li>
            </ul>
            <hr className="my-6" />
            <div>
              {/* nav  */}
              <ul className="nav flex-column nav-pills nav-pills-dark">
                {/* nav item */}
                <li className="nav-item">
                  <a className="nav-link " href="/Grocery-react/">
                    <i className="fas fa-sign-out-alt me-2" />
                    Home
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default MyAccountOrder;
