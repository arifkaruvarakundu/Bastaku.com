import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ element: Component, allowedUserTypes, ...rest }) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const location = useLocation();
    const user_type = localStorage.getItem("user_type");
  
    useEffect(() => {
      const toastKey = `toast-shown-${location.pathname}`;
      const alreadyShown = sessionStorage.getItem(toastKey);
  
      if (!isAuthenticated && !user_type && !alreadyShown) {
        if (location.pathname.startsWith('/campaigns/')) {
          toast.error('Sign in to join a campaign');
        } else if (location.pathname === '/startCampaign') {
          toast.error('Sign in to start a campaign');
        } else {
          toast.error('Sign in to access this page!');
        }
        sessionStorage.setItem(toastKey, 'true');
      }
    }, [isAuthenticated, user_type, location.pathname]);
  
    if (!user_type && !isAuthenticated) {
      return <Navigate to="/MyAccountSignIn" replace />;
    }
  
    if (allowedUserTypes.includes(user_type)) {
      return <Component {...rest} />;
    }
  
    return <Navigate to="/" replace />;
  };

export default ProtectedRoute;
