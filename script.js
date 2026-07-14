/*=========================================
ELEMENTOS
=========================================*/

const listaProdutos = document.getElementById("listaProdutos");

const modal = document.getElementById("modalPedido");

const fecharModal = document.querySelector(".fechar-modal");

const tituloPrato = document.getElementById("tituloPrato");

const precoPrato = document.getElementById("precoPrato");

const adicionarPedido = document.getElementById("adicionarPedido");

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

function obterDados(){

    const acompanhamentosEscolhidos=[];

    document

    .querySelectorAll(

    ".grupo-checkbox input:checked"

    )

    .forEach(item=>{

        acompanhamentosEscolhidos.push(item.value);

    });

    const finalizacao=

    document.querySelector(

    'input[name="finalizacao"]:checked'

    )?.value || "";

    const farofa=

    document.querySelector(

    'input[name="farofa"]:checked'

    ).value;

   return{

    prato:pratoAtual,

    preco:precoAtual,

    acompanhamentos:

    acompanhamentosSelecionados,

    finalizacao,

    farofa

};
/*=========================================
ADICIONAR AO PEDIDO
=========================================*/

adicionarPedido.addEventListener("click",()=>{

    const dados = obterDados();

    if(dados.acompanhamentos.length===0){

        alert("Escolha pelo menos um acompanhamento.");

        return;

    }

    if(dados.finalizacao===""){

        alert("Escolha uma finalização.");

        return;

    }

    pedido.push({

        prato:produtoAtual.nome,

        preco:produtoAtual.preco,

        acompanhamentos:dados.acompanhamentos,

        finalizacao:dados.finalizacao,

        farofa:dados.farofa,

        pagamento:dados.pagamento

    });

    atualizarCarrinho();

    modal.classList.remove("ativo");

});

/*=========================================
ELEMENTOS DO CARRINHO
=========================================*/

const listaPedido = document.getElementById("listaPedido");

const valorTotal = document.getElementById("valorTotal");

const finalizarPedido = document.getElementById("finalizarPedido");

/*=========================================
ATUALIZAR CARRINHO
=========================================*/

function atualizarCarrinho(){

    listaPedido.innerHTML="";

    let total=0;

    if(pedido.length===0){

        listaPedido.innerHTML=`

            <p class="carrinho-vazio">

                Nenhum prato adicionado.

            </p>

        `;

    }

    pedido.forEach((item,index)=>{

        total+=item.preco;

        const card=document.createElement("div");

        card.className="item-pedido";

        card.innerHTML=`

            <button
                class="btn-remover"
                data-id="${index}">

                🗑️

            </button>

            <h4>

                ${item.prato}

            </h4>

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

            <strong>

                R$ ${item.preco.toFixed(2)}

            </strong>

        `;

        listaPedido.appendChild(card);

    });

    valorTotal.innerText=`R$ ${total.toFixed(2)}`;

    ativarRemover();

}

/*=========================================
REMOVER ITEM
=========================================*/

function ativarRemover(){

    document

    .querySelectorAll(".btn-remover")

    .forEach(botao=>{

        botao.addEventListener("click",()=>{

            const indice=Number(botao.dataset.id);

            pedido.splice(indice,1);

            atualizarCarrinho();

        });

    });

}

/*=========================================
FINALIZAR PEDIDO
=========================================*/

finalizarPedido.addEventListener("click",()=>{

    if(pedido.length===0){

        alert("Seu pedido está vazio.");

        return;

    }

    let total=0;

    let mensagem="🍽️ *PEDIDO FINALIZADO*%0A%0A";

    pedido.forEach(item=>{

        total+=item.preco;

        mensagem+=`${item.prato}%0A`;

        item.acompanhamentos.forEach(ac=>{

            mensagem+=`${ac}%0A`;

        });

        mensagem+=`${item.finalizacao}%0A`;

        if(item.farofa==="Sim"){

            mensagem+="Farofa%0A";

        }

        mensagem+="%0A";

    });

    mensagem+=`TOTAL = R$ ${total.toFixed(2)}%0A`;

    mensagem+=`PAGAMENTO ${pedido[0].pagamento}`;

    window.open(

        `https://wa.me/5521979825876?text=${mensagem}`,

        "_blank"

    );

});

/*=========================================
INICIALIZAÇÃO
=========================================*/

renderizarProdutos();

atualizarCarrinho();
