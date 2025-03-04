// actions/userActions.js
export const updateProfile = (profileInfo, profileImage) => {
    return async (dispatch) => {
      const formData = new FormData();
      formData.append('name', profileInfo.name);
      formData.append('tc', profileInfo.tc);
      if (profileImage) formData.append('profile_img', profileImage);
      // make API call to update the profile
      dispatch({ type: 'UPDATE_PROFILE', payload: formData });
    };
  };
  
  // actions/orderCampaignActions.js
  export const getUserOrders = () => {
    return async (dispatch) => {
      // make API call to fetch user orders
      dispatch({ type: 'SET_ORDERS', payload: orders });
    };
  };
  
  export const getUserCampaigns = () => {
    return async (dispatch) => {
      // make API call to fetch user campaigns
      dispatch({ type: 'SET_CAMPAIGNS', payload: campaigns });
    };
  };
  