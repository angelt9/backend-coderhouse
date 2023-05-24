const socket = io();

const formAdd = document.getElementById("formAddProduct");
const modal = new bootstrap.Modal(document.getElementById("modalProducts"), {
  keyboard: false,
});
const toast = new bootstrap.Toast(document.querySelector(".toast"));

const table = $("#dtProducts").DataTable();

socket.on("updateProduct", (data) => {
  if (data.code === 400) return;
  if (data.code == 201) {
    const prod = data.payload;
    table.row
      .add([
        prod.title,
        prod.description,
        "S/." + prod.price,
        prod.code,
        prod.stock,
        prod.category,
        ` <span class="badge rounded-pill text-bg-${
          prod.status ? "success" : "danger"
        }">${prod.status ? "Activo" : "Inactivo"}</span>`,
        `<button class="btn btn-outline-danger btn-delete" data-product-id="${prod._id}"><i class="fa-regular fa-trash" data-icon-product-id="${prod._id}"></i></button>`,
      ])
      .draw(false);
  } else if ((data.code = 200)) {
    const tr = document.querySelector(`[data-product-id="${data.id}"]`)
      .parentElement.parentElement;
    tr.classList.add("select");
    table.row(".select").remove().draw(false);
  }
});

formAdd.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const product = Object.fromEntries(data);

  await fetch("http://localhost:8080/api/products/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  })
    .then((res) => res.json())
    .then((res) => {
      limpiarToast();
      if (res.code === 400) {
        mostrarToast("danger", res.message);
      } else if (res.code === 201) {
        modal.hide();
        mostrarToast("success", res.message);
      }
    });
});

$(document).on("click", ".btn-delete", async (e) => {
  const id = e.target.dataset.productId ?? e.target.dataset.iconProductId;
  Swal.fire({
    icon: "question",
    title: "¿Estas seguro de eliminar el producto?",
    showDenyButton: true,
    denyButtonText: `Cancelar`,
    confirmButtonText: "Confirmar",
    confirmButtonColor: "#198754",
  }).then((result) => {
    if (result.isConfirmed) {
      eliminarProducto(parseInt(id));
    }
  });
});

const eliminarProducto = async (id) => {
  await fetch(`http://localhost:8080/api/products/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      limpiarToast();
      mostrarToast("danger", res.message);
    });
};

const limpiarToast = () => {
  document.querySelector(".toast").classList.remove("text-bg-success");
  document.querySelector(".toast").classList.remove("text-bg-danger");
  document.querySelector(".toast-body").innerText = "";
};

const mostrarToast = (color, mensaje) => {
  document.querySelector(".toast").classList.add(`text-bg-${color}`);
  document.querySelector(".toast-body").innerText = mensaje;
  toast.show();
};
