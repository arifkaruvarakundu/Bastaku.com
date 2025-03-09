// import i18n from "i18next";
// import { initReactI18next } from "react-i18next";
// import LanguageDetector from "i18next-browser-languagedetector";
// import Backend from "i18next-http-backend";

// i18n
//   .use(LanguageDetector)
//   .use(initReactI18next)
//   .use(Backend)
//   .init({
//     debug: true,
//     fallbackLng: "en",
//     returnObjects: true, 
//     interpolation: {
//       escapeValue: false, // React already escapes by default
//     },
//     // backend: {
//     //   loadPath: "/locales/{{lng}}/Home.json", // Adjust path
//     // },
//   });

// export default i18n;

// src/i18n.js
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next'; // Required for React integration
import homeEN from './locales/en/Home.json'; // Adjust path as needed
import homeAR from './locales/ar/Home.json'; // Adjust path as needed
import headerEN from './locales/en/Header.json';
import headerAR from './locales/ar/Header.json';
import productItemEN from './locales/en/ProductItem.json';
import productItemAR from './locales/ar/ProductItem.json';
import footerEN from './locales/en/Footer.json';
import footerAR from './locales/ar/Footer.json';
import shopEN from './locales/en/Shop.json';
import shopAR from './locales/ar/Shop.json';
import signInEN from './locales/en/SignIn.json';
import signInAR from './locales/ar/SignIn.json';
import wh_signInEN from './locales/en/Wh_signIn.json';
import wh_signInAR from './locales/ar/Wh_signIn.json';
import signUpAR from './locales/ar/SignUp.json';
import signUpEN from './locales/en/SignUp.json';
import cart_checkEN from './locales/en/cart_check.json';
import cart_checkAR from './locales/ar/cart_check.json';
import accounts_commonEN from './locales/en/Accounts_common.json';
import accounts_commonAR from './locales/ar/Accounts_common.json';
import add_added_edit_prodEN from './locales/en/Add_added_edit_prod.json';
import add_added_edit_prodAR from './locales/ar/Add_added_edit_prod.json';
import accounts_othersEN from './locales/en/Accounts_others.json';
import accounts_othersAR from './locales/ar/Accounts_others.json';
import modalEN from './locales/en/modal.json';
import modalAR from './locales/ar/modal.json';
import home_whEN from './locales/en/Home_wh.json';
import home_whAR from './locales/ar/Home_wh.json';
import product_detailsEN from './locales/en/Product_details.json';
import product_detailsAR from './locales/ar/Product_details.json';

i18next
  .use(initReactI18next) // Passing i18n instance to react-i18next
  .init({
    resources: {
      en: {
        home: homeEN,
        header: headerEN,
        productItem: productItemEN,
        footer: footerEN,
        shop: shopEN,
        signIn: signInEN,
        wh_signIn: wh_signInEN,
        signup: signUpEN,
        cart_check: cart_checkEN,
        accounts_common: accounts_commonEN,
        add_added_edit_prod: add_added_edit_prodEN,
        accounts_others: accounts_othersEN,
        modal: modalEN,
        home_wh: home_whEN,
        product_details: product_detailsEN
      },
      ar: {
        home: homeAR,
        header: headerAR,
        productItem: productItemAR,
        footer: footerAR,
        shop: shopAR,
        signIn: signInAR,
        wh_signIn: wh_signInAR,
        signup: signUpAR,
        cart_check: cart_checkAR,
        accounts_common: accounts_commonAR,
        add_added_edit_prod: add_added_edit_prodAR,
        accounts_others: accounts_othersAR,
        modal: modalAR,
        home_wh: home_whAR,
        product_details: product_detailsAR
      },

    },
    lng: 'en', // Default language
    fallbackLng: 'en', // Fallback language
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    ns: ['home', 'header','productItem','footer','shop','signIn','wh_signIn','signup', 'cart_check', 'accounts_common', 'add_added_edit_prod', 'accounts_others','modal','home_wh', 'product_details'], // List of namespaces
    defaultNS: 'home', // Default namespace to use
  });

export default i18next;

