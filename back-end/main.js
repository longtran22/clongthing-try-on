const express=require('express')
const morgan = require('morgan')
const cors = require('cors');
const routes = require('./routes/main')
const path = require('path');
const app = express()
const mongodb=require('./modules/config/db')
const bodyParser = require('body-parser');
const setupSocket = require("./modules/config/socket");

const cloudinary = require('cloudinary').v2;
const axios = require('axios');
const multer = require('multer');
const fs = require('fs');
const upload = multer({ dest: 'uploads/' });

require('dotenv').config();

cloudinary.config({ 
    cloud_name: 'ddgrjo6jr', 
    api_key: '951328984572228', 
    api_secret: 'IBEHKrE-_AuUbTcxhks0jxLb6lE' 
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined'))
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
mongodb()
app.post('/tryon', upload.single('model_image'), async (req, res) => {
    try {
      const modelImagePath = req.file.path;
      const garmentImageUrl = req.body.garment_image_url;
  
      // Upload ảnh người dùng lên Cloudinary
      const result = await cloudinary.uploader.upload(modelImagePath, {
        folder: 'tryon',
      });
  
      const modelImageUrl = result.secure_url;
  
      // Gọi API Fashn
      const response = await axios.post(
        'https://api.fashn.ai/v1/run',
        {
          model_image: modelImageUrl,
          garment_image: garmentImageUrl,
          category: "tops"
        },
        {
          headers: {
            Authorization: 'Bearer YOUR_API_KEY',
            'Content-Type': 'application/json'
          }
        }
      );
  
      // Trả kết quả cho frontend
      res.json({ resultImageUrl: response.data.image_url });
      fs.unlinkSync(modelImagePath); // xóa ảnh tạm
  
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Try-on failed' });
    }
  });
  
// app.post('/tryon', upload.fields([
//     { name: 'avatar_image', maxCount: 1 },
//     { name: 'clothing_image', maxCount: 1 }
//   ]), async (req, res) => {
//     try {
//       const avatarPath = req.files['avatar_image'][0].path;
//       const clothingPath = req.files['clothing_image'][0].path;
  
//       const form = new FormData();
//       form.append('avatar_image', fs.createReadStream(avatarPath));
//       form.append('clothing_image', fs.createReadStream(clothingPath));
  
//       const response = await axios.post('https://try-on-diffusion.p.rapidapi.com/try-on-file', form, {
//         headers: {
//           ...form.getHeaders(),
//           'x-rapidapi-key': '70e3ffa0d9mshffc873762876c7bp1a8c05jsn704a6317d3a1',
//           'x-rapidapi-host': 'try-on-diffusion.p.rapidapi.com',
//         },
//       });
  
//       // Xoá file tạm
//       fs.unlinkSync(avatarPath);
//       fs.unlinkSync(clothingPath);
  
//       // Trả kết quả cho frontend
//       res.json({ resultImageUrl: response.data.url || response.data.image_url || response.data.result });
//     } catch (err) {
//       console.error(err.response?.data || err.message);
//       res.status(500).json({ error: 'Try-on failed' });
//     }
//   });
routes(app)
const server =app.listen(5000, () => {
    console.log('Server đang chạy tại http://localhost:5000');
});
const io =setupSocket(server);
