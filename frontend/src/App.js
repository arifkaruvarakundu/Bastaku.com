// react 
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';    
//redux
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './redux/store';
// css
import "./App.css";
// browserrouter 
import { BrowserRouter as Router, Route, Routes,Navigate} from "react-router-dom";
// Components
import Header from './Component/Header';
import Footer from "./Component/Footer";
import Language_selector from "./Component/Language_selector";
// pages
import Home from "./pages/Home";
// About pages
import AboutUs from "./pages/About/AboutUs";
import Blog from "./pages/About/Blog";
import BlogCategory from "./pages/About/BlogCategory";
import Contact from "./pages/About/Contact";
// Shop pages
import Shop from "./pages/Shop/Shop";
import ShopGridCol3 from "./pages/Shop/ShopGridCol3";
import ShopListCol from "./pages/Shop/ShopListCol";
import ShopCart from "./pages/Shop/ShopCart";
     
import ShopCheckOut from "./pages/Shop/ShopCheckOut";
import ShopWishList from "./pages/Shop/ShopWishList";
// Store pages
import StoreList from "./pages/store/StoreList";
import SingleShop from "./pages/store/SingleShop";
import NotFoundPage from "./pages/NotFound_page";

// Account pages
import MyAccountOrder from "./pages/Accounts/MyAccountOrder";
import MyAccountSetting from "./pages/Accounts/MyAcconutSetting";
import MyAcconutNotification from "./pages/Accounts/MyAcconutNotification";
import MyAcconutPaymentMethod from "./pages/Accounts/MyAcconutPaymentMethod";
import MyAccountAddress from "./pages/Accounts/MyAccountAddress";
import MyAccountForgetPassword from "./pages/Accounts/MyAccountForgetPassword";
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

const App = () => {

  const getUserRole = () => {
    if (localStorage.getItem('user_name')) {
      return 'user';
    }
    if (localStorage.getItem('company_name')) {
      return 'wholesaler';
    }
    return null;
  };

  // Protected Route Component
const ProtectedRoute = ({ element: Component, roles, ...rest }) => {
  const role = getUserRole();
  
  if (role && roles.includes(role)) {
    return <Component {...rest} />;
  } else if (!role) {
    return <Navigate to="/MyAccountSignIn" />;
  } else {
    return <Navigate to="/" />;
  }
};


  return (
    <div>
      <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <Router>
        <Header/>
        <Routes>
          <Route path="/Grocery-react/" element={<Home />} />
          {/* Shop pages */}
          <Route path="/Shop" element={<Shop />} />
          <Route path="/ShopGridCol3" element={<ShopGridCol3 />} />
          <Route path="/ShopListCol" element={<ShopListCol />} />
          <Route path="/ShopWishList" element={<ShopWishList />} />
          <Route path="/ShopCheckOut" element={<ShopCheckOut />} />
          <Route path="/ShopCart" element={<ShopCart />} />
          {/* Store pages */}
          <Route path="/StoreList" element={<StoreList />} />
          <Route path="/SingleShop" element={<SingleShop />} />
          {/* Accounts pages */}
          <Route path="/MyAccountOrder" element={<MyAccountOrder/>} />
          <Route path="/MyAccountSetting" element={<MyAccountSetting />} />
          <Route path="/MyAcconutNotification" element={<MyAcconutNotification />} />
          <Route path="/MyAcconutPaymentMethod" element={<MyAcconutPaymentMethod />} />
          <Route path="/MyAccountAddress" element={<MyAccountAddress />} />
          <Route path="/MyAccountForgetPassword" element={<MyAccountForgetPassword />} />
          <Route path="/MyAccountSignIn" element={<MyAccountSignIn />} />
          <Route path="/MyAccountSignUp" element={<MyAccountSignUp />} />
          <Route path="/WholesalerAccountSignUp" element={<WholesalerAccountSignUp />} />
          <Route path="/WholesalerAccountSignIn" element={<WholesalerAccountSignIn />} />
          <Route path="/AddProducts" element={<AddProducts/>}/>
          <Route path="/AddedProducts" element={<ProductsList/>}/>
          <Route path="/edit-product/:id" element={<EditProduct />}/>
          <Route path="/productDetails/:id" element={<ProductDetails />}/>
          <Route path="/campaigns/:id" element={<CampaignDetailPage />}/>
          <Route path="/startCampaign" element={<ProtectedRoute element={StartCampaignPage} roles={['user']}/>} />
          <Route path="/Campaigns" element={<Campaigns />}/>
          <Route path="/MyCampaigns" element={<MyAccountCampaigns />}/>
          <Route path="/EditProduct/:id" element={<EditProduct />}/>
          <Route path="/WholesalerCampaigns" element={<WholesalerCampaigns />} />
          <Route path="/ExpenseCalculationPage" element={<ExpenseCal />} />
          {/* About pages */}
          <Route path="/Blog" element={<Blog />} />
          <Route path="/BlogCategory" element={<BlogCategory />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer/>
      </Router>
      </PersistGate>
    </Provider>
    </div>
  );
};

export default App;
