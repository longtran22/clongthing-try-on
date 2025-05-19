import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import './TryOnForm.css';

const TryOnForm = ({ productImage,clothing_type, onClose }) => {
  const [userImage, setUserImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [useCamera, setUseCamera] = useState(false);
  const [userImageUrl, setUserImageUrl] = useState('');

  const webcamRef = useRef(null);

  const handleImageChange = (e) => {
    setUserImage(e.target.files[0]);
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "captured.jpg", { type: "image/jpeg" });
          setUserImage(file);
          setUseCamera(false);
        });
    }
  };
  
const handleSubmit = async (e) => {
  e.preventDefault();

  if ((!userImage && !userImageUrl) || !productImage) {
    alert("Vui lòng chọn ảnh người dùng và ảnh quần áo.");
    return;
  }

  const formData = new FormData();
  if (userImage) {
    formData.append('model_image', userImage); // Ảnh file từ upload
  } else {
    formData.append('model_image_url', userImageUrl); // Ảnh từ URL
  }

  formData.append('garment_image_url', productImage);
  formData.append('clothing_type', 'tops'); // bạn có thể cho người dùng chọn loại: tops/bottoms/dresses

  setLoading(true);
  setResultImage(null);

  try {
    const response = await fetch('http://localhost:5000/tryon', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || "Try-on request failed");
    }

    const data = await response.json();
    console.log("result URL:", data.resultImageUrl);

    // Set URL ảnh trả về vào state để hiển thị
    setResultImage(data.resultImageUrl); // Lưu URL ảnh kết quả
    // setResultImage("https://40e507dd0272b7bb46d376a326e6cb3c.cdn.bubble.io/f1747218301818x148214271773240640/upscale")
    console.log("resultImage ",resultImage)
  } catch (err) {
    console.error("Try-on error:", err.message);
    alert("Thử đồ thất bại. Vui lòng thử lại.");
  } finally {
    setLoading(false);
  }
};



  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!userImage || !productImage) return;
  
  //   const formData = new FormData();
  //   formData.append('model_image', userImage); // người dùng
  //   formData.append('garment_image_url', productImage); // ảnh sản phẩm là URL (Cloudinary chẳng hạn)
  
  //   setLoading(true);
  
  //   try {
  //     const response = await fetch('http://localhost:5000/tryon', {
  //       method: 'POST',
  //       body: formData,
  //     });
  //     const data = await response.json();
  //     setResultImage(data.resultImageUrl); // trả về ảnh kết quả
  //   } catch (err) {
  //     console.error("Try-on error:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  return (
    <div className="tryon-modal">
      <div className="tryon-content">
        <button className="close-btn" onClick={onClose}>×</button>

        <div className="img-preview">
          <div className="clothing">
            <h4>Ảnh quần áo</h4>
            <br></br>
            <img src={productImage} alt="Product" />
          </div>
          <div className="model">
            <h4>Ảnh người dùng</h4>
            <br></br>
            {useCamera ? (
            <>
                <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={180}
                height={250}
                />
                <button onClick={captureImage} className="submit" style={{ marginTop: "10px" }}>
                Chụp ảnh
                </button>
            </>
            ) : userImage && (
            <div className="preview">
               
                <img
                src={URL.createObjectURL(userImage)}
                alt="User preview"
                style={{
                    maxWidth: "100%",
                    borderRadius: "12px",
                    border: "2px solid #4caf50",
                    marginTop: "0px"
                }}
                />
            </div>
            )}
            {!useCamera && userImageUrl && !userImage && (
              <div className="preview">
                <img
                  src={userImageUrl}
                  alt="User URL preview"
                  style={{
                    maxWidth: "100%",
                    borderRadius: "12px",
                    border: "2px solid #4caf50",
                    marginTop: "0px"
                  }}
                />
              </div>
            )}
          </div>
            {resultImage &&(
                    <div className="result">
                      <h3>Kết quả:</h3>
                      <img src={resultImage} alt="Result" />
                    </div>
                  )}
        </div>

        <div style={{ textAlign: 'center', margin: '10px 0' }}>
          <button onClick={() => setUseCamera(!useCamera)}   style={{
                backgroundColor: '#ffc107',
                color: 'black',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: '12px'
            }}>
            {useCamera ? "Sử dụng ảnh tải lên" : "Camera"}
          </button>
      

        </div>

        <form onSubmit={handleSubmit}>
          {/* {!useCamera && (
            <input type="file" accept="image/*" onChange={handleImageChange} />
          )} */}

                    {!useCamera && (
                        <>
                          <input type="file" accept="image/*" onChange={handleImageChange} />
                          <input
                            type="text"
                            placeholder="Hoặc nhập URL ảnh người dùng"
                            value={userImageUrl}
                            onChange={(e) => setUserImageUrl(e.target.value)}
                            style={{ marginTop: '10px', width: '100%', padding: '8px' }}
                          />
                        </>
                      )}
          <button type="submit" disabled={loading} className="submit">
            {loading ? "Đang xử lý..." : "Thử ngay"}
          </button>
        </form>
    
    
      </div>
    </div>
  );
//   return (
//   <div className="tryon-modal">
//     <div className="tryon-content">
//       <button className="close-btn" onClick={onClose}>×</button>

//       <div className="img-preview">
//         <div className="clothing">
//           <h4>Ảnh quần áo</h4>
//           <br />
//           <img src={productImage} alt="Product" />
//         </div>

//         <div className="model">
//           <h4>Ảnh người dùng</h4>
//           <br />
//           {useCamera ? (
//             <>
//               <Webcam
//                 audio={false}
//                 ref={webcamRef}
//                 screenshotFormat="image/jpeg"
//                 width={180}
//                 height={250}
//               />
//               <button onClick={captureImage} className="submit" style={{ marginTop: "10px" }}>
//                 Chụp ảnh
//               </button>
//             </>
//           ) : userImage && (
//             <div className="preview">
//               <img
//                 src={URL.createObjectURL(userImage)}
//                 alt="User preview"
//                 style={{
//                   maxWidth: "100%",
//                   borderRadius: "12px",
//                   border: "2px solid #4caf50",
//                   marginTop: "0px"
//                 }}
//               />
//             </div>
//           )}
//         </div>
//             {resultImage && (
//       <div className="result">
//         <h3>Kết quả:</h3>
//         <img src="https://i.pinimg.com/originals/3c/fb/ca/3cfbcacb5dba4ff542f31b370168c854.jpg" alt="Result" />
//       </div>
//     )}
//       </div>

//       <div style={{ textAlign: 'center', margin: '10px 0' }}>
//         <button onClick={() => setUseCamera(!useCamera)} style={{
//           backgroundColor: '#ffc107',
//           color: 'black',
//           padding: '8px 16px',
//           border: 'none',
//           borderRadius: '6px',
//           fontWeight: 'bold',
//           cursor: 'pointer',
//           marginBottom: '12px'
//         }}>
//           {useCamera ? "Sử dụng ảnh tải lên" : "Camera"}
//         </button>
//       </div>

//       <form onSubmit={handleSubmit}>
//         {!useCamera && (
//           <input type="file" accept="image/*" onChange={handleImageChange} />
//         )}
//         <button type="submit" disabled={loading} className="submit">
//           {loading ? "Đang xử lý..." : "Thử ngay"}
//         </button>
//       </form>
//     </div>


//   </div>
// );

};

export default TryOnForm;

