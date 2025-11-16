 import { useEffect, useState } from 'react'
 import { useLocation } from "react-router-dom";
import LoginModal from './intro'
import { Navigate } from "react-router-dom";
import Cookies from 'js-cookie';
import ProductGrid from "../../components/Manage_product/item.js";
import { notify } from '../../components/Notification/notification';


// import './main.css'
// function Main(){
//     const [a,setA]= useState(0)
//     const handle=(x)=>{setA(x)}
//     const location = useLocation();
//     const storedUser = Cookies.get("user");
//     let user = null;
//     useEffect(()=>{
//       if(location.state){
//       notify(2,"bạn phải đăng nhập","Thất bại")
//     }
//     },[])
    
//     if (storedUser) {
//       try {
//         const decodedString = decodeURIComponent(storedUser);
//         user = JSON.parse(decodedString);
//       } catch (error) {
//         console.error("Không thể giải mã hoặc phân tích dữ liệu người dùng:", error);
//       }
//     }
//     if (user) {
//         //console.log(user)
//       // Nếu người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
//       return <Navigate to="/home" replace />;
//     }
//    return(<>
//    {a==1&&<LoginModal off={handle} isSignup={false}/>}
//    {a==2&&<LoginModal off={handle} isSignup={true}/>}
//    <div 
//    style={a!=0?{opacity:0.3}:{}}
//    className="main">
//     <header>
//         <div className="logo" color="black"><img style={{height:"112px",position:"absolute",top:"0px",left:"2%"}} src={logo} />VIRTUAL TRY ON</div>
//         <div className="auth-buttons">
//             <button className="btn"
//             onClick={()=>{setA(1)
//             }}
//             >Đăng nhập</button>
//             <button className="btn"
//             onClick={()=>{
//             setA(2)
//             }}
//             >Đăng ký</button>
//         </div>
    
