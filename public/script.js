let allProducts = [];
let productModal;

window.onload = () => {
  productModal = new bootstrap.Modal(document.getElementById("productModal"));
  loadProducts();
};

// ---------------------------------------------------------
// READ & RENDER
// ---------------------------------------------------------
async function loadProducts() {
  try {
    const response = await fetch("/api/products");
    allProducts = await response.json();
    renderTable(allProducts);
    updateSummaryRibbon(); // NEW: Calculate stats every time data loads!
  } catch (error) {
    showToast("Error loading products.", "bg-danger");
  }
}

function renderTable(products) {
  const tableBody = document.getElementById("product-table-body");
  tableBody.innerHTML = "";

  products.forEach((product) => {
    // Automatically highlight the row in red if stock is low
    const rowClass = product.stock < 10 ? "table-danger" : "";

    const row = `
            <tr class="${rowClass}">
                <td>${product.id}</td>
                <td class="fw-bold">${product.name}</td>
                <td><span class="badge bg-secondary">${product.category}</span></td>
                <td>$${Number(product.price).toFixed(2)}</td>
                <td>${product.stock}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-outline-primary me-2" onclick="openEditModal(${product.id})">Edit</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct(${product.id})">Delete</button>
                </td>
            </tr>
        `;
    tableBody.innerHTML += row;
  });
}

// ---------------------------------------------------------
// NEW: EXECUTIVE SUMMARY LOGIC
// ---------------------------------------------------------
function updateSummaryRibbon() {
  let totalValue = 0;
  let totalStock = 0;
  let lowStockAlerts = 0;

  allProducts.forEach((product) => {
    totalStock += product.stock;
    totalValue += parseFloat(product.price) * parseInt(product.stock);
    if (product.stock < 10) {
      lowStockAlerts++;
    }
  });

  // Update the HTML cards
  document.getElementById("totalValue").innerText = `$${totalValue.toFixed(2)}`;
  document.getElementById("totalItems").innerText = totalStock;
  document.getElementById("lowStock").innerText = lowStockAlerts;
}

// ---------------------------------------------------------
// CREATE & UPDATE
// ---------------------------------------------------------
function openAddModal() {
  document.getElementById("productForm").reset();
  document.getElementById("productId").value = "";
  document.getElementById("productModalTitle").innerText = "Add New Product";
  productModal.show();
}

function openEditModal(id) {
  const product = allProducts.find((p) => p.id === id);
  if (!product) return;

  document.getElementById("productId").value = product.id;
  document.getElementById("productName").value = product.name;
  document.getElementById("productPrice").value = product.price;
  document.getElementById("productStock").value = product.stock;

  let catId = 1;
  if (product.category === "clothes") catId = 2;
  if (product.category === "groceries") catId = 3;
  document.getElementById("productCategory").value = catId;

  document.getElementById("productModalTitle").innerText = "Edit Product";
  productModal.show();
}

async function saveProduct() {
  const id = document.getElementById("productId").value;

  const productData = {
    name: document.getElementById("productName").value,
    price: parseFloat(document.getElementById("productPrice").value),
    stock: parseInt(document.getElementById("productStock").value),
    categoryId: parseInt(document.getElementById("productCategory").value),
  };

  try {
    let response;
    if (id) {
      response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      showToast("Product updated successfully!", "bg-success");
    } else {
      response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      showToast("Product added successfully!", "bg-success");
    }

    if (response.ok) {
      productModal.hide();
      loadProducts();
    } else {
      const errorData = await response.json();
      showToast(errorData.error || "Failed to save.", "bg-danger");
    }
  } catch (error) {
    showToast("Network error occurred.", "bg-danger");
  }
}

// ---------------------------------------------------------
// DELETE
// ---------------------------------------------------------
async function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  try {
    const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (response.ok) {
      showToast("Product deleted successfully!", "bg-danger");
      loadProducts();
    } else {
      showToast("Failed to delete product.", "bg-danger");
    }
  } catch (error) {
    showToast("Network error occurred.", "bg-danger");
  }
}

// ---------------------------------------------------------
// UI/UX FEATURES
// ---------------------------------------------------------
function filterProducts() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const filtered = allProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm),
  );
  renderTable(filtered);
}

async function loadReport() {
  try {
    const response = await fetch("/api/products/report/sales");
    const reportData = await response.json();

    const reportBody = document.getElementById("report-table-body");
    reportBody.innerHTML = "";

    reportData.forEach((item) => {
      const row = `
                <tr>
                    <td class="fw-bold">${item.productName}</td>
                    <td>${item.unitsSold}</td>
                    <td class="text-success fw-bold">$${item.quarterlyRevenue}</td>
                </tr>
            `;
      reportBody.innerHTML += row;
    });
  } catch (error) {
    showToast("Error loading report.", "bg-danger");
  }
}

function showToast(message, colorClass) {
  const toastEl = document.getElementById("liveToast");
  const toastMessage = document.getElementById("toastMessage");

  toastEl.classList.remove("bg-success", "bg-danger", "bg-primary");
  toastEl.classList.add(colorClass);
  toastMessage.innerText = message;

  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}
