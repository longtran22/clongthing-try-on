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
// app.post('/tryon', upload.single('model_image'), async (req, res) => {
//     try {
//       const modelImagePath = req.file.path;
//       const garmentImageUrl = req.body.garment_image_url;
  
//       // Upload ảnh người dùng lên Cloudinary
//       const result = await cloudinary.uploader.upload(modelImagePath, {
//         folder: 'tryon',
//       });
  
//       const modelImageUrl = result.secure_url;
  
//       // Gọi API Fashn
//       const response = await axios.post(
//         'https://api.fashn.ai/v1/run',
//         {
//           model_image: modelImageUrl,
//           garment_image: garmentImageUrl,
//           category: "tops"
//         },
//         {
//           headers: {
//             Authorization: 'Bearer YOUR_API_KEY',
//             'Content-Type': 'application/json'
//           }
//         }
//       );
  
//       // Trả kết quả cho frontend
//       res.json({ resultImageUrl: response.data.image_url });
//       fs.unlinkSync(modelImagePath); // xóa ảnh tạm
  
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).json({ error: 'Try-on failed' });
//     }
//   });
  
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

app.post('/tryon', upload.single('model_image'), async (req, res) => {
  try {
    const garmentImageUrl = req.body.garment_image_url;
    const clothingType = req.body.clothing_type || 'tops';
    const { TRYON_EMAIL, TRYON_PASSWORD } = process.env;

    if (!garmentImageUrl) {
      return res.status(400).json({ error: "Thiếu ảnh quần áo (URL)" });
    }

    let modelImageUrl;

    if (req.file) {
      // Trường hợp upload file ảnh người
      const modelImagePath = req.file.path;

      const result = await cloudinary.uploader.upload(modelImagePath, {
        folder: 'tryon',
      });
      modelImageUrl = result.secure_url;

      fs.unlinkSync(modelImagePath); // xoá file tạm
    } else if (req.body.model_image_url) {
      // Trường hợp gửi URL ảnh người
      modelImageUrl = req.body.model_image_url;
    } else {
      return res.status(400).json({ error: "Thiếu ảnh người dùng (file hoặc URL)" });
    }

    // Gửi request lấy ID thử đồ
      //console.log("model",modelImageUrl);
        //console.log("clothing:",clothingType);
        //console.log("garmentImageUrl:",garmentImageUrl);
        //  //console.log("clothingType:",clothingType);
    const submitRes = await axios.post(
      'https://thenewblack.ai/api/1.1/wf/vto',
      new URLSearchParams({
          email: TRYON_EMAIL,
        password: TRYON_PASSWORD,
        model_photo: modelImageUrl,
        clothing_photo: garmentImageUrl,
        clothing_type: clothingType,
       
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const tryonId = submitRes.data;
    //console.log("Try-on ID:", tryonId);

    // Đợi 150s cho hệ thống xử lý
    await new Promise((resolve) => setTimeout(resolve, 150000));

    // Gọi API lấy kết quả
    const resultRes = await axios.post(
      'https://thenewblack.ai/api/1.1/wf/results',
      new URLSearchParams({
        email: TRYON_EMAIL,
        password: TRYON_PASSWORD,
        // id: '1748747648046x391320756246291700',
        // id: '1748747648046x391320756246291700',
         id: tryonId ,
         // id: cho tài khoa lia tran
        //  id: '1749223435054x766414709092345200',

      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const resultImageUrl = resultRes.data;
    //console.log("result",resultImageUrl);
    res.json({ resultImageUrl });

  } catch (error) {
    console.error("Try-on error:", error?.response?.data || error.message);
    res.status(500).json({ error: 'Virtual try-on failed' });
  }
});

routes(app)
const server =app.listen(5000, () => {
    //console.log('Server đang chạy tại http://localhost:5000');
});
const io =setupSocket(server);
require('./controllers/chat')(io)
