import { db } from "./firebase-config.js";
import {
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const urlParams = new URLSearchParams(window.location.search);
const clienteId = urlParams.get("c");

const nombreEl = document.getElementById("nombreCliente");
const saldoEl = document.getElementById("saldo");
const historialEl = document.getElementById("historial");
const montoInput = document.getElementById("monto");

let clienteData = null;
const docRef = doc(db, "clientes", clienteId);

// Cargar los datos del cliente desde Firestore
async function cargarCliente() {
  if (!clienteId) {
    nombreEl.textContent = "❌ Cliente no especificado";
    return;
  }

  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    nombreEl.textContent = "❌ Cliente no encontrado";
    return;
  }

  clienteData = docSnap.data();
  nombreEl.textContent = clienteData.nombre || clienteId;
  saldoEl.textContent = `$${clienteData.saldo}`;
  mostrarHistorial(clienteData.movimientos || []);
}

// Mostrar el historial ordenado por fecha (más reciente primero)
function mostrarHistorial(historial) {
  historialEl.innerHTML = "";

  // Ordenar de más reciente a más antiguo
  historial.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  if (historial.length === 0) {
    historialEl.innerHTML = "<li>No hay movimientos aún.</li>";
    return;
  }

  historial.forEach((mov) => {
    const li = document.createElement("li");
    li.textContent = `${mov.fecha} — ${mov.tipo.toUpperCase()}: $${mov.monto}`;
    li.style.color = mov.tipo === "abono" ? "green" : "red";
    historialEl.appendChild(li);
  });
}

// Función para registrar movimiento (abono o compra)
async function registrarMovimiento(tipo) {
  const valor = parseInt(montoInput.value);
  if (isNaN(valor) || valor <= 0) return alert("Monto inválido.");

  const montoFinal = tipo === "abono" ? valor : -valor;

  const nuevoMovimiento = {
    fecha: new Date().toLocaleString(),
    tipo,
    monto: montoFinal
  };

  clienteData.movimientos.push(nuevoMovimiento);
  clienteData.saldo += montoFinal;

  await updateDoc(docRef, {
    saldo: clienteData.saldo,
    movimientos: clienteData.movimientos
  });

  montoInput.value = "";
  cargarCliente();
}

// Asignar funciones a botones
window.abonar = () => registrarMovimiento("abono");
window.comprar = () => registrarMovimiento("compra");

// Iniciar
cargarCliente();

