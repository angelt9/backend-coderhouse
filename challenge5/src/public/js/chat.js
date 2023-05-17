const socket = io();

const botonChat = document.getElementById("botonChat");
const parrafosMensaje = document.getElementById("parrafosMensajes");
const val = document.getElementById("chatBox");
let user;

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
  console.log(user);
});

botonChat.addEventListener("click", () => {
  if (val.value.trim().length > 0) {
    socket.emit("mensaje", { usuario: user, mensaje: val.value });
    val.value = "";
  }
});

socket.on("mensajes", (arr) => {
  parrafosMensaje.innerHTML = "";
  arr.forEach((mensaje) => {
    parrafosMensaje.innerHTML += `<p>${mensaje.usuario}: ${mensaje.mensaje}</p>`;
  });
});
