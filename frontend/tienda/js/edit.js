async function actualizarCategorias() {
  const res = await fetch("https://happy-pet-apirest.onrender.com/productos/categoria");
  const categorias = await res.json();

  const categoriaHtml = document.querySelector("#categoria_p");
  const categoriaHtmlEdit = document.querySelector("#categoria_edit");

  if (categorias.length == 0) {
    //console.log('no hay ningun producto')
    categoriaHtml.innerHTML = `
      <option value="select">Seleccionar Categoria</option>`;
    return;
  }

  let html = "";
  for (let i in categorias) {
    //console.log("Producto ",  productos[i].producto_id);
    html += `<option value="${categorias[i].categoria_id}">${categorias[i].ctnombre}</option>`;
  }
  categoriaHtml.innerHTML = html;
  categoriaHtmlEdit.innerHTML = html;
}

async function actualizarProductosTable() {
  const res = await fetch("https://happy-pet-apirest.onrender.com/api/productos");
  const productos = await res.json();

  const listaProductosHtml = document.querySelector("#table_list_container");

  if (productos.length == 0) {
    //console.log('no hay ningun producto')
    listaProductosHtml.innerHTML = `
          <tr>
            <td colspan="5">No hay Productos En la Base de Datos</td>
          </tr>`;
    return;
  }

  let html = "";
  let contador = 0;
  for (let i in productos) {
    contador += 1;
    const res = await fetch(
      `https://happy-pet-apirest.onrender.com/productos/categoria/${productos[i].categoria_id}`
    );
    const categoria = await res.json();
    html += `
        <tr id="productos_list_fila">
          <td>${contador}</td>
          <td>${productos[i].pnombre}</td>
          <td>${productos[i].pprecio}</td>
          <td>${productos[i].ppeso}</td>
          <td>${categoria.ctnombre}</td>
          <td class="boton"><button id="btn_edit_p" onclick="editar(${productos[i].producto_id})">Editar</button></td>
          <td class="boton"><button id="btn_delete_p" onclick="eliminar(${productos[i].producto_id})">Eliminar</button></td>
        </tr>`;
  }
  listaProductosHtml.innerHTML = html;
}

async function actualizarPedidosTable() {

  const res = await fetch("https://happy-pet-apirest.onrender.com/api/usuarios");
  const usuarios = await res.json();

  const tabla_pedidos_body = document.querySelector(".tabla_pedidos_body");

  let html = "";

  for (let i in usuarios) {
    const res = await fetch("https://happy-pet-apirest.onrender.com/api/ordenes");
    const ordenes = await res.json();
    for (let j in ordenes) {
      if (ordenes[j].idcliente == usuarios[i].cliente_id) {
        const res2 = await fetch("https://happy-pet-apirest.onrender.com/api/detalleorden");
        const detalleOrdenes = await res2.json();
        let articulos = "";
        for (let k in detalleOrdenes) {
          if (detalleOrdenes[k].idorden == ordenes[j].orden_id) {
            const res = await fetch(
              `https://happy-pet-apirest.onrender.com/api/productos/${detalleOrdenes[j].idproducto}`
            );
            const productos = await res.json();
            articulos += productos.pnombre + ", ";
          } else {
            tabla_pedidos_body.innerHTML = `<tr>
                                              <td colspan="4">NO TIENES COMPRAS HECHAS</td>
                                            </tr>`;
          }
        }
        const OrdenFecha = ordenes[j].ofechapedido;
        const fechaEdit = OrdenFecha.slice(0, 10);
        html += `<tr id="pedidos_list_fila">
                  <td>${fechaEdit}</td>
                  <td>${usuarios[i].cnombre}</td>
                  <td>${ordenes[j].ototal}</td>
                  <td>${articulos}</td>
                </tr>`;
      }
    }
  }
  tabla_pedidos_body.innerHTML = html;
}

async function actualizarUsuariosTable() {
  const res = await fetch("https://happy-pet-apirest.onrender.com/api/usuarios");
  const usuarios = await res.json();

  const tabla_clientes_body = document.querySelector(".tabla_clientes_body");

  let html = "";
  for (let i in usuarios) {
    if (usuarios[i].cadmin == false) {
      html += `<tr id = "usuarios_list_fila">
                <td>${usuarios[i].cnombre}</td>
                <td>${usuarios[i].cemail}</td>
                <td>${usuarios[i].ctelefono}</td>
              </tr>`;
    }
  }
  tabla_clientes_body.innerHTML = html;
}

