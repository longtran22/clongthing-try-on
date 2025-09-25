import React, { useState, useRef,useEffect } from "react";
import "./index.css"; // Để tạo kiểu
import ProductGrid from "./item.js";
// import ProductForm from '../../components/Manage_product/ProductForm';
// import History from "../../components/Manage_product/history.js"
import {useLoading} from "../../components/introduce/Loading"
import Modal from "../../components/Modal/index.js";
import { useNavigate } from 'react-router-dom';
import Notification from "../../components/Header/noti.js"
// import Historys from "../export/form_show.js"
const ProductManager = () => {
//   const { startLoading, stopLoading } = useLoading();
//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [unselectedCategory, unsetSelectedCategory] = useState('');
//   const [a, setA] = useState(false);
//   const [b, setB] = useState(false);
//   const [c, setC] = useState(true);
//   const [d, setD] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortByA, setSortByA] = useState("default"); // Mặc định
//   const [sortByB, setSortByB] = useState("Từ thấp lên cao"); // Mặc định
//   const categoriesRef = useRef(null);
// const handleScrollLeft = () => {
//   if (categoriesRef.current) {
//     categoriesRef.current.scrollBy({
//       left: -100,
//       behavior: 'smooth',
//     });
//   }
// };

// const handleScrollRight = () => {
//   if (categoriesRef.current) {
//     categoriesRef.current.scrollBy({
//       left: 100,
//       behavior: 'smooth',
//     });
//   }
// };

  
  
  
  
//   const turnonA = () => {
//     setA(true);
//   };
//   const turnonB = () => {
//     setB(true);
//   }
//   const turnonD =()=>{
//     setD(true)
//   }
//   const turnoffA = () => {
//     setA(false);
//   };
//   const turnoffB = () => {
//     setB(false);
//   };
//   const turnoffD = () => {
//     setD(false);
//   };
//   const reload_categorie = (a) => {
//     setCategories(a);
//   };
//   const refresh=()=>{
//  setC(false);
//   }
//   useEffect(() => {
//     if (!c) {
//       startLoading();
//       setTimeout(() => {setC(true);stopLoading()}, 100); // Có thể thay đổi thời gian tùy ý
//     }
//   }, [c])

//   return (
//     <div className="product-manager">
//       {/* {a && <ProductForm turnoff={turnoffA} refresh={refresh} />} */}
//       {/* {b && <History turnoff={turnoffB} />} */}
//       {/* {d && <Historys turnoff={turnoffD} supplier={true} />} */}
//       <div className="x">
//               <div className="filter-bar">
//         {/* <button className="scroll-button" onClick={handleScrollLeft}>◀</button> */}
//         <div className="scrollable-categories" ref={categoriesRef}>
//           {categories.length>1&&categories.map((category) => (
//             <button
//               style={{ 
//                 // width: "115px",
//                  marginRight: "9px" }}
//               key={category}
//               className={`category-button ${selectedCategory === category ? 'active' : ''}`}
//               onClick={() => {
//                 if (unselectedCategory !== category) {
//                   unsetSelectedCategory(category);
//                   setSelectedCategory(category);
//                 } else {
//                   unsetSelectedCategory('');
//                   setSelectedCategory('');
//                 }
//               }}
//             >
//               {category}
//             </button>
//           ))}
//           {
//             categories.length<=1&& <h1 style={{textAlign:"center"}}>đây là nơi chọn lọc sản phẩm theo categories </h1>
//           }
//         </div>
//         {/* <button className="scroll-button" onClick={handleScrollRight}>▶</button> */}
//         {/* <button className="create-button" onClick={turnonA}>Add</button> */}
        
//       </div>
//       <div className="extended-filter-bar">
//         <input
//           type="text"
//           placeholder="Tìm kiếm..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="search-input"
//         />
//         <select 
//           value={sortByA}
//           onChange={(e) => setSortByA(e.target.value)}
//           className="sort-select"
//           // left="330%"
//         >
//           <option value="default">Sắp xếp theo</option>
//           <option value="Giá nhập">Giá nhập</option>
//           <option value="Giá bán">Giá bán</option>
//           <option value="Tên">Tên</option>
//           {/* Thêm các tùy chọn khác nếu cần */}
//         </select>
//         <select 
//           value={sortByB}
//           onChange={(e) => setSortByB(e.target.value)}
//           className="sort-select"
//         >
//           <option value="Từ thấp đến cao">Từ thấp đến cao</option>
//           <option value="Từ cao đến thấp">Từ cao đến thấp</option>
//           {/* Thêm các tùy chọn khác nếu cần */}
//         </select>
       
//       </div>
//       </div>

      


//       {/* Hiển thị grid sản phẩm */}
//       {c&&<ProductGrid  selectedCategory={selectedCategory} reload={reload_categorie} searchTerm={searchTerm} sortByA={sortByA} sortByB={sortByB}/>}
//     </div>
//   );


  // State and functions for product sorting and filtering
  const { startLoading, stopLoading } = useLoading();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [unselectedCategory, unsetSelectedCategory] = useState('');
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const [c, setC] = useState(true);
  const [d, setD] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortByA, setSortByA] = useState("default"); // Mặc định
  const [sortByB, setSortByB] = useState("Từ thấp lên cao"); // Mặc định
  const categoriesRef = useRef(null);
  
  // Additional required states
  const [activeCategory, setActiveCategory] = useState('TRANG CHỦ');
  const [Itemnavbar, setitemnavbar] = useState('TRANG CHỦ');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeSubCategory, setActiveSubCategory] = useState('all');

  // Banner images data
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
  } ];
  // const bannerImages = [
  //   {
  //     image: '/api/placeholder/1200/500',
  //     title: 'Bộ Sưu Tập Mùa Hè 2024',
  //     description: 'Khám phá những thiết kế mới nhất cho mùa hè năm nay',
  //     cta: 'MUA NGAY'
  //   },
  //   {
  //     image: '/api/placeholder/1200/500',
  //     title: 'Thời Trang Công Sở',
  //     description: 'Phong cách chuyên nghiệp cho môi trường làm việc',
  //     cta: 'XEM THÊM'
  //   },
  //   {
  //     image: '/api/placeholder/1200/500',
  //     title: 'Xu Hướng Thời Trang 2024',
  //     description: 'Cập nhật những xu hướng thời trang mới nhất',
  //     cta: 'KHÁM PHÁ'
  //   }
  // ];

  // Sub categories data
  // const subCategories = [
  //   { id: 'all', label: 'TẤT CẢ' },
  //   { id: 'ao-thun', label: 'ÁO THUN' },
  //   { id: 'ao-so-mi', label: 'ÁO SƠ MI' },
  //   { id: 'ao-khoac', label: 'ÁO KHOÁC' },
  //   { id: 'quan-jean', label: 'QUẦN JEAN' },
  //   { id: 'quan-tay', label: 'QUẦN TÂY' },
  //   { id: 'phu-kien', label: 'PHỤ KIỆN' }
  // ];
  const subCategories = [
    { id: 'all', label: 'TẤT CẢ' },
    ...categories.map((category) => ({
      id: category,
      label: category.replace(/-/g, ' ').toLocaleUpperCase('vi')
    }))
  ];


  const navigate = useNavigate();

  const handleNavClick = (item) => {
    setActiveCategory(item);
    setitemnavbar(item);

    if (item === 'ĐƠN HÀNG') {
      navigate('/shop/import');
    }
 
  };

  const handleScrollLeft = () => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollBy({
        left: -100,
        behavior: 'smooth',
      });
    }
  };

  const handleScrollRight = () => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollBy({
        left: 100,
        behavior: 'smooth',
      });
    }
  };

  const turnonA = () => {
    setA(true);
  };

  const turnonB = () => {
    setB(true);
  };

  const turnonD = () => {
    setD(true);
  };

  const turnoffA = () => {
    setA(false);
  };

  const turnoffB = () => {
    setB(false);
  };

  const turnoffD = () => {
    setD(false);
  };

  const reload_categorie = (a) => {
    setCategories(a);
  };

  const refresh = () => {
    setC(false);
  };

  useEffect(() => {
    if (!c) {
      startLoading();
      setTimeout(() => {
        setC(true);
        stopLoading();
      }, 100); // Có thể thay đổi thời gian tùy ý
    }
  }, [c]);

  return (
    <div className="container">
      {/* Header */}
      {/* <header className="header">
        <div className="header-content">
          <div className="logo">Otina</div>
          <nav className="nav">
            {['TRANG CHỦ', 'ÁO XUÂN HÈ', 'QUẦN', 'ĐƠN HÀNG', 'TÌM CỬA HÀNG', 'THÔNG TIN'].map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-container"
              />
            <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>          
          </div>
         <div className="auth-buttons">
             <div className="header__notify"><Notification /></div>
              <div className="header__user"><Modal /></div>
         </div>
        </div>
      </header> */}

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
            {/* {subCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveSubCategory(category.id)}
                className={`subcategory-item ${activeSubCategory === category.id ? 'subcategory-item-active' : ''}`}
              >
                {category.label}
              </button>
            ))} */}
            {subCategories.map((category) => (
              <button
                key={category.id}
                // onClick={() => setActiveSubCategory(category.id)}
                onClick={() => {
                              setActiveSubCategory(category.id)
                              if (unselectedCategory !== category.id) {
                                unsetSelectedCategory(category.id);
                                setSelectedCategory(category.id);
                              } else {
                                unsetSelectedCategory('');
                                setSelectedCategory('');
                              }
                            }}
                          
                
                className={`subcategory-item ${activeSubCategory === category.id ? 'subcategory-item-active' : ''}`}
              >
                {category.label.toUpperCase()}
              </button>
            ))}

          <div className="search-container" style={{marginLeft:"200px"}}>
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-container" 
                // style={{textAlign:"right"}}
              />
            <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>          
          </div>
                {/* <div className="scrollable-categories" ref={categoriesRef}>
            {categories.length>1&&categories.map((category) => (
              <button
                style={{ 
                  // width: "115px",
                  marginRight: "9px" }}
                key={category}
                className={`subcategory-item ${selectedCategory === category ? 'subcategory-item-active' : ''}`}
                onClick={() => {
                  if (unselectedCategory !== category) {
                    unsetSelectedCategory(category);
                    setSelectedCategory(category);
                  } else {
                    unsetSelectedCategory('');
                    setSelectedCategory('');
                  }
                }}
              >
                {category.toUpperCase()}

              </button>
            ))}
            {
              categories.length<=1&& <h1 style={{textAlign:"center"}}>đây là nơi chọn lọc sản phẩm theo categories, hãy thử add từ 2 sản phẩm có catcategpries khác nhau trở lên</h1>
            }
          </div> */}
          </div>
        </div>
      </div>

      {/* Products Grid - Replaced with ProductGrid Component */}
      {c && <ProductGrid 
        selectedCategory={selectedCategory} 
        reload={reload_categorie} 
        searchTerm={searchTerm} 
        sortByA={sortByA} 
        sortByB={sortByB}
      />}

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
  );

};

export default ProductManager;
