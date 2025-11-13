/**
 * Script for managing a nutritional stock table.
 * Handles adding, editing, removing, searching, and persisting data via localStorage.
 */

// DOM Elements
const table = document.getElementById("tabelaNutricionistas");
const form = document.getElementById("formNutricionista");
let editingRow = null; // Tracks the row being edited

// ---------- Persistence Functions ----------
/**
 * Saves table data to localStorage.
 */
function saveData() {
    const data = Array.from(table.rows).map(row => ({
        codigo: row.cells[0].innerText,
        nomeDoAlimento: row.cells[1].innerText,
        validade: row.cells[2].innerText,
        quantidade: row.cells[3].innerText,
        tipo: row.cells[4].innerText,
    }));
    localStorage.setItem("instituicaoNutricionista", JSON.stringify(data));
}

/**
 * Loads data from localStorage and populates the table.
 */
function loadData() {
    const data = JSON.parse(localStorage.getItem("instituicaoNutricionista")) || [];
    data.forEach(item => addRow(item.codigo, item.nomeDoAlimento, item.validade, item.quantidade, item.tipo));
}

// ---------- Table Row Management ----------
/**
 * Adds a new row to the table.
 * @param {string} codigo - Item code.
 * @param {string} nomeDoAlimento - Food name.
 * @param {string} validade - Expiration date.
 * @param {string} quantidade - Quantity.
 * @param {string} tipo - Type.
 */
function addRow(codigo, nomeDoAlimento, validade, quantidade, tipo) {
    const row = table.insertRow();
    row.innerHTML = `
        <td>${codigo}</td>
        <td>${nomeDoAlimento}</td>
        <td>${validade}</td>
        <td>${quantidade}</td>
        <td>${tipo}</td>
        <td>
            <button class="btn btn-success btn-sm me-1 edit" aria-label="Editar">
                <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-danger btn-sm remove" aria-label="Remover">
                <i class="bi bi-x"></i>
            </button>
        </td>
    `;
}

// ---------- Form Submission (Add or Edit) ----------
form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form values
    const codigo = document.getElementById("codigo").value.trim();
    const nomeDoAlimento = document.getElementById("Nome_Do_Alimento").value.trim();
    const validade = document.getElementById("Validade").value.trim();
    const quantidade = document.getElementById("Quantidade").value.trim();
    const tipo = document.getElementById("Tipo").value.trim();

    // Basic validation
    if (!codigo || !nomeDoAlimento || !validade || !quantidade || !tipo) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    if (editingRow) {
        // Edit existing row
        editingRow.cells[0].innerText = codigo;
        editingRow.cells[1].innerText = nomeDoAlimento;
        editingRow.cells[2].innerText = validade;
        editingRow.cells[3].innerText = quantidade;
        editingRow.cells[4].innerText = tipo;
        editingRow = null;
    } else {
        // Add new row
        addRow(codigo, nomeDoAlimento, validade, quantidade, tipo);
    }

    saveData();
    form.reset();
    bootstrap.Modal.getInstance(document.getElementById("modalForm")).hide();
});

// ---------- Edit and Remove Handlers ----------
table.addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (!button) return;

    const row = button.closest("tr");

    if (button.classList.contains("remove")) {
        if (confirm("Deseja realmente remover este item?")) {
            row.remove();
            saveData();
        }
    }

    if (button.classList.contains("edit")) {
        editingRow = row;
        document.getElementById("codigo").value = row.cells[0].innerText;
        document.getElementById("Nome_Do_Alimento").value = row.cells[1].innerText;
        document.getElementById("Validade").value = row.cells[2].innerText;
        document.getElementById("Quantidade").value = row.cells[3].innerText;
        document.getElementById("Tipo").value = row.cells[4].innerText;

        document.getElementById("modalLabel").innerText = "Editar Item";
        new bootstrap.Modal(document.getElementById("modalForm")).show();
    }
});

// ---------- Modal Reset ----------
document.getElementById("modalForm").addEventListener("hidden.bs.modal", () => {
    editingRow = null;
    document.getElementById("modalLabel").innerText = "Adicionar Item";
    form.reset();
});

// ---------- Search Functionality ----------
document.getElementById("buscar").addEventListener("keyup", () => {
    const searchTerm = document.getElementById("buscar").value.toLowerCase();
    Array.from(table.rows).forEach(row => {
        const isVisible = row.innerText.toLowerCase().includes(searchTerm);
        row.style.display = isVisible ? "" : "none";
    });
});

// ---------- Initialize on Page Load ----------
window.addEventListener("DOMContentLoaded", loadData);
