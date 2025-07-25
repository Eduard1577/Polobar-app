// index.js
import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const contenedor = document.getElementById("clientes");
const clientesRef = collection(db, "clientes");

async function cargarClientes() {
  const snapshot = await getDocs(clientesRef);
  contenedor.innerHTML = "";

  snapshot.forEach(docSnap => {
    const cliente = docSnap.data();
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <a href="cliente.html?id=${docSnap.id}">👤 ${cliente.nombre} — $${cliente.saldo}</a><br/>
      <button class="danger" onclick="eliminarCliente('${docSnap.id}')">Eliminar</button>
    `;
    contenedor.appendChild(div);
  });
}

window.agregarCliente = async function () {
  const nombre = prompt("Nombre del nuevo cliente:");
  if (!nombre) return;
  const clave = nombre.toLowerCase().replace(/\s+/g, '');
  const saldo = prompt("Saldo inicial:");
  if (!saldo || isNaN(saldo)) return alert("Saldo inválido.");

  await setDoc(doc(db, "clientes", clave), {
    nombre,
    saldo: parseInt(saldo),
    movimientos: []
  });

  alert("Cliente agregado.");
  cargarClientes();
};

window.eliminarCliente = async function (id) {
  const confirmar = confirm("¿Eliminar cliente?");
  if (!confirmar) return;
  await deleteDoc(doc(db, "clientes", id));
  alert("Cliente eliminado.");
  cargarClientes();
};

cargarClientes();
