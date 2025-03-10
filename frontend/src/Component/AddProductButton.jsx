import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { useTranslation } from "react-i18next"; // i18next for language switching

const AddProductButton = ({ loading, addProduct, productData, handleChange }) => {
  const { t, i18n } = useTranslation('add_added_edit_prod'); // Translation hook
  const [currentLang, setCurrentLang] = useState(i18n.language); // Track current language
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevent multiple submissions

  const handleAddProduct = async () => {  // No "e" parameter
    // e.preventDefault();
    if (isSubmitting) return; // Prevent double submission
    setIsSubmitting(true);
  
    try {
      // Ensure both English and Arabic product name/description are filled
      if (
        !productData.product_name_en ||
        !productData.product_name_ar ||
        !productData.description_en ||
        !productData.description_ar
      ) {
        alert("Please fill both languages for the product name and description!");
        throw new Error("Missing required fields"); // Throw error to trigger catch block
      }
  
      // Submit data to the backend
      await addProduct(productData);
    } catch (error) {
      console.error("Error adding product:", error);
    } finally {
      setIsSubmitting(false); // Ensure this runs regardless of success or failure
    }
  };
  

  // Switch language and update the fields accordingly
  const switchLanguage = (newLang) => {
    i18n.changeLanguage(newLang);
    setCurrentLang(newLang);
  };

  // Check if both languages' fields are filled to enable the Add Product button
  const isButtonEnabled = productData.product_name_en && productData.product_name_ar && 
                          productData.description_en && productData.description_ar;

  return (
    <div>
      {/* Button to Add Product */}
      <button
          type="button"
          className="btn btn-primary"
          disabled={loading || isSubmitting || !isButtonEnabled}
          onClick={handleAddProduct}  // No event is passed
        >
          {loading || isSubmitting ? (
            <ClipLoader color="#fff" loading size={20} />
          ) : (
            t("add_product")
          )}
        </button>


      {/* Language toggle button (ensure no submission is triggered) */}
      <button
        type="button" // Add type="button" to prevent accidental form submission
        className="btn btn-primary ml-3"
        onClick={() => switchLanguage(currentLang === "en" ? "ar" : "en")}
      >
        {t(currentLang === "en" ? "Switch to Arabic" : "Switch to English")}
      </button>
    </div>
  );
};

export default AddProductButton;
