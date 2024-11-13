document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.querySelector("tbody");
  const totalPrecioElem = document.getElementById("total-precio");
  const checkboxDomicilio = document.getElementById("checkbox-domicilio");
  const botonCompra = document.getElementById("completar-compra");
  const costoDomicilio = 150;

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let total = 0;

  // Cargar estado de entrega
  checkboxDomicilio.checked =
    localStorage.getItem("entregaSeleccionada") === "domicilio";

  // Renderizar productos del carrito en el DOM
  function renderizarCarrito() {
    tbody.innerHTML = "";
    total = carrito.reduce((acc, producto, index) => {
      const subtotal = producto.precio * producto.cantidad;
      acc += subtotal;

      tbody.insertAdjacentHTML(
        "beforeend",
        `
        <tr>
          <td><img src="${producto.imagen}" alt="${
          producto.nombre
        }" width="70"></td>
          <td>${producto.entidad}</td>
          <td>$${subtotal.toLocaleString("es-CO")}</td>
          <td>${producto.cantidad}</td>
          <td><button class="eliminar" data-index="${index}">X</button></td>
        </tr>
      `
      );
      return acc;
    }, 0);

    if (!carrito.length) {
      tbody.innerHTML = `<tr><td colspan="5">No hay productos en el carrito</td></tr>`;
    }

    actualizarTotal();
  }

  // Actualizar el total con o sin domicilio
  function actualizarTotal() {
    const totalFinal = total + (checkboxDomicilio.checked ? costoDomicilio : 0);
    totalPrecioElem.textContent = `$${totalFinal.toLocaleString("es-CO")}`;
  }

  // Eliminar producto del carrito y actualizar vista y localStorage
  tbody.addEventListener("click", (e) => {
    if (e.target.classList.contains("eliminar")) {
      const index = e.target.getAttribute("data-index");
      carrito.splice(index, 1);
      localStorage.setItem("carrito", JSON.stringify(carrito));
      renderizarCarrito();
    }
  });

  // Validar datos y realizar compra
  botonCompra.addEventListener("click", async (e) => {
    e.preventDefault();
    botonCompra.disabled = true;

    const numeroTarjeta = document.getElementById("tarjeta").value;
    const fechaExp = document.getElementById("fecha-exp").value;
    const codigoSeguridad = document.getElementById("codigo-seguridad").value;
    const nombreTitular = document.getElementById("nombre-titular").value;
    const tipoTarjeta = document.getElementById("tipo-tarjeta").value;
    const presupuestoMaximo = parseInt(
      localStorage.getItem("presupuestoMaximo")?.replace(/[^0-9]/g, "") || "0"
    );
    const cantidadTotal = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
    const totalConDomicilio =
      total + (checkboxDomicilio.checked ? costoDomicilio : 0);

    try {
      await validarCompra(
        numeroTarjeta,
        fechaExp,
        codigoSeguridad,
        nombreTitular,
        tipoTarjeta,
        cantidadTotal,
        totalConDomicilio,
        presupuestoMaximo
      );
      alert("Pago realizado con éxito");
      localStorage.removeItem("carrito");
      limpiarCampos(); // Limpiar campos después de la compra
      window.location.href = "index.html";
    } catch (error) {
      alert(error);
      botonCompra.disabled = false;
    }
  });

  // Promesa de validación de compra
  function validarCompra(
    numeroTarjeta,
    fechaExp,
    codigoSeguridad,
    nombreTitular,
    tipoTarjeta,
    cantidadTotal,
    totalConDomicilio,
    presupuestoMaximo
  ) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (
          !numeroTarjeta ||
          !fechaExp ||
          !codigoSeguridad ||
          !nombreTitular ||
          !tipoTarjeta
        ) {
          return reject("Por favor complete todos los campos de la tarjeta.");
        }

        if (!/^\d{16}$/.test(numeroTarjeta)) {
          return reject(
            "Número de tarjeta inválido. Debe contener 16 dígitos."
          );
        }
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(fechaExp)) {
          return reject(
            "La tarjeta ha expirado o el formato de fecha es inválido (MM/AA)."
          );
        }
        if (!/^\d{3,4}$/.test(codigoSeguridad)) {
          return reject(
            "Código de seguridad inválido. Debe tener 3 o 4 dígitos."
          );
        }
        if (cantidadTotal > 20) {
          return reject(
            "La cantidad de productos no puede superar los 20 items."
          );
        }
        if (totalConDomicilio > presupuestoMaximo) {
          return reject(
            "El total de la compra supera el presupuesto máximo permitido."
          );
        }
        resolve();
      }, Math.floor(Math.random() * 1000) + 2000);
    });
  }
  checkboxDomicilio.addEventListener("change", actualizarTotal);
  renderizarCarrito();
});
function limpiarCampos() {
  document.getElementById("tarjeta").value = "";
  document.getElementById("fecha-exp").value = "";
  document.getElementById("codigo-seguridad").value = "";
  document.getElementById("nombre-titular").value = "";
  document.getElementById("tipo-tarjeta").value = "";
}
