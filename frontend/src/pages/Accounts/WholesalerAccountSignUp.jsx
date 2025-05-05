import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"; // Import useDispatch
import { setAuthenticated } from "../../redux/authSlice";
import signupimage from "../../images/signup-g.svg";
import { Link } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";
import Swal from "sweetalert2";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import API_BASE_URL from '../../config';

const WholesalerAccountSignUp = () => {
  const [formData, setFormData] = useState({
    company_name: "",
    license_number: "",
    email: "",
    mobile_number1: "",
    password: "",
    confirmPassword: "",
    license_image: null, // To store the license image file
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {t} = useTranslation("signup")

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Dynamically update the field
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files[0], // Store the first selected file
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Password Mismatch",
        text: "Passwords do not match. Please check your input.",
      });
      return;
    }

    // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // At least 8 characters, alphanumeric
    // if (!passwordRegex.test(formData.password)) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Weak Password",
    //     text: "Password must be at least 8 characters long and contain both letters and numbers.",
    //   });
    //   return;
    // }

    const payload = new FormData();
    payload.append("company_name", formData.company_name);
    payload.append("license_number", formData.license_number);
    payload.append("email", formData.email);
    payload.append("mobile_number1", formData.mobile_number1);
    payload.append("password", formData.password);
    payload.append("password2", formData.confirmPassword); // Add `password2` for confirmation
    // if (formData.license_image) {
    //   payload.append("license_image", formData.license_image);
    // }

    axios
      .post(`${API_BASE_URL}/wholesaler/register/`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      })
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: "Your account has been created successfully!",
        });

        const user = { name: formData.company_name };
        localStorage.setItem("company_name", user.name);
        const email = { email: formData.email };
        localStorage.setItem("user_type", response.data.user_type);
        localStorage.setItem("email", email.email);
        localStorage.setItem("access_token", response.data.token.access);
        dispatch(setAuthenticated(user));
        navigate("/Grocery-react");
      })
      .catch((error) => {
        let errorMessage = "Registration failed. Please try again.";
        if (error.response && error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        }
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
        });
      });
  };

  return (
    <div>
      <ScrollToTop />
      {/* section */}
      <section className="my-lg-14 my-8">
        {/* container */}
        <div className="container">
          {/* row */}
          <div className="row justify-content-center align-items-center">
            <div className="col-12 col-md-6 col-lg-4 order-lg-1 order-2">
              {/* img */}
              <img src={signupimage} alt="freshcart" className="img-fluid" />
            </div>
            {/* col */}
            <div className="col-12 col-md-6 offset-lg-1 col-lg-4 order-lg-2 order-1">
              <div className="mb-lg-9 mb-5">
                <h1 className="mb-1 h2 fw-bold">{t("get_start_shopping")}</h1>
                <p>{t("welcome_message")}</p>
              </div>
              {/* form */}
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* Company Name */}
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      id="company_name"
                      name="company_name"
                      placeholder={t("company_name")}
                      value={formData.company_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {/* License Number */}
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      id="license_number"
                      name="license_number"
                      placeholder={t("registration_number")}
                      value={formData.license_number}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    {/* Email */}
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder={t("email_placeholder")}
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    {/* Whatsapp number 1 */}
                    <input
                      type="text"
                      className="form-control"
                      id="mobile_number1"
                      name="mobile_number1"
                      placeholder={t("mobile_number")}
                      value={formData.mobile_number1}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    {/* Password */}
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="password"
                      name="password"
                      placeholder={t("password_placeholder")}
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <span
                      className="position-absolute end-0 top-50 translate-middle-y me-3"
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  <div className="col-12">
                    {/* Confirm Password */}
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-control"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder={t("confirm_password")}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <span
                      className="position-absolute end-0 top-50 translate-middle-y me-3"
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  {/* <div className="col-12">
                    
                    <input
                      type="file"
                      className="form-control"
                      id="license_image"
                      name="license_image"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div> */}
                  {/* Submit Button */}
                  <div className="col-12 d-grid">
                    <button type="submit" className="btn btn-primary">
                      {t("register")}
                    </button>
                    <span className="navbar-text">
                      {t("already_have_account")}{" "}
                      <Link to="/MyAccountSignIn" style={{ color: "green" }}>{t("sign_in")}</Link>
                    </span>
                  </div>
                  {/* Terms and Privacy */}
                  <p>
                    {/* <small>
                      By continuing, you agree to our{" "}
                      <Link to="#!"> Terms of Service</Link> &amp;{" "}
                      <Link to="#!">Privacy Policy</Link>
                    </small> */}
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WholesalerAccountSignUp;
