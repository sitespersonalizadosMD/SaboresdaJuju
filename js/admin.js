const usuario = "admin";
const senha = "123456";

const formLogin = document.getElementById("formLogin");

if(formLogin){

    formLogin.addEventListener("submit",(e)=>{

        e.preventDefault();

        const user = document.getElementById("usuario").value;

        const pass = document.getElementById("senha").value;

        if(user === usuario && pass === senha){

            window.location.href = "admin.html";

        }else{

            alert("Usuário ou senha inválidos.");

        }

    });

}
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
/*=========================================
LOCAL STORAGE
=========================================*/

let pratos = JSON.parse(localStorage.getItem("pratos")) || [

    {

        nome:"Bife à Cavalo",

        preco:22,

        descricao:"",

        imagem:""

    },

    {

        nome:"Frango à Parmegiana",

        preco:18,

        descricao:"",

        imagem:""

    },

    {

        nome:"Frango Acebolado",

        preco:18,

        descricao:"",

        imagem:""

    },

    {

        nome:"Frango à Milanesa",

        preco:18,

        descricao:"",

        imagem:""

    },

    {

        nome:"Omelete",

        preco:16,

        descricao:"",

        imagem:""

    },

    {

        nome:"Calabresa Acebolada",

        preco:16,

        descricao:"",

        imagem:""

    }

];

const tabelaPratos = document.getElementById("listaPratos");

function salvarBanco(){

    localStorage.setItem(

        "pratos",

        JSON.stringify(pratos)

    );

}

function renderizarTabela(){

    tabelaPratos.innerHTML="";

    pratos.forEach((prato,index)=>{

        tabelaPratos.innerHTML += `

        <tr>

            <td>${prato.nome}</td>

            <td>

                R$ ${Number(prato.preco).toFixed(2)}

            </td>

            <td>

                <button
                    class="editar"

                    data-id="${index}">

                    Editar

                </button>

                <button
                    class="excluir"

                    data-id="${index}">

                    Excluir

                </button>

            </td>

        </tr>

        `;

    });

    excluirPrato();

}
/*=========================================
SALVAR PRATO
=========================================*/

const salvarPrato =
document.getElementById("salvarPrato");

if(salvarPrato){

salvarPrato.addEventListener("click",()=>{

const nome=

document.getElementById("nomePrato").value;

const preco=

document.getElementById("precoPrato").value;

const descricao=

document.getElementById("descricaoPrato").value;

if(nome==="" || preco===""){

alert("Preencha os campos.");

return;

}

pratos.push({

nome,

preco,

descricao,

imagem:""

});

salvarBanco();

renderizarTabela();

modal.classList.remove("ativo");

document.getElementById("nomePrato").value="";

document.getElementById("precoPrato").value="";

document.getElementById("descricaoPrato").value="";

});

}
/*=========================================
EXCLUIR
=========================================*/

function excluirPrato(){

document

.querySelectorAll(".excluir")

.forEach(botao=>{

botao.onclick=()=>{

const indice=

Number(botao.dataset.id);

if(confirm("Excluir prato?")){

pratos.splice(indice,1);

salvarBanco();

renderizarTabela();

}

};

});

}
renderizarTabela();
