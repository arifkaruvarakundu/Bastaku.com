import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {useSelector} from 'react-redux';
import { toast } from 'react-toastify';

const CampaignDetailPage = () => {
  const [variant, setVariant] = useState(null);
  const [progress, setProgress] = useState(0);
  const [campaign, setCampaign] = useState(null);
  const [campaignPrice, setCampaignPrice] = useState(0);
  const [additionalQuantity, setAdditionalQuantity] = useState(0); // User-added quantity
  const [currentQuantity, setCurrentQuantity] = useState(0); // Default current quantity
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [selectedQuantity,setSelectedQuantity] = useState(1)
  const [paymentOption, setPaymentOption] = useState("");
  const [isWholesaler, setIsWholesaler] = useState(false); // State to check if user is wholesaler

  const isAuthenticated = useSelector((state)=> state.auth.isAuthenticated)

  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("campaign_detail");

  useEffect(() => {
    const joinCampaignDetails = JSON.parse(localStorage.getItem("join_campaign_details"));
    const storedQuantity = joinCampaignDetails?.quantity || 0;
    const selectedPaymentOption = joinCampaignDetails?.payment_option || "free";
  
    setSelectedQuantity(storedQuantity);
    setAdditionalQuantity(storedQuantity);
    setPaymentOption(selectedPaymentOption);
  
    // Fetch campaign details
    axios
      .get(`http://127.0.0.1:8000/campaigns/${id}/`)
      .then((response) => {
        const campaignData = response.data;
        console.log("Campaign Data:", campaignData);
        setCampaign(campaignData);
        setVariant(campaignData.variant);
        setCurrentQuantity(campaignData.current_quantity);
  
        let calculatedPrice =
          (campaignData.variant.price *
            (100 - campaignData.variant.campaign_discount_percentage)) /
          100;
  
        if (selectedPaymentOption === "basic") {
          calculatedPrice *= 0.95; // Additional 5% discount
        } else if (selectedPaymentOption === "premium") {
          calculatedPrice *= 0.75; // Additional 25% discount
        }
  
        setCampaignPrice(calculatedPrice);
        const initialProgress =
          ((campaignData.current_quantity + storedQuantity) /
            campaignData.variant.minimum_order_quantity_for_offer) *
          100;
        setProgress(initialProgress);
      })
      .catch((error) => console.error("Error fetching campaign details:", error));
  }, [id]);

  const increaseQuantity = () => {
    const newAdditionalQuantity = additionalQuantity + 1;
    setAdditionalQuantity(newAdditionalQuantity);
  
    const totalQuantity = currentQuantity + newAdditionalQuantity;
    setProgress(
      Math.min((totalQuantity / variant.minimum_order_quantity_for_offer) * 100, 100) // Progress capped at 100%
    );
  };
  
  const decreaseQuantity = () => {
    if (additionalQuantity > 1) {
      const newAdditionalQuantity = additionalQuantity - 1;
      setAdditionalQuantity(newAdditionalQuantity);
  
      const totalQuantity = currentQuantity + newAdditionalQuantity;
      setProgress(
        Math.min((totalQuantity / variant.minimum_order_quantity_for_offer) * 100, 100) // Progress capped at 100%
      );
    }
  };

  useEffect(() => {
    const userType = localStorage.getItem("user_type");
    if (userType === "wholesaler") {
      setIsWholesaler(true);
    }
  }, []);

  const joinCampaign = async () => {
    // if(!isAuthenticated){
    //   toast.error("Please login to join the campaign.");
    //   navigate("/MyAccountSignIn")
    //   return;
    // }
    const token = localStorage.getItem("access_token");
    const data = {
      variant: campaign.variant.id,
      participant_quantity: additionalQuantity,
      payment_option: paymentOption,
      start_time: new Date().toISOString(),
      end_time: new Date(
        new Date().getTime() + 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      payment_option: paymentOption
    };

    setIsLoading(true); // Start loading
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/campaigns/${id}/join/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Successfully joined the campaign!");
        navigate("/Grocery-react/");
      } else {
        alert("Failed to join the campaign.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while joining the campaign.");
    }
    finally {
      setIsLoading(false); // Stop loading
    }
  };

  if (!campaign) {
    return (
      <div style={{ textAlign: "center", margin: "50px" }}>{t("noCampaignsNow")}</div>
    );
  }

  // const salePrice = (
  //   campaign.product.actual_price -
  //   (campaign.product.actual_price * campaign.product.campaign_discount_percentage) / 100
  // ).toFixed(2);

  const totalAmount = (campaignPrice * additionalQuantity).toFixed(2);

  localStorage.setItem("total_amount",totalAmount);
  const totalQuantity = currentQuantity + additionalQuantity;

  return (
    <div>
      <div
        style={{
          maxWidth: "1200px",
          margin: "40px auto",
          padding: "20px",
          backgroundColor: "#F0FFF4",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {/* Product Image */}
          <div style={{ flex: "1 1 40%" }}>
            <img
              src={campaign.variant.variant_images[0].image_url}
              alt={campaign.variant.brand}
              style={{
                width: "100%",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                objectFit: "cover",
              }}
            />
          </div>

          {/* Product Information */}
          <div
            style={{
              flex: "1 1 50%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
            }}
          >
            <h1
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: "#065F46",
                marginBottom: "20px",
              }}
            >
              {campaign.title}
            </h1>
            <p style={{ color: "#444", marginBottom: "20px" }}>
              {campaign.description}
            </p>
            <div style={{ marginBottom: "20px" }}>
              <p style={{ fontSize: "20px", fontWeight: "600", color: "#444" }}>
                Price:{" "}
                <span style={{ color: "#064E3B" }}>
                  {campaign.variant.price} KD
                </span>
              </p>
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#059669",
                }}
              >
                {t("yourPrice")} {campaignPrice.toFixed(2)} KD
                <p
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#059669",
                }}
              >
                {t("minOrderQty")} {campaign.variant.minimum_order_quantity_for_offer}
              </p>
              </p>
            </div>
            {/* Quantity Selector */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  color: "#065F46",
                  marginBottom: "10px",
                }}
              >
              {t("quantityKg")}
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <button
                  onClick={decreaseQuantity}
                  style={{
                    backgroundColor: "#D1FAE5",
                    color: "#065F46",
                    padding: "10px 20px",
                    borderRadius: "50%",
                    border: "none",
                    cursor: additionalQuantity === 0 ? "not-allowed" : "pointer",
                  }}
                  disabled={additionalQuantity === 0}
                >
                  -
                </button>
                <input
                  type="number"
                  value={additionalQuantity}
                  readOnly
                  style={{
                    width: "50px",
                    textAlign: "center",
                    border: "1px solid #D1D5DB",
                    borderRadius: "5px",
                  }}
                />
                <button
                  onClick={increaseQuantity}
                  style={{
                    backgroundColor: "#D1FAE5",
                    color: "#065F46",
                    padding: "10px 20px",
                    borderRadius: "50%",
                    border: "none",
                    cursor:"pointer"
                      
                  }}
                >
                  +
                </button>
              </div>
            </div>
            <div style={{ marginTop: "20px", fontSize: "16px", fontWeight: "600", color: "#065F46" }}>
              <label>{t("totalAmount")} </label>
              <span style={{ color: "#059669" }}>{totalAmount} KD</span>
            </div>
            {isLoading && (
              <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 10000,
              }}>
                <div style={{
                  width: "50px",
                  height: "50px",
                  border: "6px solid #f3f3f3",
                  borderTop: "6px solid #0aad0a",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}></div>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {campaign.has_joined ? (
                <button
                  style={{
                    backgroundColor: "#D1D5DB",
                    color: "#444",
                    padding: "15px 20px",
                    borderRadius: "10px",
                    border: "none",
                    fontSize: "16px",
                    cursor: "not-allowed",
                  }}
                  disabled
                >
                  {t("alreadyJoined")}
                </button>
              ) : (
                <button
                  onClick={joinCampaign}
                  style={{
                    backgroundColor: isLoading || isWholesaler ? "#e5e7eb" : "#0aad0a", // lighter when disabled
                    width: "200px",
                    color: isLoading ? "#888" : "white",
                    padding: "10px 15px",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "14px",
                    cursor: isLoading ? "not-allowed" : "pointer",
                  }}
                  disabled={isLoading || isWholesaler}
                  onMouseOver={(e) =>
                    !isLoading && !isWholesaler && (e.target.style.backgroundColor = "#088a08")
                  }
                  onMouseOut={(e) =>
                    !isLoading && !isWholesaler && (e.target.style.backgroundColor = "#0aad0a")
                  }
                >
                  {isLoading
                    ? "Joining..."
                    : paymentOption === "free"
                    ? "Join for Free"
                    : paymentOption === "basic"
                    ? "Pay 10% Advance"
                    : "Pay Full Amount"}
                </button>
              )}
            </div>

            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>

          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <label style={{marginTop: "30px"}}>{t("progress")}</label>
          <div
            style={{
              height: "15px",
              backgroundColor: "#E5E7EB",
              borderRadius: "5px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${Math.min(progress, 100)}%`, // Ensure progress doesn't exceed 100%
                backgroundColor:
                  progress >= 100
                    ? "#10B981"
                    : progress >= 80
                    ? "#F59E0B"
                    : "#3B82F6",
                height: "100%",
              }}
            />
          </div>
          <p style={{ textAlign: "center", marginTop: "5px" }}>
            {progress >= 100
              ? "Target Achieved!"
              : `${(
                  variant.minimum_order_quantity_for_offer - totalQuantity
                ).toFixed(2)} Kg more to unlock!`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailPage;
