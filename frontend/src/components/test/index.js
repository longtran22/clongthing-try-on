import React, { useState, useEffect, useCallback,useContext,useImperativeHandle, forwardRef } from "react";
import './index.css';
import { AuthContext } from "../introduce/AuthContext";
import debounce from "lodash.debounce";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import {useAuth} from "../introduce/useAuth"
import { useLoading } from "../introduce/Loading";
import { notify } from "../Notification/notification";
let apiFetchOrderHistory; 

const OrderManagement = forwardRef(({ onCreateOrder, onHistory,openModalDetail,setIdOrder,refOrder,setView,setLoadOrder,setLoadLog,loadOrder })=> {
  const [orders, setOrders] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedOrder, setEditedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [noteDetail, setNoteDetail] = useState(null); // Thay đổi state để theo dõi chỉ số đơn hàng đang chỉnh sửa
  const {startLoading,stopLoading} = useLoading();
  // const {user} = useContext(AuthContext)
  // const {user,loading} = useAuth()
  const { user = {}, loading } = useAuth();
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  // thêm usestate để lọc đươn hàng theo id
  const [filteredOrders, setFilteredOrders] = useState([]);


  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  

  // const sortedOrders = [...orders].sort((a, b) => {
    // dùng filteredOrders thay vì orders
    const sortedOrders = [...filteredOrders].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
  
    if (sortField === 'date') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    } else if (sortField === 'total') {
      aVal = parseFloat(aVal);
      bVal = parseFloat(bVal);
    } else if (sortField === 'status' || sortField === 'email') {
      aVal = aVal?.toLowerCase();
      bVal = bVal?.toLowerCase();
    }
  
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  

  const createorder = (order) => {
    // console.log(order);
    let emails="";
    if (user.role === "Admin") {
      emails=order.ownerEmail;
    } else {
     emails=order.email
    }
    return {
      id: order._id,
      tax:order.tax,
      client: order.ownerId,
      email: emails,
      status: order.generalStatus,
      date: order.updatedAt,
      country: 'vn',
      total: order.amount,
      notes: order.notes || '', // Giả sử có trường "notes" trong dữ liệu đơn hàng
    };
  };
//   const createorder = async (order) => {
//   // Lấy email từ API dựa trên ownerId
//   const response = await fetch(`http://localhost:5000/accounts/show/?userId=${order.ownerId}`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
  
//   // Chuyển đổi response thành JSON để lấy email
//   const data = await response.json();
//   const emailFromApi = data?.email || ''; // Cẩn thận ở đây
//   if (!data || !data.email) {
//     throw new Error('Email not found in API response');
//   }
  
//   // Tạo và trả về dữ liệu đơn hàng với email an toàn
//   return {
//     id: order._id,
//     tax: order.tax,
//     client: order.ownerId,
//     email: (order.email || emailFromApi || '').toLowerCase(),  // An toàn hơn
//     status: order.generalStatus,
//     date: order.updatedAt,
//     country: 'vn',
//     total: order.amount,
//     notes: order.notes || '',
//   };
  
// };


   const fetchOrder = async (keyword) => {
    try {
      // const apiUrl = `http://localhost:5000/import/orderHistory/getOrder?search=${keyword}&ownerId=${user.id_owner}&userId=${user._id}`;
      if (!user) return;

      let apiUrl = '';
      if (user.role === "User") {
        apiUrl = `http://localhost:5000/import/orderHistory/getOrder?search=${keyword}&ownerId=${user.id_owner}&userId=${user._id}`;

      } else {
                apiUrl = `http://localhost:5000/import/orderHistory/getAllOrder`;
      }
      
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error('Failed to fetch the order');
      }

      const data = await response.json();
      // const data = await response.json();
console.log('API response order:', data);
      // console.log(data,"new data")
      // const regurlizationData = data.map(item => createorder(item));
      // setOrders((prev)=>{
      //   const newData = [...regurlizationData]
        
      //   return newData;
      // });
      const regurlizationData = Array.isArray(data) ? data.map(item => createorder(item)) : [];
setOrders(regurlizationData);

setFilteredOrders(regurlizationData); // ban đầu hiển thị toàn bộ dùng tương đương set order

    } catch (error) {
      console.error('Error:', error);
    }
  };
  useImperativeHandle(refOrder,()=>({
    fetchOrder
  }))

  //.xóa đơn hànghàng
  const deleteData = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:5000/import/orderHistory/deleteOrderhistory/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json(); // Nếu server trả về dữ liệu sau khi xóa
      console.log('Delete successful:', data);
      return 1;
    } catch (error) {
      console.error('Error during delete:', error);
      return 0;
    }
  };
  
  const updateData = async ( newData) => {
    try {
      newData.ownerId= user.id_owner;
      newData.user=user;
      const response = await fetch(`http://localhost:5000/import/orderHistory/updateOrderhistory`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(newData),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
        return 0;
      }

      const data = await response.json(); // Đọc phản hồi trả về
      console.log('Update successful:', data);
      return 1;
    } catch (error) {
      console.error('Error during update:', error);
      return 0;
    }
  };
  apiFetchOrderHistory = fetchOrder;
  const debouncedFetchSuggestions = useCallback(
    debounce((keyword) => {
      fetchOrder(keyword);
    }, 500),
    [user,loading]
  );
  // useEffect(() => {
  //   if(loading)return
  //     console.log("debub")
  //     debouncedFetchSuggestions(searchTerm.trim());
  //   }, [loading,loadOrder,user]);
  useEffect(() => {
    if (loading || !user) return;
    debouncedFetchSuggestions(searchTerm.trim());
  }, [loading, loadOrder, user]);
  

  //không tìm theo api backend nữa
  // useEffect(() => {
  //   debouncedFetchSuggestions(searchTerm.trim());
  // }, [searchTerm]);  

  const handleSaveClick = async () => {
    try {
      const updatedOrders = [...orders];
      const newOrder = { ...editedOrder, userid: user._id, userName: user.name };
      newOrder.date = new Date().toISOString();
  
      console.log(loadOrder);
      console.log("Đơn hàng mới:", newOrder);
  
    let i= await updateData(newOrder);
  
      updatedOrders[editingIndex] = editedOrder;
      setOrders(updatedOrders);
      setEditingIndex(null);
      setNoteDetail(null);
      if(i){
       notify(1, "you've updated importing goods", "Successfully!"); 
      }else{
        notify(2, "Error updating data", "Failed to update!"); 
      }
      setLoadOrder((prev) => !prev);
      setLoadLog((prev) => !prev);
    } catch (error) {
      console.error("Error in handleSaveClick:", error);
      notify(0, "Error updating data", "Failed to update!");
    }
  };

  // onclick xóa đơn hàng
  const handleDeleteClick = async (orderId) => {
    try {
      let i = await deleteData(orderId);
  
      if (i) {
        const updatedOrders = orders.filter(order => order._id !== orderId);
        setOrders(updatedOrders);
        notify(1, "Đơn hàng đã được xóa thành công", "Successfully!");
      } else {
        notify(2, "Error deleting data", "Failed to delete!");
      }
  
      setEditingIndex(null);
      setNoteDetail(null);
      setLoadOrder((prev) => !prev);
      setLoadLog((prev) => !prev);
    } catch (error) {
      console.error("Error in handleDeleteClick:", error);
      notify(0, "Error deleting data", "Failed to delete!");
    }
  };
  

  const handleCancelClick = () => {
    setEditingIndex(null); // Hủy chế độ chỉnh sửa
    setNoteDetail(null);  // Ẩn ghi chú khi hủy
  };

  const handleEditClick = (index, order) => {
    setEditingIndex(index);
    setEditedOrder({ ...order });
    setNoteDetail(index); // Hiển thị ghi chú khi nhấn "Edit" vào đơn hàng cụ thể
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedOrder(prevOrder => ({ ...prevOrder, [name]: value }));
  };

  // const handleSearch = (e) => {
  //   setSearchTerm(e.target.value);
  // };

  // hàm tím kiểm đơn hàng theo id
  const handleSearch = (e) => {
  const keyword = e.target.value;
  setSearchTerm(keyword);

  if (!keyword) {
    // nếu xóa hết ô search thì hiển thị lại toàn bộ
    setFilteredOrders(orders);
  } else {
    const filtered = orders.filter(order =>
      order.id.toLowerCase() === keyword.toLowerCase()
    );
    setFilteredOrders(filtered);
  }
};

  const transfer = (date) => {
    const date2 = new Date(date);
    if (isNaN(date2)) {
      return 'Invalid date';
    }
    return date2.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };
  return (
    <div className="order-mgmt-container">
      <div className="order-mgmt-header">
        <h2 className="order-mgmt-title">Danh sách đơn hàng</h2>
        <div className="order-mgmt-header-controls">
          <input
            type="text"
            className="order-mgmt-search"
            placeholder="Search for..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <button className="order-mgmt-create-btn" onClick={onCreateOrder}>Tạo mới</button>
          <button className="order-mgmt-history-btn" onClick={onHistory}>Lịch sử</button>
        </div>
      </div>

      <table className="order-mgmt-table">
      <thead>
        <tr>
          <th>Đơn</th>
          <th style={{ width: "300px", cursor: "pointer" }} onClick={() => handleSort('email')}>
            Khách {sortField === 'email' && (sortDirection === 'asc' ? '▲' : '▼')}
          </th>
          <th style={{ cursor: "pointer" }} onClick={() => handleSort('date')}>
            Ngày {sortField === 'date' && (sortDirection === 'asc' ? '▲' : '▼')}
          </th>
          <th style={{ cursor: "pointer" }} onClick={() => handleSort('status')}>
            Trạng thái {sortField === 'status' && (sortDirection === 'asc' ? '▲' : '▼')}
          </th>
          <th>Địa chỉ</th>
          <th style={{ cursor: "pointer" }} onClick={() => handleSort('total')}>
            Tổng {sortField === 'total' && (sortDirection === 'asc' ? '▲' : '▼')}
          </th>
          <th>Chi tiết</th>
        </tr>
      </thead>

        <tbody >
          {sortedOrders.map((order, index) => (
            <React.Fragment key={order.id}>
              <tr >
                <td>
                  {/* #{order.id} */}
                  {index + 1}
                </td>
                <td style={{ width: "20200px" }}>
                  {editingIndex === index ? (
                    <div>
                      <input
                        type="text"
                        name="client"
                        value={editedOrder.client}
                        onChange={handleEditChange}
                      />
                      <input
                        type="email"
                        name="email"
                        value={editedOrder.email}
                        onChange={handleEditChange}
                      />
                    </div>
                  ) : (
                    <div>
                      Đơn : {order.id} <br /> 
                      {/* <small>{order.email}</small>  */}
                      Email: {order.email}
                    </div>
                  )}
                </td>
             
                <td>
                  {editingIndex === index ? (
                    <input
                      type="date"
                      name="date"
                      value={editedOrder.date}
                      onChange={handleEditChange}
                    />
                  ) : (
                    transfer(order.date)
                  )}
                </td>
                <td>
                  {editingIndex === index  ? (
                    <select
                      name="status"
                      value={editedOrder.status}
                      onChange={handleEditChange}
                    >
                      <option value="Pending">Pending</option>
                      <option value="deliveried">Deliveried</option>
                       <option value="Complete">Complete</option>
                      <option value="Canceled">Canceled</option>
                    </select>
                  ) : (
                    <span className={`order-mgmt-status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      name="country"
                      value={editedOrder.country}
                      onChange={handleEditChange}
                    />
                  ) : (
                    order.country
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="number"
                      name="total"
                      style={{width:'100%'}}
                      value={editedOrder.total}
                      onChange={handleEditChange}
                      step="0.01"
                    />
                  ) : (
                    `$${order.total}`
                  )}
                </td>
                <td>
                  {/* {editingIndex === index ? (
                    <>
                      <button className="order-mgmt-button save" onClick={() => handleDeleteClick(order.id)}>Xóa</button>
                      <button className="order-mgmt-button cancel" onClick={handleCancelClick}>Hủy</button>
                    </>
                  ) : (
                    <>
                      <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                      <button className="order-mgmt-button edit" onClick={() => handleEditClick(index, order) } style={{margin:0}}>✏️</button>
                      <FontAwesomeIcon icon={faCircleInfo} onClick={()=>{
                        setView(true)
                        openModalDetail();
                        setIdOrder(order.id)
                      }}
                       style={{height: '24px', witdh: '24px', padding:'8px'}} className="infoDetail"/>
                      </div>
                    </>
                  )} */}
                  {editingIndex === index ? (
                    <>
                      {user.role !== "Admin" && (
                        <button className="order-mgmt-button save" onClick={() => handleDeleteClick(order.id)}>Xóa</button>
                      )}
                      {user.role === "Admin" && (
                        <button className="order-mgmt-button save" onClick={handleSaveClick}>Lưu</button>
                      )}
                      <button className="order-mgmt-button cancel" onClick={handleCancelClick}>Hủy</button>
                    </>
                  ) : (
                    <>
                      <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                        {user.role === "Admin" && (
                          <button className="order-mgmt-button edit" onClick={() => handleEditClick(index, order)} style={{margin:0}}>✏️</button>
                        )}
                        {user.role !== "Admin" && (
                          <button className="order-mgmt-button edit" onClick={() => handleDeleteClick(order.id)} style={{margin:0}}>🗑️</button>
                        )}
                        <FontAwesomeIcon icon={faCircleInfo} onClick={() => {
                          setView(true);
                          openModalDetail();
                          setIdOrder(order.id);
                        }} style={{height: '24px', witdh: '24px', padding:'8px'}} className="infoDetail"/>
                      </div>
                    </>
                  )}

                </td>
              </tr>

              {/* Render dòng ghi chú dưới mỗi đơn hàng khi nhấn Edit */}
              {editingIndex === index && noteDetail === index && (
                <tr>
                  <td colSpan="7">
                    <input
                      style={{outline:'none',border:'none'}}
                      type="text"
                      name="notes"
                      value={editedOrder.notes}
                      onChange={handleEditChange}
                      placeholder="Add your notes here"
                      className="note-input"
                    />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
  
    </div>
  );
});

export default OrderManagement;

export {apiFetchOrderHistory}