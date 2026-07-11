/*=========================================
ELEMENTOS
=========================================*/

const modal = document.getElementById("modalPedido");

const fecharModal = document.querySelector(".fechar-modal");

const tituloPrato = document.getElementById("tituloPrato");

const precoPrato = document.getElementById("precoPrato");

const adicionarPedido = document.getElementById("adicionarPedido");

const listaPedido = document.getElementById("listaPedido");

const valorTotal = document.getElementById("valorTotal");

const finalizarPedido = document.getElementById("finalizarPedido");

/*=========================================
VARIÁVEIS
=========================================*/

let pedido = [];

let pratoAtual = "";

let precoAtual = 0;

let total = 0;

const listaProdutos = document.getElementById("listaProdutos");

/*=========================================
FECHAR MODAL
=========================================*/

fecharModal.addEventListener("click", () => {

    modal.classList.remove("ativo");

});

window.addEventListener("click",(e)=>{

    if(e.target===modal){

        modal.classList.remove("ativo");

    }

});

/*=========================================
LIMPAR FORMULÁRIO
=========================================*/

function limparFormulario(){

    document.querySelectorAll(".grupo-checkbox input")
    .forEach(item=>{

        item.checked=false;

    });

    document
    .querySelectorAll('input[name="finalizacao"]')
    .forEach(item=>{

        item.checked=false;

    });

    document
    .querySelector('input[name="farofa"][value="Não"]')
    .checked=true;

    document
    .getElementById("formaPagamento")
    .selectedIndex=0;

}

/*=========================================
LIMITAR 3 ACOMPANHAMENTOS
=========================================*/

const acompanhamentos =
document.querySelectorAll(".grupo-checkbox input");

acompanhamentos.forEach(item=>{

    item.addEventListener("change",()=>{

        const selecionados =
        document.querySelectorAll(".grupo-checkbox input:checked");

        if(selecionados.length>3){

            item.checked=false;

            alert("Escolha no máximo 3 acompanhamentos.");

        }

    });

});

/*=========================================
CAPTURAR DADOS
=========================================*/

function obterPedido(){

    const acompanhamentosSelecionados=[];

    document
    .querySelectorAll(".grupo-checkbox input:checked")
    .forEach(item=>{

        acompanhamentosSelecionados.push(item.value);

    });

    const finalizacao=

    document.querySelector(
    'input[name="finalizacao"]:checked'
    )?.value || "";

    const farofa=

    document.querySelector(
    'input[name="farofa"]:checked'
    ).value;

    const pagamento=

    document.getElementById(
    "formaPagamento"
    ).value;

    return{

        prato:pratoAtual,

        preco:precoAtual,

        acompanhamentos:

        acompanhamentosSelecionados,

        finalizacao,

        farofa,

        pagamento

    };

}
/*=========================================
ADICIONAR AO PEDIDO
=========================================*/

adicionarPedido.addEventListener("click", () => {

    const dados = obterPedido();

    if (dados.acompanhamentos.length === 0) {

        alert("Escolha pelo menos um acompanhamento.");

        return;

    }

    if (dados.finalizacao === "") {

        alert("Escolha uma finalização.");

        return;

    }

    pedido.push(dados);

    atualizarCarrinho();

    modal.classList.remove("ativo");

});

/*=========================================
ATUALIZAR CARRINHO
=========================================*/

function atualizarCarrinho() {

    listaPedido.innerHTML = "";

    total = 0;

    pedido.forEach((item, indice) => {

        total += item.preco;

        const card = document.createElement("div");

        card.classList.add("item-pedido");

        card.innerHTML = `

            <button
                class="btn-remover"
                data-id="${indice}">

                🗑️

            </button>

            <h4>${item.prato}</h4>

            <p>

                <strong>Acompanhamentos:</strong>

                ${item.acompanhamentos.join(", ")}

            </p>

            <p>

                <strong>Finalização:</strong>

                ${item.finalizacao}

            </p>

            <p>

                <strong>Farofa:</strong>

                ${item.farofa}

            </p>

            <p>

                <strong>Pagamento:</strong>

                ${item.pagamento}

            </p>

            <span class="preco-item">

                R$ ${item.preco.toFixed(2)}

            </span>

        `;

        listaPedido.appendChild(card);

    });

    valorTotal.innerText = `R$ ${total.toFixed(2)}`;

    removerItens();

}

/*=========================================
REMOVER ITEM
=========================================*/

function removerItens() {

    document
    .querySelectorAll(".btn-remover")
    .forEach(botao => {

        botao.addEventListener("click", () => {

            const indice = Number(botao.dataset.id);

            pedido.splice(indice,1);

            atualizarCarrinho();

        });

    });

}

/*=========================================
FINALIZAR PEDIDO
=========================================*/

finalizarPedido.addEventListener("click", () => {

    if (pedido.length === 0) {

        alert("Seu pedido está vazio.");

        return;

    }

    let mensagem = "🍽️ *SABORES DA JUJU*%0A%0A";

    mensagem += "*PEDIDO*%0A%0A";

    pedido.forEach((item, numero) => {

        mensagem += `*${numero+1}. ${item.prato}*%0A`;

        mensagem += `Acompanhamentos:%0A`;

        item.acompanhamentos.forEach(ac => {

            mensagem += `• ${ac}%0A`;

        });

        mensagem += `Finalização: ${item.finalizacao}%0A`;

        mensagem += `Farofa: ${item.farofa}%0A`;

        mensagem += `Pagamento: ${item.pagamento}%0A`;

        mensagem += `Valor: R$ ${item.preco.toFixed(2)}%0A`;

        mensagem += `%0A`;

    });

    mensagem += "-------------------------%0A";

    mensagem += `*TOTAL:* R$ ${total.toFixed(2)}%0A`;

    window.open(

        `https://wa.me/5521979825876?text=${mensagem}`,

        "_blank"

    );

});

/*=========================================
INICIALIZAÇÃO
=========================================*/

atualizarCarrinho();

/*=========================================
RENDERIZAR PRODUTOS
=========================================*/

function renderizarProdutos() {

    listaProdutos.innerHTML = "";

    produtos.forEach(produto => {

        const card = document.createElement("div");

        card.className = "produto-card";

        card.innerHTML = `

            <img src="${produto.imagem}" alt="${produto.nome}">

            <div class="produto-info">

                <h3>${produto.nome}</h3>

                <span class="preco">

                    R$ ${produto.preco.toFixed(2)}

                </span>

                <button
                    class="btn-escolher"
                    data-produto="${produto.nome}"
                    data-preco="${produto.preco}">

                    Escolher

                </button>

            </div>

        `;

        listaProdutos.appendChild(card);

    });

    ativarBotoesProdutos();

}

/*=========================================
ATIVAR BOTÕES
=========================================*/

function ativarBotoesProdutos(){

    document.querySelectorAll(".btn-escolher")
    .forEach(botao=>{

        botao.addEventListener("click",()=>{

            pratoAtual = botao.dataset.produto;

            precoAtual = Number(botao.dataset.preco);

            tituloPrato.innerText = pratoAtual;

            precoPrato.innerText =
            `R$ ${precoAtual.toFixed(2)}`;

            limparFormulario();

            modal.classList.add("ativo");

        });

    });

}

renderizarProdutos();
