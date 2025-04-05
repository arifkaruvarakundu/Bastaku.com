import React, { useEffect, useState } from "react";
import { Link,useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

const ShopCheckOut = () => {
  // loading
  const [loaderStatus, setLoaderStatus] = useState(true);
  const location = useLocation();
  // const { totalPrice } = location.state || { cartItems: [], totalPrice: 0 };
  const cartItems = useSelector((state) => state.cart.cartItems); 
  const [userDetails, setUserDetails] = useState(null);
  const [address, setAddress] = useState({
      first_name: '',
      last_name: '',
      company_name: '',
      street_address: '',
      city: '',
      zipcode: '',
      country: '',
      phone_number: '',
      license_number: '',
    });

  const navigate = useNavigate();
  const {t} = useTranslation('cart_check')

  console.log('cartItems:', cartItems);

  // Simulate API call to fetch addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const email = localStorage.getItem('email'); 
        const response = await axios.get('http://127.0.0.1:8000/details/', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            email,
          },
        });
  
        setUserDetails(response.data);
        console.log('Fetched user details:', response.data);
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
        console.error('Error fetching user data:', error.response?.data || error.message);
      }
    };
  
    fetchAddresses();
  }, []);

    // Handle input change
    const handleChange = (e) => {
      const { name, value } = e.target;
      setAddress((prevAddress) => ({
        ...prevAddress,
        [name]: value,
      }));
    };

    const calculateSubtotal = () => {
      return cartItems.reduce((acc, item) => {
        return acc + (item.quantity * parseFloat(item.variant.price));
      }, 0).toFixed(2);  // Sum the total and format to 2 decimal places
    };


    const handleSubmit = async (e) => {
      e.preventDefault();
    
      const formData = new FormData();
      
      // For individual, include these fields
      if (!address.first_name || !address.last_name || !address.city) {
        alert('First name, last name, and city are required for an individual.');
        return;
      }
      formData.append('first_name', address.first_name);
      formData.append('last_name', address.last_name);
      formData.append('city', address.city);
    
      // Common fields for both
      formData.append('street_address', address.street_address);
      formData.append('zipcode', address.zipcode);
      formData.append('country', address.country);
      formData.append('phone_number', address.phone_number);
    
      try {
        const email = localStorage.getItem('email');
        const token = localStorage.getItem('access_token');
    
        const response = await axios.patch('http://127.0.0.1:8000/profile/update/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
             email,
            Authorization: `Bearer ${token}`,
          },
        });
    
        // Handle success
        setUserDetails(response.data);
        alert('Profile updated successfully! Refresh to see your new address.');
        navigate('/ShopCheckOut');
      } catch (error) {
        console.error('Error updating profile:', error.response?.data || error.message);
        alert('Failed to update profile. Please check your input and try again.');
      }
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
              <ScrollToTop />
            </>
            <>
              {/* section */}
              <section className="mb-lg-14 mb-8 mt-8">
                <div className="container">
                  {/* row */}
                  <div className="row">
                    {/* col */}
                    <div className="col-12">
                      <div>
                        <div className="mb-8">
                          {/* text */}
                          <h1 className="fw-bold mb-0">{t("checkout")}</h1>
                          {/* <p className="mb-0">
                            Already have an account? Click here to{" "}
                            <Link to="/MyAccountSignIn">Sign in</Link>.
                          </p> */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    {/* row */}
                    <div className="row">
                      <div className="col-lg-7 col-md-12">
                        {/* accordion */}
                        <div
                          className="accordion accordion-flush"
                          id="accordionFlushExample"
                        >
                          {/* accordion item */}
                          <div className="accordion-item py-4">
                            <div className="d-flex justify-content-between align-items-center">
                              {/* heading one */}
                              <Link
                                to="#"
                                className="fs-5 text-inherit collapsed h4"
                                data-bs-toggle="collapse"
                                data-bs-target="#flush-collapseOne"
                                aria-expanded="true"
                                aria-controls="flush-collapseOne"
                              >
                                <i className="feather-icon icon-map-pin me-2 text-muted" />
                                {t("delivery_address")}
                              </Link>
                              {/* btn */}
                              <Link
                                to="#"
                                className="btn btn-outline-primary btn-sm"
                                data-bs-toggle="modal"
                                data-bs-target="#addAddressModal"
                              >
                                {t("change_address")}{" "}
                              </Link>
                              {/* collapse */}
                            </div>
                            <div
                              id="flush-collapseOne"
                              className="accordion-collapse collapse show"
                              data-bs-parent="#accordionFlushExample"
                            >
                              <div className="mt-5">
                                <div className="row">
                                  {/* <div className="col-lg-6 col-12 mb-4"> */}
                                    {/* form */}
                                    {/* <div className="border p-6 rounded-3"> */}
                                      {/* <div className="form-check mb-4">
                                        <input
                                          className="form-check-input"
                                          type="radio"
                                          name="flexRadioDefault"
                                          id="homeRadio"
                                          defaultChecked
                                        />
                                        <label
                                          className="form-check-label text-dark"
                                          htmlFor="homeRadio"
                                        >
                                          Home
                                        </label>
                                      </div> */}
                                      {/* address */}
                                      
                                                                  {/* Check if userDetails is available */}
                                                                  {userDetails ? (
                                                                    <div className="col-lg-5 col-xxl-4 col-12 mb-4">
                                                                      {/* Address Card */}
                                                                      <div className="border p-6 rounded-3">
                                                                        {/* Address Title */}
                                                                        <h5 className="text-dark fw-semi-bold">{t("address")}</h5>
                                      
                                                                        {/* Address Details */}
                                                                        {!localStorage.getItem('company_name') && (
                                                                          <p className="mb-6">
                                                                            {userDetails.first_name} {userDetails.last_name}
                                                                          </p>
                                                                        )}
                                                                        <p className="mb-6">
                                                                          {userDetails.street_address}
                                                                          <br />
                                                                          {userDetails.city}<span>, {t("zip_code")}:</span> {userDetails.zipcode}
                                                                          <br />
                                                                          {userDetails.country}
                                                                          <br />
                                                                          {userDetails.phone_number}
                                                                        </p>
                                                                        {/* Action Buttons */}
                                                                        <div className="mt-4">
                                                                          {/* Edit Address Button */}
                                                                          {/* <Link
                                                                            to="#"
                                                                            className="btn btn-outline-primary"
                                                                            data-bs-toggle="modal"
                                                                            data-bs-target="#addAddressModal"
                                                                          >
                                                                            Edit Address
                                                                          </Link> */}
                                      
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
                                                                      <p>{t("no_address_found")}</p>
                                                                    </div>
                                                                  )}
                                      
                                                                
                                      
                                </div>
                              </div>
                            </div>
                          </div>
                         
                          
                        </div>
                      </div>
                      <div className="col-12 col-md-12 offset-lg-1 col-lg-4">
                        <div className="mt-4 mt-lg-0">
                        
                          <div  className="card shadow-sm">
                            <h5 className="px-6 py-4 bg-transparent mb-0">
                              {t("order_details")}
                            </h5>
                            
                            <ul className="list-group list-group-flush">
                              {/* list group item */}
                              {cartItems.map((item, index) => (
                              <li key={index} className="list-group-item px-4 py-3">
                                <div className="row align-items-center">
                                  <div className="col-2 col-md-2">
                                  <img
                                    src={
                                      item.variant.variant_images && item.variant.variant_images?.length > 0
                                        ? item.variant.variant_images[0].image_url // Cloudinary image URL
                                        : "https://via.placeholder.com/150" // Fallback image if no image exists
                                    }
                                    alt={item.variant.brand}
                                    className="img-fluid"
                                  />
                                  </div>
                                  <div className="col-5 col-md-5">
                                    <h6 className="mb-0">{item.variant.brand}</h6>
                                    <span>
                                      <small className="text-muted">
                                      Quantity:{item.quantity}
                                      </small>
                                    </span>
                                  </div>
                                  <div className="col-2 col-md-2 text-center text-muted">
                                    <span>{item.variant.price}</span>
                                  </div>
                                  <div className="col-3 text-lg-end text-start text-md-end col-md-3">
                                    <span className="fw-bold">{(item.quantity * parseFloat(item.variant.price)).toFixed(2)} {t("currency_kd")}</span>
                                  </div>
                                </div>
                              </li>
                              ))}
                              <li className="list-group-item px-4 py-3">
                                <div className="d-flex align-items-center justify-content-between fw-bold">
                                  <div>{t("total")}</div>
                                  <div>{calculateSubtotal()} {t("currency_kd")}</div>
                                </div>
                                <div>
                                <button
                                  style={{
                                    backgroundColor: '#28a745', // Green background
                                    color: 'white', // White text
                                    padding: '10px 20px', // Padding for the button
                                    borderRadius: '5px', // Rounded corners
                                    border: 'none', // No border
                                    marginTop:25,
                                    marginLeft:255,
                                    cursor: 'pointer', // Pointer on hover
                                    transition: 'background-color 0.3s ease', // Smooth transition for hover
                                  }}
                                  onMouseOver={(e) => {
                                    e.target.style.backgroundColor = '#218838'; // Darker green on hover
                                  }}
                                  onMouseOut={(e) => {
                                    e.target.style.backgroundColor = '#28a745'; // Revert to original green
                                  }}
                                >
                                  {t("place_order")}
                                </button>
                              </div>
                              </li>
                            </ul>
                            
                          </div>
                        
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
            <>
              <div>
          
                  <div
                    className="modal fade"
                    id="addAddressModal"
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
                                New Shipping Address
                              </h5>
                              <p className="small mb-0">
                                Add new shipping address for your order delivery.
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
                              <input
                                type="text"
                                className="form-control"
                                id="company_name"
                                name="company_name"
                                placeholder="Company Name"
                                aria-label="company Name"
                                value={address.company_name}
                                onChange={handleChange}
                                required
                              />
                            </div>)}
                            {!localStorage.getItem('company_name') && (
                            <div className="col-12">
                              {/* input */}
                              <input
                                type="text"
                                className="form-control"
                                id="first_name"
                                name="first_name"
                                placeholder="First name"
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
                              <input
                                type="text"
                                className="form-control"
                                id="last_name"
                                name="last_name"
                                placeholder="Last name"
                                aria-label="Last name"
                                value={address.last_name}
                                onChange={handleChange}
                                required
                              />
                              </div>
                            )}
                            {/* col */}
                            {/* <div className="col-12"> */}
                              {/* input */}
                              {/* <input
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
                            <div className="col-12">
                              {/* input */}
                              <input
                                type="text"
                                id="street_address"
                                name="street_address"
                                className="form-control"
                                placeholder="Street Address"
                                value={address.street_address}
                                onChange={handleChange}
                              />
                            </div>
                            
                            {/* col */}
                            <div className="col-12">
                              {/* input */}
                              <input
                                type="text"
                                id = "phone_number"
                                name="phone_number"
                                className="form-control"
                                placeholder="Phone Number"
                                value={address.phone_number}
                                onChange={handleChange}
                              />
                            </div>
                            {/* col */}
                            <div className="col-12">
                              {/* input */}
                              <input
                                type="text"
                                id="city"
                                name="city"
                                className="form-control"
                                placeholder="City"
                                value={address.city}
                                onChange={handleChange}
                              />
                            </div>
                            {/* col */}
                            <div className="col-12">
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
                                <option value="KUWAIT">KUWAIT</option>
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
                              <input
                                type="text"
                                className="form-control"
                                id="zipcode"
                                name="zipcode"
                                placeholder="Zip Code"
                                value={address.zipcode}
                                onChange={handleChange}
                              />
                            </div>
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
                            <div className="col-12 text-end">
                              <button
                                type="button"
                                className="btn btn-outline-primary"
                                data-bs-dismiss="modal"
                              >
                                Cancel
                              </button>
                              <button className="btn btn-primary" type="submit">
                                Update Address
                              </button>
                            </div>
                          </div>
                          </form>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
            </>
          </>
        )}
      </div>
    </div>
  );
};

export default ShopCheckOut;
