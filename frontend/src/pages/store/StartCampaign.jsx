import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StartCampaignPage = () => {
  const [variant, setVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [campaignPrice, setCampaignPrice] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [paymentOption, setPaymentOption] = useState("");

  const navigate = useNavigate();

  const productDetails = JSON.parse(localStorage.getItem("productDetails"));
  const product_name = productDetails?.product_name || "Product Name";

  // Fetch product details from localStorage
  useEffect(() => {
    // const storedProduct = JSON.parse(localStorage.getItem("productDetails"));
    const start_campaign_details = JSON.parse(localStorage.getItem("start_campaign_details"));
    
    if (start_campaign_details) {
      const storedQuantity = start_campaign_details.quantity;
      const paymentOption = start_campaign_details.payment_option;
      console.log(paymentOption)
      setPaymentOption(paymentOption)
  
      // Base price after discount
      let calculatedPrice =
        (start_campaign_details.variant.price * (100 - start_campaign_details.variant.campaign_discount_percentage)) / 100;
  
      // Apply additional discount based on payment option
      if (paymentOption === "basic") {
        calculatedPrice *= 0.95; // 5% extra discount
      } else if (paymentOption === "premium") {
        calculatedPrice *= 0.75; // 25% extra discount
      }
  
      setVariant(start_campaign_details.variant);
      setCampaignPrice(calculatedPrice);
      setQuantity(storedQuantity);
      setProgress((storedQuantity / start_campaign_details.minimum_order_quantity_for_offer) * 100);

    } else {
      console.error("No product details or campaign details found in localStorage.");
    }
  }, []);

  const increaseQuantity = () => {
    if (quantity < variant.stock) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      localStorage.setItem("productQuantity", newQuantity);
      setProgress((newQuantity / variant.minimum_order_quantity_for_offer) * 100);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      localStorage.setItem("productQuantity", newQuantity);
      setProgress((newQuantity / variant.minimum_order_quantity_for_offer) * 100);
    }
  };

  const handleStartCampaign = async () => {
    const data = {
      variant: variant.id,
      title: `${variant.brand} ${product_name}`,
      // description: product.description,
      discounted_price: campaignPrice,
      
      payment_option: paymentOption,
      quantity,
      start_time: new Date().toISOString(),
      end_time: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    setIsLoading(true); // Start loading

    try {
      const token = localStorage.getItem("access_token");
      
      const response = await axios.post("http://127.0.0.1:8000/start_campaign/", data, 
        { 
          headers: { 
            Authorization: `Bearer ${token}` 
          } 
        });

      if (response.status === 201) {
        alert("Campaign started successfully!");
        navigate("/Grocery-react/")
      } else {
        alert("Failed to start the campaign.");
      }
    } catch (error) {
      alert("An error occurred while starting the campaign.");
    }
    finally {
      setIsLoading(false); // Stop loading
    }
  };

  const totalAmount = campaignPrice * quantity;

  return (
    <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "20px", backgroundColor: "#F0FFF4", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
      {variant ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", textAlign: "center", color: "#065F46" }}>Start a New Campaign</h1>

          <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
            {/* Product Image */}
            <div style={{ flex: "1 1 40%" }}>
            {variant?.variant_images?.length > 0 && (
              <img
                src={variant.variant_images[0].image_url}
                alt={variant.brand}
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              />
            )}
            </div>
            {/* Product Details and Form */}
            <div style={{ flex: "1 1 60%" }}>
              
              <form style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {/* Campaign Title */}
                <div>
                  <label>Campaign Title</label>
                  <input
                    type="text"
                    value={`${variant.brand} ${product_name}`}
                    readOnly
                    style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #D1D5DB" }}
                  />
                </div>

                {/* Variant Volume */}
                {variant?.liter && (
                <div>
                  <label>Volume (Litre)</label>
                  <input
                    type="text"
                    value={variant.liter} 
                    readOnly
                    style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #D1D5DB" }}
                  />
                </div>
                )}

                {/* Variant Weight */}
                {variant?.weight && (
                <div>
                  <label>Weight (Kg)</label>
                  <input
                    type="text"
                    value={variant.weight} 
                    readOnly
                    style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #D1D5DB" }}
                  />
                </div>
                )}

                {/* Your Price */}
                <div>
                  <label>Your Price (in KD)</label>
                  <input
                    type="text"
                    value={campaignPrice.toFixed(2)}
                    readOnly
                    style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #D1D5DB" }}
                  />
                </div>

                {/* Quantity Selector */}
                <div>
                  <label>My Quantity (in Kg)</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#D1FAE5",
                        color: "#065F46",
                        borderRadius: "50%",
                        border: "none",
                        cursor: quantity === 1 ? "not-allowed" : "pointer",
                      }}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={quantity}
                      readOnly
                      style={{ width: "50px", textAlign: "center", borderRadius: "5px", border: "1px solid #D1D5DB" }}
                    />
                    <button
                      type="button"
                      onClick={increaseQuantity}
                      disabled={quantity >= variant.stock}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#D1FAE5",
                        color: "#065F46",
                        borderRadius: "50%",
                        border: "none",
                        cursor: quantity === variant.stock ? "not-allowed" : "pointer",
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                <p><strong>Minimum Order Quantity For Offer:</strong> {variant.minimum_order_quantity_for_offer} Kg</p>
                    <label>Progress</label>
                    <div style={{ height: "20px", backgroundColor: "#rgb(155, 227, 192)", borderRadius: "5px", overflow: "hidden" }}>
                        <div
                            style={{
                                width: `${Math.min(progress, 100)}%`, // Ensure progress doesn't exceed 100%
                                backgroundColor:
                                    progress >= 100
                                        ? "#10B981" // Green when target is achieved
                                        : progress >= 90
                                        ? "#EF4444" // Red for 90% and above
                                        : progress >= 80
                                        ? "#F59E0B" // Orange for 80% to 89%
                                        : progress >= 50
                                        ? "#FBBF24" // Yellow for 50% to 79%
                                        : "#3B82F6", // Blue for less than 50%
                                height: "100%",
                            }}
                        />
                    </div>
                    <p style={{ textAlign: "center", marginTop: "5px" }}>
                        {progress >= 100
                            ? "Target Achieved!" // Show only "Target Achieved!" when progress reaches or exceeds 100%
                            : `${Math.max(0, (variant.minimum_order_quantity_for_offer - quantity).toFixed(2))} more to unlock!`} 
                        {/* Prevent negative quantities */}
                    </p>
                </div>

                {/* Total Amount */}
                <div>
                  <label>Total Amount (in KD)</label>
                  <input
                    type="text"
                    value={totalAmount.toFixed(2)}
                    readOnly
                    style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #D1D5DB" }}
                  />
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

                {/* Start Campaign Button */}
                <button
                  type="button"
                  onClick={handleStartCampaign}
                  style={{
                    backgroundColor: isLoading ? "#D1D5DB" : "#0aad0a",
                    width: "160px",
                    color: isLoading ? "#888" : "white",
                    padding: "10px 15px",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "14px",
                    marginLeft:"245px",
                    cursor: isLoading ? "not-allowed" : "pointer",
                  }}
                  disabled={isLoading}
                  onMouseOver={(e) => !isLoading && (e.target.style.backgroundColor = "#088a08")}
                  onMouseOut={(e) => !isLoading && (e.target.style.backgroundColor = "#0aad0a")}
                >
                  {isLoading ? "StartingCampaign..." : "Start Campaign"}
                </button>
                <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading product details...</p>
      )}
   
    </div>
  );
};

export default StartCampaignPage;
