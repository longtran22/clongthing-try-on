import React,{useEffect,useState} from "react";
import { useAuth } from "../../components/introduce/useAuth";
import Sales_daily from "./sale_daily"
import Useronline from "./useronlinecard"
// src/index.js hoặc src/App.js'
import notify from '../../components/Notification/notification.js'
// import OrderInfoCard from "./OrderInfoCard.js"
import OrderInfoCard from "./OrderInfoCard";

import Cookies from "js-cookie";
import CalendarComponent from "../Calendar/index.js"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import "./x1.css";
function Home() {
  const { user, loading } = useAuth();
  const [totalrevenue,setTotalrevenue] =useState({percentChange:"0%",totalRevenueToday:"0",state:""});
  const [totalincome,setTotalincome] =useState({
    profitToday:0,
    profitYesterday:0,
    percentChange:"0%",
    message: "notchange",
});
const  [data,setData]=useState([])
const  [topproduct,setTopproduct]=useState([])
const [newcustomer,setNewcustomer] =useState({
  customerToday:0,
  customerYesterday:0,
  percentChange:"0%",
  state: "notchange",
});
const [pending,setPending]=useState({total:0,percent:"0%"})
const [act,setAct]=useState([])
  const datas = [
    { name: "Jan", "Khách hàng trung thành": 270, "khách hàng mới": 150, "Khách hàng quay lại": 542 },
    { name: "Feb", "Khách hàng trung thành": 310, "khách hàng mới": 180, "Khách hàng quay lại": 520 },
    { name: "Mar", "Khách hàng trung thành": 350, "khách hàng mới": 200, "Khách hàng quay lại": 560 },
    { name: "Apr", "Khách hàng trung thành": 330, "khách hàng mới": 220, "Khách hàng quay lại": 480 },
    { name: "May", "Khách hàng trung thành": 450, "khách hàng mới": 260, "Khách hàng quay lại": 550 },
    { name: "Jun", "Khách hàng trung thành": 400, "khách hàng mới": 290, "Khách hàng quay lại": 580 },
    { name: "Jul", "Khách hàng trung thành": 460, "khách hàng mới": 320, "Khách hàng quay lại": 620 },
    { name: "Aug", "Khách hàng trung thành": 510, "khách hàng mới": 340, "Khách hàng quay lại": 680 },
    { name: "Sep", "Khách hàng trung thành": 252, "khách hàng mới": 360, "Khách hàng quay lại": 740 },
    { name: "Oct", "Khách hàng trung thành": 680, "khách hàng mới": 390, "Khách hàng quay lại": 820 },
    { name: "Nov", "Khách hàng trung thành": 780, "khách hàng mới": 420, "Khách hàng quay lại": 890 },
    { name: "Dec", "Khách hàng trung thành": 900, "khách hàng mới": 450, "Khách hàng quay lại": 980 },
  ];
  const [vnpayList, setVnpayList] = useState([]);
  const [userList, setUserList] = useState([]);
  // if (!user) {
  //   return <div>Không có người dùng nào đăng nhập.</div>;
  // }
  const API_URL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const fetchData = async () => {
      if (loading) return;
      const get_revenue = async () => {
        try {
          const response = await fetch(`${API_URL}/home/total_revenue`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user: user,
            }),
          });
  
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
  
          const data = await response.json();
          //console.log("Revenue:", data);
          // setTotalrevenue(data);
        } catch (error) {
          console.error("Error fetching revenue:", error);
        }
      };
      const get_vnpay_list = async () => {
      try {
        const response = await fetch(`${API_URL}/payment/getAllvnpay`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        //console.log("VNPAY List:", data.totalAmount);
        setVnpayList(data.payments.reverse()); // 2. Gán dữ liệu vào state
        setTotalrevenue(prev => ({
          percentChange: "80%",
          state: "",
          totalRevenueToday: new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }).format(data.totalAmount)
        }));
      


      } catch (error) {
        console.error("Error fetching VNPAY list:", error);
      }
      };
            const get_user_list = async () => {
      try {
        const response = await fetch(`${API_URL}/accounts/show`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        //console.log("user:", data);
        setUserList(data.reverse()); // 2. Gán dữ liệu vào state
        //console.log("userList:", userList);
      


      } catch (error) {
        console.error("Error fetching VNPAY list:", error);
      }
      };
      const get_income = async () => {
        try {
          const response = await fetch(`${API_URL}/home/today_income`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user: user,
            }),
          });
  
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
  
          const data = await response.json();
          //console.log("Income:", data);
          setTotalincome(data);
        } catch (error) {
          console.error("Error fetching income:", error);
        }
      };
      const get_customer = async () => {
        try {
          const response = await fetch(`${API_URL}/home/new_customer`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user: user,
            }),
          });
  
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
  
          const data = await response.json();
          //console.log("customer:", data);
          setNewcustomer(data);
        } catch (error) {
          console.error("Error fetching income:", error);
        }
      };
      const get_report_customer=async()=>{
        try {
          const response = await fetch(`${API_URL}/home/generateCustomerReport`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user: user,
            }),
          });
  
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
  
          const data = await response.json();
          //console.log("customer:", data);
          setData(data)
        } catch (error) {
          console.error("Error fetching income:", error);
        }
      }
      const get_top_product=async()=>{
        try {
          const response = await fetch(`${API_URL}/home/generate_top_product`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user: user,
            }),
          });
  
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
  
          const data = await response.json();
          //console.log("products:", data);
          setTopproduct(data)
        } catch (error) {
          console.error("Error fetching income:", error);
        }
      }
      const get_pending=async()=>{
        try {
          const response = await fetch(`${API_URL}/home/total_pending`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user: user,
            }),
          });
  
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          //console.log("pending:", data);
          setPending(data)
        } catch (error) {
          console.error("Error fetching income:", error);
        }
      }
      const get_activity=async () => {
      try{
        const activity = await fetch(`${API_URL}/home/recent_activity`,{
          method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user: user,
            }),

        });
        const data=await activity.json();
      
        setAct(data.events);
      }catch (error) {
        console.error("Error fetching activity:", error)
      }
      }

      await Promise.all([
        get_revenue(), 
        get_income(),
        get_customer(),
        get_report_customer(),
        get_top_product(),
        get_pending(),
        get_activity(),
        get_vnpay_list(),
        get_user_list(),
      ]);
    };
  
    fetchData();
  }, [loading]); // Thêm 'user' vào dependencies nếu cần
  
  const [showForm, setShowForm] = useState(false);
