document.addEventListener("DOMContentLoaded", () => {
  // Recupera los productos del `localStorage`
  const productosGuardados =
    JSON.parse(localStorage.getItem("productos")) || [];
  const catalogo = document.querySelector(".productos-lista");
  const aside = document.querySelector(".detalle-producto");
  const filtroCategoria = document.getElementById("categoria");
  const filtroMarca = document.getElementById("MarcaProductos");
  const filtrarBtn = document.getElementById("filtrar-btn");
  const limpiarFiltrosBtn = document.getElementById("limpiar-filtros");

  let productosCargados = 0;
  const productosPorPagina = 15;
  let productosFiltrados = [...productosGuardados];
  let estadoScroll = true;

  function cargarProductos(productosParaCargar) {
    const productosParaMostrar = productosParaCargar.slice(
      productosCargados,
      productosCargados + productosPorPagina
    );

    if (productosParaMostrar.length === 0) {
      alert("No hay más productos para visualizar. Inténtelo más tarde.");
      window.removeEventListener("scroll", scrollInfinito);
      return;
    }

    productosParaMostrar.forEach((producto) => {
      const article = document.createElement("article");
      article.classList.add("producto");
      article.innerHTML = `
          <img src="${producto.imagen}" alt="${producto.entidad}">
          <p>${producto.entidad}</p>
          <p>Precio: $${producto.precio.toLocaleString("es-CO")}</p>
          <p>Stock: ${producto.cantidad}</p>
          <p>tipo: ${producto.tipo}</p>
          <p>genero: ${producto.genero}</p>
          <p>empresa: ${producto.empresa}</p>
          <button class="ver-detalles" data-id="${
            producto.id
          }">Ver más detalles</button>
        `;
      catalogo.appendChild(article);
    });

    productosCargados += productosPorPagina;
  }

  function scrollInfinito() {
    if (
      estadoScroll &&
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
    ) {
      cargarProductos(productosFiltrados);
    }
  }

  function mostrarDetallesProducto(producto) {
    if (producto) {
      // Actualizamos los elementos en el aside de detalles con la información del producto
      document.getElementById("imagen").src = producto.imagen;
      document.getElementById(
        "entidad"
      ).textContent = `Entidad: ${producto.entidad}`;
      document.getElementById(
        "empresa"
      ).textContent = `Marca: ${producto.marca}`;
      document.getElementById(
        "cantidad"
      ).textContent = `Cantidad: ${producto.cantidad}`;
      document.getElementById("id").textContent = `ID: ${producto.id}`;
      document.getElementById(
        "Precio"
      ).textContent = `Precio: $${producto.precio.toLocaleString("es-CO")}`;
      document.getElementById(
        "categoria"
      ).textContent = `Tipo: ${producto.tipo}`;

      // Mostramos el contenedor de detalles
      const aside = document.querySelector(".detalle-producto");
      aside.classList.remove("oculto");

      // Configuramos el botón para agregar al carrito
      const agregarCarritoBtn = document.getElementById("agregar-carrito");
      agregarCarritoBtn.onclick = () => agregarAlCarrito(producto);
    } else {
      console.error("Producto no encontrado");
    }
  }

  function filtrarProductos() {
    estadoScroll = false;
    const categoriaSeleccionada = filtroCategoria.value.trim();
    const proveedorSeleccionado = filtroMarca.value.trim();

    productosFiltrados = productosGuardados.filter((producto) => {
      const coincideCategoria = categoriaSeleccionada
        ? producto.tipo === categoriaSeleccionada
        : true;
      const coincideProveedor = proveedorSeleccionado
        ? producto.marca
            .toLowerCase()
            .includes(proveedorSeleccionado.toLowerCase())
        : true;
      return coincideCategoria && coincideProveedor;
    });

    catalogo.innerHTML = "";
    productosCargados = 0;
    cargarProductos(productosFiltrados);
    window.addEventListener("scroll", scrollInfinito);
  }

  function agregarAlCarrito(producto) {
    const cantidad = parseInt(document.getElementById("cantidad").value);
    cantidad.value = 1;
    cantidad.min = 1;

    if (isNaN(cantidad) || cantidad <= 0) {
      alert("La cantidad debe ser un número positivo.");
      return;
    }

    const productoCarrito = { ...producto, cantidad: cantidad };

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const indiceExistente = carrito.findIndex(
      (item) => item.id === productoCarrito.id
    );
    if (indiceExistente > -1) {
      carrito[indiceExistente].cantidad += productoCarrito.cantidad;
    } else {
      carrito.push(productoCarrito);
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert(`${producto.entidad} agregado al carrito con éxito!`);
  }

  window.addEventListener("scroll", scrollInfinito);
  cargarProductos(productosGuardados);

  catalogo.addEventListener("click", (e) => {
    if (e.target.classList.contains("ver-detalles")) {
      const id = e.target.getAttribute("data-id");
      const productoSeleccionado = productosGuardados.find((p) => p.id == id);
      mostrarDetallesProducto(productoSeleccionado);
    }
  });

  filtrarBtn.addEventListener("click", filtrarProductos);
  limpiarFiltrosBtn.addEventListener("click", () => {
    filtroCategoria.value = "";
    filtroMarca.value = "";
    catalogo.innerHTML = "";
    productosCargados = 0;
    productosFiltrados = [...productosGuardados];
    cargarProductos(productosFiltrados);
    estadoScroll = true;
  });
  function agregarAlCarrito(producto) {
    const cantidadInput = document.getElementById("cantidades");
    const cantidad = parseInt(cantidadInput.value);

    // Validación de cantidad
    if (isNaN(cantidad) || cantidad <= 0) {
      alert("La cantidad debe ser un número positivo.");
      return;
    }

    // Verificación de stock
    if (cantidad > producto.cantidad) {
      alert(`Cantidad solicitada excede el stock disponible.`);
      return;
    }

    const productoCarrito = {
      ...producto,
      cantidad: cantidad,
    };

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const indiceExistente = carrito.findIndex(
      (item) => item.id === productoCarrito.id
    );
    const totalCantidadEnCarrito = carrito.reduce(
      (total, item) => total + item.cantidad,
      0
    );

    const cantidadTotalPostAgregar = totalCantidadEnCarrito + cantidad;
    if (cantidadTotalPostAgregar > 20) {
      alert(
        `No puedes agregar más de 20 unidades en total al carrito. Actualmente tienes ${totalCantidadEnCarrito} unidades en el carrito.`
      );
      return;
    }
    if (indiceExistente > -1) {
      if (
        carrito[indiceExistente].cantidad + productoCarrito.cantidad >
        producto.cantidad
      ) {
        alert(
          `No puedes agregar ${productoCarrito.cantidad} unidades de ${
            producto.entidad
          }. Solo quedan ${
            producto.cantidad - carrito[indiceExistente].cantidad
          } en stock.`
        );
        return;
      }
      carrito[indiceExistente].cantidad += productoCarrito.cantidad;
    } else {
      carrito.push(productoCarrito);
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert(
      `${producto.entidad} se ha agregado un producto a carrito satisfactoriamente!`
    );
  }
});
