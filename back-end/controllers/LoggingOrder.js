const mongoose = require("mongoose");
const LoggingOrder = require('../modules/loggingOrder')
const OrderDetailHistory = require('../modules/OrderDetailHistory')
const Products = require('../modules/products')
const getLogging = async(req,res)=>{
        try {
            const { search, limit = 10, page = 1,ownerId } = req.query; 
            const limitNum = Math.max(1, parseInt(limit));  
            const pageNum = Math.max(1, parseInt(page));   

            let query = {};
        
            if (search) {
              if (mongoose.Types.ObjectId.isValid(search)) {
                query.orderDetailId = new mongoose.Types.ObjectId(search);;  
              } else if (Date.parse(search)) {
                query.createdAt = {
                  $gte: new Date(search),  // >= ngày bắt đầu (thời gian 00:00:00)
                  $lt: new Date(new Date(search).setDate(new Date(search).getDate() + 1)) 
                };
              } else {
                query.userName = { $regex: search, $options: 'i' }; 
              }
            }
            query.ownerId = new mongoose.Types.ObjectId(ownerId);
            //console.log("query :", query)   
            const skip = (pageNum - 1) * limitNum;
        
            const logs = await LoggingOrder.aggregate([
              { 
                $match: query 
              },
              { 
                $skip: skip 
              },
              { 
                $limit: limitNum 
              },

              {
                $lookup: {
                  from: 'Order_Detail_History',  // Tên collection trong MongoDB
                  localField: 'orderId',  // Trường trong LoggingOrder
                  foreignField: 'orderId',          // Trường trong OrderDetailHistory
                  as: 'orderDetail'            // Alias cho mảng kết quả trả về
                }
              },
              {
                $unwind: {
                  path: '$orderDetail',
                  preserveNullAndEmptyArrays: true
                }
              },
              {
                $lookup: {
                  from: 'Products',             
                  localField: 'orderDetail.productId', 
                  foreignField: '_id',        
                  as: 'product'                 
                }
              },
              {
                $unwind: {
                  path: '$product',
                  preserveNullAndEmptyArrays: true  // Giữ lại kết quả nếu không có 'product'
                }
              },
            
              // Bước 8: Chọn các trường cần thiết và thêm productName
              {
                $project: {
                  orderId: 1,                   // Giữ nguyên các trường cần thiết
                  orderDetailId: '$orderDetail._id',
                  status: 1,
                  userName: 1,
                  createdAt: 1,
                  updatedAt: 1,
                  details:1,
                  productName: { 
                    $ifNull: ['$product.name', 'Không có sản phẩm'] // Thêm trường productName, nếu không có thì mặc định "Không có sản phẩm"
                  },
                  // Thêm các trường khác nếu cần
                }
              }
            ]);
            const totalCount = await LoggingOrder.countDocuments(query);
            return res.status(200).json({
              logs,  
              totalCount,  // Tổng số bản ghi (dùng để tính số trang)
              totalPages: Math.ceil(totalCount / limitNum),  // Tổng số trang
              currentPage: pageNum,  // Trang hiện tại
              limit: limitNum  // Số kết quả mỗi trang
            });
        
          } catch (error) {
            console.error('Error fetching logging orders:', error);
            return res.status(500).json({ message: 'Internal server error' });
          }
}
const getAllLogging = async (req, res) => {

  try {
    const { search, limit = 10, page = 1 } = req.query;
    const limitNum = Math.max(1, parseInt(limit));
    const pageNum = Math.max(1, parseInt(page));

    let query = {};

    if (search) {
      if (mongoose.Types.ObjectId.isValid(search)) {
        query.orderDetailId = new mongoose.Types.ObjectId(search);
      } else if (Date.parse(search)) {
        query.createdAt = {
          $gte: new Date(search),
          $lt: new Date(new Date(search).setDate(new Date(search).getDate() + 1))
        };
      } else {
        query.userName = { $regex: search, $options: 'i' };
      }
    }

    const skip = (pageNum - 1) * limitNum;

    const logs = await LoggingOrder.aggregate([
      { $match: query },
      { $skip: skip },
      { $limit: limitNum },
      {
        $lookup: {
          from: 'Order_Detail_History',
          localField: 'orderId',
          foreignField: 'orderId',
          as: 'orderDetail'
        }
      },
      {
        $unwind: {
          path: '$orderDetail',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'Products',
          localField: 'orderDetail.productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: {
          path: '$product',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          orderId: 1,
          orderDetailId: '$orderDetail._id',
          status: 1,
          userName: 1,
          createdAt: 1,
          updatedAt: 1,
          details: 1,
          productName: {
            $ifNull: ['$product.name', 'Không có sản phẩm']
          }
        }
      }
    ]);

    const totalCount = await LoggingOrder.countDocuments(query);

    return res.status(200).json({
      logs,
      totalCount,
      totalPages: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
      limit: limitNum
    });

  } catch (error) {
    console.error('Error fetching logging orders (all owners):', error);
    return res.status(500).json({ message: 'Internal server error' });
  }


    
};

