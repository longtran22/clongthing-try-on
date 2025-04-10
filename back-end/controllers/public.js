const path = require('path');
const mn=(req,res)=>{
    res.sendFile(path.join(__dirname,'..', 'public','index.html'));
}
const success=(req,res)=>{
    res.send('<h1>Đăng nhập thành công!</h1><p>Chào mừng bạn đến với trang web.</p>');
}
module.exports = {
    mn,
    success
}