import React, { useState, useRef, useEffect } from "react";
import "./Product_detail.css";
import { useLoading } from "../../components/introduce/Loading";
import { useAuth } from "../../components/introduce/useAuth";
import { notify } from "../../components/Notification/notification";
import TryOnForm from "./TryOnForm";

const DEFAULT_IMAGE =
  "https://www.shutterstock.com/shutterstock/photos/600304136/display_1500/stock-vector-full-basket-of-food-grocery-shopping-special-offer-vector-line-icon-design-600304136.jpg";

const ProductDetail = ({ product, onClose, onUpdate }) => {
  const { startLoading, stopLoading } = useLoading();
  const { user, loading } = useAuth();
  const CLOUD_NAME = "ddgrjo6jr"; // TODO: Move to .env
  const UPLOAD_PRESET = "my-app"; // TODO: Move to .env
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...product });
  const [tryOnImage, setTryOnImage] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [imageUrl, setImageUrl] = useState(product.image?.secure_url || DEFAULT_IMAGE);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Cleanup camera stream on component unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditData({ ...product });
      setImageUrl(product.image?.secure_url || DEFAULT_IMAGE);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericValue = Number(value.replace(/,/g, "").replace(/\./g, ""));
    const formattedValue = !Number.isNaN(numericValue)
      ? numericValue.toLocaleString("vi-VN")
      : value;
    setEditData({
      ...editData,
      [name]: formattedValue.toLowerCase().replace(/,/g, "."),
    });
  };

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditData({ ...editData, image: file });
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    let updatedData = { ...editData };
    if (editData.image !== product.image && editData.image) {
      const imageData = new FormData();
      imageData.append("file", editData.image);
      imageData.append("upload_preset", UPLOAD_PRESET);
      try {
        startLoading();
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
          method: "POST",
          body: imageData,
        });
        if (!response.ok) throw new Error("Failed to upload image");
        const data = await response.json();
        updatedData = {
          ...updatedData,
          image: { secure_url: data.secure_url, public_id: data.public_id },
        };
      } catch (error) {
        notify(2, "Lỗi khi tải ảnh lên.", "Thất bại");
        console.error("Error uploading image:", error);
        return;
      } finally {
        stopLoading();
      }
    }
    onUpdate(updatedData);
    setIsEditing(false);
    setImageUrl(updatedData.image?.secure_url || DEFAULT_IMAGE);
  };

  const startCamera = async () => {
    try {
      setShowCamera(true);
      streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = streamRef.current;
    } catch (error) {
      notify(2, "Không thể truy cập camera.", "Thất bại");
      console.error("Error starting camera:", error);
      setShowCamera(false);
    }
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageUrl = canvas.toDataURL("image/png");
    setImageUrl(imageUrl);

    fetch(imageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "capture.png", { type: "image/png" });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
        setEditData({ ...editData, image: file });
      })
      .catch((error) => {
        notify(2, "Lỗi khi xử lý ảnh.", "Thất bại");
        console.error("Error processing image:", error);
      });

    stopCamera();
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const handleSubmit = async (product, quantity) => {
    console.log("slectproduct",product);
    const supplierName = "Không xác định";
    const supplierId = product.supplier?.id || "";
  
    const sanitizedProduct = {
      name: product.name,
      description: product.description || "",
      supplier: supplierName,
      price: product.price,
      imageUrl: product.image.secure_url,
      supplierId: supplierId,
      quantity: quantity,
      status: "pending",
      email: true,
      isChecked: true,
      emailName: "",
      productId: product._id,
    };
  
    const groupBySupplier = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        ownerId: user.id_owner,
        id_owner: user.id_owner,
        role: user.role,
      },
      dataForm: {
        [supplierName]: [sanitizedProduct],
      },
      tax: 10,
    };
  
    try {
      startLoading();
      const response = await fetch("http://localhost:5000/import/orderHistory/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(groupBySupplier),
      });
      stopLoading();
      console.log("dat hang",groupBySupplier);
      if (response.ok) {
        const data = await response.json();
        notify(1, "Bạn đã tạo đơn hàng thành công", "Successfully!");
        console.log("Dữ liệu đã được gửi thành công", data);
      } else {
        const error = await response.json();
        notify(2, error.message || "Tạo đơn hàng không thành công", "Fail!");
        console.error("Lỗi khi gửi dữ liệu:", response.statusText);
      }
    } catch (error) {
      stopLoading();
      notify(2, "Lỗi kết nối.", "Thất bại");
      console.error("Lỗi kết nối:", error);
    } finally {
      setSelectedProduct(null);
    }
  };
  
 // set clongthingtype for api try on 
  const getClothingTypeFromSKU = (sku) => {
  if (!sku) return "unknown";
  const firstChar = sku.charAt(0).toLowerCase();
  if (firstChar === "a") return "tops";
  if (firstChar === "q") return "bottoms";
  if (firstChar === "o") return "one-pieces";
  return "unknown";
};


  if (loading) return <div>Loading...</div>;

  return (
    <div className="product-detail-overlay">
      <div className="product-detail-container">
        <span
          className="close-button"
          onClick={onClose}
          aria-label="Đóng"
          role="button"
        >
          ×
        </span>
        {tryOnImage && (
          <TryOnForm productImage={tryOnImage}  
          
          // set loại cho api try on
          clothing_type={getClothingTypeFromSKU(product.sku)} 
          
          onClose={() => setTryOnImage(null)} />
        )}
        <div className="product-info-grid">
          <div className="product-image-section">
            <img
              src={isEditing ? imageUrl : product.image?.secure_url || DEFAULT_IMAGE}
              alt={product.name}
              className="product-image-show"
            />
            <div className="product-buttons">
              <button
                className="order-button"
                onClick={() => {
                  setSelectedProduct(product);
                  setQuantity(1);
                }}
              >
                Đặt hàng
              </button>
              <button
                className="camera-button"
                onClick={() => setTryOnImage(product.image?.secure_url || null)}
              >
                Thử đồ
              </button>
              {isEditing && (
                <>
                  <button onClick={startCamera}>Chụp ảnh</button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleChangeImage}
                  />
                </>
              )}
              {/* <button onClick={handleEditToggle}>
                {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa"}
              </button> */}
            </div>
          </div>
          <div className="product-info-details">
            {[
              ["Tên", product.name],
              ["Loại", product.category],
              ["Thương hiệu", product.brand],
              ["Mã", product.sku],
              ["Giá bán", `$${product.price}`],
              ["Số lượng trên kệ", product.stock_in_shelf],
              ["Mức độ cần nhập", product.reorderLevel],
              ["Nhà cung cấp", product.supplier?.name || "Không có nhà cung cấp"],
              ["Ngày nhập", new Date(product.purchaseDate).toLocaleDateString()],
              ["Vị trí", product.location],
              ["Số lượng kho", product.stock_in_Warehouse],
              ["Đơn vị", product.unit],
              ["Giá nhập", `$${product.purchasePrice}`],
              ["Ghi chú", product.notes],
              ["Link ảnh", product.image?.secure_url || ""],
            ].map(([label, value]) => (
              <div className="product-info-details-row" key={label}>
                <strong>{label}:</strong>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
        {isEditing && (
          <form onSubmit={handleUpdate} className="edit-form">
            <label>
              Tên:
              <input
                name="name"
                value={editData.name || ""}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Giá bán:
              <input
                name="price"
                value={editData.price || ""}
                onChange={handleChange}
                type="text"
              />
            </label>
            <label>
              Giá nhập:
              <input
                name="purchasePrice"
                value={editData.purchasePrice || ""}
                onChange={handleChange}
                type="text"
              />
            </label>
            <label>
              Số lượng trên kệ:
              <input
                name="stock_in_shelf"
                value={editData.stock_in_shelf || ""}
                onChange={handleChange}
                type="number"
              />
            </label>
            <label>
              Số lượng kho:
              <input
                name="stock_in_Warehouse"
                value={editData.stock_in_Warehouse || ""}
                onChange={handleChange}
                type="number"
              />
            </label>
            <button type="submit">Lưu</button>
            <button type="button" onClick={handleEditToggle}>
              Hủy
            </button>
          </form>
        )}
        {selectedProduct && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Chi tiết sản phẩm</h3>
              <img
                src={selectedProduct.image.secure_url}
                alt={selectedProduct.name}
                style={{ width: "100%", maxHeight: "250px", objectFit: "contain", borderRadius: "12px", marginBottom: "16px" }}
              />

              <p>Tên: {selectedProduct.name}</p>
              <p>Giá: ${selectedProduct.price}</p>
              <p>
                Nhà cung cấp: {selectedProduct.supplier?.name || "Không có nhà cung cấp"}
              </p>
              <label>
                Số lượng:
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  required
                />
              </label>
              <button
                className="order-button"
                onClick={() => handleSubmit(selectedProduct, quantity)}
              >
                Đặt hàng
              </button>
              <button className="cancel-button" onClick={() => setSelectedProduct(null)}>Hủy</button>
            </div>
          </div>
        )}
        {showCamera && (
          <div className="camera-modal">
            <div className="camera-container">
              <video ref={videoRef} autoPlay style={{ width: "100%" }} />
              <button className="button-capture" onClick={captureImage}>
                Chụp
              </button>
              <button className="button-capture" onClick={stopCamera}>
                Hủy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;