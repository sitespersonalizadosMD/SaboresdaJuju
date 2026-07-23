import { db } from "./js/firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

/*=========================================
ELEMENTOS
=========================================*/

const listaProdutos = document.getElementById("listaProdutos");

const modal = document.getElementById("modalPedido");

const fecharModal = document.querySelector(".fechar-modal");

const tituloPrato = document.getElementById("tituloPrato");

const precoPrato = document.getElementById("precoPrato");

const finalizarPedidoModal = document.getElementById("finalizarPedidoModal");

const formaPagamentoModal = document.getElementById("formaPagamentoModal");

const valorTotalModal = document.getElementById("valorTotalModal");

/*=========================================
VARIÁVEIS
=========================================*/

let pedido = [];

let produtoAtual = null;

let produtos = [];

let acompanhamentos = [];

let finalizacoes = [];

/*=========================================
RENDERIZAR PRODUTOS
=========================================*/

function renderizarProdutos(){

    listaProdutos.innerHTML = "";

    produtos.forEach(produto=>{

        const card = document.createElement("div");

        card.className = "produto-card";

        card.innerHTML = `

            <div class="produto-info">

                <div>

                    <h3>${produto.nome}</h3>

                    <span class="preco">

                        R$ ${produto.preco.toFixed(2)}

                    </span>

                </div>

                <button
                    class="btn-escolher">

                    Escolher

                </button>

            </div>

        `;

        card
        .querySelector(".btn-escolher")
        .addEventListener("click",()=>{

            abrirModal(produto);

        });

        listaProdutos.appendChild(card);

    });

}

/*=========================================
ABRIR MODAL
=========================================*/

function abrirModal(produto){

    produtoAtual = produto;

    atualizarTotalModal();

    tituloPrato.innerText = produto.nome;

    precoPrato.innerText =
    `R$ ${produto.preco.toFixed(2)}`;

    renderizarAcompanhamentos();

    renderizarFinalizacoes();

    limparFormulario();

    modal.classList.add("ativo");

}

/*=========================================
RENDERIZAR ACOMPANHAMENTOS
=========================================*/

function renderizarAcompanhamentos(){

    const grupo = document.querySelector(".grupo-checkbox");

    grupo.innerHTML = "";

    acompanhamentos.forEach(item=>{

        grupo.innerHTML += `

            <label>

                <input
                    type="checkbox"
                    value="${item}">

                ${item}

            </label>

        `;

    });

    limitarAcompanhamentos();

}

/*=========================================
RENDERIZAR FINALIZAÇÕES
=========================================*/

function renderizarFinalizacoes(){

    const grupo = document.querySelector(".grupo-radio");

    grupo.innerHTML = "";

    finalizacoes.forEach(item=>{

        grupo.innerHTML += `

            <label>

                <input
                    type="radio"
                    name="finalizacao"
                    value="${item}">

                ${item}

            </label>

        `;

    });

}

/*=========================================
FECHAR MODAL
=========================================*/

fecharModal.addEventListener("click",()=>{

    modal.classList.remove("ativo");

});

window.addEventListener("click",(e)=>{

    if(e.target===modal){

        modal.classList.remove("ativo");

    }

});

/*=========================================
LIMPAR
=========================================*/

function limparFormulario(){

    document
    .querySelectorAll(".grupo-checkbox input")
    .forEach(item=>{

        item.checked=false;

    });

}

/*=========================================
LIMITE
=========================================*/

function limitarAcompanhamentos(){

    const checks =

    document.querySelectorAll(

    ".grupo-checkbox input"

    );

    checks.forEach(check=>{

        check.addEventListener("change",()=>{

            const marcados=

            document.querySelectorAll(

            ".grupo-checkbox input:checked"

            );

            if(marcados.length>3){

                check.checked=false;

                alert(

                "Escolha no máximo 3 acompanhamentos."

                );

            }

        });

    });

}

/*=========================================
CAPTURAR DADOS
=========================================*/

