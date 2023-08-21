function getUserInSession() {
    const userInSession = sessionStorage.getItem('userInSession');
    if (!userInSession)
        return null;
    let user = null;
    try {
        user = JSON.parse(userInSession);
    } catch (e) {
        console.error("Error al obtener el usuario", e)
    }
    console.log(user);
    return user;
}

function setUserInSession(user) {
    if (user) {
        sessionStorage.setItem('userInSession', JSON.stringify(user));
    } else {
        sessionStorage.removeItem('userInSession');
    }
}

function salir() {
    setUserInSession(null);
    //window.location.href = "principal.html";
    window.location.href = "https://happy-pet-apirest.onrender.com";
}

