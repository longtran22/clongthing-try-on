import React, { useEffect, useState } from "react";
import axios from "axios";
import "./x1.css";



const OrderInfoCard = () => {
  const [orders, setOrders] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    axios
      .get(`${API_URL}/import/orderHistory/getAllOrder`)
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy đơn hàng:", err);
      });
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-warning";
      case "deliveried":
        return "text-success";
      case "canceled":
      case "closed":
        return "text-muted";
      default:
        return "text-secondary";
    }
  };

  return (
    <div className="col-md-6">
      <div className="card">
        <div className="card-header">
          <div className="card-head-row">
            <div className="card-title">Thông tin đơn hàng</div>
          </div>
        </div>
        <div className="card-body" style={{ maxHeight: "400px", overflowY: "auto" }}>
          {orders.map((order) => (
            <React.Fragment key={order._id}>
              <div className="d-flex">
                <div className="avatar avatar-online">
                  <span className="avatar-title rounded-circle border border-white bg-info">
                    {(order.ownerId || "?").slice(-2).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 ms-3 pt-1">
                  <h6 className="text-uppercase fw-bold mb-1">
                    Đơn #{order._id.slice(-5)}
                    <span className={`${getStatusColor(order.generalStatus)} ps-3`}>
                      {order.generalStatus}
                    </span>
                  </h6>
                  <span className="text-muted">
                    Tổng tiền: {parseInt(order.amount).toLocaleString("vi-VN")}đ — Thuế: {order.tax}%
                  </span>
                </div>
                <div className="float-end pt-1">
                  <small className="text-muted">
                    {new Date(order.updatedAt).toLocaleString("vi-VN")}
                  </small>
                </div>
              </div>
              <div className="separator-dashed"></div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderInfoCard;