function obterDados() {

    const acompanhamentosEscolhidos = [];

    document
        .querySelectorAll(".grupo-checkbox input:checked")
        .forEach(item => {
            acompanhamentosEscolhidos.push(item.value);
        });

    const finalizacao =
        document.querySelector(
            'input[name="finalizacao"]:checked'
        )?.value || "";

    const farofa =
        document.querySelector(
            'input[name="farofa"]:checked'
        ).value;

    return {
        prato: produtoAtual.nome,
        preco: produtoAtual.preco,
        acompanhamentos: acompanhamentosEscolhidos,
        finalizacao,
        farofa
    };

}
/*=========================================
FINALIZAR PEDIDO
=========================================*/

finalizarPedidoModal.addEventListener("click", () => {

    const dados = obterDados();

    const pagamento = document.getElementById("formaPagamentoModal").value;

    const precisaTroco = document.getElementById("precisaTroco").value;

const valorTroco = document.getElementById("valorTroco").value;

    if (pagamento === "") {

    alert("Selecione a forma de pagamento.");

    return;

}
    if (
    pagamento === "Dinheiro" &&
    precisaTroco === "Sim" &&
    valorTroco === ""
) {

    alert("Informe o valor para o troco.");

    return;

}

    const taxa = pagamento === "Alimentação/Refeição" ? 2 : 0;

const total = produtoAtual.preco + taxa;

    let mensagem = "🍽️ *PEDIDO*%0A%0A";

    mensagem += `*Prato:* ${produtoAtual.nome}%0A%0A`;

    mensagem += "*Acompanhamentos:*%0A";

    dados.acompanhamentos.forEach(item => {

        mensagem += `• ${item}%0A`;

    });

   if (dados.finalizacao !== "") {

    mensagem += `%0A*Finalização:* ${dados.finalizacao}%0A`;

}

    mensagem += `*Farofa:* ${dados.farofa}%0A`;

    mensagem += `*Pagamento:* ${pagamento}%0A`;

    if (pagamento === "Dinheiro") {

    mensagem += `*Precisa de troco:* ${precisaTroco}%0A`;

    if (precisaTroco === "Sim") {

        mensagem += `*Troco para:* R$ ${Number(valorTroco).toFixed(2)}%0A`;

    }

}

    if (taxa > 0) {

    mensagem += `*Taxa Alimentação/Refeição:* R$ ${taxa.toFixed(2)}%0A`;

}

mensagem += `%0A*Total:* R$ ${total.toFixed(2)}`;

    window.open(

        `https://wa.me/5521979825876?text=${mensagem}`,

        "_blank"

    );

    modal.classList.remove("ativo");

});

function atualizarTotalModal() {

    if (!produtoAtual) return;

    let total = produtoAtual.preco;

    if (formaPagamentoModal.value === "Alimentação/Refeição") {

        total += 2;

    }

    valorTotalModal.innerText = `Total: R$ ${total.toFixed(2)}`;

}
/*=========================================
INICIALIZAÇÃO
=========================================*/

formaPagamentoModal.addEventListener("change", () => {

    atualizarTotalModal();

    const container = document.getElementById("trocoContainer");

    if (formaPagamentoModal.value === "Dinheiro") {

        container.style.display = "block";

    } else {

        container.style.display = "none";

    }

});

renderizarProdutos();
const precisaTroco = document.getElementById("precisaTroco");

const valorTroco = document.getElementById("valorTroco");

precisaTroco.addEventListener("change", () => {

    valorTroco.style.display =
        precisaTroco.value === "Sim"
            ? "block"
            : "none";

});

// Carrega tudo do Firebase
carregarDados();

async function carregarDados() {

    produtos = [];
    acompanhamentos = [];
    finalizacoes = [];

    // Produtos
    const produtosSnap = await getDocs(collection(db, "produtos"));

    produtosSnap.forEach(doc => {

        const dados = doc.data();

        if (dados.ativo) {

            produtos.push({

                nome: dados.nome,
                preco: dados.preco

            });

        }

    });

    // Acompanhamentos
    const acompSnap = await getDocs(collection(db, "acompanhamentos"));

    acompSnap.forEach(doc => {

        const dados = doc.data();

        if (dados.ativo) {

            acompanhamentos.push(dados.nome);

        }

    });

   // Finalizações
const finalSnap = await getDocs(collection(db, "finalização"));

finalSnap.forEach(doc => {

    const dados = doc.data();

    if (dados.ativo) {

        finalizacoes.push(dados.nome);

    }

});

// Agora desenha os produtos na tela
renderizarProdutos();
    }
carregarDados();
