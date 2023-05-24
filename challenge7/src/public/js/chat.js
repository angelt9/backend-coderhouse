const socket = io();

const botonChat = document.getElementById("botonChat");
const cardMessages = document.getElementById("card-messages");
const parrafosMensaje = document.getElementById("parrafosMensajes");
const val = document.getElementById("chatBox");
let user;

cardMessages.scroll(0, cardMessages.offsetHeight);

Swal.fire({
  title: "Identificacion de Usuario",
  text: "Por favor ingrese su nombre de Usuario",
  input: "text",
  inputValidator: (valor) => {
    return !valor && "Ingrese un valor valido";
  },
  allowOutsideClick: false,
}).then((resultado) => {
  user = resultado.value;
});

botonChat.addEventListener("click", async () => {
  if (val.value.trim().length > 0) {
    // socket.emit("mensaje", { user: user, message: val.value });
    await fetch("http://localhost:8080/api/messages/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: user, message: val.value }),
    })
      .then((res) => res.json())
      .then((res) => {
        val.value = "";
      });
  }
});

socket.on("messages", (res) => {
  var item = document.createElement("div");
  item.classList.add("card");
  item.classList.add("mb-3");
  item.classList.add("w-50");
  item.innerHTML = `
        <div class=""><p class="m-0 ps-2 fw-bold">${res.payload.user}</p></div>
        <div class="card-body p-2"><p class="m-0">${res.payload.message}</p></div>
    `;
  parrafosMensaje.append(item);
  cardMessages.scroll(0, cardMessages.offsetHeight);
});
