import React from "react";

const ExistingImagesSection = ({ variant, variantIndex, removeVariantImage }) => {
  return (
    <div className="mb-3">
      <h5>Variant: {variant.brand} (Weight: {variant.weight}kg)</h5>
      {variant.variant_images && variant.variant_images.length > 0 && (
        <div className="image-container" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {variant.variant_images.map((image, imageIndex) => (
            <div key={imageIndex} className="image-item">
              <img
                src={image.image_url || 'placeholder-image-url.jpg'}
                alt={`Variant ${variantIndex} - Image ${imageIndex}`}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <button
                type="button"
                onClick={() => removeVariantImage(variantIndex, imageIndex, "existing")}
                className="btn btn-danger btn-sm remove-btn"
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExistingImagesSection;
