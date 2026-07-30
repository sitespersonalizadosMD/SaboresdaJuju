import { db } from "./js/firebase.js";

import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    getDoc,
    doc,
    writeBatch,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// =========================
// ELEMENTOS
// =========================

const nome = document.getElementById("nome");
const preco = document.getElementById("preco");
const personalizavel =
    document.getElementById("personalizavel");
const produtoId = document.getElementById("produtoId");

const btnSalvar = document.getElementById("btnSalvar");

const listaProdutos = document.getElementById("listaProdutos");

const abaProdutos = document.getElementById("abaProdutos");
const abaAcompanhamentos = document.getElementById("abaAcompanhamentos");
const abaFinalizacoes = document.getElementById("abaFinalizacoes");

const grupoPreco = document.getElementById("grupoPreco");
const grupoPersonalizacao =
    document.getElementById("grupoPersonalizacao");
const tituloTabela = document.getElementById("tituloTabela");
const lblNome = document.getElementById("lblNome");

const cabecalhoPreco = document.getElementById("colunaPreco");
const btnSite = document.getElementById("btnSite");

// =========================
// VARIÁVEIS
// =========================

let colecaoAtual = "produtos";
let registros = new Map();
let sortable = null;

// =========================
// ABAS
// =========================

function atualizarAbas() {

    abaProdutos.classList.remove("ativo");
    abaAcompanhamentos.classList.remove("ativo");
    abaFinalizacoes.classList.remove("ativo");

    if (colecaoAtual === "produtos") {

        abaProdutos.classList.add("ativo");
        grupoPersonalizacao.style.display = "block";

    }

    if (colecaoAtual === "acompanhamentos") {

        abaAcompanhamentos.classList.add("ativo");
        grupoPersonalizacao.style.display = "none";

    }

    if (colecaoAtual === "finalização") {

        abaFinalizacoes.classList.add("ativo");
        grupoPersonalizacao.style.display = "none";

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

    if (colecaoAtual === "finalização") {

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

   let snapshot;

if (colecaoAtual === "produtos") {

    snapshot = await getDocs(
        query(
            collection(db, colecaoAtual),
            orderBy("ordem")
        )
    );

} else {

    snapshot = await getDocs(
        collection(db, colecaoAtual)
    );

}

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

<tr data-id="${item.id}">

    <td style="width:40px;text-align:center;cursor:grab;" class="drag-handle">
        ☰
    </td>

    <td>

        ${dados.nome}

        ${colecaoAtual === "produtos"
            ? `<br><small style="color:${dados.ativo === false ? '#c62828' : '#2e7d32'}">
                ${dados.ativo === false ? '🔴 Pausado' : '🟢 Ativo'}
              </small>`
            : ""
        }

    </td>

    ${colunaPreco}

    <td>

        <button
            class="editar"
            onclick="editarRegistro('${item.id}')">
            Editar
        </button>

        <button
            class="${dados.ativo === false ? 'editar' : 'excluir'}"
            onclick="alterarStatus('${item.id}')">

            ${dados.ativo === false ? 'Ativar' : 'Pausar'}

        </button>

    </td>

</tr>

`; });

    habilitarOrdenacao();
    }

       function habilitarOrdenacao() {

    if (colecaoAtual !== "produtos") return;

    if (sortable) {
        sortable.destroy();
    }

    sortable = Sortable.create(listaProdutos, {

        animation: 150,

        handle: ".drag-handle",

        onEnd: async () => {

            const linhas = listaProdutos.querySelectorAll("tr");

            const batch = writeBatch(db);

            linhas.forEach((linha, indice) => {

                const id = linha.dataset.id;

                batch.update(
                    doc(db, colecaoAtual, id),
                    {
                        ordem: indice + 1
                    }
                );

            });

            await batch.commit();

            carregarDados();

        }

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

    colecaoAtual = "finalização";

    carregarDados();

});

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

    nome: nome.value.trim()

};

if (produtoId.value === "") {

    dados.ativo = true;

} else {

    const registroAtual = registros.get(produtoId.value);

    dados.ativo = registroAtual?.ativo ?? true;

}

    if (colecaoAtual === "produtos") {

    dados.preco = Number(preco.value);

    dados.personalizavel = personalizavel.checked;

}

    try {

if (produtoId.value === "") {

    dados.ordem = listaProdutos.querySelectorAll("tr").length + 1;

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
personalizavel.checked = true;

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

    personalizavel.checked = dados.personalizavel ?? true;

} else {

    preco.value = "";

}

    nome.focus();

};

// =========================
// EXCLUIR
// =========================

window.alterarStatus = async function(id){

    const dados = registros.get(id);

    if(!dados) return;

    try{

        await updateDoc(

            doc(db, colecaoAtual, id),

            {
                ativo: !(dados.ativo !== false)
            }

        );

        carregarDados();

    }catch(erro){

        console.error(erro);
        alert("Erro ao alterar o status.");

    }

}
// =========================
// STATUS DO SITE
// =========================

async function carregarStatusSite() {

    const config = await getDoc(
        doc(db, "configuracoes", "site")
    );

    if (!config.exists()) return;

    const ativo = config.data().ativo;

    btnSite.textContent = ativo
        ? "🟢 Site Online (Clique para desativar)"
        : "🔴 Site Offline (Clique para ativar)";

    btnSite.dataset.ativo = ativo;
}

btnSite.addEventListener("click", async () => {

    const novoStatus = btnSite.dataset.ativo !== "true";

    await updateDoc(
        doc(db, "configuracoes", "site"),
        {
            ativo: novoStatus
        }
    );

    carregarStatusSite();

});

// =========================
// INICIALIZAÇÃO
// =========================

carregarDados();
carregarStatusSite();
