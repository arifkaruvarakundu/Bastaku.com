// react 
import React,{useState, useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';    
//redux
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './redux/store';
// css
import "./App.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// browserrouter 
import { BrowserRouter as Router, Route, Routes,Navigate} from "react-router-dom";
// Components
import Header from './Component/Header';
import Footer from "./Component/Footer";
// import Language_selector from "./Component/Language_selector";
// pages
import Home from "./pages/Home";
// About pages
import AboutUs from "./pages/About/AboutUs";
// import Blog from "./pages/About/Blog";
// import BlogCategory from "./pages/About/BlogCategory";
// import Contact from "./pages/About/Contact";
// Shop pages
import Shop from "./pages/Shop/Shop";
// import ShopGridCol3 from "./pages/Shop/ShopGridCol3";
// import ShopListCol from "./pages/Shop/ShopListCol";
import ShopCart from "./pages/Shop/ShopCart";
import ShopCheckOut from "./pages/Shop/ShopCheckOut";
// import ShopWishList from "./pages/Shop/ShopWishList";
// Store pages
// import StoreList from "./pages/store/StoreList";
// import SingleShop from "./pages/store/SingleShop";
import NotFoundPage from "./pages/NotFound_page";
// Account pages
import MyAccountOrder from "./pages/Accounts/MyAccountOrder";
import MyAccountSetting from "./pages/Accounts/MyAcconutSetting";
import MyAcconutNotification from "./pages/Accounts/MyAcconutNotification";
import MyAcconutPaymentMethod from "./pages/Accounts/MyAcconutPaymentMethod";
import MyAccountAddress from "./pages/Accounts/MyAccountAddress";
// import MyAccountForgetPassword from "./pages/Accounts/MyAccountForgetPassword";
import MyAccountSignIn from "./pages/Accounts/MyAccountSignIn";
import MyAccountSignUp from "./pages/Accounts/MyAccountSignUp";
import WholesalerAccountSignUp from "./pages/Accounts/WholesalerAccountSignUp";
import WholesalerAccountSignIn from "./pages/Accounts/wholesalerAccountSignIn";
import AddProducts from "./pages/Accounts/AddProducts";
import ProductsList from "./pages/Accounts/AddedProducts";
import EditProduct from "./pages/Accounts/EditProducts";
import ProductDetails from "./pages/ProductDetails";
import CampaignDetailPage from "./pages/store/CampaignDetails";
import StartCampaignPage from "./pages/store/StartCampaign";
import Campaigns from "./pages/store/Campaigns";
import MyAccountCampaigns from "./pages/Accounts/UserCampaignsList";
import WholesalerCampaigns from "./pages/Accounts/WholesalerCampaignsList";
import ExpenseCal from "./pages/Expense_cal";
import ScrollToTop from "./Component/scroll_to_top";
import { toast } from 'react-toastify';
import ProtectedRoute from "./Component/ProtectedRoute";

const App = () => {

  // const getUserType = () => {
  //   return localStorage.getItem("user_type") || null;
  // };
  
  // // Protected Route Component
  // const ProtectedRoute = ({ element: Component, allowedUserTypes, ...rest }) => {
    
  //   const user_type = getUserType();
  
  //   if (!user_type) {
  //     toast.error("Please login to access this page.");
  //     return <Navigate to="/MyAccountSignIn" />; // Redirect if not logged in
  //   }
  
  //   if (allowedUserTypes.includes(user_type)) {
  //     return <Component {...rest} />; // Render component if user type is allowed
  //   }
  
  //   return <Navigate to="/" />; // Redirect unauthorized users to home
  // };


  return (
    <div>
      <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <Router>
        <ScrollToTop />
        <Header/>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Shop pages */}
          <Route path="/Shop" element={<Shop />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          {/* <Route path="/ShopGridCol3" element={<ShopGridCol3 />} /> */}
          {/* <Route path="/ShopListCol" element={<ShopListCol />} /> */}
          {/* <Route path="/ShopWishList" element={<ShopWishList />} /> */}
          <Route path="/ShopCheckOut" element={<ProtectedRoute element={ShopCheckOut} allowedUserTypes={["customer"]} />} />
          <Route path="/ShopCart" element={<ShopCart />} />
          {/* Store pages */}
          {/* <Route path="/StoreList" element={<StoreList />} /> */}
          {/* <Route path="/SingleShop" element={<SingleShop />} /> */}
          {/* Accounts pages */}
          <Route path="/MyAccountOrder" element={<ProtectedRoute element={MyAccountOrder} allowedUserTypes={["customer", "wholesaler"]} />} />
          <Route path="/MyAccountSetting" element={<ProtectedRoute element={MyAccountSetting} allowedUserTypes={["customer", "wholesaler"]}  />} />
          <Route path="/MyAcconutNotification" element={<ProtectedRoute element={MyAcconutNotification}  allowedUserTypes={["customer", "wholesaler"]} />} />
          <Route path="/MyAcconutPaymentMethod" element={<ProtectedRoute element={MyAcconutPaymentMethod} allowedUserTypes={["customer", "wholesaler"]}  />} />
          <Route path="/MyAccountAddress" element={<ProtectedRoute element={MyAccountAddress} allowedUserTypes={["customer", "wholesaler"]} />} />
          {/* <Route path="/MyAccountForgetPassword" element={<MyAccountForgetPassword />} /> */}
          <Route path="/MyAccountSignIn" element={<MyAccountSignIn />} />
          <Route path="/MyAccountSignUp" element={<MyAccountSignUp />} />
          <Route path="/WholesalerAccountSignUp" element={<WholesalerAccountSignUp />} />
          <Route path="/WholesalerAccountSignIn" element={<WholesalerAccountSignIn />} />
          <Route path="/AddProducts" element={<ProtectedRoute element={AddProducts} allowedUserTypes={['wholesaler']}/>}/>
          <Route path="/AddedProducts" element={<ProtectedRoute element={ProductsList} allowedUserTypes={['wholesaler']}/>}/>
          <Route path="/edit-product/:id" element={<ProtectedRoute element={EditProduct} allowedUserTypes={['wholesaler']} />}/>
          <Route path="/productDetails/:id" element={<ProductDetails />}/>
          <Route path="/campaigns/:id" element={<ProtectedRoute element={CampaignDetailPage} allowedUserTypes={['customer']}/>}/>
          <Route path="/startCampaign" element={<ProtectedRoute element={StartCampaignPage} allowedUserTypes={['customer']}/>} />
          <Route path="/Campaigns" element={<Campaigns />}/>
          <Route path="/MyCampaigns" element={<ProtectedRoute element={MyAccountCampaigns} allowedUserTypes={['customer']} />}/>
          {/* <Route path="/EditProduct/:id" element={<EditProduct />}/> */}
          <Route path="/WholesalerCampaigns" element={<ProtectedRoute element={WholesalerCampaigns} allowedUserTypes={['wholesaler']} />} />
          <Route path="/ExpenseCalculationPage" element={<ProtectedRoute element={ExpenseCal} allowedUserTypes={['customer']} />} />
          {/* About pages */}
          {/* <Route path="/Blog" element={<Blog />} /> */}
          {/* <Route path="/BlogCategory" element={<BlogCategory />} /> */}
          {/* <Route path="/Contact" element={<Contact />} /> */}
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer/>
          <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      </Router>
      </PersistGate>
    </Provider>
    </div>
  );
};

export default App;
