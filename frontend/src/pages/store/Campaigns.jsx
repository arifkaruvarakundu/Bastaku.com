import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import API_BASE_URL from '../../config';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/campaigns/`)
      .then((response) => {
        console.log("Campaigns Data:", response.data); // Log response data
        // Filter out campaigns with 0 participants and 0 quantity
        // const filteredCampaigns = response.data.filter((campaign) =>
        //   !(campaign.has_ended) && !(campaign.current_quantity===0|| campaign.current_participants===0));
        setCampaigns(response.data);
      })
      .catch((error) => console.error("Error fetching campaigns:", error));
  }, []);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  
  const handleCampaignClick = (campaign) => {
    console.log("Campaign Clicked:", campaign);
    const productId = campaign.product_id; // Extract product ID from the campaign
    console.log("productId", productId); // Log product ID
    const variantId = campaign.variant.id; // Extract variant ID from the campaign
    console.log("variantId", variantId); // Log variant ID
     // Pass variantId in the URL as a query parameter
    navigate(`/productDetails/${productId}?variantId=${variantId}`);
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
              campaign.variant.price -
              (campaign.variant.price * campaign.variant.campaign_discount_admin) / 100
            ).toFixed(2);

            // Calculate progress
            const progress = Math.min(
              (campaign.current_quantity / campaign.variant.minimum_order_quantity_for_offer_by_admin) * 100,
              100
            );

            return (
              <div className="col-lg-3 col-md-4 col-sm-6 fade-zoom" key={campaign.id}>
                <div className="card card-product" onClick={() => handleCampaignClick(campaign)}>
                  <div className="card-body">
                    <div className="text-center position-relative">
                      {campaign.variant.is_in_campaign && (
                        <div className="position-absolute top-0 start-0">
                          <span className="badge bg-danger">Campaign</span>
                        </div>
                      )}
                      <a href="#!">
                        <img
                          src={campaign.variant.variant_images[0].image_url}
                          alt={campaign.variant.brand}
                          className="mb-3 img-fluid"
                        />
                      </a>
                    </div>
                    <div className="text-small mb-1">
                      <a href="#!" className="text-decoration-none text-muted">
                        <small>{campaign.title}</small>
                      </a>
                    </div>
                    {campaign.variant.weight && (
                    <div className="text-small mb-1">
                      <a href="#!" className="text-decoration-none text-muted">
                        <small>{campaign.variant.weight} Kg</small>
                      </a>
                    </div>
                    )}
                    {campaign.variant.liter && (
                    <div className="text-small mb-1">
                      <a href="#!" className="text-decoration-none text-muted">
                        <small>{campaign.variant.liter} L</small>
                      </a>
                    </div>
                    )}
                    <h2 className="fs-6">
                      <a href="#!" className="text-inherit text-decoration-none">
                        {campaign.current_quantity} of {campaign.variant.minimum_order_quantity_for_offer_by_admin}{" "}
                      </a>
                    </h2>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div>
                        <span className="text-dark">KD : {campaign.variant.price}</span>{" "}
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
