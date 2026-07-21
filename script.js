/*=========================================
ELEMENTOS
=========================================*/

const listaProdutos = document.getElementById("listaProdutos");

const modal = document.getElementById("modalPedido");

const fecharModal = document.querySelector(".fechar-modal");

const tituloPrato = document.getElementById("tituloPrato");

const precoPrato = document.getElementById("precoPrato");

const finalizarPedidoModal = document.getElementById("finalizarPedidoModal");

/*=========================================
VARIÁVEIS
=========================================*/

let pedido = [];

let produtoAtual = null;

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

    if (dados.acompanhamentos.length === 0) {

        alert("Escolha pelo menos um acompanhamento.");

        return;

    }

    if (dados.finalizacao === "") {

        alert("Escolha uma finalização.");

        return;

    }

    const pagamento = document.getElementById("formaPagamentoModal").value;

    const taxa = pagamento === "Alimentação/Refeição" ? 2 : 0;

const total = produtoAtual.preco + taxa;

    let mensagem = "🍽️ *PEDIDO*%0A%0A";

    mensagem += `*Prato:* ${produtoAtual.nome}%0A%0A`;

    mensagem += "*Acompanhamentos:*%0A";

    dados.acompanhamentos.forEach(item => {

        mensagem += `• ${item}%0A`;

    });

    mensagem += `%0A*Finalização:* ${dados.finalizacao}%0A`;

    mensagem += `*Farofa:* ${dados.farofa}%0A`;

    mensagem += `*Pagamento:* ${pagamento}%0A`;

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
/*=========================================
INICIALIZAÇÃO
=========================================*/

renderizarProdutos();
