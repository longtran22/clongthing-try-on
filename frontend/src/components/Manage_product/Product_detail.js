// ProductDetail.js
import React, { useState, useRef,useEffect } from "react";
import "../Manage_product/Product_detail.css";
import { useLoading } from "../introduce/Loading";
import { useAuth } from "../introduce/useAuth";
import { notify } from '../../components/Notification/notification';
const ProductDetail = ({ product, onClose, onUpdate }) => {
  const { startLoading, stopLoading } = useLoading();
  const { user,loading} = useAuth();
  const CLOUD_NAME = "ddgrjo6jr";
  const UPLOAD_PRESET = "my-app";
  const [g, setg] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...product });
  const [products, Setproduct] = useState(product);
  const [details, Setdetails] = useState("");
  const [link, SetLink] = useState(
    product.image
      ? product.image.secure_url
      : "https://www.shutterstock.com/shutterstock/photos/600304136/display_1500/stock-vector-full-basket-of-food-grocery-shopping-special-offer-vector-line-icon-design-600304136.jpg"
  );
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const scrollableRef = useRef(null);
  const [suppliers, setSuppliers] = useState([]); // state for suppliers list
  useEffect(() => {
    const fetchSuppliers = async () => {
      let body = {
        user: user,
      };
      try {
        let response = await fetch(
          "http://localhost:5000/products/get_supplier",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );
        const data = await response.json();
        console.log(data.suppliers);
        setSuppliers(data.suppliers);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };
    fetchSuppliers();
  }, []);
  const scrollToTop = () => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const startCamera = async () => {
    setShowCamera(true);
    scrollToTop();
    streamRef.current = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    videoRef.current.srcObject = streamRef.current;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Xóa dấu phân tách cũ và chuyển thành số
    const numericValue = Number(value.replace(/,/g, "").replace(/\./g, ""));

    // Định dạng lại nếu là số hợp lệ
    const formattedValue = !Number.isNaN(numericValue)
      ? numericValue.toLocaleString("vi-VN")
      : value;

    // Cập nhật formData với giá trị đã chuyển đổi
    setEditData({
      ...editData,
      [name]:
        typeof formattedValue === "string"
          ? formattedValue.toLowerCase().replace(/,/g, ".")
          : value.replace(/,/g, "."),
    });
  };

  const handleChange_link = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
    fileInputRef.current.value = "";
    SetLink(value);
  };
  const handleChangedetail = (e) => {
    const { value } = e.target;
    Setdetails(value);
  };
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    let x = { ...editData };
    if (editData.image != product.image && editData.image) {
      const imageData = new FormData();
      imageData.append("file", editData.image);
      imageData.append("upload_preset", UPLOAD_PRESET);
      try {
        startLoading();
        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
          {
            method: "POST",
            body: imageData, // Gửi FormData trực tiếp mà không cần JSON.stringify
          }
        );
        const data = await cloudinaryResponse.json();
        const secure_url = data.secure_url;
        const public_id = data.public_id;
        x = {
          ...x,
          image: { secure_url, public_id }, // Thêm thông tin hình ảnh
        };
      } catch (error) {
        console.error("Error uploading image:", error);
        notify(2,"Đã xảy ra lỗi khi tải lên hình ảnh.","Thất bại")
      }
    }
    onUpdate(x, details, editData.image != product.image && editData.image);
    Setproduct(editData);
    setIsEditing(false);
  };
  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageUrl = canvas.toDataURL("image/png");
    SetLink(imageUrl);
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => track.stop()); // Dừng từng track trong stream
      videoRef.current.srcObject = null; // Gán srcObject về null
      streamRef.current = null; // Đặt lại tham chiếu stream
    }
    setShowCamera(false); // Đóng camera sau khi chụp
    // Tạo một file blob từ imageUrl và đặt vào input file
    fetch(imageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "capture.png", { type: "image/png" });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
        setEditData((prevData) => ({
          ...prevData,
          image: file, // Lưu trữ file vào state
        }));
      });
  };
  const handleChangeimage = (e) => {
    setEditData({
      ...editData,
      image: e.target.files[0],
    });
    const imageUrl = URL.createObjectURL(e.target.files[0]);
    console.log("Link ảnh đã được cập nhật:", imageUrl);
    SetLink(imageUrl); // Cập nhật link với URL ngắn hơn
  };
  const stopCamera = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => track.stop()); // Dừng từng track trong stream
      videoRef.current.srcObject = null; // Gán srcObject về null
      streamRef.current = null; // Đặt lại tham chiếu stream
    }
    setShowCamera(false); // Đóng modal hoặc ẩn camera
  };
  const handleNChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value.toLowerCase()
    });
  };
  return (
   <div className="product-detail-overlay">
      <div className="product-detail-container">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        {!isEditing ? (
             <div className="product-info-grid">
            {/* Bên trái: ảnh sản phẩm và các nút */}
            <div className="product-image-section">
              <img
                src={
                  products.image
                    ? products.image.secure_url
                    : "https://www.shutterstock.com/shutterstock/photos/600304136/display_1500/stock-vector-full-basket-of-food-grocery-shopping-special-offer-vector-line-icon-design-600304136.jpg"
                }
                alt="Product"
                className="product-image-show"
              />
              <div className="product-buttons">
                {/* <button className="order-button" onClick={() => notify(1, "Chức năng đặt hàng chưa được tích hợp", "Thông báo")}>
                  Đặt hàng
                </button>
                <button className="camera-button" onClick={() => setTryOnImage(products.image?.secure_url || null)}>
            Thử đồ
          </button> */}
                <button className="edit-button-detail" onClick={handleEditToggle}>
              Edit
            </button>
                
              </div>
            </div>
          
            {/* Bên phải: thông tin sản phẩm */}
            <div className="product-info-details">
              {[
                ["Tên", products.name],
                ["Loại", products.category],
                ["Thương hiệu", products.brand],
                ["Mã", products.sku],
                ["Giá bán", `$${products.price}`],
                ["Số lượng trên kệ", products.stock_in_shelf],
                ["Mức độ cần nhập", products.reorderLevel],
                ["Nhà cung cấp", products.supplier ? products.supplier.name : "Đã bị xoá"],
                ["Ngày nhập", new Date(products.purchaseDate).toLocaleDateString()],
                ["Vị trí", products.location],
                ["Số lượng kho", products.stock_in_Warehouse],
                ["Đơn vị", products.unit],
                ["Giá nhập", `$${products.purchasePrice}`],
                ["Kích cỡ", Array.isArray(products.sizes) ? products.sizes.join(", ") : ""],
                ["Màu sắc", Array.isArray(products.colors) ? products.colors.join(", ") : ""],
                ["Chất liệu", products.material || ""],
                ["Ghi chú", products.notes],
                ["Link ảnh", products.image?.secure_url || ""]
              ].map(([label, value]) => (
                <div className="product-info-details-row" key={label}>
                  <strong>{label}:</strong>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
          
        ) : (
          <div className="product-edit-form">
            <h2>Edit Product</h2>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label htmlFor="name">Tên *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editData.name}
                  onChange={handleNChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Loại *</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={editData.category}
                  onChange={handleNChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="brand">Thương hiệu</label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={editData.brand}
                  onChange={handleNChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="sku">Mã *</label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  value={editData.sku}
                  onChange={handleNChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="price">Giá bán *</label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={editData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="purchasePrice">Giá nhập</label>
                <input
                  type="text"
                  id="purchasePrice"
                  name="purchasePrice"
                  value={editData.purchasePrice}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="stock_in_shelf">Số lượng trên kệ</label>
                <input
                  type="number"
                  id="stock_in_shelf"
                  name="stock_in_shelf"
                  value={editData.stock_in_shelf}
                  onChange={handleNChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="reorderLevel">
                  Số lượng cần được nhập hàng
                </label>
                <input
                  type="number"
                  id="reorderLevel"
                  name="reorderLevel"
                  value={editData.reorderLevel}
                  onChange={handleNChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="supplier">Nhà cung cấp</label>
                <select
                  id="supplier"
                  name="supplier"
                  value={editData.supplier ? editData.supplier._id : ""}
                  onChange={handleNChange}
                >
                  <option value="">-- Null --</option> {/* Thêm option null đầu tiên */}
                  {suppliers.map((supplier) => (
                    <option key={supplier._id} value={supplier._id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="purchaseDate">Ngày nhập</label>
                <input
                  type="date"
                  id="purchaseDate"
                  name="purchaseDate"
                  value={editData.purchaseDate}
                  onChange={handleNChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="location">Vị trí</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={editData.location}
                  onChange={handleNChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="stock_in_Warehouse">
                  Số lượng trong kho hàng
                </label>
                <input
                  type="number"
                  id="stock_in_Warehouse"
                  name="stock_in_Warehouse"
                  value={editData.stock_in_Warehouse}
                  onChange={handleNChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="unit">đơn vị</label>
                <input
                  type="text"
                  id="unit"
                  name="unit"
                  value={editData.unit}
                  onChange={handleNChange}
                />
              </div>
              
              {/* New Size and Color Section */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="sizes">Kích cỡ (cách nhau bằng dấu phẩy)</label>
                  <input
                    type="text"
                    id="sizes"
                    name="sizes"
                    value={Array.isArray(editData.sizes) ? editData.sizes.join(", ") : ""}  
                    onChange={(e) => {
                      const value = e.target.value;
                      const sizesArray = value.split(',').map(size => size.trim()).filter(size => size !== '');
                      setEditData(prev => ({
                        ...prev,
                        sizes: sizesArray
                      }));
                    }}
                    placeholder="S, M, L, X, XL, XXL"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="colors">Màu sắc (cách nhau bằng dấu phẩy)</label>
                  <input
                    type="text"
                    id="colors"
                    name="colors"
                    value={Array.isArray(editData.colors) ? editData.colors.join(", ") : ""}  
                    onChange={(e) => {
                      const value = e.target.value;
                      const colorsArray = value.split(',').map(color => color.trim()).filter(color => color !== '');
                      setEditData(prev => ({
                        ...prev,
                        colors: colorsArray
                      }));
                    }}
                    placeholder="Đỏ, Xanh, Đen"
                  />
                </div>
              </div>
             
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="material">Chất liệu</label>
                  <input 
                    type="text" 
                    id="material" 
                    name="material" 
                    value={editData.material || ""} 
                    onChange={handleNChange} 
                  />
                </div>
                {/* Stock quantity for each size */}
                {editData.sizes && editData.sizes.map((size, index) => (
                  <div key={index} className="form-group">
                    <label>Số lượng {size}</label>
                    <input
                      type="number"
                      min="0"
                      value={editData.stock && editData.stock[size] ? editData.stock[size].quantity || "" : ""}
                      onChange={(e) => {
                        const quantity = e.target.value;
                        setEditData(prev => ({
                          ...prev,
                          stock: {
                            ...prev.stock,
                            [size]: {
                              ...(prev.stock && prev.stock[size] ? prev.stock[size] : {}),
                              quantity: quantity
                            }
                          }
                        }));
                      }}
                    />
                  </div>
                ))}
              </div>
              
              <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={editData.notes}
                  onChange={handleNChange}
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="image">Image:</label>
                <img
                  src={link}
                  className="product-image-show"
                  alt="Product Image"
                />
                <div
                  className="change_image"
                  onClick={() => {
                    setg((x) => {
                      return !x;
                    });
                  }}
                >
                  Thay đổi ảnh
                </div>
                {g && (
                  <div className="form-group">
                    <label htmlFor="image">Image (22 cách để nhập ảnh)</label>
                    <p style={{ marginBottom: "3px" }}>1. tải ảnh lên từ máy</p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      name="image"
                      onChange={handleChangeimage}
                    />
                    <p style={{ marginBottom: "3px", marginTop: "3px" }}>
                      2. link ảnh trên mạng
                    </p>
                    <input
                      type="text"
                      id="image"
                      name="image"
                      value={editData.image}
                      onChange={handleChange_link}
                    />
                    {/* <p style={{ marginBottom: "3px", marginTop: "3px" }}>
                      3. chụp ảnh trực tiếp
                    </p>
                    <div className="capture" onClick={startCamera}>
                      Chụp ảnh
                    </div> */}

                    {/* Modal hiển thị camera */}
                    {showCamera && (
                      <div className="camera-modal">
                        <div className="camera-container">
                          <video
                            ref={videoRef}
                            autoPlay
                            style={{ width: "100%" }}
                          />
                          <button
                            className="button-capture"
                            onClick={captureImage}
                          >
                            Chụp
                          </button>
                          <button
                            className="button-capture"
                            onClick={stopCamera}
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    )}

                    <canvas ref={canvasRef} style={{ display: "none" }} />
                  </div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="detail">Thông tin chi tiết thay đổi</label>
                <textarea
                  id="detail"
                  name="detail"
                  value={details}
                  onChange={handleChangedetail}
                ></textarea>
              </div>
              <div className="submit-row">
                <button type="submit" className="save-button">
                  Save
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleEditToggle}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
