const sliderInner = document.querySelector(".slider_inner");

let images = sliderInner.querySelectorAll(".slider_inner img");

let index = 0;

setInterval(function () {
  let percentage = index * -100;
  index++;
  sliderInner.style.transform = "translateX(" + percentage + "%)";
  if (index > images.length - 1) {
    index = 0;
  }
}, 3500);

const btnLogin = document.querySelector("#user_login");
const btnClose = document.querySelector("#btn_login_exit");
const loginPopUp = document.querySelector("#modal_login");
const loginForm = document.querySelector("#login_form");

btnLogin.addEventListener("click", function () {
  loginPopUp.style.display = "flex";
});

btnClose.addEventListener("click", function () {
  loginPopUp.style.display = "none";
});

const popup_login = document.querySelector(".popup_login");
const btn_logueado_close = document.querySelector("#btn_logueado_exit");
const popup_logueado = document.querySelector(".popup_logueado");
const logueado_nombre = document.querySelector("#logueado_nombre");
const logueado_email = document.querySelector("#logueado_email");
const logueado_phone = document.querySelector("#logueado_phone");
const logueado_btn_salir = document.querySelector("#logueado_btn_salir");

const logueado_btn_historial = document.querySelector('#logueado_btn_historial');
const modal_historial = document.querySelector('#modal_historial');
const btn_exit_historial = document.querySelector('#btn_exit_historial');

btn_logueado_close.addEventListener("click", function () {
  loginPopUp.style.display = "none";
});

logueado_btn_historial.addEventListener("click", function () {
  loginPopUp.style.display = "none";
  modal_historial.style.display = "flex";
});

btn_exit_historial.addEventListener("click", function () {
  modal_historial.style.display = "none";
  loginPopUp.style.display = "flex";
});

logueado_btn_salir.addEventListener("click", function () {
  salir();
});

document.addEventListener("DOMContentLoaded", () => {
  const userInSession = getUserInSession();
  if (userInSession) {
    //window.location.href = 'principal.html';
    const nombreUser = userInSession.nombre.split(" ")[0];
    document.querySelector("#user_id_prueba").textContent = nombreUser;
    //console.log("Usario", userInSession, " ya iniciado");

    popup_login.style.display = "none";
    popup_logueado.style.display = "block";
    logueado_nombre.textContent = userInSession.nombre;
    logueado_email.textContent = userInSession.email;
    logueado_phone.textContent = "+591 " + userInSession.telefono;

    historial(userInSession.usuarioId);
    if (userInSession.administrador === true) {
      window.location.href = "http://127.0.0.1:5500/frontend/tienda/edit.html";
      return;
    }
    return;
  } else {
    popup_logueado.style.display = "none";
    popup_login.style.display = "block";
  }
  //const loginForm = document.getElementById("login_form");
  loginForm.addEventListener("submit", login);

  async function login(e) {
    e.preventDefault();

    const email = document.getElementById("email_input").value.trim();
    const password = document.getElementById("pass_input").value.trim();

    //console.log("email: ", email, " tamaño: ", email.length);
    //console.log("password: ", password, " tamaño: ", password.length);

    const validacion_email = document.querySelector('#login_validacion_email');
    const validacion_contra = document.querySelector('#login_validacion_contra');
    const validacion_cuenta = document.querySelector('#login_validacion_cuenta');

    validacion_email.style.display = "none";
    validacion_contra.style.display = "none";
    validacion_cuenta.style.display = "none";

    let hasError = false;
    if (password.length < 8) {
      hasError = true;
      validacion_contra.innerHTML = "*contraseña no es válida*";
      validacion_contra.style.display = "block";
    }
    if (email === "") {
      hasError = true;
      validacion_email.innerHTML = "*El correo electrónico es requerido*";
      validacion_email.style.display = "block";
    } else if (!isEmailValid(email)) {
      hasError = true;
      validacion_email.innerHTML =
        "*El correo electrónico ingresado no es válido*";
      validacion_email.style.display = "block";
    }

    if (hasError) {
      return;
    }

    const userRequest = {
      email: email,
      password: password, // 123bl_2023
    };

    try {
      const response = await fetch("https://happy-pet-apirest.onrender.com/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userRequest),
      });

      if (response.ok) {
        const userData = await response.json();
        setUserInSession(userData);
        console.log("Datos recibidos del servidor en response.json:", userData);
        //window.location.href = "principal.html";
        window.location.href = "https://happypet-frontend.onrender.com";
      } else if (response.status == 401) {
        validacion_cuenta.innerHTML = "*cuenta no existente*";
        validacion_cuenta.style.display = "block";
      } else {
        const errorData = await response.json();
        console.log("Error en la solicitud:", errorData);
      }
    } catch (error) {
      console.error(error);
    }
  }
});


