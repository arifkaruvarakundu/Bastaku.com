import React from "react";
import { useDropzone } from "react-dropzone";

const VariantList = ({ variants, handleVariantChange, onDrop, removeImage, removeVariant, addVariant, tProduct }) => {
  return (
    <div className="mb-5">
      <h5>Product Variants</h5>
      {variants.map((variant, index) => (
        <VariantItem
          key={index}
          index={index}
          variant={variant}
          handleVariantChange={handleVariantChange}
          onDrop={onDrop}
          removeImage={removeImage}
          removeVariant={removeVariant}
          tProduct={tProduct}
        />
      ))}

      {/* Add Variant Button */}
      <button type="button" onClick={addVariant} className="btn btn-secondary mt-2">
        Add Variant
      </button>
    </div>
  );
};

// ✅ Separate VariantItem component to handle each variant
const VariantItem = ({ index, variant, handleVariantChange, onDrop, removeImage, removeVariant, tProduct }) => {
  // ✅ useDropzone called at the top level
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/*",
    multiple: true,
    onDrop: (acceptedFiles) => onDrop(index, acceptedFiles),
  });

  return (
    <div className="border p-3 mb-3">
      {/* Brand */}
      <label className="form-label">Brand</label>
      <input
        type="text"
        name="brand"
        value={variant.brand}
        onChange={(e) => handleVariantChange(index, e)}
        className="form-control"
        placeholder="Enter brand name"
      />

      {/* Weight OR Liter */}
      <div className="d-flex gap-3">
        {/* Weight */}
        <div>
          <label className="form-label">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={variant.weight}
            onChange={(e) => handleVariantChange(index, e)}
            className="form-control"
            disabled={variant.liter !== ""}
            placeholder="Enter weight in kg"
          />
        </div>

        {/* Liter */}
        <div>
          <label className="form-label">Volume (L)</label>
          <input
            type="number"
            name="liter"
            value={variant.liter}
            onChange={(e) => handleVariantChange(index, e)}
            className="form-control"
            disabled={variant.weight !== ""}
            placeholder="Enter volume in liters"
          />
        </div>
      </div>

      {/* Price */}
      <label className="form-label">Price</label>
      <input
        type="number"
        name="price"
        value={variant.price}
        onChange={(e) => handleVariantChange(index, e)}
        className="form-control"
        placeholder="Enter price"
      />

      {/* Stock */}
      <label className="form-label">Stock</label>
      <input
        type="number"
        name="stock"
        value={variant.stock}
        onChange={(e) => handleVariantChange(index, e)}
        className="form-control"
        placeholder="Enter stock"
      />

      {/* Campaign Discount */}
      <label className="form-label">Campaign Discount (%)</label>
      <input
        type="number"
        name="campaign_discount_percentage"
        value={variant.campaign_discount_percentage}
        onChange={(e) => handleVariantChange(index, e)}
        className="form-control"
      />

      <label className="form-label">{tProduct("minimum_order_quantity_for_offer")}</label>
      <input
        type="number"
        className="form-control"
        name="minimum_order_quantity_for_offer"
        value={variant.minimum_order_quantity_for_offer}
        onChange={(e) => handleVariantChange(index, e)}
        placeholder={tProduct("enter_minimum_quantity_for_offer")}
      />

      {/* Image Upload Section */}
      <div
        {...getRootProps()}
        style={{
          border: "2px dashed #aaa",
          padding: "20px",
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? <p>{tProduct("drop_images_here")}</p> : <p>{tProduct("drag_drop_images")}</p>}
        <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
          {variant.images &&
            variant.images.map((file, imgIndex) => (
              <div key={imgIndex} style={{ position: "relative" }}>
                <img
                  src={file.preview}
                  alt={file.name}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <button
                  type="button"
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index, imgIndex);
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Remove Variant Button */}
      <button type="button" onClick={() => removeVariant(index)} className="btn btn-danger mt-2">
        Remove Variant
      </button>
    </div>
  );
};

export default VariantList;
