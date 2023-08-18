const myCheckbox = document.getElementById('list_categoria_check');
const check_categoria = document.querySelector('.list_table_cartegoria');
const list_categoria = document.querySelector('.list_categoria');
const container_categoria_check = document.querySelector('#container_categoria_check');


myCheckbox.addEventListener("change", function() {
  if (myCheckbox.checked) {
    //console.log("El checkbox está marcado");
    check_categoria.style.display = "block";
    list_categoria.style.backgroundColor = "#366ba0";
    container_categoria_check.style.color = "#ffffff";
  } else {
    //console.log("El checkbox no está marcado");
    check_categoria.style.display = "none";
    list_categoria.style.backgroundColor = "#ffffff";
    container_categoria_check.style.color = "#000000";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  actualizarProductosCategoria();
  const userInSession = getUserInSession();
  if (userInSession.administrador === true) {
    document.querySelector(".header_edit").style.display = "block";
  } else {
    document.querySelector(".header_edit").style.display = "none";
  }
});

async function actualizarProductosCategoria() {
  const res = await fetch("https://happy-pet-apirest.onrender.com/productos/categoria");
  const categorias = await res.json();

  const list_categoria = document.querySelector("#table_list_categoria");

  if (categorias.length == 0) {
    //console.log('no hay ningun producto')
    list_categoria.innerHTML = `
        <tr>
          <td>No Hay Categorias</td>
        </tr>`;
    return;
  }

  let html = "";
  let htmlAll = `<tr>
                  <td><button class="btn_categoria" onclick="actualizarProductos(${0})">Todos</button></td>
                </tr>`;
  for (let i in categorias) {
    html += `<tr>
                  <td><button class="btn_categoria" onclick="actualizarProductos(${categorias[i].categoria_id})">${categorias[i].ctnombre}</button></td>
              </tr>`;
  }
  list_categoria.innerHTML = htmlAll + html;
  actualizarProductos(0);
}

const listaProductosHtml = document.querySelector("#list_productos");
async function actualizarProductos(id) {
  if (id == 0) {
    const res = await fetch("https://happy-pet-apirest.onrender.com/api/productos");
    const productos = await res.json();

    if (productos.length == 0) {
      //console.log('no hay ningun producto')
      listaProductosHtml.innerHTML = `
            <h2>No Hay Productos</h2>`;
      return;
    }

    let html = "";
    let contador = 0;
    for (let i in productos) {
      contador += 1;
      const res = await fetch(
        `https://happy-pet-apirest.onrender.com/imagen/${productos[i].idimage}`
      );
      const imagen = await res.json();
      html +=
        `<figure class="item${contador}">` +
        `<button onclick="detalle(${productos[i].producto_id})">
                        <img
                        class="item${contador}_img"
                        src="/src/public/uploads/${imagen}"
                        alt="Imagen de Producto${contador}"
                        />
                    </button>` +
        `<figcaption class="item${contador}_subitle">
                        <span class="item${contador}_subitle_text1">${
          productos[i].pnombre
        }</span><br />
                        <span class="item${contador}_subitle_text2">${
          productos[i].ppeso
        } Kg</span><br />
                        <span class="item${contador}_subitle_text3">Bs ${
          productos[i].pprecio
        }</span>
            
                        <div class="item${contador}_buttons">
                        <button class="item${contador}_button1" onclick="agregar(${
          productos[i].producto_id
        }, ${0})"><span>Agregar al Carrito</span></button>
                        <button class="item${contador}_button2" onclick="detalle(${
          productos[i].producto_id
        })"><span>Detalle</span></button>
                        </div>
                    </figcaption>` +
        `</figure>`;
    }
    listaProductosHtml.innerHTML = html;
  } else {
    const res = await fetch("https://happy-pet-apirest.onrender.com/api/productos");
    const productos = await res.json();

    if (productos.length == 0) {
      //console.log('no hay ningun producto')
      listaProductosHtml.innerHTML = `
            <h2>No Hay Productos</h2>`;
      return;
    }

    let html = "";
    let contador = 0;
    for (let i in productos) {

      //console.log("id Del Array: ",productos[i].categoria_id);
      //console.log("id pedido: ", id);
      //console.log(productos[i].categoria_id == id);

      if(productos[i].categoria_id == id){
        contador += 1;
        const res = await fetch(
          `https://happy-pet-apirest.onrender.com/imagen/${productos[i].idimage}`
        );
        const imagen = await res.json();
        html +=
          `<figure class="item${contador}">` +
          `<button onclick="detalle(${productos[i].producto_id})">
                          <img
                          class="item${contador}_img"
                          src="/src/public/uploads/${imagen}"
                          alt="Imagen de Producto${contador}"
                          />
                      </button>` +
          `<figcaption class="item${contador}_subitle">
                          <span class="item${contador}_subitle_text1">${
            productos[i].pnombre
          }</span><br />
                          <span class="item${contador}_subitle_text2">${
            productos[i].ppeso
          } Kg</span><br />
                          <span class="item${contador}_subitle_text3">Bs ${
            productos[i].pprecio
          }</span>
              
                          <div class="item${contador}_buttons">
                          <button class="item${contador}_button1" onclick="agregar(${
            productos[i].producto_id
          }, ${0})"><span>Agregar al Carrito</span></button>
                          <button class="item${contador}_button2" onclick="detalle(${
            productos[i].producto_id
          })"><span>Detalle</span></button>
                          </div>
                      </figcaption>` +
          `</figure>`;
      }else{
        console.log("Ocurrio Un Error en la Actualizacion");
      }
    }
    listaProductosHtml.innerHTML = html;
  }
}

const detallePopUp = document.querySelector("#modal_detalle");
const btnDetalleExit = document.querySelector("#btn_detalle_exit");
btnDetalleExit.addEventListener("click", function () {
  detallePopUp.style.display = "none";
});

async function detalle(id) {
  detallePopUp.style.display = "flex";

  const res = await fetch(`https://happy-pet-apirest.onrender.com/api/productos/${id}`);
  const producto = await res.json();

  const res2 = await fetch(`https://happy-pet-apirest.onrender.com/imagen/${producto.idimage}`);
  const imagen = await res2.json();

  // traer la img
  const detalleImg = document.querySelector(".details_data_img");
  detalleImg.src = `/src/public/uploads/${imagen}`;
  //console.log(detalleImg.src);

  const detalleNombre = document.querySelector(".details_data_text1");
  detalleNombre.textContent = producto.pnombre;

  const detallePeso = document.querySelector(".details_data_text2");
  detallePeso.textContent = producto.ppeso + " Kg";

  const detallePrecio = document.querySelector(".details_data_text3");
  detallePrecio.textContent = "Bs. " + producto.pprecio;

  const detalleDescripcion = document.querySelector(
    ".details_description_text"
  );
  detalleDescripcion.textContent = producto.pdescripcion;

  const botonAgregarCar = document.querySelector("#btn_agregar_carrito");
  botonAgregarCar.addEventListener("click", function () {
    agregar(id);
  });
  //formularioProducto.setAttribute("enctype", "multipart/form-data");
}

const carritoPopUp = document.querySelector("#modal_carrito");
const btncarrito = document.querySelector(".header_car");
const btnCarExit = document.querySelector("#btn_carrito_exit");

btncarrito.addEventListener("click", function () {
  carritoPopUp.style.display = "flex";
});

btnCarExit.addEventListener("click", function () {
  carritoPopUp.style.display = "none";
});

let productosCarrito = [];
async function agregar(id, quitar) {
  if (productosCarrito.includes(id)) {
    if (quitar == 1) {
      //console.log("Entro aqui mas");
      const index = productosCarrito.findIndex((item) => item === id);
      productosCarrito.splice(index, 1);
      mostrarValor(0, 0, 0, 0, 0, id);
    }
    //console.log("Producto: | ", id, " | ya esta Agregado");
  } else {
    productosCarrito.push(id);
    //console.log("Producto: | ", id, " | Agregado");
  }

  const productosCarList = document.querySelector(".tabla_productos_car_body");

  if (productosCarrito.length === 0) {
    console.log("no hay ningun producto");
    productosCarList.innerHTML =
      `<tr>` + `<td colspan="5">No hay Productos en el carrito</td>` + `</tr>`;
    return;
  }
  let htmlCar = "";
  for (let i = 0; i < productosCarrito.length; i++) {
    //console.log("ID en la posicion| ",i ," | del array: ",productosCarrito[i]);
    const res = await fetch(
      `https://happy-pet-apirest.onrender.com/api/productos/${productosCarrito[i]}`
    );
    const productos = await res.json();

    const res2 = await fetch(
      `https://happy-pet-apirest.onrender.com/imagen/${productos.idimage}`
    );
    const imagen = await res2.json();

    htmlCar +=
      `<tr>` +
        `<td><img width="50" src="/src/public/uploads/${imagen}" alt="Producto IMG"></td>` +
        `<td>${productos.pnombre}</td>` +
        `<td>${productos.pprecio}</td>` +
        `<td>${productos.ppeso}</td>` +
        `<td><input type="number" value="0" min="1" onchange="mostrarValor(this, '${imagen}','${productos.pnombre}','${productos.pprecio}','${productos.ppeso}', '${productos.producto_id}')"></td>` +
        `<td><button id="btn_eliminar_car" onclick="agregar(${productos.producto_id}, ${1})"><span><i class="fa-sharp fa-solid fa-circle-xmark"></i></span></button></td>` +
      `</tr>`;

    //console.log("Producto: | ", productos.pnombre," | Cantidad: ",valorCant);
  }
  productosCarList.innerHTML = htmlCar;
  //console.log("ids Dentro: ",productosCarrito);
}

const facturaPopUp = document.querySelector("#modal_factura");
const botonComprar = document.querySelector("#btn_comprar");
const botonComprarExit = document.querySelector("#btn_factura_exit");

botonComprarExit.addEventListener("click", function () {
  window.location.href = "tienda.html";
});

let productosPxC = [];
let preciosFac = {};
function mostrarValor(input, imagen, pnombre, pprecio, ppeso, producto_id) {
  const subotal = document.querySelector("#subtotal_text");
  const embalaje = document.querySelector("#embalaje_text");
  const total = document.querySelector("#total_text");

  const nuevoValor = input.value;
  let producto = {};
  let sub_precio = 0;
  //console.log("PC antes de agregar: | ", productosPxC ," |");
  if (nuevoValor == undefined) {
    console.log("Producto id a eliminar: ", producto_id);
    const index = productosPxC.findIndex((item) => item.id == producto_id);
    console.log("Index: ", index);
    if (index !== -1) {
      const sub_precioAux =
        productosPxC[index].precio * productosPxC[index].cantidad;
      sub_precio = sub_precio - sub_precioAux;
      productosPxC.splice(index, 1);
      //console.log("Tamaño del array: ", productosPxC.length);
    }
    return;
  } else {
    producto = {
      img: imagen,
      nombre: pnombre,
      precio: pprecio,
      peso: ppeso,
      id: producto_id,
      cantidad: nuevoValor,
    };
  }

  const existe = productosPxC.some((item) => item.id === producto.id);

  if (existe) {
    const index = productosPxC.findIndex((item) => item.id === producto.id);
    productosPxC[index].cantidad = nuevoValor;
  } else {
    productosPxC.push(producto);
  }

  for (let i = 0; i < productosPxC.length; i++) {
    const valorItem = productosPxC[i].precio * productosPxC[i].cantidad;
    sub_precio += valorItem;
    //console.log("subprecio: ", sub_precio);
  }

  const precioEmbalaje = 15;
  const total_precio = sub_precio + precioEmbalaje;

  subotal.textContent = sub_precio.toFixed(2);
  embalaje.textContent = precioEmbalaje.toFixed(2);
  total.textContent = total_precio.toFixed(2);

  //console.log("PC despues de agregar: | ", productosPxC, " |");
  //console.log("antes de dar click");
  preciosFac = {
    subt: sub_precio.toFixed(2),
    embal: precioEmbalaje.toFixed(2),
    tot: total_precio.toFixed(2),
  };
}

const modal_msg = document.querySelector('#modal_msg');
const msg_title = document.querySelector('#msg_title');
const msg_btn_ok = document.querySelector('#msg_btn_ok');

botonComprar.addEventListener("click", function () {
  //console.log("precios guardados: ", preciosFac.tot);
  const userInSession = getUserInSession();
  if (userInSession==null){
    modal_msg.style.display = "flex";
    msg_title.innerHTML = "Tienes que estar logueado para continuar";
    msg_btn_ok.addEventListener("click", function(){
      window.location.href = "http://127.0.0.1:5500/frontend/principal/principal.html";
    })
  }

  const productosFacList = document.querySelector(".tabla_productos_fac_body");
  const nitUsario = document.querySelector(".factura_subtitulo_text4");
  const subtotal_fac = document.querySelector("#subtotal_fac");
  const embalaje_fac = document.querySelector("#embalaje_fac");
  const total_fac = document.querySelector("#total_fac");

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  //console.log("click al boton");
  console.log("Tamaño del array: ", productosPxC.length);
  if (productosPxC.length != 0) {
    //console.log("entrando a la primer condicional despues de button");
    if (userInSession === null) {
      console.log("Registrese");
    } else {
      //console.log("usuario iniciado");
      carritoPopUp.style.display = "none";
      facturaPopUp.style.display = "flex";

      nitUsario.textContent =
        userInSession.usuarioId + ":" + userInSession.nombre;

      subtotal_fac.textContent = preciosFac.subt;
      embalaje_fac.textContent = preciosFac.embal;
      total_fac.textContent = preciosFac.tot;

      obtenerOrdenId(formattedDate, preciosFac.tot, userInSession.usuarioId);

      let htmlFac = "";
      for (let i = 0; i < productosPxC.length; i++) {
        htmlFac +=
          `<tr>` +
          `<td><img width="50" src="/src/public/uploads/${productosPxC[i].img}" alt="Producto IMG"></td>` +
          `<td>${productosPxC[i].nombre}</td>` +
          `<td>${productosPxC[i].precio}</td>` +
          `<td>${productosPxC[i].peso}</td>` +
          `<td>${productosPxC[i].cantidad}</td>` +
          `</tr>`;

        //console.log("Producto: | ", productos.pnombre," | Cantidad: ",valorCant);
      }
      productosFacList.innerHTML = htmlFac;
    }
  }
});

async function obtenerOrdenId(fecha, total, usuario_id) {
  const ordenRequest = {
    oFechaPedido: fecha,
    oTotal: total,
    idCliente: usuario_id,
  };

  let ordenRecibida = {};
  try {
    const response = await fetch("https://happy-pet-apirest.onrender.com/api/ordenes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ordenRequest),
    });

    if (response.ok) {
      ordenRecibida = await response.json();
    } else {
      const errorData = await response.json();
      console.log("Error en la solicitud:", errorData);
    }
  } catch (error) {
    console.error(error);
  }

  const nitFactura = document.querySelector(".factura_subtitulo_text2");
  nitFactura.textContent = ordenRecibida.ocodigo;

  const idOrdenRecibida = ordenRecibida.orden_id;
  //console.log("orden ID: ", idOrdenRecibida);

  //console.log("------- SEPARADOR DE DATOS IMPRIMIDOS ------");
  for (let i = 0; i < productosPxC.length; i++) {
    //console.log("array depues de click: ", productosPxC[i]);
    const subtotalItem = productosPxC[i].precio * productosPxC[i].cantidad;
    const ordenRequestdetalle = {
      dCantidad: productosPxC[i].cantidad,
      dSubTotal: subtotalItem,
      idProducto: productosPxC[i].id,
      idOrden: idOrdenRecibida,
    };
    console.log("ordenRequestdetalle: ", ordenRequestdetalle);
    try {
      const response = await fetch("https://happy-pet-apirest.onrender.com/api/detalleorden", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ordenRequestdetalle),
      });

      if (response.ok) {
        console.log("Detalles Orden creados");
      } else {
        const errorData = await response.json();
        console.log("Error en la solicitud:", errorData);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
