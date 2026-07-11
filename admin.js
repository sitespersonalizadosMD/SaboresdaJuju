/*=========================================
LOGIN
=========================================*/

const formLogin = document.getElementById("formLogin");

if(formLogin){

    const usuario = "admin";

    const senha = "123456";

    formLogin.addEventListener("submit",(e)=>{

        e.preventDefault();

        const user = document.getElementById("usuario").value;

        const pass = document.getElementById("senha").value;

        if(user===usuario && pass===senha){

            window.location.href="admin.html";

        }else{

            alert("Usuário ou senha inválidos.");

        }

    });

}

/*=========================================
BANCO LOCAL
=========================================*/

let pratos = JSON.parse(localStorage.getItem("pratos")) || [

    {
        id:1,
        nome:"Bife à Cavalo",
        preco:22,
        descricao:""
    },

    {
        id:2,
        nome:"Frango à Parmegiana",
        preco:18,
        descricao:""
    },

    {
        id:3,
        nome:"Frango Acebolado",
        preco:18,
        descricao:""
    },

    {
        id:4,
        nome:"Frango à Milanesa",
        preco:18,
        descricao:""
    },

    {
        id:5,
        nome:"Omelete",
        preco:16,
        descricao:""
    },

    {
        id:6,
        nome:"Calabresa Acebolada",
        preco:16,
        descricao:""
    }

];

function salvarBanco(){

    localStorage.setItem(

        "pratos",

        JSON.stringify(pratos)

    );

}

/*=========================================
ELEMENTOS
=========================================*/

const listaPratos = document.getElementById("listaPratos");

const totalPratos = document.getElementById("totalPratos");

const totalAcompanhamentos = document.getElementById("totalAcompanhamentos");

const totalFinalizacoes = document.getElementById("totalFinalizacoes");

/*=========================================
RENDERIZAR TABELA
=========================================*/

function renderizarTabela(){

    if(!listaPratos) return;

    listaPratos.innerHTML="";

    pratos.forEach((prato,index)=>{

        listaPratos.innerHTML += `

        <tr>

            <td>

                ${prato.nome}

            </td>

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

    atualizarDashboard();

ativarEditar();

ativarExcluir();

}

/*=========================================
DASHBOARD
=========================================*/

function atualizarDashboard(){

    if(totalPratos){

        totalPratos.innerText=pratos.length;

    }

    if(totalAcompanhamentos){

        totalAcompanhamentos.innerText=5;

    }

    if(totalFinalizacoes){

        totalFinalizacoes.innerText=3;

    }

}

/*=========================================
INICIALIZAÇÃO
=========================================*/

renderizarTabela();
/*=========================================
MODAL
=========================================*/

const modal = document.getElementById("modalPrato");

const btnNovoPrato = document.getElementById("novoPrato");

const btnSalvar = document.getElementById("salvarPrato");

const nomePrato = document.getElementById("nomePrato");

const precoPrato = document.getElementById("precoPrato");

const descricaoPrato = document.getElementById("descricaoPrato");

const tituloModal = document.getElementById("tituloModal");

/*=========================================
VARIÁVEIS
=========================================*/

let editando = false;

let indiceEdicao = null;

/*=========================================
ABRIR MODAL
=========================================*/

if(btnNovoPrato){

    btnNovoPrato.addEventListener("click",()=>{

        limparFormulario();

        editando=false;

        indiceEdicao=null;

        tituloModal.innerText="Novo Prato";

        btnSalvar.innerText="Salvar Prato";

        modal.classList.add("ativo");

    });

}

/*=========================================
FECHAR MODAL
=========================================*/

window.addEventListener("click",(e)=>{

    if(e.target===modal){

        modal.classList.remove("ativo");

    }

});

/*=========================================
LIMPAR FORMULÁRIO
=========================================*/

function limparFormulario(){

    nomePrato.value="";

    precoPrato.value="";

    descricaoPrato.value="";

}

/*=========================================
SALVAR
=========================================*/

if(btnSalvar){

btnSalvar.addEventListener("click",()=>{

    if(nomePrato.value===""){

        alert("Informe o nome do prato.");

        return;

    }

    if(precoPrato.value===""){

        alert("Informe o preço.");

        return;

    }

    const prato={

        id:Date.now(),

        nome:nomePrato.value,

        preco:Number(precoPrato.value),

        descricao:descricaoPrato.value

    };

    if(editando){

        prato.id=pratos[indiceEdicao].id;

        pratos[indiceEdicao]=prato;

    }else{

        pratos.push(prato);

    }

    salvarBanco();

    renderizarTabela();

    limparFormulario();

    modal.classList.remove("ativo");

    editando=false;

    indiceEdicao=null;

});

}

/*=========================================
EDITAR
=========================================*/

function ativarEditar(){

    document

    .querySelectorAll(".editar")

    .forEach(botao=>{

        botao.onclick=()=>{

            indiceEdicao=Number(botao.dataset.id);

            const prato=pratos[indiceEdicao];

            nomePrato.value=prato.nome;

            precoPrato.value=prato.preco;

            descricaoPrato.value=prato.descricao;

            tituloModal.innerText="Editar Prato";

            btnSalvar.innerText="Atualizar";

            editando=true;

            modal.classList.add("ativo");

        };

    });

}

/*=========================================
EXCLUIR
=========================================*/

function ativarExcluir(){

    document

    .querySelectorAll(".excluir")

    .forEach(botao=>{

        botao.onclick=()=>{

            const indice=Number(botao.dataset.id);

            if(confirm("Deseja excluir este prato?")){

                pratos.splice(indice,1);

                salvarBanco();

                renderizarTabela();

            }

        };

    });

}
/*=========================================
ACOMPANHAMENTOS
=========================================*/

let acompanhamentos = JSON.parse(
    localStorage.getItem("acompanhamentos")
) || [

    "Arroz Branco",

    "Arroz Integral",

    "Feijão Preto",

    "Feijão Mulatinho",

    "Macarrão"

];

/*=========================================
FINALIZAÇÕES
=========================================*/

let finalizacoes = JSON.parse(
    localStorage.getItem("finalizacoes")
) || [

    "Batata Frita",

    "Salada Verde",

    "Purê de Batata"

];

/*=========================================
CONFIGURAÇÕES
=========================================*/

let configuracoes = JSON.parse(
    localStorage.getItem("configuracoes")
) || {

    restaurante:"Sabores da Juju",

    whatsapp:"5521979825876",

    pix:""

};

/*=========================================
SALVAR DADOS
=========================================*/

function salvarAcompanhamentos(){

    localStorage.setItem(

        "acompanhamentos",

        JSON.stringify(acompanhamentos)

    );

}

function salvarFinalizacoes(){

    localStorage.setItem(

        "finalizacoes",

        JSON.stringify(finalizacoes)

    );

}

function salvarConfiguracoes(){

    localStorage.setItem(

        "configuracoes",

        JSON.stringify(configuracoes)

    );

}
