import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
import { FaBell, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import ScrollToTop from "../ScrollToTop";
// import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import { useTranslation } from "react-i18next";
import API_BASE_URL from '../../config';

const MyAcconutNotification = () => {
  // loading
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const {t: tCommon} = useTranslation('accounts_common')
  const{t: tAccounts} = useTranslation('accounts_others')

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const email = localStorage.getItem("email");
        const token = localStorage.getItem("access_token");
        if (!email || !token) return;

        const response = await axios.get(`${API_BASE_URL}/notifications/`, {
          headers: {
            "Content-Type": "application/json",
            email: email,
            Authorization: `Bearer ${token}`,
          },
        });

        // Filter unread notifications and update state
        const unreadNotifications = response.data.filter((notification) => !notification.is_read);
        console.log("notifications",unreadNotifications)
        setNotifications(unreadNotifications);
        // setNotificationCount(unreadNotifications.length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoaderStatus(false);
    }, 1500);
  }, []);

  return (
    <div>
       <>
            <ScrollToTop/>
            </>
      <>
        {/* section */}
        <section>
          {/* container */}
          <div className="container">
            {/* row */}
            <div className="row">
              {/* col */}
              <div className="col-12">
                {/* text */}
                <div className="p-6 d-flex justify-content-between align-items-center d-md-none">
                  {/* heading */}
                  <h3 className="fs-5 mb-0">{tCommon("account_settings")}</h3>
                  {/* btn */}
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
                        className="nav-link "
                        aria-current="page"
                        to="/MyAccountOrder"
                      >
                        <i className="fas fa-shopping-bag me-2" />
                        {tCommon("your_orders")}
                      </Link>
                    </li>
                    {/* nav item */}
                    {/* <li className="nav-item">
                      <Link className="nav-link " to="/MyAccountSetting">
                        <i className="fas fa-cog me-2" />
                        {tCommon("settings")}
                      </Link>
                    </li> */}
                    {/* nav item */}
                    <li className="nav-item">
                      <Link className="nav-link " to="/MyAccountAddress">
                        <i className="fas fa-map-marker-alt me-2" />
                        {tCommon('address')}
                      </Link>
                    </li>
                    {/* nav item */}
                    <li className="nav-item">
                      <Link className="nav-link " to="/MyAcconutPaymentMethod">
                        <i className="fas fa-credit-card me-2" />
                        {tCommon('payment_method')}
                      </Link>
                    </li>
                    {/* nav item */}
                    <li className="nav-item">
                      <Link
                        className="nav-link active"
                        to="/MyAcconutNotification"
                      >
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
                  ) : notifications.length === 0 ? (
                    <p className="text-center text-gray-500">{tAccounts("no_new_notifications")}</p>
                  ) : (
                    <ul className="bg-white shadow-md rounded-lg divide-y">
                        {notifications.map((notification) => (
                          <li key={notification.id} className="p-4 flex items-center justify-between hover:bg-gray-100 transition">
                            <div>
                              <Link to="/MyAccountOrder">
                              <p className="text-gray-800 font-medium">@ {notification.message}</p>
                              </Link>
                              <p className="text-gray-500 text-sm">
                                {/* {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })} */}
                              </p>
                            </div>
                            {/* <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-green-600 hover:text-green-800 transition flex items-center gap-1"
                            >
                              <FaCheckCircle /> Mark as Read
                            </button> */}
                          </li>
                        ))}
                      </ul>
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

export default MyAcconutNotification;
