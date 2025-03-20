import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { useTranslation } from "react-i18next"; // i18next for language switching

const UpdateProductButton = ({ loading, updateProduct, productData, handleChange }) => {
  const { t, i18n } = useTranslation("add_added_edit_prod"); // Translation hook
  const [currentLang, setCurrentLang] = useState(i18n.language); // Track current language
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevent multiple submissions

  const handleUpdateProduct = async () => {
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
        throw new Error("Missing required fields"); // Trigger catch block
      }

      // Submit updated product data to backend
      await updateProduct();  // Call `updateProduct` which is now `handleSubmit` without an event
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setIsSubmitting(false); // Ensure this runs regardless of success or failure
    }
  };

  // Switch language and update the fields accordingly
  const switchLanguage = (newLang) => {
    i18n.changeLanguage(newLang);
    setCurrentLang(newLang);
  };

  // Check if both languages' fields are filled to enable the Update Product button
  const isButtonEnabled =
    productData.product_name_en &&
    productData.product_name_ar &&
    productData.description_en &&
    productData.description_ar;

  return (
    <div>
      {/* Button to Update Product */}
      <button
          type="button"
          className="btn btn-success"
          disabled={loading || isSubmitting || !isButtonEnabled}
          onClick={handleUpdateProduct} // Now it directly calls the function
        >
          {loading || isSubmitting ? (
            <ClipLoader color="#fff" loading size={20} />
          ) : (
            t("update_product")
          )}
        </button>

      {/* Language toggle button */}
      <button
        type="button"
        className="btn btn-primary ml-3"
        onClick={() => switchLanguage(currentLang === "en" ? "ar" : "en")}
      >
        {t(currentLang === "en" ? "Switch to Arabic" : "Switch to English")}
      </button>
    </div>
  );
};

export default UpdateProductButton;


