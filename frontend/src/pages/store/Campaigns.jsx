import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";



const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/campaigns/")
      .then((response) => {
        console.log("Campaigns Data:", response.data); // Log response data
        setCampaigns(response.data);
      })
      .catch((error) => console.error("Error fetching campaigns:", error));
  }, []);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  

  // Function to handle clicking on a campaign
  const handleCampaignClick = (campaign) => {
    if (isAuthenticated) {
      const productId = campaign.product.id; // Extract product ID from the campaign
      navigate(`/productDetails/${productId}`);
    } else {
      alert("Please log in to see the campaign details.");
    }
  };

  return (
    <div>
      
      <div className="container my-lg-14 my-8">
        <h3 className="h3style text-center" data-title="Campaigns">
          Active Campaigns
        </h3>
        <div className="wt-separator bg-primarys"></div>
        <div className="row g-4 row-cols-lg-5 row-cols-md-3 row-cols-2">
          {campaigns.map((campaign) => {
            // Calculate the sale price
            const salePrice = (
              campaign.product.actual_price -
              (campaign.product.actual_price * campaign.product.campaign_discount_percentage) / 100
            ).toFixed(2);

            // Calculate progress
            const progress = Math.min(
              (campaign.current_quantity / campaign.product.minimum_order_quantity_for_offer) * 100,
              100
            );

            return (
              <div className="col-lg-3 col-md-4 col-sm-6 fade-zoom" key={campaign.id}>
                <div className="card card-product" onClick={() => handleCampaignClick(campaign)}>
                  <div className="card-body">
                    <div className="text-center position-relative">
                      {campaign.product.is_in_campaign && (
                        <div className="position-absolute top-0 start-0">
                          <span className="badge bg-danger">Campaign</span>
                        </div>
                      )}
                      <a href="#!">
                        <img
                          src={campaign.product.product_images[0].image_url}
                          alt={campaign.product.product_name}
                          className="mb-3 img-fluid"
                        />
                      </a>
                    </div>
                    <div className="text-small mb-1">
                      <a href="#!" className="text-decoration-none text-muted">
                        <small>{campaign.product.category}</small>
                      </a>
                    </div>
                    <h2 className="fs-6">
                      <a href="#!" className="text-inherit text-decoration-none">
                        {campaign.product.product_name}
                      </a>
                    </h2>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div>
                        <span className="text-dark">KD : {campaign.product.actual_price}</span>{" "}
                        <span className="text-decoration-line-through text-muted">
                          KD: {salePrice}
                        </span>
                      </div>
                    </div>
                    {/* Campaign Sale Price */}
                    <div>
                      <span style={{ color: "red" }}>
                        Campaign Price: KD {salePrice}
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="progress mt-3">
                      <div
                        className={`progress-bar ${progress === 100 ? "bg-success" : "bg-info"}`}
                        role="progressbar"
                        style={{ width: `${progress}%` }}
                        aria-valuenow={progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        {progress.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
    </div>
  );
};

export default Campaigns;