module.exports = {
    getLogging,
    getAllLogging
}
// const mongoose = require("mongoose");
// const LoggingOrder = require('../modules/loggingOrder');
// const OrderDetailHistory = require('../modules/OrderDetailHistory');
// const Products = require('../modules/products');

// // Hàm lấy logging có phân trang và tìm kiếm
// const getLogging = async (req, res) => {
//   try {
//     const { search, limit = 10, page = 1, ownerId } = req.query;
//     const limitNum = Math.max(1, parseInt(limit));  
//     const pageNum = Math.max(1, parseInt(page));   

//     let query = {};

//     // Kiểm tra nếu có tham số tìm kiếm
//     if (search) {
//       if (mongoose.Types.ObjectId.isValid(search)) {
//         query.orderDetailId = new mongoose.Types.ObjectId(search);  
//       } else if (Date.parse(search)) {
//         query.createdAt = {
//           $gte: new Date(search),  // >= ngày bắt đầu (thời gian 00:00:00)
//           $lt: new Date(new Date(search).setDate(new Date(search).getDate() + 1)) 
//         };
//       } else {
//         query.userName = { $regex: search, $options: 'i' }; 
//       }
//     }

//     // Thêm ownerId vào query
//     query.ownerId = new mongoose.Types.ObjectId(ownerId);
//     //console.log("query :", query)   
//     const skip = (pageNum - 1) * limitNum;

//     const logs = await LoggingOrder.aggregate([
//       { 
//         $match: query 
//       },
//       { 
//         $skip: skip 
//       },
//       { 
//         $limit: limitNum 
//       },
//       {
//         $lookup: {
//           from: 'Order_Detail_History',
//           localField: 'orderId',
//           foreignField: 'orderId',
//           as: 'orderDetail'
//         }
//       },
//       {
//         $unwind: {
//           path: '$orderDetail',
//           preserveNullAndEmptyArrays: true
//         }
//       },
//       {
//         $lookup: {
//           from: 'Products',
//           localField: 'orderDetail.productId',
//           foreignField: '_id',
//           as: 'product'
//         }
//       },
//       {
//         $unwind: {
//           path: '$product',
//           preserveNullAndEmptyArrays: true
//         }
//       },
//       {
//         $project: {
//           orderId: 1,
//           orderDetailId: '$orderDetail._id',
//           status: 1,
//           userName: 1,
//           createdAt: 1,
//           updatedAt: 1,
//           details: 1,
//           productName: { 
//             $ifNull: ['$product.name', 'Không có sản phẩm']
//           }
//         }
//       }
//     ]);

//     const totalCount = await LoggingOrder.countDocuments(query);
//     return res.status(200).json({
//       logs,  
//       totalCount,  // Tổng số bản ghi (dùng để tính số trang)
//       totalPages: Math.ceil(totalCount / limitNum),  // Tổng số trang
//       currentPage: pageNum,  // Trang hiện tại
//       limit: limitNum  // Số kết quả mỗi trang
//     });

//   } catch (error) {
//     console.error('Error fetching logging orders:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };

// // Hàm lấy tất cả các logging mà không có phân trang
// const getAllLogging = async (req, res) => {
//   try {
//     const { ownerId } = req.query;

//     let query = {};

//     // Thêm ownerId vào query
//     query.ownerId = new mongoose.Types.ObjectId(ownerId);

//     const logs = await LoggingOrder.aggregate([
//       { 
//         $match: query 
//       },
//       {
//         $lookup: {
//           from: 'Order_Detail_History',
//           localField: 'orderId',
//           foreignField: 'orderId',
//           as: 'orderDetail'
//         }
//       },
//       {
//         $unwind: {
//           path: '$orderDetail',
//           preserveNullAndEmptyArrays: true
//         }
//       },
//       {
//         $lookup: {
//           from: 'Products',
//           localField: 'orderDetail.productId',
//           foreignField: '_id',
//           as: 'product'
//         }
//       },
//       {
//         $unwind: {
//           path: '$product',
//           preserveNullAndEmptyArrays: true
//         }
//       },
//       {
//         $project: {
//           orderId: 1,
//           orderDetailId: '$orderDetail._id',
//           status: 1,
//           userName: 1,
//           createdAt: 1,
//           updatedAt: 1,
//           details: 1,
//           productName: { 
//             $ifNull: ['$product.name', 'Không có sản phẩm']
//           }
//         }
//       }
//     ]);

//     return res.status(200).json(logs);

//   } catch (error) {
//     console.error('Error fetching all logging orders:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };

// module.exports = {
//   getLogging,
//   getAllLogging
// };
