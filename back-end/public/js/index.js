var main_login=document.querySelector('.main_login');
var main_signup=document.querySelector('.main_signup');
var main=document.querySelector('.main');
var login=document.querySelector('.login');
var forlogin=document.querySelector('.forlogin');
var forsignup=document.querySelector('.forsignup');
a=function(){
  document.querySelector('.login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // Xử lý đăng nhập bình thường với email/password
    body={
        email,
        password
    }
    fetch("http://localhost:3000/login/login_raw", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    })
    .then(response => {
        return response.json();
        // if (response.redirected) {
        //     window.location.href = response.url; // Chuyển hướng đến URL mới
        // } else {
        //     alert('Đăng nhập thất bại');
        // }
    })
    .then(data => {
        console.log(data);
        // Nếu cần chuyển hướng, bạn có thể thực hiện ở đây
        // window.location.href = '/success';
    })
    .catch(error => {
        console.error('Lỗi:', error);
    });
});  
}
b=function(){
    returns=document.querySelectorAll('.close-btn')
    returns.forEach(element => {
        element.addEventListener('click',()=>{
    login.style.display="none";
    main.style.opacity="1";
    });
    
    
})
}
main_login.addEventListener('click',()=>{
    login.style.display="block";
    main.style.opacity="0.2";
    forlogin.style.display="block";
    forsignup.style.display="none";
})
main_signup.addEventListener('click',()=>{
    login.style.display="block";
    main.style.opacity="0.2";
    forlogin.style.display="none";
    forsignup.style.display="block";

})

// Xử lý đăng nhập Google
function handleCredentialResponse(response) {
    const jwtToken = response.credential;
    const decoded = jwt_decode(jwtToken);  // Giải mã JWT token
    console.log('Thông tin người dùng:', decoded);
    body={
    family_name:decoded.family_name,
    given_name:decoded.given_name,
    GoogleID:decoded.sub
    }
    console.log(JSON.stringify(body))
    fetch("http://localhost:3000/login/login_google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
      })
      .then(response => response.json()
    //     {
    //       if (response.redirected) {
    //           window.location.href = response.url; // Chuyển hướng đến URL mới
    //       } else {
    //           alert('Đăng nhập thất bại');
    //       }
    //   }
    )
    .then((a)=>{
        console.log(a)
    })
      .catch(error => {
          console.error('Lỗi:', error);
      });
}


a();
b();

