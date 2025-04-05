import React, { useEffect, useState, useRef} from "react";
import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";
import axios from 'axios';
import { useTranslation } from "react-i18next";
import { Modal } from "bootstrap";

const MyAccountAddress = () => {
  // loading
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const [licenseImage, setLicenseImage] = useState(null);
  // const [isEdit, setIsEdit] = useState(false);  // To toggle between edit and add modes
  // const [editAddressId, setEditAddressId] = useState(null); // To store the address ID when editing

  const modalRef = useRef(null); // Create a reference

  const{t: tCommon} = useTranslation('accounts_common')
  const{t: tAccounts} = useTranslation('accounts_others')
  const{t: tModal} = useTranslation('modal')

  const [address, setAddress] = useState({
    first_name: '',
    last_name: '',
    company_name: '',
    street_address: '',
    email: '',
    city: '',
    zipcode: '',
    country: '',
    phone_number: '',
    mobile_number1: '',
    mobile_number2: '',
    mobile_number3: '',
    license_number: '',
  });

  // const navigate = useNavigate();

  // Check if `company_name` exists in local storage
  const isCompany = localStorage.getItem('company_name') ? true : false;

  useEffect(() => {
    fetchUserDetails();
  }, [isCompany]);

  const fetchUserDetails = async () => {
    try {
      const email = localStorage.getItem("email");
      const token = localStorage.getItem("access_token");

      if (!email) {
        console.error("No email found in local storage");
        return;
      }

      const endpoint = isCompany
        ? "http://127.0.0.1:8000/wholesaler/details/"
        : "http://127.0.0.1:8000/details/";

      const response = await axios.get(endpoint, {
        headers: {
          "Content-Type": "application/json",
          email,
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Fetched user details:", response.data);

      setUserDetails(response.data);

      // Merge fetched data into address state
      setAddress({
        company_name: response.data.company_name || "",
        first_name: response.data.first_name || "",
        last_name: response.data.last_name || "",
        email: response.data.email || "",
        phone_number: response.data.phone_number || "",
        street_address: response.data.street_address || "",
        mobile_number1: response.data.mobile_number1 || "",
        mobile_number2: response.data.mobile_number2 || "",
        mobile_number3: response.data.mobile_number3 || "",
        country: response.data.country || "KUWAIT",
        city: response.data.city || "",
        zipcode: response.data.zipcode || "",
        license_number: response.data.license_number || "",
        license_image: null, // Assuming it's not needed initially
      });

    } catch (error) {
      console.error("Error fetching user data:", error.response?.data || error.message);
    }
  };
  
  // Handle input change
  const handleChange = (e) => {
  const { name, value } = e.target;

  setAddress((prevAddress) => ({
    ...prevAddress,
    [name]: value,
  }));
};

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLicenseImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
  
    if (isCompany) {
      if (!address.license_number) {
        alert("License number is required for a company.");
        return;
      }
      formData.append("company_name", address.company_name);
      formData.append("license_number", address.license_number);
  
      if (licenseImage && licenseImage instanceof File) {
        formData.append("license_image", licenseImage);
      } else {
        alert("Please upload a valid license image.");
        return;
      }
    } else {
      if (!address.first_name || !address.last_name || !address.city) {
        alert("First name, last name, and city are required for an individual.");
        return;
      }
      formData.append("first_name", address.first_name);
      formData.append("last_name", address.last_name);
      formData.append("city", address.city);
      formData.append("phone_number", address.phone_number);
    }
  
    formData.append("email", address.email);
    formData.append("street_address", address.street_address);
    formData.append("zipcode", address.zipcode);
    formData.append("country", address.country);
    formData.append("mobile_number1", address.mobile_number1);
    formData.append("mobile_number2", address.mobile_number2);
    formData.append("mobile_number3", address.mobile_number3);
  
    try {
      const token = localStorage.getItem("access_token");
      const email = localStorage.getItem("email");
  
      if (!email) {
        console.error("No email found in local storage");
        alert("No email found in local storage.");
        return;
      }
  
      const endpoint = isCompany
        ? "http://127.0.0.1:8000/wholesaler/update_profile/"
        : "http://127.0.0.1:8000/profile/update/";
  
      await axios.patch(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          email,
          Authorization: `Bearer ${token}`,
        },
      });
  
      fetchUserDetails(); // ✅ Call the function after updating
  
      alert("Profile updated successfully!");
  
      if (modalRef.current) {
        const modalInstance = Modal.getInstance(modalRef.current);
        modalInstance?.hide();
      }
  
      setTimeout(() => {
        document.querySelectorAll(".modal-backdrop").forEach((backdrop) => backdrop.remove());
        document.body.style.overflow = "auto";
        document.body.classList.remove("modal-open");
      }, 300);
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      alert("Failed to update profile. Please check your input and try again.");
    }
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
        <div>
          {/* section */}
          <section>
            {/* container */}
            <div className="container">
              {/* row */}
              <div className="row">
                {/* col */}
                <div className="col-12">
                  <div className="p-6 d-flex justify-content-between align-items-center d-md-none">
                    {/* heading */}
                    <h3 className="fs-5 mb-0">{tCommon('account_settings')}</h3>
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
                        {/* nav link */}
                        <Link
                          className="nav-link "
                          aria-current="page"
                          to="/MyAccountOrder"
                        >
                          <i className="fas fa-shopping-bag me-2" />
                          {tCommon('your_orders')}
                        </Link>
                      </li>
                      {/* nav item */}
                      {/* <li className="nav-item">
                        <Link className="nav-link " to="/MyAccountSetting">
                          <i className="fas fa-cog me-2" />
                          {tCommon('settings')}
                        </Link>
                      </li> */}
                      {/* nav item */}
                      <li className="nav-item">
                        <Link
                          className="nav-link active"
                          to="/MyAccountAddress"
                        >
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
                      <ul className="nav flex-column nav-pills nav-pills-dark">
                        <li className="nav-item">
                        <Link className="nav-link" to="/AddProducts">
                          <i className="bi bi-plus-circle" style={{ marginRight: '8px' }}/>
                          {tCommon('add_products')}
                        </Link>
                        </li>
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
                      </ul>
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
                    ) : (
                      <>
                        <div className="p-6 p-lg-10">
                          <div className="d-flex justify-content-between mb-6">
                            {/* heading */}
                            <h2 className="mb-0">{tAccounts('address')}</h2>
                            {/* button */}
                            {/* {!userDetails && (
                            <Link
                              to="#"
                              
                              className="btn btn-outline-primary"
                              data-bs-toggle="modal"
                              data-bs-target="#addAddressModal"
                            >
                              Add a new address
                            </Link>
                            ) } */}
                          </div>
                          <div className="row">
                            {/* Check if userDetails is available */}
                            {userDetails ? (
                              <div className="col-lg-5 col-xxl-4 col-12 mb-4">
                                {/* Address Card */}
                                <div className="border p-6 rounded-3">
                                  {/* Address Title */}
                                  <h5 className="text-dark fw-semi-bold">{tAccounts('address')}</h5>

                                  {/* Address Details */}
                                  {!localStorage.getItem('company_name') && (
                                    <p className="mb-6">
                                      {userDetails.first_name} {userDetails.last_name}
                                      <br />
                                      {userDetails.city}
                                      <br />
                                      {userDetails.phone_number}
                                    </p>
                                  )}
                                  <br />
                                  {localStorage.getItem('company_name') && (
                                    <p className="mb-6">
                                      {userDetails.company_name}
                                      <br />
                                      {tAccounts("mob_1")}: {userDetails.mobile_number1}
                                      <br />
                                      {tAccounts("mob_2")}: {userDetails.mobile_number2}
                                      <br />
                                      {tAccounts("mob_3")}: {userDetails.mobile_number3}
                                      <br />
                                      {tAccounts("license_no")}:{userDetails.license_number}
                                      <br />
                                      {userDetails.license_image && (
                                        <img
                                          src={`http://127.0.0.1:8000${userDetails.license_image}`} // Use the license image URL from userDetails
                                          alt="License"
                                          style={{ width: '200px', height: 'auto', marginTop: '10px' }}
                                        />
                                      )}
                                    </p>
                                  )}
                                  <br />
                                  <p className="mb-6">
                                    {userDetails.street_address}
                                    <br />
                                    <span>{tAccounts('zip_code')}:</span> {userDetails.zipcode}
                                    <br />
                                    {userDetails.country}
                                    <br />
                                  </p>
                                  {/* Action Buttons */}
                                  <div className="mt-4">
                                    {/* Edit Address Button */}
                                    <Link
                                      to="#"
                                      className="btn btn-outline-primary"
                                      data-bs-toggle="modal"
                                      data-bs-target="#addAddressModal"
                                    >
                                      {tAccounts('edit_address')}
                                    </Link>

                                    {/* Delete Button */}
                                    {/* <Link
                                      to="#"
                                      className="text-danger ms-3"
                                      // onClick={() => handleDeleteAddress()}
                                    >
                                      Delete
                                    </Link> */}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="col-12">
                                {/* Display if no address is found */}
                                <p>{tAccounts('no_address_found')}</p>
                              </div>
                            )}

                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Modal */}
          <div
            className="modal fade"
            id="deleteModal"
            tabIndex={-1}
            aria-labelledby="deleteModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              {/* modal content */}
              <div className="modal-content">
                {/* modal header */}
                <div className="modal-header">
                  <h5 className="modal-title" id="deleteModalLabel">
                    Delete address
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  />
                </div>
                {/* modal body */}
                <div className="modal-body">
                  <h6>Are you sure you want to delete this address?</h6>
                  <p className="mb-6">
                    Jitu Chauhan
                    <br />
                    4450 North Avenue Oakland, <br />
                    Nebraska, United States,
                    <br />
                    402-776-1106
                  </p>
                </div>
                {/* modal footer */}
                <div className="modal-footer">
                  {/* btn */}
                  <button
                    type="button"
                    className="btn btn-outline-gray-400"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="button" className="btn btn-danger">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>


          {/* Modal */}
          <div
            className="modal fade"
            id="addAddressModal"
            ref={modalRef}
            tabIndex={-1}
            aria-labelledby="addAddressModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              {/* modal content */}
              <div className="modal-content">
                {/* modal body */}
                <div className="modal-body p-6">
                  <div className="d-flex justify-content-between mb-5">
                    <div>
                      {/* heading */}
                      <h5 className="h6 mb-1" id="addAddressModalLabel">
                        {tModal('new_shipping_address')}
                      </h5>
                      <p className="small mb-0">
                        {tModal('add_new_shipping_address')}
                      </p>
                    </div>
                    <div>
                      {/* button */}
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      />
                    </div>
                  </div>
                  {/* row */}
                  
                  <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    {/* col */}
                    {localStorage.getItem('company_name') && (
                    <div className="col-12">
                      {/* input */}
                      <h6>{tModal('company_name')}</h6>
                      <input
                        type="text"
                        className="form-control"
                        id="company_name"
                        name="company_name"
                        placeholder={tModal('company_name')}
                        aria-label="company Name"
                        value={address.company_name}
                        onChange={handleChange}
                        required
                      />
                      <div className="col-12">
                      {/* input */}
                      <h6>{tModal('whatsapp_number_1')}</h6>
                      <input
                        type="text"
                        id = "mobile_number1"
                        name="mobile_number1"
                        className="form-control"
                        placeholder={tModal('whatsapp_number_1')}
                        value={address.mobile_number1}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12">
                      {/* input */}
                      <h6>{tModal('whatsapp_number_2')}</h6>
                      <input
                        type="text"
                        id = "mobile_number2"
                        name="mobile_number2"
                        className="form-control"
                        placeholder={tModal('whatsapp_number_2')}
                        value={address.mobile_number2}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12">
                      {/* input */}
                      <h6>{tModal('whatsapp_number_3')}</h6>
                      <input
                        type="text"
                        id = "mobile_number3"
                        name="mobile_number3"
                        className="form-control"
                        placeholder={tModal('whatsapp_number_2')}
                        value={address.mobile_number3}
                        onChange={handleChange}
                      />
                    </div>
                    </div> 
                  )}
              
                    {!localStorage.getItem('company_name') && (
                    <div className="col-12">
                      {/* input */}
                      <h6>{tModal('first_name')}</h6>
                      <input
                        type="text"
                        className="form-control"
                        id="first_name"
                        name="first_name"
                        placeholder={tModal('first_name')}
                        aria-label="First name"
                        value={address.first_name}
                        onChange={handleChange}
                        required
                      />
                    </div>)}
                    {/* col */}
                    {!localStorage.getItem('company_name') && (
                    <div className="col-12">
                      {/* input */}
                      <h6>{tModal('last_name')}</h6>
                      <input
                        type="text"
                        className="form-control"
                        id="last_name"
                        name="last_name"
                        placeholder={tModal('last_name')}
                        aria-label="Last name"
                        value={address.last_name}
                        onChange={handleChange}
                        required
                      />
                      </div>
                    )}
                    {/* col */}
                    {/* <div className="col-12">
                      {/* input *
                      <input
                        type="text"
                        className="form-control"
                        id="email"
                        name="email"
                        placeholder="Email"
                        aria-label="Email"
                        value={address.email}
                        onChange={handleChange}
                        required
                      />
                    </div> */}
                    {/* col */}
                    
                    {!localStorage.getItem('company_name') && (
                    <>  
                    <div className="col-12">
                      {/* input */}
                      <h6>{tModal('mobile_number')}</h6>
                      <input
                        type="text"
                        id = "phone_number"
                        name="phone_number"
                        className="form-control"
                        placeholder={tModal('mobile_number')}
                        value={address.phone_number}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12">
                      {/* input */}
                      <h6>{tModal('city')}</h6>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        className="form-control"
                        placeholder={tModal('city')}
                        value={address.city}
                        onChange={handleChange}
                      />
                    </div>
                    </>
                    )}
                    <div className="col-12">
                      {/* input */}
                      <h6>{tModal('street_address')}</h6>
                      <input
                        type="text"
                        id="street_address"
                        name="street_address"
                        className="form-control"
                        placeholder={tModal('street_address')}
                        value={address.street_address}
                        onChange={handleChange}
                      />
                    </div>
                    {/* col */}
                    <div className="col-12">
                    <h6>{tModal('country')}</h6>
                      <select
                        className="form-select"
                        id="country"
                        name="country"
                        value={address.country} // Dynamically controlled by state
                        onChange={handleChange} // Updates the state on change
                      >
                        {/* <option value="UAE">UAE</option>
                        <option value="UK">UK</option>
                        <option value="USA">USA</option> */}
                        <option value="KUWAIT">{tModal('kuwait')}</option>
                      </select>
                    </div>
                    {/* col */}
                    {/* <div className="col-12"> */}
                      {/* form select */}
                      {/* <select
                        className="form-select"
                        aria-label="Default select example"
                      >
                        <option selected>Shuwaik</option>
                        <option value={1}>Northern Ireland</option>
                        <option value={2}> Alaska</option>
                        <option value={3}>Abu Dhabi</option>
                      </select>
                    </div> */}
                    {/* col */}
                    <div className="col-12">
                      {/* input */}
                      <h6>{tModal('zip_code')}</h6>
                      <input
                        type="text"
                        className="form-control"
                        id="zipcode"
                        name="zipcode"
                        placeholder={tModal('zip_code')}
                        value={address.zipcode}
                        onChange={handleChange}
                      />
                    </div>
                    {localStorage.getItem('company_name') && (
                    <div className="col-12">
                      {/* input */}
                      <h6>{tModal('registration_number')}</h6>
                      <input
                        type="text"
                        className="form-control"
                        id="license_number"
                        name="license_number"
                        placeholder={tModal('registration_number')}
                        aria-label="License Number"
                        value={address.license_number}
                        onChange={handleChange}
                        required
                      />
                    </div>)}
                    {localStorage.getItem('company_name') && (
                    <div className="col-12">
                      {/* input */}
                      <span><h6>{tModal('license_registration_image')}</h6></span>
                      <input
                        type="file"
                        className="form-control"
                        id="license_image"
                        name="license_image"
                        placeholder={tModal('license_registration_image')}
                        aria-label="License Image"
                        value={address.license_image}
                        onChange={handleFileChange}
                        required
                      />
                    </div>)}
                    {/* col */}
                    {/* <div className="col-12"> */}
                      {/* input */}
                      {/* <input
                        type="text"
                        className="form-control"
                        placeholder="Business Name"
                      />
                    </div> */}
                    {/* col */}
                    {/* <div className="col-12">
                      {/* form check *
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          defaultValue
                          id="flexCheckDefault"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexCheckDefault"
                        >
                          Set as Default
                        </label>
                      </div>
                    </div> */}
                    {/* col */}
                    <div className="col-12 d-flex justify-content-end gap-3">
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        data-bs-dismiss="modal"
                      >
                        {tModal('cancel')}
                      </button>
                      <button className="btn btn-primary" type="submit">
                        {tModal('save_address')}
                      </button>
                    </div>
                  </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
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
        </div>
      </>
    </div>
  );
};

export default MyAccountAddress;
