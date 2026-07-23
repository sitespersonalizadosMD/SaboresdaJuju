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
// ELEMENTOS
// =========================

const nome = document.getElementById("nome");
const preco = document.getElementById("preco");
const produtoId = document.getElementById("produtoId");

const btnSalvar = document.getElementById("btnSalvar");

const listaProdutos = document.getElementById("listaProdutos");

const abaProdutos = document.getElementById("abaProdutos");
const abaAcompanhamentos = document.getElementById("abaAcompanhamentos");
const abaFinalizacoes = document.getElementById("abaFinalizacoes");

const grupoPreco = document.getElementById("grupoPreco");
const tituloTabela = document.getElementById("tituloTabela");
const lblNome = document.getElementById("lblNome");

const cabecalhoPreco = document.getElementById("colunaPreco");

// =========================
// VARIÁVEIS
// =========================

let colecaoAtual = "produtos";
let registros = new Map();

// =========================
// ABAS
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
// FORMULÁRIO
// =========================

function atualizarFormulario() {

    if (colecaoAtual === "produtos") {

        grupoPreco.style.display = "block";
        cabecalhoPreco.style.display = "";

        lblNome.textContent = "Nome do prato";
        tituloTabela.textContent = "Pratos cadastrados";

    }

    if (colecaoAtual === "acompanhamentos") {

        grupoPreco.style.display = "none";
        cabecalhoPreco.style.display = "none";

        lblNome.textContent = "Nome do acompanhamento";
        tituloTabela.textContent = "Acompanhamentos cadastrados";

        preco.value = "";

    }

    if (colecaoAtual === "finalizacoes") {

        grupoPreco.style.display = "none";
        cabecalhoPreco.style.display = "none";

        lblNome.textContent = "Nome da finalização";
        tituloTabela.textContent = "Finalizações cadastradas";

        preco.value = "";

    }

}

// =========================
// LISTAR
// =========================

async function carregarDados() {

    listaProdutos.innerHTML = "";

    registros.clear();

    atualizarAbas();

    atualizarFormulario();

    const snapshot = await getDocs(
        collection(db, colecaoAtual)
    );

    snapshot.forEach((item) => {

        const dados = item.data();

        registros.set(item.id, dados);

        let colunaPreco = "";

        if (colecaoAtual === "produtos") {

            colunaPreco = `
                <td>
                    R$ ${Number(dados.preco).toFixed(2)}
                </td>
            `;

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

}

// =========================
// TROCA DE ABAS
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

    colecaoAtual = "finalizacão";

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

    if (colecaoAtual === "produtos" && preco.value.trim() === "") {

        alert("Informe o preço.");

        return;

    }

    const dados = {

        nome: nome.value.trim(),
        ativo: true

    };

    if (colecaoAtual === "produtos") {

        dados.preco = Number(preco.value);

    }

    try {

        if (produtoId.value === "") {

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

        carregarDados();

    } catch (erro) {

        console.error(erro);

        alert("Erro ao salvar.");

    }

});

// =========================
// EDITAR
// =========================

window.editarRegistro = function (id) {

    const dados = registros.get(id);

    if (!dados) return;

    produtoId.value = id;

    nome.value = dados.nome;

    if (colecaoAtual === "produtos") {

        preco.value = dados.preco;

    } else {

        preco.value = "";

    }

    nome.focus();

};

// =========================
// EXCLUIR
// =========================

window.excluirRegistro = async function (id) {

    if (!confirm("Deseja realmente excluir este registro?")) {

        return;

    }

    try {

        await deleteDoc(

            doc(db, colecaoAtual, id)

        );

        if (produtoId.value === id) {

            produtoId.value = "";
            nome.value = "";
            preco.value = "";

        }

        carregarDados();

    } catch (erro) {

        console.error(erro);

        alert("Erro ao excluir.");

    }

};