//     </header>
// {/* 
//     <section className="content">
//         <p>Chào mừng đến với trang web của chúng tôi! Đây là nơi giới thiệu các tính năng và dịch vụ mà chúng tôi cung cấp.</p>
//     </section> */}
//     <div id="wrapper">
         

        
//     </div>
//     </div>
//     </>) 
// }
import './AtinoFashionStore.css'; // Import CSS file
const Main = () => {
  const [activeCategory, setActiveCategory] = useState('ÁO XUÂN HÈ');
  const [activeSubCategory, setActiveSubCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [Itemnavbar, setitemnavbar] = useState();
    const [subCategories, setSubCategories] = useState([
    { id: 'all', label: 'TẤT CẢ' },
    { id: 'ÁO PHÔNG', label: 'ÁO PHÔNG' },
    { id: 'ÁO POLO', label: 'ÁO POLO' },
    { id: 'ÁO SƠ MI NGẮN TAY', label: 'ÁO SƠ MI NGẮN TAY' },
    { id: 'BỘ THỂ THAO HÈ', label: 'BỘ THỂ THAO HÈ' },
    { id: 'ÁO TANK TOP', label: 'ÁO TANK TOP' },
    { id: 'ÁO SƠ MI DÀI TAY', label: 'ÁO SƠ MI DÀI TAY' },
  ]);
  // State cho banner slider
const [currentSlide, setCurrentSlide] = useState(0);
const [visibleProducts, setVisibleProducts] = useState(8);
const [selectedProduct, setSelectedProduct] = useState(null);
const [showProductDetail, setShowProductDetail] = useState(false);
const [selectedSize, setSelectedSize] = useState('');
const [selectedColor, setSelectedColor] = useState('');
const [quantity, setQuantity] = useState(1);
// Data mẫu cho banner (bạn có thể thay đổi theo nhu cầu)
const bannerImages = [
  {
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
    title: "BỘ SƯU TẬP XUÂN HÈ 2025",
    description: "Khám phá những thiết kế mới nhất với phong cách trẻ trung, năng động",
    cta: "MUA NGAY"
  },
  {
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=400&fit=crop",
    title: "THỜI TRANG CÔNG SỞ",
    description: "Lịch lãm và chuyên nghiệp cho môi trường làm việc hiện đại",
    cta: "XEM THÊM"
  },
  {
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&h=400&fit=crop",
    title: "GIẢM GIÁ 50%",
    description: "Ưu đãi đặc biệt cho toàn bộ bộ sưu tập thu đông",
    cta: "MUA NGAY"
  }
];
  const [a,setA]= useState(0)
    const handle=(x)=>{setA(x)}
    const location = useLocation();
    const storedUser = Cookies.get("user");
    let user = null;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    useEffect(()=>{
      if(location.state){
      notify(2,"bạn phải đăng nhập","Thất bại")
    }
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/products/show`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}) // Gửi body rỗng nếu backend yêu cầu
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        //console.log("dtata",data)
        const formattedProducts = data.map((product) => ({
          id: product._id,
          name: product.name,
          price: product.price + " VND",
          originalPrice :product.price,
          image: product.image.secure_url || '/api/placeholder/300/400',
          colors: product.colors,
          material:product.material,
          sku:product.sku,
          unit:product.unit,
          location:product.location,
          sizes:product.sizes, 
          try_on_available:product.try_on_available,
          stock_in_Warehouse:product.stock_in_Warehouse,
          stock_in_shelf:product.stock_in_shelf,


          category: product.category.toUpperCase(),
        }));

        // Update subCategories dynamically based on fetched data
        const uniqueCategories = [...new Set(data.map((product) => product.category.toUpperCase()))];
        const newSubCategories = [
          { id: 'all', label: 'TẤT CẢ' },
          ...uniqueCategories.map((cat) => ({ id: cat, label: cat })),
        ];
        setSubCategories(newSubCategories);
        setProducts(formattedProducts);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProducts();
    },[])
    
    if (storedUser) {
      try {
        const decodedString = decodeURIComponent(storedUser);
        user = JSON.parse(decodedString);
      } catch (error) {
        console.error("Không thể giải mã hoặc phân tích dữ liệu người dùng:", error);
      }
    }
    if (user) {
        //console.log(user)
      // Nếu người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
      return <Navigate to="/home" replace />;
    }


  const filteredProducts = activeSubCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeSubCategory);

  const ColorDot = ({ color }) => (
    <div 
      className={`w-4 h-4 rounded-full border border-gray-300 cursor-pointer hover:scale-110 transition-transform ${
        color === 'white' ? 'bg-white' :
        color === 'black' ? 'bg-black' :
        color === 'gray' ? 'bg-gray-500' :
        color === 'lightgray' ? 'bg-gray-300' :
        color === 'blue' ? 'bg-blue-500' :
        color === 'lightblue' ? 'bg-blue-300' :
        color === 'beige' ? 'bg-yellow-100' :
        color === 'brown' ? 'bg-yellow-800' :
        'bg-gray-400'
      }`}
    />
  );

return (<>
     {a==1&&<LoginModal off={handle} isSignup={false}/>}
      {a==2&&<LoginModal off={handle} isSignup={true}/>}
      
      {/* Product Detail Modal */}
      {showProductDetail && selectedProduct && (
        <div className="product-detail-overlay">
          <div className="product-detail-modal">
            <button 
              className="close-detail-btn"
              onClick={() => {
                setShowProductDetail(false);
                setSelectedProduct(null);
                setSelectedSize('');
                setSelectedColor('');
                setQuantity(1);
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div className="product-detail-content">
              <div className="product-detail-left">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="product-detail-image" />
              </div>
              
              <div className="product-detail-right">
                <div className="product-detail-header">
                  <h1 className="product-detail-name">{selectedProduct.name}</h1>
                  <div className="product-detail-brand">{selectedProduct.brand}</div>
                  <div className="product-detail-sku">SKU: {selectedProduct.sku}</div>
                </div>
                
                <div className="product-detail-price">
                  {selectedProduct.discount > 0 ? (
                    <div className="price-with-discount">
                      <span className="discounted-price">{(selectedProduct.originalPrice * (1 - selectedProduct.discount / 100)).toLocaleString()} VND</span>
                      <span className="original-price">{selectedProduct.originalPrice.toLocaleString()} VND</span>
                      <span className="discount-badge">-{selectedProduct.discount}%</span>
                    </div>
                  ) : (
                    <span className="current-price">{selectedProduct.originalPrice.toLocaleString()} VND</span>
                  )}
                </div>
                
                <div className="product-detail-description">
                  <h3>Mô tả sản phẩm</h3>
                  <p>{selectedProduct.description}</p>
                </div>
                
                <div className="product-detail-info">
                  <div className="info-grid">
                    <div className="info-item">
                      <strong>Chất liệu:</strong> {selectedProduct.material}
                    </div>
                    <div className="info-item">
                      <strong>Đơn vị:</strong> {selectedProduct.unit}
                    </div>
                    <div className="info-item">
                      <strong>Vị trí:</strong> {selectedProduct.location}
                    </div>
                    <div className="info-item">
                      <strong>Thử đồ:</strong> {selectedProduct.try_on_available ? 'Có' : 'Không'}
                    </div>
                    <div className="info-item">
                      <strong>Đánh giá:</strong> {selectedProduct.rate}/5 ⭐
                    </div>
                    <div className="info-item">
                      <strong>Kho hàng:</strong> {selectedProduct.stock_in_Warehouse} | <strong>Kệ:</strong> {selectedProduct.stock_in_shelf}
                    </div>
                  </div>
                </div>
                
                {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                  <div className="product-detail-sizes">
                    <h3>Kích thước</h3>
                    <div className="size-options">
                      {selectedProduct.sizes.map((size) => (
                        <button
                          key={size}
                          className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                          onClick={() => setSelectedSize(size)}
                          disabled={selectedProduct.stock && selectedProduct.stock[size] && selectedProduct.stock[size].quantity === 0}
                        >
                          {size}
                          {selectedProduct.stock && selectedProduct.stock[size] && (
                            <span className="stock-count">({selectedProduct.stock[size].quantity})</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                  <div className="product-detail-colors">
                    <h3>Màu sắc</h3>
                    <div className="color-options">
                      {selectedProduct.colors.map((color, index) => (
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
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
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
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                {selectedProduct.notes && (
                  <div className="product-detail-notes">
                    <h3>Ghi chú</h3>
                    <p>{selectedProduct.notes}</p>
                  </div>
                )}
                
                <div className="product-detail-actions">
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => {
                      // Xử lý thêm vào giỏ hàng
                      const orderData = {
                        product: selectedProduct,
                        size: selectedSize,
                        color: selectedColor,
                        quantity: quantity
                      };
                      //console.log('Đặt hàng:', orderData);
                      // alert('Đã thêm vào giỏ hàng!');
                       notify(3,"bạn phải đăng nhập","Cảnh báo !")
                    }}
                    disabled={
                      (selectedProduct.sizes && selectedProduct.sizes.length > 0 && !selectedSize) ||
                      (selectedProduct.colors && selectedProduct.colors.length > 0 && !selectedColor)
                    }
                  >
                    THÊM VÀO GIỎ HÀNG
                  </button>
                  <button 
                    className="buy-now-btn"
                    onClick={() => {
                      // Xử lý mua ngay
                      const orderData = {
                        product: selectedProduct,
                        size: selectedSize,
                        color: selectedColor,
                        quantity: quantity
                      };
                      //console.log('Mua ngay:', orderData);
                      // alert('Chuyển đến trang thanh toán!');
                      notify(3,"bạn phải đăng nhập","Cảnh báo !")
                    }}
                    disabled={
                      (selectedProduct.sizes && selectedProduct.sizes.length > 0 && !selectedSize) ||
                      (selectedProduct.colors && selectedProduct.colors.length > 0 && !selectedColor)
                    }
                  >
                    MUA NGAY
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
   <div className="container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">Otina</div>
          <nav className="nav">
            {['TRANG CHỦ',  'ÁO XUÂN HÈ', 'QUẦN', 'PHỤ KIỆN', 'TÌM CỬA HÀNG', 'THÔNG TIN'].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActiveCategory(item)
                  setitemnavbar(item)
                }}
                className={`nav-item ${activeCategory === item ? 'nav-item-active' : ''}`}
              >
                {item}
              </button>
            ))}
          </nav>
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Tìm kiếm..." 
              className="search-container"
            />
            <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>          
          </div>
         <div className="auth-buttons">
             <button className="btn"
             onClick={()=>{setA(1)
             }}
             >Đăng nhập</button>
             <button className="btn"
             onClick={()=>{
             setA(2)
             }}
             >Đăng ký</button>
         </div>
        </div>
      </header>

      {/* Banner Slider */}
      <div className="banner-slider">
        <div className="banner-container">
          <div className="banner-slide" style={{transform: `translateX(-${currentSlide * 100}%)`}}>
            {bannerImages.map((banner, index) => (
              <div key={index} className="banner-item">
                <img src={banner.image} alt={banner.title} className="banner-image" />
                <div className="banner-overlay">
                  <div className="banner-content">
                    <h2 className="banner-title">{banner.title}</h2>
                    <p className="banner-description">{banner.description}</p>
                    <button className="banner-cta">{banner.cta}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation Buttons */}
          <button 
            className="banner-nav banner-nav-left"
            onClick={() => setCurrentSlide(currentSlide === 0 ? bannerImages.length - 1 : currentSlide - 1)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>
          
          <button 
            className="banner-nav banner-nav-right"
            onClick={() => setCurrentSlide(currentSlide === bannerImages.length - 1 ? 0 : currentSlide + 1)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9,6 15,12 9,18"></polyline>
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="banner-dots">
            {bannerImages.map((_, index) => (
              <button
                key={index}
                className={`banner-dot ${currentSlide === index ? 'banner-dot-active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
            
      {/* Category Header */}
      <div className="category-header">
        <div className="category-content">
          <h1 className="category-title">{Itemnavbar}</h1>
          <div className="subcategory-list">
            {subCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveSubCategory(category.id)}
                className={`subcategory-item ${activeSubCategory === category.id ? 'subcategory-item-active' : ''}`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        <div className="grid">
          {filteredProducts.slice(0, visibleProducts).map((product) => (
            <div 
              key={product.id} 
              className="product-card"
              onClick={() => {
                setSelectedProduct(product);
                setShowProductDetail(true);
                // Set default selections
                if (product.sizes && product.sizes.length > 0) {
                  setSelectedSize(product.sizes[0]);
                }
                if (product.colors && product.colors.length > 0) {
                  setSelectedColor(product.colors[0]);
                }
              }}
            >
              <div className="product-image-container">
               
                <div className="product-image-container">
                  {/* <div className="product-placeholder">👕</div> */}
                   <div className="product-brand">Otina</div>
                  <img src={product.image} alt={product.name} className="product-img" />

                </div>
                <div className="product-overlay"></div>
              </div>
              <div className="product-colors">
                {product.colors.map((color, index) => (
                  <ColorDot key={index} color={color} />
                ))}
              </div>
              <div>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      

      {/* Load More */}
      {visibleProducts < filteredProducts.length && (
        <div className="load-more">
          <button 
            className="load-more-button"
            onClick={() => setVisibleProducts(prev => Math.min(prev + 4, filteredProducts.length))}
          >
            XEM THÊM SẢN PHẨM ({filteredProducts.length - visibleProducts} còn lại)
          </button>
        </div>
      )}

      {/* Newsletter */}
      <div className="newsletter">
        <div className="newsletter-content">
          <h2 className="newsletter-title">ĐĂNG KÝ NHẬN THÔNG TIN</h2>
          <p className="newsletter-description">
            Nhận thông tin về các sản phẩm mới và ưu đãi đặc biệt
          </p>
          <div className="newsletter-form">
            <input 
              type="email" 
              placeholder="Địa chỉ email của bạn" 
              className="newsletter-input"
            />
            <button className="newsletter-button">ĐĂNG KÝ</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-grid">
            <div>
              <h3 className="footer-title">Otina</h3>
              <p className="footer-description">
                Thời trang casual cho cuộc sống hiện đại. 
                Chất lượng và phong cách trong từng sản phẩm.
              </p>
            </div>
            <div>
              <h4 className="footer-subtitle">SẢN PHẨM</h4>
              <ul className="footer-list">
                <li><a href="#" className="footer-link">Áo xuân hè</a></li>
                <li><a href="#" className="footer-link">Quần</a></li>
                <li><a href="#" className="footer-link">Phụ kiện</a></li>
                <li><a href="#" className="footer-link">Bộ sưu tập mới</a></li>
              </ul>
            </div>
            <div>
              <h4 className="footer-subtitle">HỖ TRỢ</h4>
              <ul className="footer-list">
                <li><a href="#" className="footer-link">Hướng dẫn chọn size</a></li>
                <li><a href="#" className="footer-link">Chính sách đổi trả</a></li>
                <li><a href="#" className="footer-link">Giao hàng</a></li>
                <li><a href="#" className="footer-link">Liên hệ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="footer-subtitle">LIÊN HỆ</h4>
              <ul className="footer-list">
                <li>Hotline: 1900 1234</li>
                <li>Email: hello@atino.vn</li>
                <li>Địa chỉ: 123 Phố Cổ, Hà Nội</li>
                <li>Giờ làm việc: 8:00 - 22:00</li>
              </ul>
            </div>
          </div>
          <div className="footer-copyright">
            <p>© 2025 Otina. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
          </>
  );
};

// export default AtinoFashionStore;
export default Main