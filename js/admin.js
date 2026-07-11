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
/*=========================================
MODAL
=========================================*/

const btnNovoPrato = document.getElementById("novoPrato");

const modal = document.getElementById("modalPrato");

const fechar = document.getElementById("fecharModal");

if(btnNovoPrato){

    btnNovoPrato.addEventListener("click",()=>{

        modal.classList.add("ativo");

    });

}

if(fechar){

    fechar.addEventListener("click",()=>{

        modal.classList.remove("ativo");

    });

}

window.addEventListener("click",(e)=>{

    if(e.target===modal){

        modal.classList.remove("ativo");

    }

});
