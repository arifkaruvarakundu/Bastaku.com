import React from "react";
import { useState} from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import axios from 'axios';
import signinimage from '../../images/signin-g.svg'
import { Link } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";
import { useDispatch} from 'react-redux';
import { setAuthenticated } from '../../redux/authSlice';
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash } from "react-icons/fa";
// import Grocerylogo from '../../images/Grocerylogo.png'

const MyAccountSignIn = () => {

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const { t } = useTranslation("signIn");

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
      const response = await axios.post('http://127.0.0.1:8000/login/', formData);
      console.log(response.data)

      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: response.data.msg,
      });

      localStorage.setItem('access_token', response.data.token.access);
      localStorage.setItem('user_name', response.data.first_name);
      localStorage.setItem('email', response.data.email);
      localStorage.setItem('profile_img', response.data.profile_img);
      localStorage.setItem('user_type', response.data.user_type);

      dispatch(setAuthenticated(true));
      navigate("/Grocery-react/")

    } catch (error) {
      const errorMessage =
        error.response?.data?.errors?.non_field_errors?.[0] ||
        'Something went wrong. Please try again.';
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: errorMessage,
      });
    }
  };

  return (
    <div>
      <>
        <div>
          {/* navigation */}
          {/* <div className="border-bottom shadow-sm">
            <nav className="navbar navbar-light py-2">
              <div className="container justify-content-center justify-content-lg-between">
                <Link className="navbar-brand" to="../index.html">
                  <img
                    src={Grocerylogo}
                    alt="freshcart"
                    className="d-inline-block align-text-top"
                  />
                </Link>
                <span className="navbar-text">
                  Already have an account? <Link to="signin.html">Sign in</Link>
                </span>
              </div>
            </nav>
          </div> */}
          {/* section */}
          <>
            <ScrollToTop/>
            </>
          <section className="my-lg-14 my-8">
            <div className="container">
              {/* row */}
              <div className="row justify-content-center align-items-center">
                <div className="col-12 col-md-6 col-lg-4 order-lg-1 order-2">
                  {/* img */}
                  <img
                    src={signinimage}
                    alt="freshcart"
                    className="img-fluid"
                  />
                </div>
                {/* col */}
                <div className="col-12 col-md-6 offset-lg-1 col-lg-4 order-lg-2 order-1">
                  <div className="mb-lg-9 mb-5">
                    <h1 className="mb-1 h2 fw-bold">{t("sign_in_to_freshcart")}</h1>
                    <p>
                    {t("welcome_back_message")}
                    </p>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      {/* row */}
                      <div className="col-12">
                        {/* input */}
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
                      <div className="col-12">
                        {/* input */}
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          id="inputPassword4"
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
                        {/* form check */}
                        {/* <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            defaultValue
                            id="flexCheckDefault"
                          /> */}
                          {/* label */}{" "}
                          {/* <label
                            className="form-check-label"
                            htmlFor="flexCheckDefault"
                          >
                            Remember me
                          </label>
                        </div> */}
                        {/* <div>
                          {" "}
                          Forgot password?{" "}
                          <Link to="/MyAccountForgetPassword">Reset it</Link>
                        </div> */}
                      </div>
                      {/* btn */}
                      <div className="col-12 d-grid">
                        {" "}
                        <button type="submit" className="btn btn-primary">
                        {t("sign_in")}
                        </button>
                      </div>
                      {/* link */}
                      <div>
                      {t("dont_have_account")}{" "}
                        <Link to="/MyAccountSignUp">{t("sign_up")}</Link>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
      </>
    </div>
  );
};

export default MyAccountSignIn;
