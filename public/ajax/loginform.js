
//////login form
const loginform=document.getElementById('loginform')

loginform.addEventListener('submit',e=>{
  e.preventDefault()
  console.log('djhgfudw');
  loginsbmit()
})


function loginsbmit(){
    const loginEmail=document.getElementById('loginEmail').value
const loginPassword=document.getElementById('loginPassword').value
console.log(loginEmail);
 const loginData={
    loginEmail:loginEmail,
    loginPassword:loginPassword
  }
  console.log(loginData);
  $.ajax({
    url:'/login',
    type:'post',
    data:JSON.stringify({loginData}),
    dataType:'json',
    contentType:'application/json',
    success:function(res){
        if(res.emailError){
            $("#login-e-error").text(res.emailError)
        }
        if(res.passwordError){
            $("#login-p-error").text(res.passwordError)
        }
          if(res.success){
            console.log('sucsses');
             location.href='/'
      }else{

      }
    }

  }
  )

}