import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import signinimage from '../../images/signin-g.svg'
import { Link } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";
import { useDispatch } from "react-redux";
import { setAuthenticated } from "../../redux/authSlice";
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API_BASE_URL from '../../config';

const WholesalerAccountSignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation("wh_signIn");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_BASE_URL}/wholesaler/login/`, // Use the wholesaler login endpoint
        formData
      );
      console.log(response.data);

      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: response.data.msg,
      });

      // Storing wholesaler-specific data in localStorage
      localStorage.setItem("access_token", response.data.token.access);
      localStorage.setItem("company_name", response.data.company_name);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("profile_img", response.data.profile_img);
      localStorage.setItem("user_type", response.data.user_type);

      dispatch(setAuthenticated(true));
      navigate("/Grocery-react/"); // Redirect to wholesaler dashboard

    } catch (error) {
      const errorMessage =
        error.response?.data?.errors?.non_field_errors?.[0] ||
        "Something went wrong. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: errorMessage,
      });
    }
  };

  return (
    <div>
      <ScrollToTop />
      {/* Section */}
      <section className="my-lg-14 my-8">
        <div className="container">
          {/* Row */}
          <div className="row justify-content-center align-items-center">
            <div className="col-12 col-md-6 col-lg-4 order-lg-1 order-2">
              {/* Image */}
              <img
                src={signinimage}
                alt="Wholesaler Sign In"
                className="img-fluid"
              />
            </div>
            {/* Form Section */}
            <div className="col-12 col-md-6 offset-lg-1 col-lg-4 order-lg-2 order-1">
              <div className="mb-lg-9 mb-5">
                <h1 className="mb-1 h2 fw-bold">{t("wholesaler_sign_in")}</h1>
                <p>{t("welcome_back_message")}</p>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* Email */}
                  <div className="col-12">
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t("email_placeholder")}
                      required
                    />
                  </div>
                  {/* Password */}
                  <div className="col-12">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="inputPassword"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder={t("password_placeholder")}
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
                  <div className="d-flex justify-content-between">
                    {/* Forgot password link */}
                    {/* <div>
                      Forgot password? <Link to="/WholesalerAccountForgetPassword">Reset it</Link>
                    </div> */}
                  </div>
                  {/* Submit Button */}
                  <div className="col-12 d-grid">
                    <button type="submit" className="btn btn-primary">
                    {t("sign_in")}
                    </button>
                  </div>
                  {/* Sign up link */}
                  <div>
                  {t("dont_have_account")}{" "}
                    <Link to="/WholesalerAccountSignUp">{t("sign_up")}</Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WholesalerAccountSignIn;
