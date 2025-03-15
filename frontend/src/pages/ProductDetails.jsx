import React, { useState, useEffect } from "react";
import {Clock,ShoppingCart,Package,Percent, UserPlus,Star,ChevronLeft,ChevronRight,StarHalf,Trash2,Plus,Minus,Shield,Sparkles,Info,BarChart2,TrendingUp,Users,ArrowUp,ArrowDown,Activity,} from "lucide-react";
import { Bar, Pie } from "react-chartjs-2";
import {Chart as ChartJS,CategoryScale, LinearScale,PointElement,LineElement,BarElement,ArcElement,Title,Tooltip,Legend,Filler,} from "chart.js";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Line } from "react-chartjs-2";
import styles from "../styles/ProductDetails.module.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

// Register ChartJS components
ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,BarElement,ArcElement,Title,Tooltip,Legend,Filler);

const ProductDetails = () => {
  const {t, i18n} = useTranslation('product_details')
  const [product, setProduct] = useState(null);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(null);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(172800);
  const [isLoading, setIsLoading] = useState(true);
  const [isGroupCreated, setIsGroupCreated] = useState(true); // Set to true for demo
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cartQuantity, setCartQuantity] = useState(1);
  const [showCartControls, setShowCartControls] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const { id } = useParams()
  // New state for analytics
  const [activeChart, setActiveChart] = useState("demand");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [campaignDetails, setCampaignDetails] = useState(null);
  const [images,setImages] = useState([])

  const navigate = useNavigate()

  // Update currentLang when the language is changed
    useEffect(() => {
      setCurrentLang(i18n.language);
    }, [i18n.language]);

    
  useEffect(() => {
    const loadingTimer = setTimeout(() => setIsLoading(false), 1500);
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 70));
    }, 50);
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearTimeout(loadingTimer);
      clearInterval(progressInterval);
      clearInterval(timerInterval);
    };
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/product_details/${id}/`);
        const fetchedProduct = response.data;
        setProduct(fetchedProduct);
        console.log("Fetched Product:", fetchedProduct);
        
        localStorage.setItem("productDetails", JSON.stringify(fetchedProduct));
        const storedQuantity = parseInt(localStorage.getItem("productQuantity"), 10) || 1;
        setQuantity(storedQuantity);
  
        if (fetchedProduct.product_images && fetchedProduct.product_images.length > 0) {
          setSelectedImage(fetchedProduct.product_images[0]);
          setImages(fetchedProduct.product_images);
        }
  
        if (fetchedProduct.is_in_campaign) {
          const campaignResponse = await axios.get(`http://127.0.0.1:8000/campaigns/`);
          console.log("Campaigns:", campaignResponse.data);
  
          // Log fetchedProduct.id and campaign.product
          console.log("Fetched Product ID:", fetchedProduct.id);
          campaignResponse.data.forEach(campaign => {
            console.log("Campaign Product ID:", campaign.product);
          });
  
          // Ensure both are integers before comparing
          const relatedCampaign = campaignResponse.data.find(
            (campaign) => parseInt(campaign.product) === fetchedProduct.id
          );
          console.log("Related Campaign:", relatedCampaign);
  
          if (relatedCampaign) {
            setCampaignDetails(relatedCampaign);
            const numberOfParticipants = relatedCampaign?.current_participants ?? 0;
            const currentQuantity = relatedCampaign?.current_quantity ?? 0;
            const minOrderQuantity = fetchedProduct?.minimum_order_quantity_for_offer ?? 1;
            setProgress((currentQuantity / minOrderQuantity) * 100);
          } else {
            console.log("No related campaign found for this product.");
          }
        }
      } catch (err) {
        setError("Failed to load product details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProduct();
  }, [id]);
  

  const formatTime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;
  };

  const calculateCampaignPrice = () => {
    if (product && product.campaign_discount_percentage) {
      return (
        (product.actual_price * (100 - product.campaign_discount_percentage)) / 100
      ).toFixed(2);
    }
    return null;
  };

  const handleQuantityChange = (action) => {
    if (action === "increment") {
      setQuantity((prev) => prev + 1);
    } else if (action === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    } else if (action === "reset") {
      setQuantity(1);
    }
  };

  const handleCartQuantityChange = (action) => {
    if (action === "increment") {
      setCartQuantity((prev) => prev + 1);
    } else if (action === "decrement" && cartQuantity > 1) {
      setCartQuantity((prev) => prev - 1);
    } else if (action === "clear") {
      setCartQuantity(0);
      setShowCartControls(false);
    }
  };

  const handleAddToCart = (product) => {
        // Retrieve the current cart from local storage or initialize it
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
      
        // Check if the product is already in the cart
        const existingItemIndex = cart.findIndex((item) => item.product.id === product.id);
      
        if (existingItemIndex > -1) {
          // Update the quantity for the existing item
          cart[existingItemIndex].quantity = cartQuantity;
        } else {
          // Add the new product with its quantity
          cart.push({ product, quantity });
        }
      
        // Save the updated cart back to local storage
        localStorage.setItem("cart", JSON.stringify(cart));
      
        // Store the quantity separately in local storage
        const quantities = JSON.parse(localStorage.getItem("quantities")) || {};
        quantities[product.id] = cartQuantity;
        localStorage.setItem("quantities", JSON.stringify(quantities));
      
        // Alert the user and navigate to the cart page
        alert("Product added to cart successfully!");
        navigate("/ShopCart");
      };

  const handleImageNavigation = (direction) => {
    if (direction === "next") {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    } else {
      setCurrentImageIndex(
        (prev) => (prev - 1 + images.length) % images.length
      );
    }
  };

  const handleButtonClick = async () => {
    if (!selectedPaymentOption) {
      alert("Please select a payment option.");
      return;
    }
    const payload = {
      product_id: product.id,
      quantity: quantity,
      payment_option: selectedPaymentOption,
    };
    try {
      // Check if the user is starting or joining the campaign
      if (!product.is_in_campaign) {
        // Store details in localStorage for starting a campaign
        localStorage.setItem("start_campaign_details", JSON.stringify(payload));
        
        // Navigate to the start campaign page
        // navigate("/startCampaign/");
        navigate("*");

      } else {
        // If joining an existing campaign, use the product ID for the campaign detail page
        localStorage.setItem("join_campaign_details", JSON.stringify(payload));
        const id = campaignDetails.id
        // navigate(`/campaigns/${id}`);
        navigate("*");
      }
      
    } catch (error) {
      console.error("❌ Error starting/joining campaign:", error);
      // alert(`Error: ${error.response ? error.response.data : "Check console"}`);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <DotLottieReact src="lotties/loading-dots.lottie" loop autoplay />
        <p className={styles.loadingText}>{t('loadingProductDetails')}</p>
      </div>
    );
  }

  const campaignPrice = calculateCampaignPrice();

  const userEmail = localStorage.getItem("email");
  const isAlreadyJoined = campaignDetails?.participants?.some(
    (participant) => participant.email === userEmail
  );

  return (
    <div className={styles.productContainer}>
      {product ? (
      <div className={styles.productGrid}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          {/* Image Carousel */}
          <div className={styles.imageSection}>
   <div className={styles.carouselContainer}>
     <button
       className={styles.carouselButton}
       onClick={() => handleImageNavigation("prev")}
       aria-label="Previous image"
     >
       <ChevronLeft strokeWidth={2} />
     </button>
     
     <div className={styles.imageContainer}>
       {images.length > 0 && (
         <img
           src={images[currentImageIndex].image_url}
           alt={`${product?.product_name} - View ${currentImageIndex + 1}`}
           className={styles.productImage}
         />
       )}
        {product?.is_in_campaign && (
                  <div className={styles.timerOverlay}>
                    <div className={styles.timerContent}>
                      <Clock className={styles.timerIcon} strokeWidth={2} />
                      <div>
                        <p className={styles.timerText}>Campaign ends in:</p>
                        <p className={styles.timerValue}>
                          {formatTime(timeLeft)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                  </div>

                  <button
                    className={styles.carouselButton}
                    onClick={() => handleImageNavigation("next")}
                    aria-label="Next image"
                  >
                    <ChevronRight strokeWidth={2} />
                  </button>
                </div>

                <div className={styles.thumbnailContainer}>
                  {images.map((image, index) => (
                    <button
                      key={index}
                      className={`${styles.thumbnail} ${
                        index === currentImageIndex ? styles.activeThumbnail : ""
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={`View image ${index + 1}`}
                    >
                      <img src={image.image_url} alt={`Thumbnail ${index + 1}`} />
                    </button>
                  ))}
                </div>
              </div>

          {/* Seller Info and Brand */}
          <div className={styles.sellerInfo}>
            <div className={styles.sellerProfile}>
              <img
                src="https://media.istockphoto.com/id/1331491686/vector/element-design.jpg?s=612x612&w=is&k=20&c=z8VgFpBhjhLp3p3oJpi_PyJSpqjFWykSGy2mLjMlprQ="
                alt="Seller profile"
                className={styles.sellerAvatar}
              />
              <div className={styles.sellerDetails}>
                <h3>{product?.wholesalerName}</h3>
                <div className={styles.sellerRating}>
                  <div className={styles.stars}>
                    {[...Array(5)].map((_, index) => {
                      const value = index + 1;
                      return value <= product?.sellerRating ? (
                        <Star
                          key={index}
                          className={styles.starFilled}
                          size={16}
                          strokeWidth={2}
                        />
                      ) : value - 0.5 <= product?.sellerRating ? (
                        <StarHalf
                          key={index}
                          className={styles.starHalf}
                          size={16}
                          strokeWidth={2}
                        />
                      ) : (
                        <Star
                          key={index}
                          className={styles.starEmpty}
                          size={16}
                          strokeWidth={2}
                        />
                      );
                    })}
                  </div>
                  <span>
                    {product?.sellerRating} ({product?.totalReviews} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Product Title and Description */}
          <div className={styles.productInfo}>
            <h1 className={styles.productTitle}>{currentLang === "en" ? product?.product_name_en : product?.product_name_ar}</h1>
            <div className={styles.productDescription}>
            {(currentLang === "en" ? product?.description_en : product?.description_ar)
                ?.split("\n")
                .map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
          {/* Analytics Section */}
          {/* <div className={styles.analyticsSection}>
            <div className={styles.analyticsCard}>
              <h3>Product Performance</h3>
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <Users className={styles.statIcon} strokeWidth={2} />
                  <div className={styles.statInfo}>
                    <span>Total Groups</span>
                    <strong>{product?.analytics?.totalGroups || 0}</strong>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <TrendingUp className={styles.statIcon} strokeWidth={2} />
                  <div className={styles.statInfo}>
                    <span>Success Rate</span>
                    <strong>{product?.analytics?.successRate || 0}%</strong>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
        {/* Right Column */}
        <div className={styles.rightColumn}>
          <div className={styles.priceCard}>
            {/* Single Unit Price Section */}
            <div className={styles.priceSection}>
              <div className={styles.priceHeader}>
                <span className={styles.priceLabel}>{t('singleUnitPrice')}</span>
                <div className={styles.tooltip}>
                  <Info size={16} strokeWidth={2} />
                  <span className={styles.tooltipText}>
                    {t('buyNowAtRegularPrice')}
                  </span>
                </div>
              </div>
              <div className={styles.priceContent}>
                <p className={styles.singlePrice}>{product?.actual_price} {t('kd')}</p>
                {/* Quantity Selector */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                   <button
                    onClick={() => handleCartQuantityChange("decrement")}
                    style={{
                      backgroundColor: "#D1FAE5",
                      color: "#065F46",
                      padding: "10px 20px",
                      borderRadius: "50%",
                      border: "none",
                      cursor: cartQuantity === 1 ? "not-allowed" : "pointer",
                    }}
                    disabled={cartQuantity === 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={cartQuantity}
                    readOnly
                    style={{
                      width: "50px",
                      textAlign: "center",
                      border: "1px solid #D1D5DB",
                      borderRadius: "5px",
                    }}
                  />
                  <button
                    onClick={() => handleCartQuantityChange("increment")}
                    style={{
                      backgroundColor: "#D1FAE5",
                      color: "#065F46",
                      padding: "10px 20px",
                      borderRadius: "50%",
                      border: "none",
                      cursor: cartQuantity === product?.stock ? "not-allowed" : "pointer",
                    }}
                    disabled={cartQuantity === product?.stock}
                  >
                    +
                  </button>
                </div>
                  <button
                    className={styles.addToCartButton}
                    onClick={() => handleAddToCart(product)} 
                  >
                    <ShoppingCart size={16} strokeWidth={2} />
                    {t('addToCart')}
                  </button>
              </div>
            </div>
            <div style={{marginBottom:25}}>
              <span> {t("unit")}: {product?.unit}</span>
            </div>
            {/* Group Buying Section */}
            <div className={styles.wholesalePriceSection}>
                  <div className={styles.priceHeader}>
                    <span className={styles.priceLabel}>{t('campaignPrice')}</span>
                    <div className={styles.tooltip}>
                      <Info size={16} strokeWidth={2} />
                      <span className={styles.tooltipText}>
                        {t('joinGroupDeal')}
                      </span>
                    </div>
                  </div>
                  <p className={styles.wholesalePrice}>
                    {campaignPrice} {t("kd")}
                    <span className={styles.savingsBadge}>
                      {t('save')} {product?.campaign_discount_percentage}%
                    </span>
                  </p>
                </div>
            {product?.is_in_campaign ? (
              <>
                <div className={styles.groupProgressSection}>
                  <div className={styles.groupInfo}>
                    <Users className={styles.groupIcon} strokeWidth={2} />
                    <div>
                      <p className={styles.groupText}>{t('activeGroupCampaign')}</p>
                      <p className={styles.groupStats}>
                      <strong>{campaignDetails?.current_participants ?? 0}</strong>{" "}
                        {t('participants')} ·
                        <strong>{campaignDetails.product.minimum_order_quantity_for_offer-campaignDetails.current_quantity}</strong> 
                        {t('moreToUnlockCampaignPrice')}
                      </p>
                    </div>
                  </div>

                  <div className={styles.progressContainer}>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${progress}%` }}
                      />
                      <div className={styles.progressMarker}>
                        <div className={styles.progressLabel}>
                          {t('current')}: {product?.currentQuantity}
                        </div>
                      </div>
                      <div className={styles.targetMarker}>
                        <div className={styles.targetTooltip}>
                          <strong>{t('target')}: {product?.minimum_order_quantity_for_offer}</strong>
                          <p>{t('minimumQuantityNeededForWholesale')}</p>
                          <p className={styles.remaining}>
                            {product?.minimum_order_quantity_for_offer - product?.currentQuantity} more
                            to go!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
              <div className={styles.createGroupBanner}>
                <UserPlus className={styles.bannerIcon} strokeWidth={2} />
                <div className={styles.bannerContent}>
                  <h3>{t('beTheFirst')}!</h3>
                  <p>{t('createGroupAndUnlockWholesalePrices')}</p>
                  {/* <button className={styles.createGroupButton}>
                    Create Group Now
                  </button> */}
                </div>
              </div>
              <div className={styles.groupDealOptions}>
              {[
                {
                  id: "free",
                  icon: <Shield className={styles.dealIcon} strokeWidth={2} />,
                  title: t('startFree'),
                  description: t('noUpfrontPayment'),
                  features: [
                    t('payIfGroupDealSucceeds'),
                    t('cancelAnytimeBeforeDealEnds'),
                  ],
                },
                {
                  id: "basic",
                  icon: <Percent className={styles.dealIcon} strokeWidth={2} />,
                  title: t('earlyBird5Percent'),
                  description: t('tenPercentUpfrontPayment'),
                  features: [
                    t('lockInAdditional5PercentDiscount'),
                    t('priorityOrderProcessing'),
                  ],
                },
                {
                  id: "premium",
                  icon: (
                    <Sparkles className={styles.dealIcon} strokeWidth={2} />
                  ),
                  title: t('vipDeal25Percent'),
                  description: t('hundredPercentUpfrontPayment'),
                  features: [
                    t('maximum25PercentAdditionalSavings'),
                    t('vipSupportAndFastestDelivery'),
                  ],
                },
              ].map((option) => (
                <div
                  key={option.id}
                  className={`${styles.dealCard} ${
                    selectedPaymentOption === option.id ? styles.selected : ""
                  }`}
                  onClick={() => setSelectedPaymentOption(option.id)}
                  role="button"
                  tabIndex={0}
                >
                  {option.icon}
                  <h3>{option.title}</h3>
                  <p>{option.description}</p>
                  <ul className={styles.dealFeatures}>
                    {option.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            </>
            )}
            {/* Payment Options */}
            {product?.is_in_campaign && (
            <div className={styles.groupDealOptions}>
              {[
                {
                  id: "free",
                  icon: <Shield className={styles.dealIcon} strokeWidth={2} />,
                  title: t('joinFree'),
                  description: t('noUpfrontPayment'),
                  features: [
                    t('payIfGroupDealSucceeds'),
                    t('cancelAnytimeBeforeDealEnds'),
                  ],
                },
                {
                  id: "basic",
                  icon: <Percent className={styles.dealIcon} strokeWidth={2} />,
                  title: t('earlyBird5Percent'),
                  description: t('tenPercentUpfrontPayment'),
                  features: [
                    t('lockInAdditional5PercentDiscount'),
                    t("priorityOrderProcessing"),
                  ],
                },
                {
                  id: "premium",
                  icon: (
                    <Sparkles className={styles.dealIcon} strokeWidth={2} />
                  ),
                  title: t('vipDeal25Percent'),
                  description: t('hundredPercentUpfrontPayment'),
                  features: [
                    t("maximum25PercentAdditionalSavings"),
                    t("vipSupportAndFastestDelivery"),
                  ],
                },
              ].map((option) => (
                <div
                  key={option.id}
                  className={`${styles.dealCard} ${
                    selectedPaymentOption === option.id ? styles.selected : ""
                  }`}
                  onClick={() => setSelectedPaymentOption(option.id)}
                  role="button"
                  tabIndex={0}
                >
                  {option.icon}
                  <h3>{option.title}</h3>
                  <p>{option.description}</p>
                  <ul className={styles.dealFeatures}>
                    {option.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            )}
            {/* Quantity Selector */}
            <div className={styles.quantitySelector}>
              <span className={styles.quantityLabel}>
                {t("groupOrderQuantity")}:
              </span>
              <div className={styles.quantityControls}>
                <button
                  style={{
                    backgroundColor: "#D1FAE5",
                    color: "#065F46",
                    padding: "10px 20px",
                    borderRadius: "50%",
                    border: "none",
                    cursor: quantity === 1 ? "not-allowed" : "pointer",
                  }}
                  onClick={() => handleQuantityChange("decrement")}
                  className={styles.quantityButton}
                  disabled={quantity <= 1}
                >
                  {/* <Minus size={16} strokeWidth={2} /> */}-
                </button>
                <span className={styles.quantityValue}>{quantity}</span>
                <button
                  style={{
                    backgroundColor: "#D1FAE5",
                    color: "#065F46",
                    padding: "10px 20px",
                    borderRadius: "50%",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => handleQuantityChange("increment")}
                  className={styles.quantityButton}
                >
                  {/* <Plus size={16} strokeWidth={2} /> */}+
                </button>
                <button
                  onClick={() => handleQuantityChange("reset")}
                  className={styles.resetButton}
                >
                  <Trash2 size={16} strokeWidth={2} />
                </button>
              </div>
            </div>
            {/* Action Button */}
            <button
              className={styles.actionButton}
              disabled={isAlreadyJoined || !selectedPaymentOption}
              onClick={handleButtonClick}
            >
              {isAlreadyJoined
                ? t('already_joined')
                : !product?.is_in_campaign
                ? selectedPaymentOption === "free"
                  ? t('start_group_deal', { quantity })
                  : selectedPaymentOption === "basic"
                  ? t('start_with_5_percent_extra_discount', { quantity })
                  : selectedPaymentOption === "premium"
                  ? t('start_with_25_percent_extra_discount', { quantity })
                  : t('select_payment_option')
                : selectedPaymentOption === "free"
                ? t('join_group_deal', { quantity })
                : selectedPaymentOption === "basic"
                ? t('join_with_5_percent_extra_discount', { quantity })
                : selectedPaymentOption === "premium"
                ? t('join_with_25_percent_extra_discount', { quantity })
                : t('select_payment_option')}
            </button>
          </div>
        </div>
      </div>
       ) : (
        <p>{t('loading')}</p>
      )}
    </div>
  );
};

export default ProductDetails;