const [email, setEmail] = useState("");
const [role, setRole] = useState("Admin"); // mặc định là admin

const fetchUserIdByEmail = async () => {
  try {
    const res = await fetch(`${API_URL}/accounts/find-by-email?email=${email}`);
    const user = await res.json();
    if (res.ok) {
      //console.log(user);
      return user._id;
    } else {
      alert(user.message || "Không tìm thấy user!");
      return null;
    }
  } catch (err) {
    console.error(err);
    alert("Lỗi khi tìm user!");
    return null;
  }
};




const handleAddAdmin = async (e) => {
  e.preventDefault();

  try {
    // ✅ Lấy thông tin người dùng hiện tại
    const userCookie = Cookies.get("user");
    if (!userCookie) {
      notify(3, "Bạn chưa đăng nhập!", "Error");
      return;
    }

    const currentUser = JSON.parse(userCookie);

    // ✅ Chỉ cho phép admin
    if (currentUser.role !== "Admin") {
      notify(2, "Bạn không có quyền thực hiện hành động này!", "Error");
      return;
    }

    // ✅ Thực hiện cập nhật nếu là admin
    const userId = await fetchUserIdByEmail();
    if (!userId) return;

    const res = await fetch(`${API_URL}/accounts/edit/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role }),
    });

    const data = await res.json();

    if (res.ok) {
      notify(1, "Cập nhật thành công!", "Success");
      setEmail("");
      setShowForm(false);
    } else {
      notify(2, data.message || "Cập nhật thất bại!", "Error");
    }
  } catch (err) {
    console.error(err);
    notify(3, "Có lỗi xảy ra!", "Error");
  }
};


  return (<>
    <div class="container">
      <div class="page-inner">
        <div class="dashboard-container">
          <div class="dashboard-title">
            <h3>Trang chủ</h3>
         
          </div>
          <div class="dashboard-actions">
            <a href="#">Manage</a>
            <div class="dashboard-actions">
                  {/* <a href="#" onClick={() => setShowForm(!showForm)}>Thêm Admin</a> */}
                  
                  {/* {showForm && (
              <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
                backdropFilter: "blur(2px)",
                transition: "all 0.3s ease"
              }}>
                <div style={{
                  backgroundColor: "#fff",
                  padding: "30px",
                  borderRadius: "12px",
                  width: "100%",
                  maxWidth: "450px",
                  boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
                  position: "relative",
                  animation: "fadeIn 0.3s ease-out"
                }}>
                  <button 
                    onClick={() => setShowForm(false)} 
                    style={{
                      position: "absolute",
                      top: "15px",
                      right: "15px",
                      background: "transparent",
                      border: "none",
                      fontSize: "24px",
                      cursor: "pointer",
                      color: "#666",
                      transition: "color 0.2s",
                      padding: "5px",
                      lineHeight: 1
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = "#333"}
                    onMouseOut={(e) => e.currentTarget.style.color = "#666"}
                  >
                    &times;
                  </button>
                  
                  <h3 style={{
                    margin: "0 0 25px 0",
                    color: "#2c3e50",
                    fontSize: "1.5rem",
                    fontWeight: 600
      }}>
        Thêm Admin
      </h3>
      
      <form onSubmit={handleAddAdmin}>
        <div style={{ marginBottom: "20px" }}>
          <label style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: 500,
            color: "#34495e"
          }}>
            Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: "12px 15px",
              width: "100%",
              border: "1px solid #ddd",
              borderRadius: "6px",
              fontSize: "1rem",
              transition: "border 0.3s",
              boxSizing: "border-box"
            }}
            onFocus={(e) => e.target.style.borderColor = "#3498db"}
            onBlur={(e) => e.target.style.borderColor = "#ddd"}
          />
        </div>
        
        <div style={{ marginBottom: "25px" }}>
          <label style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: 500,
            color: "#34495e"
          }}>
            Vai trò:
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            style={{
              padding: "12px 15px",
              width: "100%",
              border: "1px solid #ddd",
              borderRadius: "6px",
              fontSize: "1rem",
              backgroundColor: "white",
              appearance: "none",
              backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center",
              backgroundSize: "1em",
              transition: "border 0.3s"
            }}
            onFocus={(e) => e.target.style.borderColor = "#3498db"}
            onBlur={(e) => e.target.style.borderColor = "#ddd"}
          >
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          style={{ 
            padding: "14px",
            width: "100%",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.3s",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#3e8e41"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#4CAF50"}
        >
          Cập nhật
        </button>
      </form>
    </div>
  </div>
)} */}

          </div>
          </div>
        </div>
        <div class="row row-card-no-pd">
          <div class="col-12 col-sm-6 col-md-6 col-xl-3">
            <div class="card">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h6>
                      <b style={{ whiteSpace: "nowrap", 
  overflow: "hidden",
  textOverflow: "ellipsis" }}>Todays Income</b>
                    </h6>
                    <p class="text-muted">All Customs Value</p>
                  </div><h4 class="text-info fw-bold">{totalincome.profitToday}</h4>
                </div>
                <div class="progress progress-sm">
                  <div
                    class="progress-bar bg-info"
                    role="progressbar"
                    style={{ width: `${totalincome.percentChange}` }}
                  ></div>
                </div>
                <div class="d-flex justify-content-between">
                  <p class="text-muted">Change</p>
                  <p class="text-muted">{totalincome.percentChange}<small>{' '+totalincome.state}</small></p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-sm-6 col-md-6 col-xl-3">
            <div class="card">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h6>
                      <b>Total Revenue</b>
                      
                    </h6>
                    <p class="text-muted">All Customs Value</p>
                  </div><h4 class="text-success fw-bold">{totalrevenue.totalRevenueToday}</h4>
                </div>
                <div class="progress progress-sm">
                  <div
                    class="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: `${totalrevenue.percentChange}` }}
                  ></div>
                  
                </div>
                <div class="d-flex justify-content-between">
                  <p class="text-muted">Change</p>
                  <p class="text-muted">{totalrevenue.percentChange}<small>{' '+totalrevenue.state}</small></p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-sm-6 col-md-6 col-xl-3">
            <div class="card">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h6>
                      <b>Pending order</b>
                      
                    </h6>
                    <p class="text-muted">Fresh Order Amount</p>
                  </div><h4 class="text-danger fw-bold">{pending.total}</h4>
                </div>
                <div class="progress progress-sm">
                  <div
                    class="progress-bar bg-danger"
                    role="progressbar"
                    style={{ width: `${pending.percent}` }}
                  ></div>
                </div>
                <div class="d-flex justify-content-between">
                  <p class="text-muted">Change</p>
                  <p class="text-muted">{pending.percent}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-sm-6 col-md-6 col-xl-3">
            <div class="card">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h6>
                      <b>New Customer</b>
                      
                    </h6>
                    <p class="text-muted">Joined New User</p>
                  </div><h4 class="text-secondary fw-bold">{newcustomer.customerToday}</h4>
                </div>
                <div class="progress progress-sm">
                  <div
                    class="progress-bar bg-secondary"
                    role="progressbar"
                    style={{ width: `${newcustomer.percentChange}` }}
                  ></div>
                </div>
                <div class="d-flex justify-content-between">
                  <p class="text-muted">Change</p>
                  <p class="text-muted">{newcustomer.percentChange}<small>{' '+newcustomer.state}</small></p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row row-card-no-pd">
          <div class="col-md-8">
            <div class="card">
              <div class="card-header">
                <div class="card-head-row">
                  <div class="card-title">Thống kê khách hàng</div>
                  <div class="card-tools">
                    <a
                      href="#"
                      class="btn btn-label-success btn-round btn-sm me-2"
                    >
                      <span class="btn-label">
                        <i class="fa fa-pencil"></i>
                      </span>
                      Export
                    </a>
                    <a href="#" class="btn btn-label-info btn-round btn-sm">
                      <span class="btn-label">
                        <i class="fa fa-print"></i>
                      </span>
                      Print
                    </a>
                  </div>
                </div>
              </div>
              <div class="card-body">
                <div class="chart-container" style={{ minHeight: "375px" }}>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={datas}>
                      <XAxis dataKey="name" />
                      <YAxis type="number" domain={[0, "dataMax"]} />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="khách hàng mới"
                        stroke="#ffa726"
                        fill="#1e88e5"
                        fillOpacity={0.8}
                      />
                      <Area
                        type="monotone"
                        dataKey="Khách hàng trung thành"
                        stroke="#ff6b6b"
                        fill="red"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="Khách hàng quay lại"
                        stroke="#2196f3"
                        fill="#0277bd"
                        fillOpacity={0.4}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div id="myChartLegend"></div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card card-primary">
              <div class="card card-primary">
<Sales_daily />

              </div>
            
            </div>
            <div class="card">

              <Useronline />
            </div>
          </div>
        </div>
        <div class="row">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                <div className="card-title">Sản Phẩm</div>
              </div>
              <div className="card-body pb-0">
                <div style={{ maxHeight: '540px', overflowY: 'auto' }}>
                  {topproduct.slice(0, 9).map((a, b) => (
                    <div key={b}>
                      {b > 0 && <div className="separator-dashed"></div>}
                      <div className="d-flex">
                        <div className="avatar">
                          <img
                            src={a.image ? a.image.secure_url : "https://www.shutterstock.com/shutterstock/photos/600304136/display_1500/stock-vector-full-basket-of-food-grocery-shopping-special-offer-vector-line-icon-design-600304136.jpg"}
                            alt="..."
                            className="avatar-img rounded-circle"
                          />
                        </div>
                        <div className="flex-1 pt-1 ms-2">
                          Tên: 
                          <h6 className="fw-bold mb-1">{a.name}</h6>
                          Sku: 
                          <h6 className="fw-bold mb-1">{a.sku}</h6>
                        </div>
                        <div className="d-flex ms-auto align-items-center">
                         <div>
                          <div>
                            Nhập: <span className="text-info">{a.purchasePrice} VND</span>
                          </div>
                          <div>
                            Bán: <span className="text-info">{a.price} VND</span>
                          </div>
                          <div>
                            Hàng trong kho: <span className="text-info">{a.stock_in_Warehouse}</span>
                          </div>
                        </div>

                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="separator-dashed"></div>
                {/* <div className="pull-in">
                  <canvas id="topProductsChart"></canvas>
                </div> */}
              </div>
            </div>
          </div>
          <div class="col-md-4" style={{maxHeight:"645px",overflowY:"auto",marginBottom:"15px"}}>
          <div class="card">
              <div class="card-header">
                <div class="card-head-row card-tools-still-right">
                  <div class="card-title">Hoạt động gần đây</div>
                  <div class="card-tools">
                    {/* <div class="dropdown">
                      <button
                        class="btn btn-icon btn-clean"
                        type="button"
                        id="dropdownMenuButton"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <i class="fas fa-ellipsis-h"></i>
                      </button>
                      <div
                        class="dropdown-menu"
                        aria-labelledby="dropdownMenuButton"
                      >
                        <a class="dropdown-item" href="#">
                          Action
                        </a>
                        <a class="dropdown-item" href="#">
                          Another action
                        </a>
                        <a class="dropdown-item" href="#">
                          Something else here
                        </a>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
              <div class="card-body">
                <ol class="activity-feed">
                  {act.map(act =>{
                    return(
                      <li class={"feed-item "+ act.type}>
                    <time class="date" datetime={act.date}>
                      {act.date}
                    </time>
                    <span class="text" dangerouslySetInnerHTML={{
              __html: act.detail,  // Hiển thị HTML (thẻ <br /> sẽ được xử lý)
            }}>
                     
                    </span>
                  </li>
                    )
                  })}
                  {/* <li class="feed-item feed-item-secondary">
                    <time class="date" datetime="9-25">
                      Sep 25
                    </time>
                    <span class="text">
                      Responded to need
                      <a href="#">"Volunteer opportunity"</a>
                    </span>
                  </li>
                  <li class="feed-item feed-item-success">
                    <time class="date" datetime="9-24">
                      Sep 24
                    </time>
                    <span class="text">
                      Added an interest
                      <a href="#">"Volunteer Activities"</a>
                    </span>
                  </li>
                  <li class="feed-item feed-item-info">
                    <time class="date" datetime="9-23">
                      Sep 23
                    </time>
                    <span class="text">
                      Joined the group
                      <a href="single-group.php">"Boardsmanship Forum"</a>
                    </span>
                  </li>
                  <li class="feed-item feed-item-warning">
                    <time class="date" datetime="9-21">
                      Sep 21
                    </time>
                    <span class="text">
                      Responded to need
                      <a href="#">"In-Kind Opportunity"</a>
                    </span>
                  </li>
                  <li class="feed-item feed-item-danger">
                    <time class="date" datetime="9-18">
                      Sep 18
                    </time>
                    <span class="text">
                      Created need
                      <a href="#">"Volunteer Opportunity"</a>
                    </span>
                  </li>
                  <li class="feed-item">
                    <time class="date" datetime="9-17">
                      Sep 17
                    </time>
                    <span class="text">
                      Attending the event
                      <a href="single-event.php">"Some New Event"</a>
                    </span>
                  </li> */}
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div class="row" style={{marginTop:"10px"}}>
          {/* <div class="col-md-6">
                  <div class="card">
              <div class="card-header">
                <div class="card-head-row">
                  <div class="card-title">Thông tin</div>
                  <div class="card-tools">
                    <ul
                      class="nav nav-pills nav-secondary nav-pills-no-bd nav-sm"
                      id="pills-tab"
                      role="tablist"
                    >
                      <li class="nav-item">
                        <a
                          class="nav-link"
                          id="pills-today"
                          data-bs-toggle="pill"
                          href="#pills-today"
                          role="tab"
                          aria-selected="true"
                        >
                          Today
                        </a>
                      </li>
                      <li class="nav-item">
                        <a
                          class="nav-link active"
                          id="pills-week"
                          data-bs-toggle="pill"
                          href="#pills-week"
                          role="tab"
                          aria-selected="false"
                        >
                          Week
                        </a>
                      </li>
                      <li class="nav-item">
                        <a
                          class="nav-link"
                          id="pills-month"
                          data-bs-toggle="pill"
                          href="#pills-month"
                          role="tab"
                          aria-selected="false"
                        >
                          Month
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="card-body">
                <div class="d-flex">
                  <div class="avatar avatar-online">
                    <span class="avatar-title rounded-circle border border-white bg-info">
                      J
                    </span>
                  </div>
                  <div class="flex-1 ms-3 pt-1">
                    <h6 class="text-uppercase fw-bold mb-1">
                      Joko Subianto
                      <span class="text-warning ps-3">pending</span>
                    </h6>
                    <span class="text-muted">
                      I am facing some trouble with my viewport. When i start my
                    </span>
                  </div>
                  <div class="float-end pt-1">
                    <small class="text-muted">8:40 PM</small>
                  </div>
                </div>
                <div class="separator-dashed"></div>
                <div class="d-flex">
                  <div class="avatar avatar-offline">
                    <span class="avatar-title rounded-circle border border-white bg-secondary">
                      P
                    </span>
                  </div>
                  <div class="flex-1 ms-3 pt-1">
                    <h6 class="text-uppercase fw-bold mb-1">
                      Prabowo Widodo
                      <span class="text-success ps-3">open</span>
                    </h6>
                    <span class="text-muted">
                      I have some query regarding the license issue.
                    </span>
                  </div>
                  <div class="float-end pt-1">
                    <small class="text-muted">1 Day Ago</small>
                  </div>
                </div>
                <div class="separator-dashed"></div>
                <div class="d-flex">
                  <div class="avatar avatar-away">
                    <span class="avatar-title rounded-circle border border-white bg-danger">
                      L
                    </span>
                  </div>
                  <div class="flex-1 ms-3 pt-1">
                    <h6 class="text-uppercase fw-bold mb-1">
                      Lee Chong Wei
                      <span class="text-muted ps-3">closed</span>
                    </h6>
                    <span class="text-muted">
                      Is there any update plan for RTL version near future?
                    </span>
                  </div>
                  <div class="float-end pt-1">
                    <small class="text-muted">2 Days Ago</small>
                  </div>
                </div>
                <div class="separator-dashed"></div>
                <div class="d-flex">
                  <div class="avatar avatar-offline">
                    <span class="avatar-title rounded-circle border border-white bg-secondary">
                      P
                    </span>
                  </div>
                  <div class="flex-1 ms-3 pt-1">
                    <h6 class="text-uppercase fw-bold mb-1">
                      Peter Parker
                      <span class="text-success ps-3">open</span>
                    </h6>
                    <span class="text-muted">
                      I have some query regarding the license issue.
                    </span>
                  </div>
                  <div class="float-end pt-1">
                    <small class="text-muted">2 Day Ago</small>
                  </div>
                </div>
                <div class="separator-dashed"></div>
                <div class="d-flex">
                  <div class="avatar avatar-away">
                    <span class="avatar-title rounded-circle border border-white bg-danger">
                      L
                    </span>
                  </div>
                  <div class="flex-1 ms-3 pt-1">
                    <h6 class="text-uppercase fw-bold mb-1">
                      Logan Paul <span class="text-muted ps-3">closed</span>
                    </h6>
                    <span class="text-muted">
                      Is there any update plan for RTL version near future?
                    </span>
                  </div>
                  <div class="float-end pt-1">
                    <small class="text-muted">2 Days Ago</small>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          {/* <div className="col-md-6">
                <div class="card">
              <div class="card-header">
                <div class="card-head-row">
            <div className="card mt-4">
  <div className="card-header">

     <div class="card-title">Giao dịch VNPAY gần đây</div>
  </div>
  <div className="card-body">
    <div style={{ maxHeight: "300px", overflowY: "auto" }}>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Số tiền</th>
            <th>Thông tin đơn hàng</th>
            <th>Ngân hàng</th>
            <th>Ngày tạo</th>
          </tr>
        </thead>
        <tbody>
          {vnpayList.slice(0, 7).map((txn, index) => (
            <tr key={index}>
              <td>{txn.amount}</td>
              <td>{txn.orderInfo}</td>
              <td>{txn.bankCode}</td>
              <td>{new Date(txn.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  </div>
  </div>
  </div>
</div>

          </div> */}
           <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <div className="card-head-row">
                      <div className="card-title">Thông tin thanh toán</div>
                    </div>
                  </div>
                  <div className="card-body" style={{ maxHeight: "400px", overflowY: "auto" }}>
                    {vnpayList.map((order) => (
                      <React.Fragment key={order._id}>
                        <div className="d-flex">
                          {/* <div className="avatar avatar-online">
                            <span className="avatar-title rounded-circle border border-white bg-info">
                              {(order.ownerId || "?").slice(-2).toUpperCase()}
                            </span>
                          </div> */}
                          <div className="flex-1 ms-3 pt-1">
                            <h6 className="text-uppercase fw-bold mb-1">
                              {order.orderInfo}
                              {/* <span className={`${getStatusColor(order.generalStatus)} ps-3`}>
                                {order.generalStatus}
                              </span> */}
                            </h6>
                            <span className="text-muted">
                              Tổng tiền: {parseInt(order.amount).toLocaleString("vi-VN")}đ — Thuế: 10 %
                            </span>
                          </div>
                          <div className="float-end pt-1">
                            <small className="text-muted">
                              {new Date(order.createdAt).toLocaleString("vi-VN")}
                            </small>
                          </div>
                        </div>
                        <div className="separator-dashed"></div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
          {/* <div class="col-md-6">
            <div class="card">
              <div class="card-header">
                <div class="card-head-row">
                  <div class="card-title">Thông tin</div>
                  <div class="card-tools">
                    <ul
                      class="nav nav-pills nav-secondary nav-pills-no-bd nav-sm"
                      id="pills-tab"
                      role="tablist"
                    >
                      <li class="nav-item">
                        <a
                          class="nav-link"
                          id="pills-today"
                          data-bs-toggle="pill"
                          href="#pills-today"
                          role="tab"
                          aria-selected="true"
                        >
                          Today
                        </a>
                      </li>
                      <li class="nav-item">
                        <a
                          class="nav-link active"
                          id="pills-week"
                          data-bs-toggle="pill"
                          href="#pills-week"
                          role="tab"
                          aria-selected="false"
                        >
                          Week
                        </a>
                      </li>
                      <li class="nav-item">
                        <a
                          class="nav-link"
                          id="pills-month"
                          data-bs-toggle="pill"
                          href="#pills-month"
                          role="tab"
                          aria-selected="false"
                        >
                          Month
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="card-body">
                <div class="d-flex">
                  <div class="avatar avatar-online">
                    <span class="avatar-title rounded-circle border border-white bg-info">
                      J
                    </span>
                  </div>
                  <div class="flex-1 ms-3 pt-1">
                    <h6 class="text-uppercase fw-bold mb-1">
                      Joko Subianto
                      <span class="text-warning ps-3">pending</span>
                    </h6>
                    <span class="text-muted">
                      I am facing some trouble with my viewport. When i start my
                    </span>
                  </div>
                  <div class="float-end pt-1">
                    <small class="text-muted">8:40 PM</small>
                  </div>
                </div>
                <div class="separator-dashed"></div>
                <div class="d-flex">
                  <div class="avatar avatar-offline">
                    <span class="avatar-title rounded-circle border border-white bg-secondary">
                      P
                    </span>
                  </div>
                  <div class="flex-1 ms-3 pt-1">
                    <h6 class="text-uppercase fw-bold mb-1">
                      Prabowo Widodo
                      <span class="text-success ps-3">open</span>
                    </h6>
                    <span class="text-muted">
                      I have some query regarding the license issue.
                    </span>
                  </div>
                  <div class="float-end pt-1">
                    <small class="text-muted">1 Day Ago</small>
                  </div>
                </div>
                <div class="separator-dashed"></div>
                <div class="d-flex">
                  <div class="avatar avatar-away">
                    <span class="avatar-title rounded-circle border border-white bg-danger">
                      L
                    </span>
                  </div>
                  <div class="flex-1 ms-3 pt-1">
                    <h6 class="text-uppercase fw-bold mb-1">
                      Lee Chong Wei
                      <span class="text-muted ps-3">closed</span>
                    </h6>
                    <span class="text-muted">
                      Is there any update plan for RTL version near future?
                    </span>
                  </div>
                  <div class="float-end pt-1">
                    <small class="text-muted">2 Days Ago</small>
                  </div>
                </div>
                <div class="separator-dashed"></div>
                <div class="d-flex">
                  <div class="avatar avatar-offline">
                    <span class="avatar-title rounded-circle border border-white bg-secondary">
                      P
                    </span>
                  </div>
                  <div class="flex-1 ms-3 pt-1">
                    <h6 class="text-uppercase fw-bold mb-1">
                      Peter Parker
                      <span class="text-success ps-3">open</span>
                    </h6>
                    <span class="text-muted">
                      I have some query regarding the license issue.
                    </span>
                  </div>
                  <div class="float-end pt-1">
                    <small class="text-muted">2 Day Ago</small>
                  </div>
                </div>
                <div class="separator-dashed"></div>
                <div class="d-flex">
                  <div class="avatar avatar-away">
                    <span class="avatar-title rounded-circle border border-white bg-danger">
                      L
                    </span>
                  </div>
                  <div class="flex-1 ms-3 pt-1">
                    <h6 class="text-uppercase fw-bold mb-1">
                      Logan Paul <span class="text-muted ps-3">closed</span>
                    </h6>
                    <span class="text-muted">
                      Is there any update plan for RTL version near future?
                    </span>
                  </div>
                  <div class="float-end pt-1">
                    <small class="text-muted">2 Days Ago</small>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          <OrderInfoCard />
        </div>
          <div class="row" style={{marginTop:"10px"}}>
          {/* <div class="col-md-6">
                  <div class="card">
              <div class="card-header">
                <div class="card-head-row">
                  <div class="card-title">Thông tin</div>
                  <div class="card-tools">
                    <ul
                      class="nav nav-pills nav-secondary nav-pills-no-bd nav-sm"
                      id="pills-tab"
                      role="tablist"
                    >
                      <li class="nav-item">
                        <a
                          class="nav-link"
                          id="pills-today"
                          data-bs-toggle="pill"
                          href="#pills-today"
                          role="tab"
                          aria-selected="true"
                        >
                          Today
                        </a>
                      </li>
                      <li class="nav-item">
                        <a
                          class="nav-link active"
                          id="pills-week"
                          data-bs-toggle="pill"
                          href="#pills-week"
                          role="tab"
                          aria-selected="false"
                        >
                          Week
                        </a>
                      </li>
                      <li class="nav-item">
                        <a
                          class="nav-link"
                          id="pills-month"
                          data-bs-toggle="pill"
                          href="#pills-month"
                          role="tab"
                          aria-selected="false"
                        >
                          Month
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="card-body">
                <div class="d-flex">
                  <div class="avatar avatar-online">
                    <span class="avatar-title rounded-circle border border-white bg-info">
                      J
                    </span>
                  </div>
                  <div class="flex-1 ms-3 pt-1">
                    <h6 class="text-uppercase fw-bold mb-1">
                      Joko Subianto
                      <span class="text-warning ps-3">pending</span>
                    </h6>
                    <span class="text-muted">
                      I am facing some trouble with my viewport. When i start my
                    </span>
                  </div>
                  <div class="float-end pt-1">
                    <small class="text-muted">8:40 PM</small>
                  </div>
                </div>
                <div class="separator-dashed"></div>
                <div class="d-flex">
                  <div class="avatar avatar-offline">
                    <span class="avatar-title rounded-circle border border-white bg-secondary">
                      P
                    </span>
                  </div>
                  <div class="flex-1 ms-3 pt-1">
                    <h6 class="text-uppercase fw-bold mb-1">
                      Prabowo Widodo
                      <span class="text-success ps-3">open</span>
                    </h6>
                    <span class="text-muted">
                      I have some query regarding the license issue.
                    </span>
                  </div>
                  <div class="float-end pt-1">
                    <small class="text-muted">1 Day Ago</small>
                  </div>
                </div>
                <div class="separator-dashed"></div>
                <div class="d-flex">
                  <div class="avatar avatar-away">
                    <span class="avatar-title rounded-circle border border-white bg-danger">
                      L
                    </span>
                  </div>
                  <div class="flex-1 ms-3 pt-1">
                    <h6 class="text-uppercase fw-bold mb-1">
                      Lee Chong Wei
                      <span class="text-muted ps-3">closed</span>
                    </h6>
                    <span class="text-muted">
                      Is there any update plan for RTL version near future?
                    </span>
                  </div>
                  <div class="float-end pt-1">
                    <small class="text-muted">2 Days Ago</small>
                  </div>
                </div>
                <div class="separator-dashed"></div>
                <div class="d-flex">
                  <div class="avatar avatar-offline">
                    <span class="avatar-title rounded-circle border border-white bg-secondary">
                      P
                    </span>
                  </div>
                  <div class="flex-1 ms-3 pt-1">
                    <h6 class="text-uppercase fw-bold mb-1">
                      Peter Parker
                      <span class="text-success ps-3">open</span>
                    </h6>
                    <span class="text-muted">
                      I have some query regarding the license issue.
                    </span>
                  </div>
                  <div class="float-end pt-1">
                    <small class="text-muted">2 Day Ago</small>
                  </div>
                </div>
                <div class="separator-dashed"></div>
                <div class="d-flex">
                  <div class="avatar avatar-away">
                    <span class="avatar-title rounded-circle border border-white bg-danger">
                      L
                    </span>
                  </div>
                  <div class="flex-1 ms-3 pt-1">
                    <h6 class="text-uppercase fw-bold mb-1">
                      Logan Paul <span class="text-muted ps-3">closed</span>
                    </h6>
                    <span class="text-muted">
                      Is there any update plan for RTL version near future?
                    </span>
                  </div>
                  <div class="float-end pt-1">
                    <small class="text-muted">2 Days Ago</small>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          {/* <div className="col-md-6">
                <div class="card">
              <div class="card-header">
                <div class="card-head-row">
            <div className="card mt-4">
  <div className="card-header">

     <div class="card-title">Giao dịch VNPAY gần đây</div>
  </div>
  <div className="card-body">
    <div style={{ maxHeight: "300px", overflowY: "auto" }}>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Số tiền</th>
            <th>Thông tin đơn hàng</th>
            <th>Ngân hàng</th>
            <th>Ngày tạo</th>
          </tr>
        </thead>
        <tbody>
          {vnpayList.slice(0, 7).map((txn, index) => (
            <tr key={index}>
              <td>{txn.amount}</td>
              <td>{txn.orderInfo}</td>
              <td>{txn.bankCode}</td>
              <td>{new Date(txn.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  </div>
  </div>
  </div>
</div>

          </div> */}
           {/* <div className="col-md-6"> */}
                <div className="card-body">
                  <div className="card-header">
                    <div className="card-head-row">
                      <div className="card-title">Thông tin người dùng</div>
                    </div>
                  </div>
                  <div className="card-body" style={{ maxHeight: "400px", overflowY: "auto" }}>
                    {userList.map((order) => (
                      <React.Fragment key={order._id}>
                        <div className="d-flex">
                          {/* Avatar */}
                            <div style={{ width: 50, height: 50, borderRadius: "50%", overflow: "hidden", marginRight: "1rem", backgroundColor: "#ccc", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.2rem" }}>
                              {order.avatar ? (
                                <img src={order.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              ) : (
                                (order.name || "?").slice(-2).toUpperCase()
                              )}
                            </div>
                          <div className="flex-1 ms-3 pt-1">
                            <h6 className="text-uppercase fw-bold mb-1">
                              Email: {order.email}
                              {/* <span className={`${getStatusColor(order.generalStatus)} ps-3`}>
                                {order.generalStatus}
                              </span> */}
                            </h6>
                            <span className="text-muted">
                              Tên : {order.name} — Vai trò: {order.role}
                            </span>
                            <br /> 
                            <span className="text-muted">
                              ID : {order._id} 
                            </span>
                          </div>
                          <div className="float-end pt-1">
                            <small className="text-muted">
                              Ngày tạo
                              <br/>
                              {new Date(order.createdAt).toLocaleString("vi-VN")}
                            </small>
                          </div>
                        </div>
                        <div className="separator-dashed"></div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              {/* </div> */}
     
          
        </div>
      </div>
    </div>
    <footer class="footer">
    <div class="container-fluid d-flex justify-content-between">
      <nav class="pull-left">
        <ul class="nav">
          <li class="nav-item">
           
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#"> Help </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#"> Licenses </a>
          </li>
        </ul>
      </nav>
    
    </div>
  </footer></>
  );
}

export default Home;
