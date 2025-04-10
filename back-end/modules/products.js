const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Users', 
        required: true 
    },
    name: { type: String, required: true },
    category: { type: String, required: true },
    brand: { type: String },
    description: { type: String },
    sku: { type: String, required: true },
    price: { type: String, required: true },
    stock_in_shelf: { type: Number, default: 0 },
    reorderLevel: { type: Number, default: 10 },
    supplier: {  type: mongoose.Schema.Types.ObjectId, 
        ref: 'Suppliers', 
        required: false  },
    purchaseDate: { type: Date, default: Date.now },
    location: { type: String },
    stock_in_Warehouse: { type: Number, default: 0 },
    unit: { type: String, default: 'pcs' },
    purchasePrice: { type: String },
    notes: { type: String },
    image: {
        secure_url: String,
        public_id: String,
    },
    sizes: { type: [String], default: [] },  
    colors: { type: [String], default: [] },
    stock: { 
      type: Map, 
      of: Map, // Tồn kho theo {size: {color: số lượng}}
      default: {} 
    },      
    material: { type: String }, 
    try_on_available: { type: Boolean, default: true },
    rate:{
        type:Number,
         default: 0 
    },
    discount:{
        type:Number,
         default: 0 
    }
}, { 
    timestamps: true,
});


const Products = mongoose.model('Products', productSchema,'Products');

module.exports = Products;




// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema({
//   owner: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Users', 
//     required: true 
//   },
//   name: { type: String, required: true },
//   price: { type: Number, required: true },
//   category: { type: String, required: true },
//   images: [{ secure_url: String, public_id: String }],
//   sizes: { type: [String], default: [] },  
//   colors: { type: [String], default: [] },
//   weight: { type: Number }, // Cân nặng sản phẩm
//   material: { type: String }, // Chất liệu
//   supplier_name: { type: String },         
//   cost_price: { type: Number, required: true },  
//   profit_margin: { type: Number, required: true }, 
//   stock: { 
//     type: Map, 
//     of: Map, // Tồn kho theo {size: {color: số lượng}}
//     default: {} 
//   },  
//   rating: { type: Number, default: 0, min: 0, max: 5 },
//   reviews: [
//     {
//       user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
//       rating: { type: Number, required: true, min: 1, max: 5 },
//       comment: { type: String },
//       created_at: { type: Date, default: Date.now }
//     }
//   ],
//   sales_count: { type: Number, default: 0 },
//   views: { type: Number, default: 0 },
//   status: { 
//     type: String, 
//     enum: ["available", "out_of_stock", "coming_soon"], 
//     default: "available" 
//   },
//   try_on_available: { type: Boolean, default: true },
// }, { timestamps: true });

// // Middleware tự động tính giá bán dựa trên biên lợi nhuận
// productSchema.pre('save', function(next) {
//   if (this.cost_price && this.profit_margin) {
//     this.price = this.cost_price * (1 + this.profit_margin / 100);
//   }
//   next();
// });

// module.exports = mongoose.model("Product", productSchema);
