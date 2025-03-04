import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";

const WholesalerCampaigns = () => {
  // loading
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const email = localStorage.getItem("email"); // Get email from local storage
        if (!email) {
          console.error("No email found in local storage");
          return;
        }

        const token = localStorage.getItem("access_token"); // Assuming you store an auth token in localStorage
        if (!token) {
          console.error("No token found in local storage");
          return;
        }

        // Fetch campaigns
        const response = await axios.get("http://127.0.0.1:8000/wholesaler/campaigns/", {
          headers: {
            "Content-Type": "application/json",
            email: email,
           
          },
        });
        console.log("Campaigns fetched successfully:", response.data);
        
        setCampaigns(response.data.campaigns); // Assuming 'campaigns' field exists
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };

    fetchCampaigns();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoaderStatus(false);
    }, 1500);
  }, []);

  return (
    <div>
      <ScrollToTop />
      <section>
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-4 col-12 border-end d-none d-md-block">
              <div className="pt-10 pe-lg-10">
                <ul className="nav flex-column nav-pills nav-pills-dark">
                  <li className="nav-item">
                    <Link className="nav-link" to="/MyAccountOrder">
                      <i className="fas fa-shopping-bag me-2" />
                      Your Orders
                    </Link>
                  </li>
                  
                  <li className="nav-item">
                                        <Link className="nav-link" to="/MyAccountSetting">
                                          <i className="fas fa-cog me-2" />
                                          Settings
                                        </Link>
                                      </li>
                                      {/* nav item */}
                                      <li className="nav-item">
                                        <Link className="nav-link" to="/MyAccountAddress">
                                          <i className="fas fa-map-marker-alt me-2" />
                                          Address
                                        </Link>
                                      </li>
                                      {/* nav item */}
                                      <li className="nav-item">
                                        <Link className="nav-link" to="/MyAcconutPaymentMethod">
                                          <i className="fas fa-credit-card me-2" />
                                          Payment Method
                                        </Link>
                                      </li>
                                      {/* nav item */}
                                      <li className="nav-item">
                                        <Link className="nav-link" to="/MyAcconutNotification">
                                          <i className="fas fa-bell me-2" />
                                          Notification
                                        </Link>
                                      </li>
                                      {localStorage.getItem('company_name') && (
                                                            <li className="nav-item">
                                                              <Link className="nav-link" to="/AddProducts">
                                                                <i className="bi bi-plus-circle" style={{ marginRight: '8px' }}/>
                                                                Add Products
                                                              </Link>
                                                            </li>
                                                          )}
                                                          {localStorage.getItem('company_name') && (
                                                            <>
                                                            <li className="nav-item">
                                                            <Link className="nav-link" to="/AddedProducts">
                                                              <i className="bi bi-card-list " style={{ marginRight: '8px' }}/>
                                                                Added Products
                                                            </Link>
                                                            </li>
                                                            
                                                            </>
                                                            )}
                {/* Add more nav items here */}
                  <li className="nav-item">
                    <Link className="nav-link active" to="/MyCampaigns">
                      <i className="bi bi-collection-fill me-2" />
                      Campaigns
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link " to="/Grocery-react/">
                    <i className="fas fa-sign-out-alt me-2" />
                     Home
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-9 col-md-8 col-12">
              <div>
                {loaderStatus ? (
                  <div className="loader-container">
                    <MagnifyingGlass
                      visible={true}
                      height="100"
                      width="100"
                      ariaLabel="magnifying-glass-loading"
                      glassColor="#c0efff"
                      color="#0aad0a"
                    />
                  </div>
                ) : (
                  <div className="p-6 p-lg-10">
                    <h2 className="mb-6">Your Campaigns</h2>
                    <div className="table-responsive border-0">
                      <table className="table mb-0 text-nowrap">
                        <thead className="table-light">
                          <tr>
                            <th className="border-0">Campaign ID</th>
                            <th className="border-0">Product</th>
                            <th className="border-0">Image</th>
                            <th className="border-0">Start Date</th>
                            <th className="border-0">Progress</th>
                            <th className="border-0">Status</th>
                            
                          </tr>
                        </thead>
                        <tbody>
                          {campaigns.map((campaign) => (
                            <tr key={campaign.campaign_id}>
                              <td className="align-middle border-top-0">
                                {campaign.id}
                              </td>
                              <td className="align-middle border-top-0">
                                {campaign.product_name}
                              </td>
                              <td className="align-middle border-top-0">
                                <img 
                                    src={campaign.product.product_image} 
                                    alt={campaign.product.product_name} 
                                    className="img-fluid" 
                                    style={{ width: "50px", height: "50px", objectFit: "cover" }} 
                                />
                                </td>
                              <td className="align-middle border-top-0">
                                {new Date(campaign.start_time).toLocaleDateString()}
                              </td>
                              <td className="align-middle border-top-0">
                              {((campaign.current_quantity / campaign.product.minimum_order_quantity_for_offer) * 100).toFixed(2)}%
                              </td>
                              <td className="align-middle border-top-0">
                              {campaign.is_active ? ( <span className="badge bg-success">Active</span>) : ( <span className="badge bg-danger">Inactive</span>)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Unlock campaign function
const handleUnlockCampaign = (campaignId) => {
  console.log(`Unlocking campaign: ${campaignId}`);
  // Here, you can trigger a campaign unlock API request
};

export default WholesalerCampaigns;