const createUser = document.querySelector("#create_user");
const btnCloseForm = document.querySelector("#btn_exit_form");
const formPopUp = document.querySelector("#modal_create");
const createForm = document.querySelector("#create_form");

createUser.addEventListener("click", function () {
  loginPopUp.style.display = "none";
  formPopUp.style.display = "flex";
});

btnCloseForm.addEventListener("click", function () {
  formPopUp.style.display = "none";
  //loginPopUp.style.display = "flex";
});

document.addEventListener("DOMContentLoaded", () => {
  actualizarProductosDestacados();

  createForm.addEventListener("submit", create);

  async function create(e) {
    e.preventDefault();

    const nombre = document.querySelector("#nombre_create_input").value.trim();
    const email = document.querySelector("#email_create_input").value.trim();
    const password = document.querySelector("#pass_create_input").value;
    const phone = document.querySelector("#phone_create_input").value;

    const cvalidacion_nombre = document.querySelector('#create_validacion_nombre');
    const cvalidacion_email = document.querySelector('#create_validacion_email');
    const cvalidacion_contra = document.querySelector('#create_validacion_contra');
    const cvalidacion_phone = document.querySelector('#create_validacion_phone');

    cvalidacion_nombre.style.display = "none";
    cvalidacion_email.style.display = "none";
    cvalidacion_contra.style.display = "none";
    cvalidacion_phone.style.display = "none";

    let hasError = false;

    if (nombre === "") {
      hasError = true;
      cvalidacion_nombre.innerHTML = "*nombre es requerido*";
      cvalidacion_nombre.style.display = "block";
    } else if (!isNameValid(nombre)) {
      hasError = true;
      cvalidacion_nombre.innerHTML = "*nombre no es valido*";
      cvalidacion_nombre.style.display = "block";
    }

    if (password.length < 8) {
      hasError = true;
      cvalidacion_contra.innerHTML = "*contraseña no es válida*";
      cvalidacion_contra.style.display = "block";
    }
    if (email === "") {
      hasError = true;
      cvalidacion_email.innerHTML = "*El correo electrónico es requerido*";
      cvalidacion_email.style.display = "block";
    } else if (!isEmailValid(email)) {
      hasError = true;
      cvalidacion_email.innerHTML = "*El correo electrónico ingresado no es válido*";
      cvalidacion_email.style.display = "block";
    }

    if (phone == "") {
      hasError = true;
      cvalidacion_phone.innerHTML = "*El numero de telefono es requerido*";
      cvalidacion_phone.style.display = "block";
    } else if (phone.length > 8 || phone.length < 8) {
      hasError = true;
      cvalidacion_phone.innerHTML = "*El numero de telefono ingresado tiene menos y/o mas de 8 digitos*";
      cvalidacion_phone.style.display = "block";
    } else if (!isPhoneValid(phone)) {
      hasError = true;
      cvalidacion_phone.innerHTML = "*El numero ingresado no es válido debe de empezar con 6 o 7*";
      cvalidacion_phone.style.display = "block";
    }

    if (hasError) {
      return;
    }

    const userRequest = {
      cNombre: nombre,
      cContrasena: password,
      cEmail: email,
      cTelefono: phone,
    };

    try {
      const response = await fetch("https://happy-pet-apirest.onrender.com/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userRequest),
      });

      if (response.ok) {
        console.log("Usuario creado");
        formPopUp.style.display = "none";
        loginPopUp.style.display = "flex";
        /*setUserInSession(userData);
        console.log("Datos recibidos del servidor en response.json:", userData);
        window.location.href = "principal.html";*/
      } else {
        const errorData = await response.json();
        console.log("Error en la solicitud:", errorData);
      }
    } catch (error) {
      console.error(error);
    }
  }
});