const formularioProducto = document.querySelector('#formulario_producto');
const form_edit_p = document.querySelector('#formulario_editar');

const btn_cancelar_edit = document.querySelector('#btn_cancelar');
const adm_titulo = document.querySelector('#titulo_admin');
const list_productos = document.querySelector('.list');
const pedidos_list = document.querySelector('.pedidos_list');
const clientes_list = document.querySelector('.clientes_list');


btn_cancelar_edit.addEventListener("click", function () {
  form_edit_p.style.display = "none";
  formularioProducto.style.display = "block";
  adm_titulo.textContent = "Agregar Producto";
  list_productos.style.display = "block";
  pedidos_list.style.display = "block";
  clientes_list.style.display = "block";
});

let guardarIdP = 0;
async function editar(id) {
  actualizarCategorias();
  formularioProducto.style.display = "none";
  form_edit_p.style.display = "block";
  adm_titulo.textContent = "Editar Producto";
  list_productos.style.display = "none";
  pedidos_list.style.display = "none";
  clientes_list.style.display = "none";

  const res = await fetch(`https://happy-pet-apirest.onrender.com/api/productos/${id}`);
  const productos = await res.json();

  guardarIdP = id;

  const nombre = document.querySelector("#nombre_edit");
  const precio = document.querySelector("#precio_edit");
  const peso = document.querySelector("#peso_edit");
  const descripcion = document.querySelector("#descripcion_edit");

  nombre.value = productos.pnombre;
  precio.value = productos.pprecio;
  peso.value = productos.ppeso;
  descripcion.value = productos.pdescripcion;

  //console.log(productos.pnombre);
}

