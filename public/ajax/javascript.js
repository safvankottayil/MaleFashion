    const form=document.getElementById('form')
    const name=document.getElementById('name')
    const email=document.getElementById('email')
    const mobile=document.getElementById('mobile')
    const password1=document.getElementById('password')
    const password2=document.getElementById('repassword')


    form.addEventListener('submit',e=>{
      console.log('hallo');
        e.preventDefault()
        let check=validateInput()
        if(check){
            submitForm()
        }
    })

    const seterror=(element,message)=>{
        const inputControll=element.parentElement;
        const errorDisplay=inputControll.querySelector('.error')
  
        errorDisplay.innerText=message
        inputControll.classList.add('error')
        inputControll.classList.remove('success')
      }
      const setSuccess=(element)=>{
        const inputControll=element.parentElement;
        const errorDisplay=inputControll.querySelector('.error')
  
        errorDisplay.innerText=''
        inputControll.classList.remove('success')
        inputControll.classList.add('error')
      }
      function  validateInput(){
        const username=name.value.trim()
        const useremail=email.value.trim()
        const usermobile=mobile.value.trim()
        const userpassword1=password1.value.trim()
        const userpassword2=password2.value.trim()
        
         const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
         const mobileregex = /^[0-9]{10}$/;


        let isvalid=true
       

        if(username===''){
          seterror(name,'User name is required')
           isvalid=false
        }else if(username.length<4){
          seterror(name,'Enter minimum 4 charectre')
           isvalid=false
        //  } else if(!stringregex.test(username)){
        //   seterror(name,'Enter valid user')
        // 
      }else{
          setSuccess(name)
        }

    if(useremail==''){
      seterror(email,'email is required')
       isvalid=false
    }else if(!emailregex.test(useremail)){
      seterror(email,'Enter email format')
    }
      else{
      setSuccess(email)
    }
    if(usermobile==''){
      seterror(mobile,'mobile number required')
    
        }else if(!mobileregex.test(usermobile))
        seterror(mobile,'Enter only number and 10 number')
    else{
      setSuccess(mobile)
    }
    if(userpassword1==''){
      seterror(password1,'password is required')
       isvalid=false
    }else if(userpassword1.length<8){
      seterror(password1,'Enter minmum 8 number')
     isvalid=false
    }else{
      setSuccess(password1)
    }

    if(userpassword2===''){
      seterror(password2,'password is required')
       isvalid=false
    }else if(userpassword2!==userpassword1){
      seterror(password2,'password not match')
      isvalid=false

    }else{
      setSuccess(password2)
    }

    return isvalid
    }
   function  submitForm(){
        const username=name.value.trim()
        const useremail=email.value.trim()
        const usermobile=mobile.value.trim()
        const userpassword1=password1.value.trim()
        // const password2=password2.value.trim()

    const   formdata={
        name:username,
        email:useremail,
        mobile:usermobile,
        password:userpassword1
       }
console.log(formdata);
        $.ajax({
          url: '/register',
          type:'POST',
          data: JSON.stringify({formdata}),
          dataType: 'json',
          contentType: 'application/json',
          success:function(res){
            console.log(res);
            
            if (res.success) {
              alert('Check Email')
            }else{
              seterror(email,res.response)
            }
          }
      })
   }
   