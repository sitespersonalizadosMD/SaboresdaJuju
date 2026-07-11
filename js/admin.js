const usuario = "admin";

const senha = "123456";

document
.getElementById("formLogin")
.addEventListener("submit",(e)=>{

e.preventDefault();

const user=document.getElementById("usuario").value;

const pass=document.getElementById("senha").value;

if(user===usuario && pass===senha){

window.location.href="admin.html";

}else{

alert("Usuário ou senha inválidos.");

}

});
