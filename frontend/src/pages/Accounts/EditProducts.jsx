import React, { useEffect, useState } from "react";
import { useParams,Link } from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
// import { useDropzone } from 'react-dropzone';
import ScrollToTop from "../ScrollToTop";
import axios from "axios";
import { useTranslation } from "react-i18next";
import VariantItem from "../../Component/variant_edit_form";
import UpdateProductButton from "../../Component/update_product_button";

const EditProduct = () => {
  const { t: tCommon, i18n } = useTranslation("accounts_common");
  const { t: tProduct } = useTranslation("add_added_edit_prod");
  const { id } = useParams();
  
  const [productData, setProductData] = useState({});  // ✅ Prevents undefined errors

  // const [productData, setProductData] = useState({
  //   product_name: "",
  //   product_name_en: "",
  //   product_name_ar: "",
  //   description: "",
  //   description_en: "",
  //   description_ar: "",
  //   category: "",
  // });

  const [categories, setCategories] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const [loaderStatus, setLoaderStatus] = useState(true);

  useEffect(() => {
    setCurrentLang(i18n.language);
  }, [i18n.language]);

  useEffect(() => {
    
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/product_details/${id}/`);
        
        setProductData(response.data || {});
        setVariants(response.data.variants);
        
      } catch (err) {
        console.error("Error fetching product details", err);
        setError("Failed to load product data");
      }
      finally {
      setLoading(false);
      }
     };

    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/productcategories/");
        setCategories(response.data);
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };

    fetchProductDetails();
    fetchCategories();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleVariantChange = (index, event) => {
    const { name, value } = event.target;
    
    setVariants((prevVariants) => 
      prevVariants.map((variant, i) =>
        i === index
          ? {
              ...variant,
              [name]: value,
              existingImages: [...(variant.existingImages || [])], // Ensure existing images are kept
              newImages: [...(variant.newImages || [])], // Preserve new images
            }
          : variant
      )
    );
  };

  const addVariant = () => {
    setVariants((prevVariants) => {
      console.log("Previous Variants:", JSON.stringify(prevVariants, null, 2)); // Log before updating
  
      const updatedVariants = [
        ...prevVariants.map((variant) => ({
          ...variant,
          existingImages: variant.existingImages || [], 
          newImages: variant.newImages || [], 
        })),
        {
          brand: "",
          weight: "",
          liter: "",
          price: "",
          stock: "",
          campaign_discount_percentage: "",
          minimum_order_quantity_for_offer: "",
          existingImages: [],  
          newImages: [],  
        },
      ];
  
      console.log("Updated Variants:", JSON.stringify(updatedVariants, null, 2)); // Log after updating
  
      return updatedVariants;
    });
  };
  
  // const removeVariant = (index) => {
  //   setVariants(variants.filter((_, i) => i !== index));
  // };

  // const removeVariantImage = (variantIndex, imageIndex) => {
  //   const updatedVariants = [...variants];
  //   updatedVariants[variantIndex].variant_images.splice(imageIndex, 1);
  //   setVariants(updatedVariants);
  // };

  // const removeVariantImage = (variantIndex, imgIndex, type) => {
  //   setVariants((prevVariants) => {
  //     const updatedVariants = [...prevVariants];
  //     const variant = updatedVariants[variantIndex];
  
  //     if (!variant) return updatedVariants;
  
  //     // Ensure arrays are initialized
  //     if (!Array.isArray(variant.existingImages)) variant.existingImages = [];
  //     if (!Array.isArray(variant.newImages)) variant.newImages = [];
  //     if (!Array.isArray(variant.imagesToDelete)) variant.imagesToDelete = [];
  
  //     // Handling image removal from `existingImages`
  //     if (type === "existing" && variant.existingImages[imgIndex]) {
  //       const imageToDelete = variant.existingImages[imgIndex];
  //       if (imageToDelete.id) {
  //         variant.imagesToDelete.push(imageToDelete.id);
  //         console.log(`Image marked for deletion (existing): ${imageToDelete.id}`);
  //       }
  //       variant.existingImages.splice(imgIndex, 1); // Remove the image
  //       console.log(`Removed existing image. Current images:`, variant.existingImages);
  //     }
  
  //     // Handling image removal from `newImages`
  //     if (type === "new" && variant.newImages[imgIndex]) {
  //       const imageToDelete = variant.newImages[imgIndex];
  //       if (imageToDelete.id) {
  //         variant.imagesToDelete.push(imageToDelete.id);
  //         console.log(`Image marked for deletion (new): ${imageToDelete.id}`);
  //       }
  //       variant.newImages.splice(imgIndex, 1); // Remove the image
  //       console.log(`Removed new image. Current images:`, variant.newImages);
  //     }
  
  //     return updatedVariants;
  //   });
  // };

  const removeVariantImage = (variantIndex, imageIndex, type) => {
    setVariants((prevVariants) => {
      const updatedVariants = [...prevVariants];
      const variantToUpdate = updatedVariants[variantIndex];
  
      // Assuming each image has a unique 'id' field. If not, adjust accordingly
      const imageToDelete = variantToUpdate.variant_images[imageIndex];
  
      // If type is 'existing', we handle it accordingly
      if (type === 'existing') {
        // Remove the image from variant_images
        const updatedImages = variantToUpdate.variant_images.filter((_, index) => index !== imageIndex);
        variantToUpdate.variant_images = updatedImages;
  
        // Add the image id to imagesToDelete if it exists
        if (imageToDelete && imageToDelete.id) {
          if (!variantToUpdate.imagesToDelete) {
            variantToUpdate.imagesToDelete = [];
          }
          variantToUpdate.imagesToDelete.push(imageToDelete.id);
        }
      }
  
      return updatedVariants;
    });
  };
  
  
  const removeImage = (variantIndex, imgIndex, type) => {
    setVariants((prevVariants) => {
      const updatedVariants = [...prevVariants];
  
      if (type === "existing") {
        updatedVariants[variantIndex].existingImages.splice(imgIndex, 1);
      } else {
        updatedVariants[variantIndex].newImages.splice(imgIndex, 1);
      }
  
      return updatedVariants;
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
  
    const formData = new FormData();
  
    // Append basic product data
    Object.keys(productData).forEach((key) => {
      formData.append(key, productData[key]);
    });
  
    const safeVariants = Array.isArray(variants) ? variants : [];
  
    safeVariants.forEach((variant, index) => {
      // Include existing images
      if (Array.isArray(variant.variant_images)) {
        variant.variant_images.forEach((image, imgIndex) => {
          formData.append(`existing_images_${index}_${imgIndex}`, image);
        });
      }
  
      // Include new images
      if (Array.isArray(variant.newImages)) {
        variant.newImages.forEach((file, fileIndex) => {
          formData.append(`new_images_${index}_${fileIndex}`, file);
        });
      }
  
      // Include images to delete
      if (Array.isArray(variant.imagesToDelete)) {
        variant.imagesToDelete.forEach((imageId, imgIndex) => {
          formData.append(`images_to_delete_${index}_${imgIndex}`, imageId);
          console.log(`Image ID marked for deletion: ${imageId}`);
        });
      }
    });
  
    const formattedVariants = safeVariants.map((variant) => ({
      ...variant,
      imagesToDelete: variant.imagesToDelete || [],
    }));
  
    formData.append("variants", JSON.stringify(formattedVariants));
  
    try {
      const response = await axios.put(`http://127.0.0.1:8000/wholesaler/product_edit/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Product Updated Successfully!");
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Failed to update product");
    } finally {
      setLoading(false);
    }
  };
  
  // const handleSubmit = async () => {
  //   setLoading(true);
  //   setError(null);
  
  //   const formData = new FormData();
  //   Object.keys(productData).forEach((key) => {
  //     formData.append(key, productData[key]);
  //   });
  
  //   const safeVariants = Array.isArray(variants) ? variants : [];
  
  //   safeVariants.forEach((variant, index) => {
  //     // Include old images (only the ones that are still present)
  //     if (Array.isArray(variant.existingImages)) {
  //       variant.existingImages.forEach((image, imgIndex) => {
  //         formData.append(`existing_images_${index}_${imgIndex}`, image);
  //       });
  //     }
  
  //     // Include new images
  //     if (Array.isArray(variant.newImages)) {
  //       variant.newImages.forEach((file, fileIndex) => {
  //         formData.append(`new_images_${index}_${fileIndex}`, file);
  //       });
  //     }
  //   });
  
  //   formData.append("variants", JSON.stringify(safeVariants));
  
  //   try {
  //     await axios.put(`http://127.0.0.1:8000/wholesaler/product_edit/${id}/`, formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });
  //     alert("Product Updated Successfully!");
  //   } catch (err) {
  //     setError("Failed to update product");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  const onDrop = (index, acceptedFiles) => {
  setVariants((prevVariants) =>
    prevVariants.map((variant, i) =>
      i === index
        ? {
            ...variant,
            newImages: [...(variant.newImages || []), ...acceptedFiles.map((file) => Object.assign(file, { preview: URL.createObjectURL(file) }))],
          }
        : variant
    )
  );
};


  useEffect(() => {
      setTimeout(() => {
        setLoaderStatus(false);
      }, 1500);
    }, []);

    if (loading) return <p>Loading...</p>;  

  return (
    <div>
      <ScrollToTop />
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="p-6 d-flex justify-content-between align-items-center d-md-none">
              <h3 className="fs-5 mb-0">{tCommon("account_settings")}</h3>
              <button
                className="btn btn-outline-gray-400 text-muted d-md-none"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasAccount"
                aria-controls="offcanvasAccount"
              >
                <i className="fas fa-bars"></i>
              </button>
            </div>
          </div>
  
          {/* Sidebar Navigation */}
          <div className="col-lg-3 col-md-4 col-12 border-end d-none d-md-block">
            <div className="pt-10 pe-lg-10">
              <ul className="nav flex-column nav-pills nav-pills-dark">
                <li className="nav-item">
                  <Link className="nav-link" to="/MyAccountOrder">
                    <i className="fas fa-shopping-bag me-2" />
                    {tCommon("your_orders")}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/MyAccountAddress">
                    <i className="fas fa-map-marker-alt me-2" />
                    {tCommon("address")}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/MyAccountPaymentMethod">
                    <i className="fas fa-credit-card me-2" />
                    {tCommon("payment_method")}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/MyAccountNotification">
                    <i className="fas fa-bell me-2" />
                    {tCommon("notification")}
                  </Link>
                </li>
  
                {localStorage.getItem("company_name") && (
                  <ul className="nav flex-column nav-pills nav-pills-dark">
                    <li className="nav-item">
                      <Link className="nav-link active" to="/AddProducts">
                        <i className="bi bi-plus-circle me-2" />
                        {tCommon("add_products")}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/AddedProducts">
                        <i className="bi bi-card-list me-2" />
                        {tCommon("added_products")}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/WholesalerCampaigns">
                        <i className="bi bi-collection-fill me-2" />
                        {tCommon("campaigns")}
                      </Link>
                    </li>
                  </ul>
                )}
  
                {localStorage.getItem("user_name") && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/WholesalerCampaigns">
                      <i className="bi bi-collection-fill me-2" />
                      {tCommon("campaigns")}
                    </Link>
                  </li>
                )}
  
                <li className="nav-item">
                  <Link className="nav-link" to="/Grocery-react/">
                    <i className="fas fa-sign-out-alt me-2" />
                    {tCommon("home")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
  
          {/* Main Content */}
          <div className="col-lg-9 col-md-8 col-12">
            {loaderStatus ? (
              <div className="loader-container">
                <MagnifyingGlass
                  visible={true}
                  height="100"
                  width="100"
                  ariaLabel="magnifying-glass-loading"
                  color="#0aad0a"
                />
              </div>
            ) : (
              <div>
                <h2>{tProduct("edit_your_product")}</h2>
                <form onSubmit={handleSubmit}>
                <div className="mb-3">
                <label className="form-label">{tProduct("product_name")}</label>
                  <input
                    type="text"
                    name={currentLang === "en" ? "product_name_en" : "product_name_ar"}
                    value={
                      currentLang === "en"
                        ? productData?.product_name_en || ""
                        : productData?.product_name_ar || ""
                    }
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                  </div>
                  {variants.map((variant, index) => (
                    <VariantItem
                      key={index}
                      index={index}
                      variant={variant}
                      handleVariantChange={handleVariantChange}
                      onDrop={onDrop}
                      removeImage={removeImage}
                      // removeVariant={removeVariant}
                      removeVariantImage={removeVariantImage}
                      tProduct={tProduct}
                    />
                  ))}

                   {/* Add Variant Button */}
                   <button type="button" onClick={addVariant} className="btn btn-secondary mt-2">
                    {tProduct("add_variant")}
                  </button>

                   {/* Description Field */}
                   <div className="mb-3">
                    <label className="form-label">{tProduct('description')}</label>
                    <textarea
                      name={currentLang === "en" ? "description_en" : "description_ar"}
                      value={currentLang === "en" ? productData.description_en : productData.description_ar}
                      onChange={handleChange}
                      className="form-control"
                      placeholder={tProduct('description')}
                    />
                  </div>

                  {/* Category Field */}
                  <div className="mb-5">
                    <label className="form-label">{tProduct('product_category')}</label>
                    <select
                      id="product_category"
                      className="form-control"
                      name="category"
                      value={productData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">{tProduct("select_category")}</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <UpdateProductButton
                    loading={loading}
                    updateProduct={handleSubmit}
                    productData={productData || {}}
                    handleChange={handleChange}
                  />
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
  
      
    </div>
  );
};

export default EditProduct;