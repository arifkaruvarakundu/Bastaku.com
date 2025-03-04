import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDropzone } from 'react-dropzone';
import axios from "axios";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [isCropping,setIsCropping]=useState(false)
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState(null);
  const [files, setFiles] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/wholesaler/product_detail/${id}/`
        );
        setProduct(response.data);
      } catch (err) {
        setError("Failed to load product details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prevFiles) => [
      ...prevFiles,  // ✅ Keep the existing files
      ...acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      ),
    ]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: 'image/*',
      multiple: true,  // Allow multiple files
    });

    
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/productcategories/');
        setCategories(response.data); // Assuming the response data is an array of categories
      } catch (err) {
        console.error("Error fetching categories", err);
        setError("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (
      ["actual_price", "stock", "minimum_order_quantity_for_offer"].includes(
        name
      ) &&
      value < 0
    ) {
      setError(`${name.replace("_", " ")} cannot be negative.`);
      return;
    } else {
      setError(null);
    }
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append("product_name", product.product_name);
      formData.append("actual_price", product.actual_price);
      formData.append("campaign_discount_percentage", product.campaign_discount_percentage);
      formData.append("description", product.description);
      formData.append("stock", product.stock);
      formData.append("category", product.category);
      formData.append("minimum_order_quantity_for_offer", product.minimum_order_quantity_for_offer);
  
      files.forEach((file) => {
        formData.append("product_images", file);  // ✅ Fixed
      });
  
      console.log("Updating product with ID:", id);
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
  
      await axios.put(  // ✅ Changed to PATCH
        `http://127.0.0.1:8000/wholesaler/product_edit/${id}/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Product updated successfully");
      navigate("/AddedProducts");
    } catch (err) {
      setError("Failed to update product");
      console.error(err);
    }
  };
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-3 col-md-4 col-12 border-end">
            <ul className="nav flex-column">
              <li className="nav-item">
                <a className="nav-link active" href="/MyAccountSetting">
                  <i className="fas fa-cog me-2" /> Settings
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/MyAccountOrder">
                  <i className="fas fa-shopping-bag me-2" /> Your Orders
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/MyAccountAddress">
                  <i className="fas fa-map-marker-alt me-2" /> Address
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/MyAcconutPaymentMethod">
                  <i className="fas fa-credit-card me-2" /> Payment Method
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/MyAcconutNotification">
                  <i className="fas fa-bell me-2" /> Notification
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/wholesaler_profile">
                  <i className="bi bi-card-list me-2" /> Added Products
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/">
                  <i className="fas fa-sign-out-alt me-2" /> Log out
                </a>
              </li>
            </ul>
          </div>

          <div className="col-lg-9 col-md-8 col-12">
            <h2 className="mb-4">Edit Product</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  name="product_name"
                  value={product.product_name}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                  placeholder="Product Name"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Description"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Actual Price (in KD)</label>
                <input
                  type="number"
                  name="actual_price"
                  value={product.actual_price}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Actual Price"
                />
              </div>
              <div className="mb-5">
                <label className="form-label">Campaign Discount Percentage(%):</label>
                  <input
                    type="number"
                    className="form-control"
                    name="campaignDiscountPercentage"
                    value={product.campaignDiscountPercentage}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    placeholder="Enter discount percentage"
                  />
              </div>
              <div className="mb-3">
                <label className="form-label">Stock (Kg)</label>
                <input
                  type="number"
                  name="stock"
                  value={product.stock}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Stock"
                />
              </div>
              <div className="mb-5">
                <label className="form-label">Product Category:</label>
                <select
                  id="product_category"
                  className="form-control"
                  name="category"
                  value={product.category}
                  onChange={handleInputChange}
                  required
                >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                  {category.name}
                  </option>
                    ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Minimum Order Quantity For Offer (in Kg)
                </label>
                <input
                  type="number"
                  name="minimum_order_quantity_for_offer"
                  value={product.minimum_order_quantity_for_offer}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Minimum Order Quantity"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Existing Images</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {product.product_images && product.product_images.map((img, index) => (
                    <img
                      key={index}
                      src={img.image_url}
                      alt={img.alt_text || `Thumbnail ${index}`}
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Image upload */}
              <div
  {...getRootProps()}
  style={{
    border: "2px dashed #aaa",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
  }}
>
  <input {...getInputProps()} multiple />
  {isDragActive ? (
    <p>Drop the images here...</p>
  ) : (
    <p>Drag & drop images here, or click to select files</p>
  )}

  <div
    style={{
      display: "flex",
      gap: "10px",
      marginTop: "10px",
      flexWrap: "wrap",
    }}
  >
    {files.map((file, index) => (
      <div
        key={file.name}
        style={{
          position: "relative",
          display: "inline-block",
        }}
      >
        <img
          src={file.preview}
          alt={file.name}
          style={{
            width: "100px",
            height: "100px",
            objectFit: "cover",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        />
        
        {/* X Button for removing the image */}
        <button
          onClick={(e) => {
            e.stopPropagation();  // Prevents the click from opening file dialog
            const updatedFiles = files.filter((_, i) => i !== index);
            setFiles(updatedFiles);  // Update state to remove the image
          }}
          style={{
            position: "absolute",
            top: "5px",
            right: "5px",
            backgroundColor: "rgba(0,0,0,0.6)",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "24px",
            height: "24px",
            cursor: "pointer",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0",
          }}
        >
          ✕
        </button>
      </div>
    ))}
  </div>
</div>
              <button type="submit" className="btn btn-primary">
                Update Product
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;