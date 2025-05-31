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
   const [confirmbuy, setIsconfirmbuy] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleProducts, setVisibleProducts] = useState(8);
  // const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  // const [quantity, setQuantity] = useState(1);
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

  const handleSubmit = async (product, quantity,size) => {
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
      size: size, // ✅ Thêm dòng này
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

  // return (
  //   <div className="product-detail-overlay">
  //     <div className="product-detail-container">
  //       <span
  //         className="close-button"
  //         onClick={onClose}
  //         aria-label="Đóng"
  //         role="button"
  //       >
  //         ×
  //       </span>
  //       {tryOnImage && (
  //         <TryOnForm productImage={tryOnImage}  
          
  //         // set loại cho api try on
  //         clothing_type={getClothingTypeFromSKU(product.sku)} 
          
  //         onClose={() => setTryOnImage(null)} />
  //       )}
  //       <div className="product-info-grid">
  //         <div className="product-image-section">
  //           <img
  //             src={isEditing ? imageUrl : product.image?.secure_url || DEFAULT_IMAGE}
  //             alt={product.name}
  //             className="product-image-show"
  //           />
  //           <div className="product-buttons">
  //             <button
  //               className="order-button"
  //               onClick={() => {
  //                 setSelectedProduct(product);
  //                 setQuantity(1);
  //               }}
  //             >
  //               Đặt hàng
  //             </button>
  //             <button
  //               className="camera-button"
  //               onClick={() => setTryOnImage(product.image?.secure_url || null)}
  //             >
  //               Thử đồ
  //             </button>
  //             {isEditing && (
  //               <>
  //                 <button onClick={startCamera}>Chụp ảnh</button>
  //                 <input
  //                   type="file"
  //                   ref={fileInputRef}
  //                   accept="image/*"
  //                   onChange={handleChangeImage}
  //                 />
  //               </>
  //             )}
  //             {/* <button onClick={handleEditToggle}>
  //               {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa"}
  //             </button> */}
  //           </div>
  //         </div>
  //         <div className="product-info-details">
  //           {[
  //             ["Tên", product.name],
  //             ["Loại", product.category],
  //             ["Thương hiệu", product.brand],
  //             ["Mã", product.sku],
  //             ["Giá bán", `$${product.price}`],
  //             ["Số lượng trên kệ", product.stock_in_shelf],
  //             ["Mức độ cần nhập", product.reorderLevel],
  //             ["Nhà cung cấp", product.supplier?.name || "Không có nhà cung cấp"],
  //             ["Ngày nhập", new Date(product.purchaseDate).toLocaleDateString()],
  //             ["Vị trí", product.location],
  //             ["Số lượng kho", product.stock_in_Warehouse],
  //             ["Đơn vị", product.unit],
  //             ["Giá nhập", `$${product.purchasePrice}`],
  //             ["Ghi chú", product.notes],
  //             ["Link ảnh", product.image?.secure_url || ""],
  //           ].map(([label, value]) => (
  //             <div className="product-info-details-row" key={label}>
  //               <strong>{label}:</strong>
  //               <span>{value}</span>
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //       {isEditing && (
  //         <form onSubmit={handleUpdate} className="edit-form">
  //           <label>
  //             Tên:
  //             <input
  //               name="name"
  //               value={editData.name || ""}
  //               onChange={handleChange}
  //               required
  //             />
  //           </label>
  //           <label>
  //             Giá bán:
  //             <input
  //               name="price"
  //               value={editData.price || ""}
  //               onChange={handleChange}
  //               type="text"
  //             />
  //           </label>
  //           <label>
  //             Giá nhập:
  //             <input
  //               name="purchasePrice"
  //               value={editData.purchasePrice || ""}
  //               onChange={handleChange}
  //               type="text"
  //             />
  //           </label>
  //           <label>
  //             Số lượng trên kệ:
  //             <input
  //               name="stock_in_shelf"
  //               value={editData.stock_in_shelf || ""}
  //               onChange={handleChange}
  //               type="number"
  //             />
  //           </label>
  //           <label>
  //             Số lượng kho:
  //             <input
  //               name="stock_in_Warehouse"
  //               value={editData.stock_in_Warehouse || ""}
  //               onChange={handleChange}
  //               type="number"
  //             />
  //           </label>
  //           <button type="submit">Lưu</button>
  //           <button type="button" onClick={handleEditToggle}>
  //             Hủy
  //           </button>
  //         </form>
  //       )}
  //       {selectedProduct && (
  //       <div className="modal-overlay">
  //         <div className="modal">
  //           <h3>Chi tiết sản phẩm</h3>
  //           <img
  //             src={selectedProduct.image.secure_url}
  //             alt={selectedProduct.name}
  //             style={{
  //               width: "100%",
  //               maxHeight: "250px",
  //               objectFit: "contain",
  //               borderRadius: "12px",
  //               marginBottom: "16px",
  //             }}
  //           />

  //           <p>Tên: {selectedProduct.name}</p>
  //           <p>Giá: ${Number(selectedProduct.price || 0).toLocaleString()}</p>
  //           <p>
  //             Nhà cung cấp: {selectedProduct.supplier?.name || "Không có nhà cung cấp"}
  //           </p>
  //           <label>
  //             Số lượng:
  //             <input
  //               type="number"
  //               min="1"
  //               value={quantity}
  //               onChange={(e) => setQuantity(Number(e.target.value))}
  //               required
  //             />
  //           </label>

  //           <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
  //             <button
  //               className="order-button"
  //               onClick={() => handleSubmit(selectedProduct, quantity)}
  //             >
  //               Đặt hàng
  //             </button>

  //             <button
  //               className="cancel-order-button"
  //               onClick={() => {
  //                 // Xử lý hủy đơn tại đây nếu cần
  //                 setQuantity(1); // Reset lại số lượng
  //                 alert("Đã hủy đặt hàng!");
  //               }}
  //             >
  //               Hủy đặt hàng
  //             </button>

  //             <button
  //               className="cancel-button"
  //               onClick={() => setSelectedProduct(null)}
  //             >
  //               Đóng
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     )}

  //             {/* {showProductDetail && selectedProduct && (
  //       <div className="product-detail-overlay">
  //         <div className="product-detail-modal">
  //           <button 
  //             className="close-detail-btn"
  //             onClick={() => {
  //               setShowProductDetail(false);
  //               setSelectedProduct(null);
  //               setSelectedSize('');
  //               setSelectedColor('');
  //               setQuantity(1);
  //             }}
  //           >
  //             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
  //               <line x1="18" y1="6" x2="6" y2="18"></line>
  //               <line x1="6" y1="6" x2="18" y2="18"></line>
  //             </svg>
  //           </button>
            
  //           <div className="product-detail-content">
  //             <div className="product-detail-left">
  //               <img src={selectedProduct.image} alt={selectedProduct.name} className="product-detail-image" />
  //             </div>
              
  //             <div className="product-detail-right">
  //               <div className="product-detail-header">
  //                 <h1 className="product-detail-name">{selectedProduct.name}</h1>
  //                 <div className="product-detail-brand">{selectedProduct.brand}</div>
  //                 <div className="product-detail-sku">SKU: {selectedProduct.sku}</div>
  //               </div>
                
  //               <div className="product-detail-price">
  //                 {selectedProduct.discount > 0 ? (
  //                   <div className="price-with-discount">
  //                     <span className="discounted-price">{(selectedProduct.originalPrice * (1 - selectedProduct.discount / 100)).toLocaleString()} VND</span>
  //                     <span className="original-price">{selectedProduct.originalPrice.toLocaleString()} VND</span>
  //                     <span className="discount-badge">-{selectedProduct.discount}%</span>
  //                   </div>
  //                 ) : (
  //                   <span className="current-price">{selectedProduct.originalPrice.toLocaleString()} VND</span>
  //                 )}
  //               </div>
                
  //               <div className="product-detail-description">
  //                 <h3>Mô tả sản phẩm</h3>
  //                 <p>{selectedProduct.description}</p>
  //               </div>
                
  //               <div className="product-detail-info">
  //                 <div className="info-grid">
  //                   <div className="info-item">
  //                     <strong>Chất liệu:</strong> {selectedProduct.material}
  //                   </div>
  //                   <div className="info-item">
  //                     <strong>Đơn vị:</strong> {selectedProduct.unit}
  //                   </div>
  //                   <div className="info-item">
  //                     <strong>Vị trí:</strong> {selectedProduct.location}
  //                   </div>
  //                   <div className="info-item">
  //                     <strong>Thử đồ:</strong> {selectedProduct.try_on_available ? 'Có' : 'Không'}
  //                   </div>
  //                   <div className="info-item">
  //                     <strong>Đánh giá:</strong> {selectedProduct.rate}/5 ⭐
  //                   </div>
  //                   <div className="info-item">
  //                     <strong>Kho hàng:</strong> {selectedProduct.stock_in_Warehouse} | <strong>Kệ:</strong> {selectedProduct.stock_in_shelf}
  //                   </div>
  //                 </div>
  //               </div>
                
  //               {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
  //                 <div className="product-detail-sizes">
  //                   <h3>Kích thước</h3>
  //                   <div className="size-options">
  //                     {selectedProduct.sizes.map((size) => (
  //                       <button
  //                         key={size}
  //                         className={`size-option ${selectedSize === size ? 'selected' : ''}`}
  //                         onClick={() => setSelectedSize(size)}
  //                         disabled={selectedProduct.stock && selectedProduct.stock[size] && selectedProduct.stock[size].quantity === 0}
  //                       >
  //                         {size}
  //                         {selectedProduct.stock && selectedProduct.stock[size] && (
  //                           <span className="stock-count">({selectedProduct.stock[size].quantity})</span>
  //                         )}
  //                       </button>
  //                     ))}
  //                   </div>
  //                 </div>
  //               )}
                
  //               {selectedProduct.colors && selectedProduct.colors.length > 0 && (
  //                 <div className="product-detail-colors">
  //                   <h3>Màu sắc</h3>
  //                   <div className="color-options">
  //                     {selectedProduct.colors.map((color, index) => (
  //                       <button
  //                         key={index}
  //                         className={`color-option ${selectedColor === color ? 'selected' : ''}`}
  //                         onClick={() => setSelectedColor(color)}
  //                         style={{ backgroundColor: color }}
  //                         title={color}
  //                       />
  //                     ))}
  //                   </div>
  //                 </div>
  //               )}
                
  //               <div className="product-detail-quantity">
  //                 <h3>Số lượng</h3>
  //                 <div className="quantity-control">
  //                   <button 
  //                     className="quantity-btn"
  //                     onClick={() => setQuantity(Math.max(1, quantity - 1))}
  //                   >
  //                     -
  //                   </button>
  //                   <input 
  //                     type="number" 
  //                     value={quantity} 
  //                     onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
  //                     className="quantity-input"
  //                     min="1"
  //                   />
  //                   <button 
  //                     className="quantity-btn"
  //                     onClick={() => setQuantity(quantity + 1)}
  //                   >
  //                     +
  //                   </button>
  //                 </div>
  //               </div>
                
  //               {selectedProduct.notes && (
  //                 <div className="product-detail-notes">
  //                   <h3>Ghi chú</h3>
  //                   <p>{selectedProduct.notes}</p>
  //                 </div>
  //               )}
                
  //               <div className="product-detail-actions">
  //                 <button 
  //                   className="add-to-cart-btn"
  //                   onClick={() => {
  //                     // Xử lý thêm vào giỏ hàng
  //                     const orderData = {
  //                       product: selectedProduct,
  //                       size: selectedSize,
  //                       color: selectedColor,
  //                       quantity: quantity
  //                     };
  //                     console.log('Đặt hàng:', orderData);
  //                     alert('Đã thêm vào giỏ hàng!');
  //                   }}
  //                   disabled={
  //                     (selectedProduct.sizes && selectedProduct.sizes.length > 0 && !selectedSize) ||
  //                     (selectedProduct.colors && selectedProduct.colors.length > 0 && !selectedColor)
  //                   }
  //                 >
  //                   THÊM VÀO GIỎ HÀNG
  //                 </button>
  //                 <button 
  //                   className="buy-now-btn"
  //                   onClick={() => {
  //                     // Xử lý mua ngay
  //                     const orderData = {
  //                       product: selectedProduct,
  //                       size: selectedSize,
  //                       color: selectedColor,
  //                       quantity: quantity
  //                     };
  //                     console.log('Mua ngay:', orderData);
  //                     alert('Chuyển đến trang thanh toán!');
  //                   }}
  //                   disabled={
  //                     (selectedProduct.sizes && selectedProduct.sizes.length > 0 && !selectedSize) ||
  //                     (selectedProduct.colors && selectedProduct.colors.length > 0 && !selectedColor)
  //                   }
  //                 >
  //                   MUA NGAY
  //                 </button>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     )} */}
  //       {showCamera && (
  //         <div className="camera-modal">
  //           <div className="camera-container">
  //             <video ref={videoRef} autoPlay style={{ width: "100%" }} />
  //             <button className="button-capture" onClick={captureImage}>
  //               Chụp
  //             </button>
  //             <button className="button-capture" onClick={stopCamera}>
  //               Hủy
  //             </button>
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );
  return (
  <div className="product-detail-overlay">
    {/* <div className="product-detail-container"> */}
      {/* Try On Modal */}
      {tryOnImage && (
        <TryOnForm 
          productImage={tryOnImage}  
          clothing_type={getClothingTypeFromSKU(product.sku)} 
          onClose={() => setTryOnImage(null)} 
        />
      )}

      {/* Product Detail Modal */}
      <div className="product-detail-modal">
        <button
           
          className="close-detail-btn"
          // onClick={() => {
          //   setShowProductDetail(false);
          //   setSelectedProduct(null);
          //   setSelectedSize('');
          //   setSelectedColor('');
          //   setQuantity(1);
          //   // onClose;
            
          // }}
          onClick={onClose}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div className="product-detail-content">
          
          <div className="product-detail-left">
            {/* <img src={product.image} alt={product.name} className="product-detail-image" />        */}
            <img
               src={isEditing ? imageUrl : product.image?.secure_url || DEFAULT_IMAGE}
               alt={product.name}
               className="product-detail-image"
             />
            
            {/* Try On Button */}
            {/* {product.try_on_available && (
              <button 
                className="try-on-btn"
                onClick={() => setTryOnImage(product.image?.secure_url || null)}
              >
                THỬ ĐỒ TRỰC TUYẾN
              </button>
            )} */}
          </div>
          
          <div className="product-detail-right">
            <div className="product-detail-header">
              <h1 className="product-detail-name">{product.name}</h1>
              <div className="product-detail-brand">{product.brand}</div>
              <div className="product-detail-sku">SKU: {product.sku}</div>
            </div>
            
            <div className="product-detail-price">
              {product.discount > 0 ? (
                <div className="price-with-discount">
                  <span className="discounted-price">{(product.price * (1 - product.discount / 100)).toLocaleString()} VND</span>
                  <span className="original-price">{product.price.toLocaleString()} VND</span>
                  <span className="discount-badge">-{product.discount}%</span>
                </div>
              ) : (
                <span className="current-price">{product.price.toLocaleString()} VND</span>
              )}
            </div>
            
            <div className="product-detail-description">
              <h3>Mô tả sản phẩm</h3>
              <p>{product.description}</p>
            </div>
            
            <div className="product-detail-info">
              <div className="info-grid">
                <div className="info-item">
                  <strong>Chất liệu:</strong> {product.material}
                </div>
                <div className="info-item">
                  <strong>Đơn vị:</strong> {product.unit}
                </div>
                <div className="info-item">
                  <strong>Vị trí:</strong> {product.location}
                </div>
                <div className="info-item">
                  <strong>Thử đồ:</strong> {product.try_on_available ? 'Có' : 'Không'}
                </div>
                <div className="info-item">
                  <strong>Đánh giá:</strong> {product.rate}/5 ⭐
                </div>
                <div className="info-item">
                  <strong>Kho hàng:</strong> {product.stock_in_Warehouse} | <strong>Kệ:</strong> {product.stock_in_shelf}
                </div>
              </div>
            </div>
            
            {product.sizes && product.sizes.length > 0 && (
              <div className="product-detail-sizes">
                <h3>Kích thước</h3>
                <div className="size-options">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(size)}
                      disabled={product.stock && product.stock[size] && product.stock[size].quantity === 0}
                    >
                      {size}
                      {product.stock && product.stock[size] && (
                        <span className="stock-count">({product.stock[size].quantity})</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {product.colors && product.colors.length > 0 && (
              <div className="product-detail-colors">
                <h3>Màu sắc</h3>
                <div className="color-options">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                      onClick={() => setSelectedColor(color)}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
            
            <div className="product-detail-quantity">
              <h3>Số lượng</h3>
              <div className="quantity-control">
                <button 
                  className="quantity-btn"
                  onClick={() => 
                    {
                      setQuantity(Math.max(1, quantity - 1));
                      setIsconfirmbuy(true);
                    }  
                  }
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="quantity-input"
                  min="1"
                />
                <button 
                  className="quantity-btn"
                  onClick={() => 
                    {
                    setIsconfirmbuy(true);
                    setQuantity(quantity + 1)
                    }
                  }
                >
                  +
                </button>
              </div>
              
            </div>
            <h5>Thuế GTGT :10% </h5>
         {confirmbuy && (
         
            <div className="product-detail-notes">
              <h3>
                Thành tiền: {(product.price * quantity * 1100).toLocaleString()} VND
              </h3>
               <p></p>
            </div>
          )}

            
            {product.notes && (
              <div className="product-detail-notes">
                <h3>Ghi chú</h3>
                <p>{product.notes}</p>
              </div>
            )}
            
            <div className="product-detail-actions">
              <button 
                className="add-to-cart-btn"
                onClick={() => {
                  const orderData = {
                    product: product,
                    size: selectedSize,
                    color: selectedColor,
                    quantity: quantity
                  };
                  console.log('Đặt hàng:', orderData);
                  alert('Đã thêm vào giỏ hàng!');
                }}
                disabled={
                  (product.sizes && product.sizes.length > 0 && !selectedSize) ||
                  (product.colors && product.colors.length > 0 && !selectedColor)
                }
              >
                THÊM VÀO GIỎ HÀNG
              </button>
                     {/* Try On Button */}
              {product.try_on_available && (
                <button 
                  className="try-on-btn"
                  onClick={() => setTryOnImage(product.image?.secure_url || null)}
                >
                  THỬ ĐỒ TRỰC TUYẾN
                </button>
              )}
                
              <button 
                className="buy-now-btn"
                onClick={() => {
                  const orderData = {
                    product: product,
                    size: selectedSize,
                    color: selectedColor,
                    quantity: quantity
                  };
                  handleSubmit(product, quantity, selectedSize);
                  
                  console.log('Mua ngay:', orderData);
                  // alert('Chuyển đến trang thanh toán!');
                }}
                // onClick={() => handleSubmit(selectedProduct, quantity)}
                disabled={
                  (product.sizes && product.sizes.length > 0 && !selectedSize) ||
                  (product.colors && product.colors.length > 0 && !selectedColor)
                }
              >
                MUA NGAY
              </button>
            </div>
          </div>
        </div>
      </div>
    {/* </div> */}
  </div>
);
};

export default ProductDetail;