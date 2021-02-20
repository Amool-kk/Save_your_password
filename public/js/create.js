console.log("Welcome to Registration Page");

let userName = document.querySelector(".userName");
let userEmail = document.querySelector(".userEmail");
let password = document.querySelector(".Password");
let cpassword = document.querySelector(".cPassword");
let submit = document.querySelector(".btn");
const div = document.getElementsByClassName("div");
// console.log(div)
// const cont = document.querySelector(".cont")

let validName = false;
let validEmail = false;
let validPassword = false;
let validConpas = false;



// validation for userName
userName.addEventListener('blur',()=>{
    const str = userName.value
    if(str.length <= 0){
        const html = `<small>Fill this entry</small>`
        div.innerHTML = html;
        validName = false;
        userName.classList.add('error')
    }
})
    userName.addEventListener('input',()=>{
        let regex = /^[a-zA-Z]{3,10}$/;
        const str = userName.value
    
        if(regex.test(str) == true){
            div[0].innerHTML = "";
            validName = true;
            userName.classList.remove('error');
            userName.classList.add('done');
        }if(regex.test(str) == false) {
            // console.log("error")
            const html = `<small>Does not use numbers and other charter</small>`;
            div[0].innerHTML = html;
            validName = false;
            userName.classList.add('error')
        }if (str.length < 3) {
            // console.log("write angain")
            // div.innerHTML = ""
            const html = `<small>UserName at least 3 latters</small>`;
            div[0].innerHTML = html;
            validName = false;
            userName.classList.add('error')
        }
    });



// validation for email
userEmail.addEventListener('blur',()=>{
    const str = userEmail.value;
    if(str.length<=0){
        const html = `<small>Fill this entry</small>`
        div[1].innerHTML = html;
        validEmail = false;
        userEmail.classList.add('error');
    }
});
userEmail.addEventListener('input',()=>{
    // console.log("event fired")
    const regex = /([0-9a-zA-Z]+)@([0-9a-zA-Z]+)\.([a-zA-Z])/;
    const str = userEmail.value;

    if(regex.test(str)){
        div[1].innerHTML = "";
        userEmail.classList.remove('error');
        validEmail = true;
        userEmail.classList.add('done');
    }
    else{
        const html = `<small>Enter valid Email</small>`;
        div[1].innerHTML = html
        userEmail.classList.add('error');
        validEmail = false;
    }
})


// validation for password
password.addEventListener('blur',()=>{
    const str = password.value;
    if(str.length<=0){
        const html = `<small>Fill this entry</small>`
        div[2].innerHTML = html;
        validPassword = false;
        password.classList.add('error');
    }
});
password.addEventListener('input',()=>{
    const regex = /[0-9a-zA-Z]{8,15}$/;
    const str = password.value;
    if(regex.test(str)){
        div[2].innerHTML = "";
        password.classList.remove('error');
        validPassword = true;
        password.classList.add('done');
    }else{
        const html = `<small>Create Password at least 8 charcter</small>`;
        div[2].innerHTML = html;
        password.classList.add('error');
        validPassword = false;
    }
});


// validation for conform password
cpassword.addEventListener('blur',()=>{
    const str = cpassword.value;
    const str2 = password.value;
    if(str.length<=0){
        const html = `<small>Not same as above password</small>`;
        div[3].innerHTML = html;
        validConpas =false;
        cpassword.classList.add('error');
    }
});
cpassword.addEventListener('input',()=>{
    const str = cpassword.value;
    const regex = /[0-9a-zA-Z]{8,15}$/;
    if(regex.test(str) && str == password.value){
        div[3].innerHTML = "";
        validConpas = true;
        cpassword.classList.remove('error');
        cpassword.classList.add('done');
    }else{
        const html = `<small>Not same as above password</small>`;
        div[3].innerHTML = html;
        validConpas =false;
        cpassword.classList.add('error');
    }
})


submit.addEventListener('click',(e)=>{
    // e.preventDefault()
    console.log(validName,validEmail,validPassword,validConpas)
})