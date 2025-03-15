import React, { useEffect, useState,useCallback } from "react";
import { Link} from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
import { useDropzone } from 'react-dropzone';
import ScrollToTop from "../ScrollToTop";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { useTranslation } from "react-i18next";
import AddProductButton from "../../Component/AddProductButton";

const AddProducts = () => {
  const { t: tCommon, i18n } = useTranslation('accounts_common');
  const { t: tProduct} = useTranslation('add_added_edit_prod');
  // loading
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [image, setImage] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const [productData, setProductData] = useState({
    product_name: "",
    product_name_en:"",
    product_name_ar:"",
    description: "",
    description_en: "",
    description_ar: "",
    actualPrice: "",
    stock: "",
    category: "", // Updated to category (dropdown field)
    campaignDiscountPercentage: "",
    minimumOrderQuantityForOffer: "", // New field added here
    unit: ""
  });

  const [categories, setCategories] = useState([]); // To store product categories

  // Update currentLang when the language is changed
  useEffect(() => {
    setCurrentLang(i18n.language);
  }, [i18n.language]);

 

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/productcategories/');
        setCategories(response.data); // Assuming the response data is an array of categories
      } catch (err) {
        console.error("Error fetching categories", err);
        setError("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  
  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prevFiles) => [
      ...prevFiles,  // Keep the existing files
      ...acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      ),
    ]);
  }, []);
  

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: true,  // Allow multiple files
  });

  // Handle form field changes with validation for price, stock, and minimum order quantity
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent negative values for price, stock, and minimum order quantity
    if ((name === "actualPrice" || name === "stock" || name === "minimumOrderQuantityForOffer") && Number(value) < 0) {
      return;
    }

    // Update state with the new value
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
  
    const formData = new FormData();
    formData.append("product_name", productData.product_name);
    formData.append("product_name_en", productData.product_name_en);
    formData.append("product_name_ar", productData.product_name_ar);
    formData.append("description", productData.description);
    formData.append("description_en", productData.description_en);
    formData.append("description_ar", productData.description_ar);
    formData.append("actual_price", productData.actualPrice);
    formData.append("stock", productData.stock);
    formData.append("category", productData.category);
    formData.append("campaign_discount_percentage", productData.campaignDiscountPercentage);
    formData.append("minimum_order_quantity_for_offer", productData.minimumOrderQuantityForOffer);
    formData.append("unit", productData.unit);

  
    const wholesalerEmail = localStorage.getItem("email");
    if (wholesalerEmail) {
      formData.append("wholesaler", wholesalerEmail);
    }
  
    files.forEach((file, index) => {
      formData.append(`product_images[${index}]`, file);
    });
  
    try {
      const response = await axios.post("http://127.0.0.1:8000/add_product/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      alert("Product Added Successfully!");
      setSuccess(true);
      setProductData({
        product_name: "",
        product_name_en: "",
        product_name_ar: "",
        description: "",
        description_en: "",
        description_ar: "",
        actualPrice: "",
        stock: "",
        category: "",
        campaignDiscountPercentage: "",
        minimumOrderQuantityForOffer: "",
        unit: ""
      });
      setImage(null);
      
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add product");
    } finally {
      setLoading(false);
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
                    {/* nav item */}
                    <ul className="nav flex-column nav-pills nav-pills-dark">
                      <li className="nav-item">
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
                        <Link
                          className="nav-link"
                          to="/MyAccountSetting"
                        >
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
                          {tCommon("payment_method")}
                        </Link>
                      </li>
                      {/* nav item */}
                      <li className="nav-item">
                        <Link className="nav-link" to="/MyAcconutNotification">
                          <i className="fas fa-bell me-2" />
                          {tCommon("notification")}
                        </Link>
                      </li>
                      {/* nav item */}
                      {localStorage.getItem('company_name') && (
                        <ul className="nav flex-column nav-pills nav-pills-dark">
                          <li className="nav-item">
                            <Link className="nav-link active" to="/AddProducts">
                              <i className="bi bi-plus-circle" style={{ marginRight: '8px' }}/>
                                {tCommon("add_products")}
                            </Link>
                          </li>                                                 
                          <li className="nav-item">
                              <Link className="nav-link" to="/AddedProducts">
                                <i className="bi bi-card-list " style={{ marginRight: '8px' }}/>
                                {tCommon("added_products")}
                              </Link>
                          </li>
                          {/* nav item */}
                                                                  
                        <li className="nav-item">
                          <Link className="nav-link" to="/WholesalerCampaigns">
                        <i className="bi bi-collection-fill" style={{ marginRight: '8px' }}/>
                          {tCommon("campaigns")}
                        </Link>
                          </li> 
                        </ul>
                      )}
                      {localStorage.getItem('user_name') && (
                      <li className="nav-item">
                          <Link className="nav-link" to="/WholesalerCampaigns">
                        <i className="bi bi-collection-fill" style={{ marginRight: '8px' }}/>
                        {tCommon("campaigns")}
                        </Link>
                          </li>   
                        )}                                               
                      {/* nav item */}
                      <li className="nav-item">
                        <Link className="nav-link " to="/Grocery-react/">
                          <i className="fas fa-sign-out-alt me-2" />
                          {tCommon("home")}
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
                          <div className="mb-6">
                            {/* heading */}
                            <h2 className="mb-0">{tProduct('add_your_products')}</h2>
                          </div>
                          <div>
                            {/* heading */}
                            {/* <h5 className="mb-4">Add Products</h5> */}
                            <div className="row">
                              <div className="col-lg-5">
                                {/* form */}
                                <form onSubmit={handleSubmit}>
                                  {/* input */}
                                  <div className="mb-3">
                                    <label className="form-label">{tProduct("product_name")}</label>
                                    <input
                                      type="text"
                                      name={currentLang === "en" ? "product_name_en" : "product_name_ar"}
                                      value={currentLang === "en" ? productData.product_name_en : productData.product_name_ar}
                                      onChange={handleChange}
                                      required
                                      className="form-control"
                                      placeholder={tProduct("product_name")}
                                    />
                                  </div>
                                  {/* input */}
                                  <div className="mb-3">
                                    <label className="form-label">{tProduct('description')}</label>
                                    <textarea
                                      name={currentLang === "en" ? "description_en" : "description_ar"}
                                      value={currentLang === "en" ? productData.description_en : productData.description_ar}
                                      onChange={handleChange}
                                      className="form-control"
                                      placeholder={tProduct('description')}
                                    />
                                  </div>
                                  {/* input */}
                                  <div className="mb-5">
                                    <label className="form-label">{tProduct('price')}</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder={tProduct('price')}
                                      name="actualPrice"
                                      value={productData.actualPrice}
                                      onChange={handleChange}
                                    />
                                  </div>
                                  {/* input */}
                                  <div className="mb-5">
                                    <label className="form-label">{tProduct("campaign_discount_percentage")}</label>
                                    <input
                                      type="number"
                                      className="form-control"
                                      name="campaignDiscountPercentage"
                                      value={productData.campaignDiscountPercentage}
                                      onChange={handleChange}
                                      min="0"
                                      max="100"
                                      placeholder={tProduct('enter_discount_percentage')}
                                    />
                                  </div>
                                  {/* input */}
                                  <div className="mb-5">
                                    <label className="form-label">{tProduct("minimum_order_quantity_for_offer")}</label>
                                    <input
                                      type="number"
                                      className="form-control"
                                      name="minimumOrderQuantityForOffer" // Input field name matches the state key
                                      value={productData.minimumOrderQuantityForOffer}
                                      onChange={handleChange}
                                      placeholder={tProduct('enter_minimum_quantity_for_offer')}
                                      required
                                    />
                                  </div>
                                  {/* input */}
                                  <div className="mb-5">
                                    <label className="form-label">{tProduct("stock")}</label>
                                    <input
                                      type="number"
                                      className="form-control"
                                      name="stock"
                                      value={productData.stock}
                                      placeholder={tProduct("stock")}
                                      onChange={handleChange}
                                      required
                                    />
                                  </div>
                                  <div className="mb-5">
                                    <label className="form-label">{tProduct("unit")}</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      name="unit"
                                      value={productData.unit}
                                      placeholder={tProduct("unit")}
                                      onChange={handleChange}
                                      required
                                    />
                                    <small className="text-muted">
                                      {tProduct("unitDescription")}
                                    </small>
                                  </div>
                                  {/* input */}
                                  <div className="mb-5">
                                    <label className="form-label">{tProduct('product_category')}</label>
                                    <select
                                      id="product_category"
                                      className="form-control"
                                      name="category"
                                      value={productData.category}
                                      onChange={handleChange}
                                      required
                                    >
                                      <option value="">{tProduct("select_category")}</option>
                                      {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                          {category.name}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  {/* input */}
                                  <div
                                    {...getRootProps()}
                                    style={{
                                      border: '2px dashed #aaa',
                                      padding: '20px',
                                      textAlign: 'center',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    <input {...getInputProps()} multiple/>
                                    {isDragActive ? (
                                      <p>{tProduct('drop_images_here')}</p>
                                    ) : (
                                      <p>{tProduct('drag_drop_images')}</p>
                                    )}

                                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                                      {files.map((file) => (
                                        <img
                                          key={file.name}
                                          src={file.preview}
                                          alt={file.name}
                                          style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                  {/* button */}
                                  <div className="mb-3 mt-4">
                                  {/* <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? (
                                      <ClipLoader color="#fff" loading={loading} size={20} />
                                    ) : (
                                      tProduct("add_product")
                                    )}
                                  </button> */}
                                  <AddProductButton
                                    loading={false}
                                    addProduct={handleSubmit}
                                    productData={productData}
                                    handleChange={handleChange}
                                    setProductData={setProductData}
                                  />

                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
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
                {tCommon("my_account")}
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
                    {tCommon('your_orders')}
                  </a>
                </li>
                {/* nav item */}
                <li className="nav-item">
                  <a className="nav-link " href="/MyAccountSetting">
                    <i className="fas fa-cog me-2" />
                    {tCommon('settings')}
                  </a>
                </li>
                {/* nav item */}
                <li className="nav-item">
                  <a className="nav-link" href="/MyAccountAddress">
                    <i className="fas fa-map-marker-alt me-2" />
                    {tCommon('address')}
                  </a>
                </li>
                {/* nav item */}
                <li className="nav-item">
                  <a className="nav-link" href="/MyAcconutPaymentMethod">
                    <i className="fas fa-credit-card me-2" />
                    {tCommon('payment_method')}
                  </a>
                </li>
                {/* nav item */}
                <li className="nav-item">
                  <a className="nav-link" href="/MyAcconutNotification">
                    <i className="fas fa-bell me-2" />
                    {tCommon('notification')}
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
                      {tCommon('home')}
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

export default AddProducts;