async function eliminar(id) {
  const res = await fetch("https://happy-pet-apirest.onrender.com/api/detalleorden");
  const detalleOrdenes = await res.json();

  const msg_list_productos = document.querySelector(".msg_list_productos");

  msg_list_productos.style.display = "none";

  for (let i in detalleOrdenes) {
    if (detalleOrdenes[i].idproducto == id) {
      msg_list_productos.innerHTML = `El Producto que tratas de eliminar ya ha sido seleccionado para ordenes`;
      msg_list_productos.style.display = "block";
      return;
    }
  }
  if (confirm("¿Esta seguro que desea eliminar este producto?") == false) {
    return;
  }

  try {
    const response = await fetch(`https://happy-pet-apirest.onrender.com/api/productos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      //actualizarProductos();
      actualizarProductosTable();
      return;
    } else {
      const errorData = await response.json();
      console.log("Error en la solicitud:", errorData);
    }
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  actualizarCategorias();

  formularioProducto.addEventListener("submit", newproducto);

  async function newproducto(e) {
    e.preventDefault();

    const imagen = document.getElementById("imagen_p").files[0];
    //console.log("nombre de la img: ", imagen);

    const formData = new FormData();
    formData.append("imagen", imagen);

    let nombreImagen = {};
    try {
      const response = await fetch("https://happy-pet-apirest.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        //console.log('imagen Creada');
        nombreImagen = await response.json();
        //formularioProducto.reset();
      } else {
        const errorData = await response.json();
        console.log("Error en la solicitud:", errorData);
      }
    } catch (error) {
      console.error(error);
    }

    const nombre = document.getElementById("nombre_p").value.trim();
    const precio = document.getElementById("precio_p").value;
    const peso = document.getElementById("peso_p").value;
    const categoria = document.getElementById("categoria_p").value;
    const descripcion = document.getElementById("descripcion_p").value.trim();

    const validarNombre = document.querySelector("#text_error_cnombre");
    const validarPrecio = document.querySelector("#text_error_cprecio");
    const validarPeso = document.querySelector("#text_error_cpeso");
    const validarDescripcion = document.querySelector("#text_error_cdescripcion");
    const validarImagen = document.querySelector("#text_error_cimagen");

    let isValid = false;
    if (nombre == ""){
      isValid= true;
      validarNombre.style.display = "block";
    }
    if(precio == 0.00){
      isValid = true;
      validarPrecio.style.display = "block";
    }
    if(peso == 0.00){
      isValid = true;
      validarPeso.style.display = "block";
    }
    if(descripcion==""){
      isValid = true;
      validarDescripcion.style.display = "block";
    }

    if(isValid){
      return;
    }

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const formattedDate = `"${year}-${month}-${day}"`;

    const productoRequest = {
      pNombre: nombre,
      pPrecio: precio,
      pPeso: peso,
      pDescripcion: descripcion,
      pFecha_emision: formattedDate,
      idImage: nombreImagen.imagen_id,
      categoria_id: categoria,
    };

    //console.log(productoRequest);

    try {
      const response = await fetch("https://happy-pet-apirest.onrender.com/api/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productoRequest),
      });

      if (response.ok) {
        console.log("Producto creado");
        formularioProducto.reset();
      } else {
        const errorData = await response.json();
        console.log("Error en la solicitud:", errorData);
      }
    } catch (error) {
      console.error(error);
    }
  }
  formularioProducto.setAttribute("enctype", "multipart/form-data");
});

// usar otro form
document.addEventListener("DOMContentLoaded", () => {
  actualizarProductosTable();
  actualizarPedidosTable();
  actualizarUsuariosTable();
  form_edit_p.addEventListener("submit", editar);

  async function editar(e) {
    e.preventDefault();

    const imagen = document.getElementById("imagen_edit").files[0];
    const formData = new FormData();

    const res = await fetch(`https://happy-pet-apirest.onrender.com/api/productos/${guardarIdP}`);
    const producto = await res.json();

    if (imagen) {
      formData.append("imagen", imagen);
      //console.log(formData.get("imagen"));

      let nombreImagen = {};
      try {
        const response = await fetch("https://happy-pet-apirest.onrender.com/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          //console.log('imagen Creada');
          nombreImagen = await response.json();
          //formularioProducto.reset();
        } else {
          const errorData = await response.json();
          console.log("Error en la solicitud:", errorData);
        }
      } catch (error) {
        console.error(error);
      }

      const nombre = document.getElementById("nombre_edit").value.trim();
      const precio = document.getElementById("precio_edit").value;
      const peso = document.getElementById("peso_edit").value;
      const categoria = document.getElementById("categoria_edit").value;
      const descripcion = document.getElementById("descripcion_edit").value.trim();

      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");

      const formattedDate = `"${year}-${month}-${day}"`;

      const productoRequest = {
        pNombre: nombre,
        pPrecio: precio,
        pPeso: peso,
        pDescripcion: descripcion,
        pFecha_emision: formattedDate,
        idImage: nombreImagen.imagen_id,
        categoria_id: categoria,
      };

      try {
        const response = await fetch(
          `https://happy-pet-apirest.onrender.com/api/update/productos/${guardarIdP}`,
          {
            method: "put",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(productoRequest),
          }
        );

        if (response.ok) {
          console.log("Producto editado");
          window.location.href = "edit.html";
        } else {
          const errorData = await response.json();
          console.log("Error en la solicitud:", errorData);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("imagen nueva no definida idimage antiguo es: ", producto.idimage);

      const nombre = document.getElementById("nombre_edit").value.trim();
      const precio = document.getElementById("precio_edit").value;
      const peso = document.getElementById("peso_edit").value;
      const categoria = document.getElementById("categoria_edit").value;
      const descripcion = document.getElementById("descripcion_edit").value.trim();

      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");

      const formattedDate = `"${year}-${month}-${day}"`;

      const productoRequest = {
        pNombre: nombre,
        pPrecio: precio,
        pPeso: peso,
        pDescripcion: descripcion,
        pFecha_emision: formattedDate,
        idImage: producto.idimage,
        categoria_id: categoria,
      };
      //console,log("Ip Guardada: ", guardarIdP);
      try {
        const response = await fetch(`https://happy-pet-apirest.onrender.com/api/update/productos/${guardarIdP}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(productoRequest),
          }
        );

        if (response.ok) {
          console.log("Producto editado sin imagen nueva");
          window.location.href = "edit.html";
        } else {
          const errorData = await response.json();
          console.log("Error en la solicitud:", errorData);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
  formularioProducto.setAttribute("enctype", "multipart/form-data");
});