async function historial(id) {
  const res = await fetch("https://happy-pet-apirest.onrender.com/api/ordenes");
  const ordenes = await res.json();

  const tabla_historial_body = document.querySelector('.tabla_historial_body');

  let html = '';
  for (let i in ordenes) {
    if (ordenes[i].idcliente == id) {
      const res2 = await fetch("https://happy-pet-apirest.onrender.com/api/detalleorden");
      const detalleOrdenes = await res2.json();
      let articulos = '';
      for (let j in detalleOrdenes) {
        if (detalleOrdenes[j].idorden == ordenes[i].orden_id) {
          const res = await fetch(`https://happy-pet-apirest.onrender.com/api/productos/${detalleOrdenes[j].idproducto}`);
          const productos = await res.json();
          articulos += productos.pnombre + ', ';
        } else {
          tabla_historial_body.innerHTML = `<tr>
                                              <td colspan="3">NO TIENES COMPRAS HECHAS</td>
                                            </tr>`;
        }
      }
      const OrdenFecha = ordenes[i].ofechapedido;
      const fechaEdit = OrdenFecha.slice(0, 10);
      html += `<tr>
                  <td>${fechaEdit}</td>
                  <td>${ordenes[i].ototal}</td>
                  <td>${articulos}</td>
              </tr>`;
    }
  }
  tabla_historial_body.innerHTML = html;
}

const listaProductosHtml = document.querySelector("#list_productos");
async function actualizarProductosDestacados() {

  const res = await fetch("https://happy-pet-apirest.onrender.com/api/destacados/productos");
  const productosDes = await res.json();

  if (productosDes.length == 0) {
    //console.log('no hay ningun producto')
    listaProductosHtml.innerHTML = `
            <h2>No Hay Productos Destacados</h2>`;
    return;
  }
  let html = "";
  for (let i in productosDes) {
    const res2 = await fetch(`https://happy-pet-apirest.onrender.com/api/productos/${productosDes[i].idproducto}`);
    const productos = await res2.json();
    let contador = 0;

    contador += 1;
    const res = await fetch(
      `https://happy-pet-apirest.onrender.com/imagen/${productos.idimage}`
    );
    const imagen = await res.json();
    html +=
      `<figure class="item${contador}">` +
      `<button">
                      <img
                      class="item${contador}_img"
                      src="/src/public/uploads/${imagen}"
                      alt="Imagen de Producto${contador}"
                      />
                  </button>` +
      `<figcaption class="item${contador}_subitle">
                      <span class="item${contador}_subitle_text1">${productos.pnombre
      }</span><br />
                      <span class="item${contador}_subitle_text2">${productos.ppeso
      } Kg</span><br />
                      <span class="item${contador}_subitle_text3">Bs ${productos.pprecio
      }</span>
                  </figcaption>` +
      `</figure>`;

  }
  listaProductosHtml.innerHTML = html;
}

function isEmailValid(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function isNameValid(name) {
  const re = /^[a-zA-ZáÁéÉíÍóÓúÚñÑ\s]+$/u;
  return re.test(name);
}

function isPhoneValid(phone) {
  const re = /^[67]\d*$/;
  return re.test(phone);
}

