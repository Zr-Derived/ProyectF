const iniciarCompra = document.getElementById("botonEnviar");
iniciarCompra.addEventListener("click", function (validar) {
  validar.preventDefault();

  const nombrePersona = document.getElementById("nombre").value;
  const precio = document.getElementById("precio").value;
  const direccion = document.getElementById("direccion").value;
  const telefono = document.getElementById("telefono").value;
  const metodoEntrega = document.querySelector('input[name="entrega"]:checked');
  let entregaSeleccionada = "";
  if (metodoEntrega) {
    entregaSeleccionada = metodoEntrega.value;
  }

  if (
    !nombrePersona ||
    !precio ||
    !direccion ||
    !entregaSeleccionada ||
    !telefono
  ) {
    alert(
      "Por favor, completa todos los campos y selecciona un método de entrega, además de elegir un campo de producto o juego."
    );
    return;
  }

  if (nombrePersona.length > 20) {
    alert("El nombre de la persona no debe superar los 20 caracteres.");
    return;
  }

  if (isNaN(precio) || precio <= 0) {
    alert("El precio debe ser un número positivo.");
    return;
  }
  localStorage.setItem("nombre", nombrePersona);
  localStorage.setItem(
    "precio",
    `$${parseInt(precio).toLocaleString("es-CO")}`
  );
  localStorage.setItem("direccion", direccion);
  localStorage.setItem("telefono", telefono);
  localStorage.setItem("entregaSeleccionada", entregaSeleccionada);

  window.location.href = "Productos.html";
});

function limpiarCampos() {
  document.getElementById("nombre").value = "";
  document.getElementById("precio").value = "";
  document.getElementById("direccion").value = "";
  document.getElementById("telefono").value = "";
  document
    .querySelectorAll('input[name="entrega"]')
    .forEach((radio) => (radio.checked = false));
}
