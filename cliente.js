// cliente.js
import { db } from "./firebase-config.js";
import {
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const urlParams = new URLSearchParams(window.location.search);
const clienteId = urlParams.get("id");
const info = document.getElementById("info");
const historial = document.getElementById("historial");

let clienteData = null;
const docRef = doc(db, "clientes", clienteId);

async function cargarCliente() {
  if (!clienteId) {
    info.innerText = "❌ Cliente no especificado";
    return;
  }

  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    info.innerText = "❌ Cliente no encontrado";
    return;
  }

  clienteData = docSnap.data();
  document.getElementById("cliente-nombre").innerText = `👤 ${clienteData.nombre}`;
  info.innerHTML = `<strong>${clienteData.nombre}</strong><br>Saldo disponible: $${clienteData.saldo}`;
  renderHistorial();
}

function renderHistorial() {
  historial.innerHTML = "";
  if (clienteData.movimientos.length === 0) {
    historial.innerHTML = "<li>No hay movimientos aún.</li>";
    return;
  }
  clienteData.movimientos.slice().reverse().forEach(m => {
    const li = document.createElement("li");
    li.innerText = `${m.fecha} — ${m.monto > 0 ? '+' : ''}${m.monto}`;
    historial.appendChild(li);
  });
}

window.registrarMovimiento = async function () {
  const montoInput = document.getElementById("monto");
  const valor = parseInt(montoInput.value);
  if (isNaN(valor)) return alert("Monto inválido.");

  const nuevoMovimiento = {
    fecha: new Date().toLocaleString(),
    monto: valor
  };

  clienteData.movimientos.push(nuevoMovimiento);
  clienteData.saldo += valor;

  await updateDoc(docRef, {
    saldo: clienteData.saldo,
    movimientos: clienteData.movimientos
  });

  montoInput.value = "";
  cargarCliente();
};

cargarCliente();
