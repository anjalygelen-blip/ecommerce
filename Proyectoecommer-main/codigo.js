const productos = [
  { id: 1, nombre: "Mochila guajira Valle", precio: 450000, imagen: "imagenes/2.webp", categoria: "Bisutería y accesorios" },
  { id: 2, nombre: "Mochila guajira Agua", precio: 145000, imagen: "imagenes/3.jpg", categoria: "Bisutería y accesorios" },
  { id: 3, nombre: "Mochila guajira Dule", precio: 700000, imagen: "imagenes/4.jpg", categoria: "Bisutería y accesorios" },
  { id: 4, nombre: "Mochila guajira Gira", precio: 250000, imagen: "imagenes/21.jpg", categoria: "Bisutería y accesorios" },
  { id: 5, nombre: "Sombrero cachemira", precio: 350000, imagen: "imagenes/som1.jpg", categoria: "Bisutería y accesorios" },
  { id: 6, nombre: "Collar en filigrana", precio: 150000, imagen: "imagenes/collar1.webp", categoria: "Bisutería y accesorios" },
  { id: 7, nombre: "Sombrero cachemira", precio: 500000, imagen: "imagenes/som2.webp", categoria: "Bisutería y accesorios" },
  { id: 8, nombre: "Collar artesanal Melli", precio: 600000, imagen: "imagenes/collar2.jpg", categoria: "Bisutería y accesorios" },
  { id: 9, nombre: "Hamaca Truzz", precio: 300000, imagen: "imagenes/ham1.webp", categoria: "Decoración del hogar" },
  { id: 10, nombre: "Hamaca Rlluy", precio: 400000, imagen: "imagenes/ham2.webp", categoria: "Decoración del hogar" },
  { id: 11, nombre: "Artesanías de Boyacá", precio: 250000, imagen: "imagenes/hogar3.jpg", categoria: "Decoración del hogar" },
  { id: 12, nombre: "Estera artesanal", precio: 100000, imagen: "imagenes/hogar2.jpg", categoria: "Decoración del hogar" },
  { id: 13, nombre: "Tortuga en madera Sangre", precio: 150000, imagen: "imagenes/hogar1.jpg", categoria: "Decoración del hogar" },
  { id: 14, nombre: "Set de cucharas rusticas", precio: 50000, imagen: "imagenes/cocina5.webp", categoria: "Mesa y cocina" },
  { id: 15, nombre: "Olla Terracota", precio: 100000, imagen: "imagenes/cocina2.webp", categoria: "Mesa y cocina" },
  { id: 16, nombre: "Mortero", precio: 30000, imagen: "imagenes/cocina1.jpg", categoria: "Mesa y cocina" },
  { id: 17, nombre: "Wok en madera", precio: 120000, imagen: "imagenes/cocina3.webp", categoria: "Mesa y cocina" },

];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function actualizarCarrito() {
  const contenedor = document.getElementById("carrito");
  const total = document.getElementById("total");
  if (!contenedor) return;

  contenedor.innerHTML = "";
  carrito.forEach(p => {
    const item = document.createElement("div");
    item.innerHTML = `
      <span>${p.nombre} - $${p.precio.toLocaleString()}</span>
      <button onclick="eliminarDelCarrito(${p.id})">❌</button>
    `;
    contenedor.appendChild(item);
  });

  if (total) total.textContent = carrito.reduce((acc, p) => acc + p.precio, 0).toLocaleString();
}

// Reemplazar la gestión del carrito con llamadas a la API
async function obtenerCarrito() {
  try {
    const response = await fetch('http://localhost:3000/api/carrito');
    carrito = await response.json();
    actualizarCarrito();
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
  }
}

async function agregarAlCarrito(id) {
  try {
    const producto = productos.find(p => p.id === id);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    // Primero intentamos con el servidor
    try {
      const response = await fetch('http://localhost:3000/api/carrito', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      
      if (response.ok) {
        const data = await response.json();
        carrito = data.carrito;
      } else {
        throw new Error('Error en el servidor');
      }
    } catch (serverError) {
      // Si falla el servidor, usamos localStorage
      console.log('Usando respaldo local');
      carrito.push(producto);
      guardarCarrito();
    }

    actualizarCarrito();
    actualizarContadorCarrito();
    alert(`${producto.nombre} agregado al carrito 🛍️`);
  } catch (error) {
    console.error('Error:', error);
    alert('Error al agregar el producto: ' + error.message);
  }
}

// Modificar la función eliminarDelCarrito para que también actualice el contador
function eliminarDelCarrito(id) {
  carrito = carrito.filter(p => p.id !== id);
  guardarCarrito();
  actualizarCarrito();
  actualizarContadorCarrito();
}

// Agregar función para vaciar el carrito completo
function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
  actualizarCarrito();
  actualizarContadorCarrito();
}

// Agregar función para actualizar el contador
function actualizarContadorCarrito() {
  const contador = document.getElementById("contador-carrito");
  if (contador) {
    contador.textContent = carrito.length;
  }
}

function mostrarProductos() {
  const contenedor = document.getElementById("lista-productos");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  const urlParams = new URLSearchParams(window.location.search);
  const categoriaSeleccionada = urlParams.get('categoria');

  // Debug
  console.log('URL params:', window.location.search);
  console.log('Categoría seleccionada:', categoriaSeleccionada);

  let productosFiltrados = productos;

  if (categoriaSeleccionada) {
    productosFiltrados = productos.filter(p => {
      const categoriaProducto = p.categoria.toLowerCase().trim();
      const categoriaBuscada = decodeURIComponent(categoriaSeleccionada).toLowerCase().trim();
      console.log(`Comparando: "${categoriaProducto}" con "${categoriaBuscada}"`);
      return categoriaProducto === categoriaBuscada;
    });
  }

  console.log('Productos filtrados:', productosFiltrados);

  if (productosFiltrados.length === 0) {
    contenedor.innerHTML = `
      <p>No se encontraron productos en la categoría: ${categoriaSeleccionada}</p>
      <p>Categorías disponibles: ${[...new Set(productos.map(p => p.categoria))].join(', ')}</p>
    `;
    return;
  }

  productosFiltrados.forEach(p => {
    const item = document.createElement("div");
    item.classList.add("producto");
    item.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}" width="200">
      <h3>${p.nombre}</h3>
      <p>Precio: $${p.precio.toLocaleString()}</p>
      <button onclick="agregarAlCarrito(${p.id})">Agregar al carrito</button>
    `;
    contenedor.appendChild(item);
  });
}

// Modificar window.onload para cargar datos del servidor
window.onload = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/productos');
    const productosServer = await response.json();
    // Actualizar productos si es necesario
    productos.push(...productosServer.filter(p => !productos.find(existing => existing.id === p.id)));
    mostrarProductos();
    await obtenerCarrito();
  } catch (error) {
    console.error('Error al cargar datos iniciales:', error);
  }

  // Agregar event listener para el botón de vaciar carrito
  const botonVaciar = document.getElementById("vaciar-carrito");
  if (botonVaciar) {
    botonVaciar.addEventListener("click", () => {
      if (confirm("¿Estás seguro de que deseas vaciar el carrito?")) {
        vaciarCarrito();
      }
    });
  }
};
