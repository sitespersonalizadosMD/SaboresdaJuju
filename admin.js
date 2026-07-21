import { db } from "./js/firebase.js";

import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const nome = document.getElementById("nome");
const preco = document.getElementById("preco");
const produtoId = document.getElementById("produtoId");

const btnSalvar = document.getElementById("btnSalvar");

const listaProdutos = document.getElementById("listaProdutos");

async function carregarProdutos() {

    listaProdutos.innerHTML = "";

    const snapshot = await getDocs(collection(db, "produtos"));

    snapshot.forEach((item) => {

        const produto = item.data();

        listaProdutos.innerHTML += `

        <tr>

            <td>${produto.nome}</td>

            <td>R$ ${Number(produto.preco).toFixed(2)}</td>

            <td>

                <button
                    class="editar"
                    onclick="editarProduto(
                        '${item.id}',
                        '${produto.nome}',
                        '${produto.preco}'
                    )">

                    Editar

                </button>

                <button
                    class="excluir"
                    onclick="excluirProduto(
                        '${item.id}'
                    )">

                    Excluir

                </button>

            </td>

        </tr>

        `;

    });

}

btnSalvar.addEventListener("click", async () => {

    if (nome.value.trim() === "") {

        alert("Informe o nome do prato.");

        return;

    }

    if (preco.value === "") {

        alert("Informe o preço.");

        return;

    }

    if (produtoId.value === "") {

        await addDoc(

            collection(db, "produtos"),

            {

                nome: nome.value,

                preco: Number(preco.value),

                ativo: true

            }

        );

    } else {

        await updateDoc(

            doc(db, "produtos", produtoId.value),

            {

                nome: nome.value,

                preco: Number(preco.value)

            }

        );

    }

    produtoId.value = "";

    nome.value = "";

    preco.value = "";

    carregarProdutos();

});

window.editarProduto = function(id, nomeProduto, precoProduto){

    produtoId.value = id;

    nome.value = nomeProduto;

    preco.value = precoProduto;

}

window.excluirProduto = async function(id){

    if(confirm("Excluir este prato?")){

        await deleteDoc(

            doc(db,"produtos",id)

        );

        carregarProdutos();

    }

}

carregarProdutos();
