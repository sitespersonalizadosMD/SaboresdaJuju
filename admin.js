import { db } from "./js/firebase.js";

import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// =========================
// ELEMENTOS DA TELA
// =========================

const nome = document.getElementById("nome");
const preco = document.getElementById("preco");
const produtoId = document.getElementById("produtoId");

const btnSalvar = document.getElementById("btnSalvar");

const listaProdutos = document.getElementById("listaProdutos");

const abaProdutos = document.getElementById("abaProdutos");
const abaAcompanhamentos = document.getElementById("abaAcompanhamentos");
const abaFinalizacoes = document.getElementById("abaFinalizacoes");

// =========================
// VARIÁVEIS
// =========================

let colecaoAtual = "produtos";
let registros = new Map();

// =========================
// ALTERA O VISUAL DAS ABAS
// =========================

function atualizarAbas() {

    abaProdutos.classList.remove("ativo");
    abaAcompanhamentos.classList.remove("ativo");
    abaFinalizacoes.classList.remove("ativo");

    if (colecaoAtual === "produtos") {

        abaProdutos.classList.add("ativo");

    }

    if (colecaoAtual === "acompanhamentos") {

        abaAcompanhamentos.classList.add("ativo");

    }

    if (colecaoAtual === "finalizacoes") {

        abaFinalizacoes.classList.add("ativo");

    }

}

// =========================
// MOSTRA OU ESCONDE PREÇO
// =========================

function atualizarFormulario() {

    if (colecaoAtual === "produtos") {

        preco.parentElement.style.display = "block";

    } else {

        preco.parentElement.style.display = "none";

        preco.value = "";

    }

}

// =========================
// CARREGAR DADOS
// =========================

async function carregarDados() {

    listaProdutos.innerHTML = "";
    registros.clear();

    atualizarAbas();

    atualizarFormulario();

    try {

        const snapshot = await getDocs(
            collection(db, colecaoAtual)
        );

        snapshot.forEach((item) => {

            const dados = item.data();
            registros.set(item.id, dados);

            let colunaPreco = "";

            if (colecaoAtual === "produtos") {

                colunaPreco =
                    `<td>R$ ${Number(dados.preco).toFixed(2)}</td>`;

            } else {

                colunaPreco = `<td>-</td>`;

            }

            listaProdutos.innerHTML += `

                <tr>

                    <td>${dados.nome}</td>

                    ${colunaPreco}

                    <td>

                        <button
                            class="editar"
                            onclick="editarRegistro('${item.id}')">

                            Editar

                        </button>

                        <button
                            class="excluir"
                            onclick="excluirRegistro('${item.id}')">

                            Excluir

                        </button>

                    </td>

                </tr>

            `;

        });

    } catch (erro) {

        console.error(erro);

    }

}

// =========================
// EVENTOS DAS ABAS
// =========================

abaProdutos.addEventListener("click", () => {

    colecaoAtual = "produtos";

    carregarDados();

});

abaAcompanhamentos.addEventListener("click", () => {

    colecaoAtual = "acompanhamentos";

    carregarDados();

});

abaFinalizacoes.addEventListener("click", () => {

    colecaoAtual = "finalizacoes";

    carregarDados();

});

// =========================
// INICIALIZAÇÃO
// =========================

carregarDados();

// =========================
// SALVAR
// =========================

btnSalvar.addEventListener("click", async () => {

    if (nome.value.trim() === "") {

        alert("Informe o nome.");

        return;

    }

    if (colecaoAtual === "produtos" && preco.value === "") {

        alert("Informe o preço.");

        return;

    }

    const dados = {

        nome: nome.value.trim()

    };

    if (colecaoAtual === "produtos") {

        dados.preco = Number(preco.value);

    }

    if (produtoId.value === "") {

        dados.ativo = true;

        await addDoc(
            collection(db, colecaoAtual),
            dados
        );

    } else {

        await updateDoc(

            doc(db, colecaoAtual, produtoId.value),

            dados

        );

    }

    produtoId.value = "";

nome.value = "";

preco.value = "";

nome.focus();

await carregarDados();
});

// =========================
// EDITAR
// =========================

window.editarRegistro = function(id){

    const dados = registros.get(id);

    if(!dados) return;

    produtoId.value = id;

    nome.value = dados.nome;

    if(colecaoAtual === "produtos"){

        preco.value = dados.preco;

    }

}

// =========================
// EXCLUIR
// =========================

window.excluirRegistro = async function(id){

    if(!confirm("Deseja realmente excluir este registro?")){

        return;

    }

    await deleteDoc(

        doc(db, colecaoAtual, id)

    );

   atualizarAbas();

atualizarFormulario();

carregarDados();

}
