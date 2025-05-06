import React from "react";
import CountUp from "react-countup";
import { useTranslation } from "react-i18next";
import image1 from "../images/2a-users.webp";
import image2 from "../images/2a-companies.webp";
import image3 from "../images/2a-products.webp";
import bgImage from "../images/bg-2.jpg"; // background image for overlay

const StatsSection = () => {
  const { t } = useTranslation("aboutus");

  const stats = [
    {
      id: 1,
      end: 100,
      suffix: "+",
      label: t("listing_info"),
      image: image2,
    },
    {
      id: 2,
      end: 100,
      suffix: "+",
      label: t("successful_purchases"),
      image: image3,
    },
    {
      id: 3,
      end: 89,
      suffix: "%",
      label: t("customer_satisfaction_rate"),
      image: image1,
    },
  ];

  const containerStyle = {
    display: "flex",
    flexWrap: "wrap",
    width: "100%",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    padding: "3rem 0",
  };

  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0)",
    zIndex: 1,
  };

  const contentWrapperStyle = {
    display: "flex",
    flexWrap: "wrap",
    width: "100%",
    justifyContent: "space-around",
    position: "relative",
    zIndex: 2,
  };

  const cardStyle = {
    flex: "1 1 250px",
    maxWidth: "300px",
    textAlign: "center",
    color: "#fff",
    padding: "1rem",
  };

  const iconStyle = {
    width: "80px",
    height: "80px",
    objectFit: "contain",
    marginBottom: "1rem",
  };

  const countStyle = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    color: "#fff",
  };

  const labelStyle = {
    fontSize: "1.1rem",
    fontWeight: "normal",
    
  };

  return (
    <div style={containerStyle}>
      <div style={overlayStyle}></div>
      <div style={contentWrapperStyle}>
        {stats.map((stat) => (
          <div key={stat.id} style={cardStyle}>
            <img src={stat.image} alt={stat.label} style={iconStyle} />
            <h3 style={countStyle}>
              <CountUp end={stat.end} duration={2} />{stat.suffix}
            </h3>
            <p style={labelStyle}>{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsSection;
