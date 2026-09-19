/**
 * app.js — Lógica del sitio (Fetch + Dialogs)
 * Tarea Sesión 7 · Desarrollo Web · UMG
 */

const API = '/alumnos';
const API_KEY = 'umg-2026'; // debe coincidir con config.env

// Helper ya resuelto: cabeceras para las peticiones
const cabeceras = (conJson = true) => ({
    ...(conJson ? { 'Content-Type': 'application/json' } : {}),
    'x-api-key': API_KEY,
});

// Referencias del DOM (ya resueltas)
const tabla = document.querySelector('#tablaAlumnos tbody');
const mensaje = document.querySelector('#mensaje');
const dialogoForm = document.querySelector('#dialogoForm');
const dialogoEliminar = document.querySelector('#dialogoEliminar');
const form = document.querySelector('#formAlumno');
const tituloForm = document.querySelector('#tituloForm');
const nombreEliminar = document.querySelector('#nombreEliminar');

let idEnEdicion = null;        // null = crear | string = editar
let idAEliminar = null;

/**
 GET /alumnos .
 */
async function cargarAlumnos() {
    let respuesta = await fetch(API);
    let alumnos = await respuesta.json();
    tabla.innerHTML = '';

    alumnos.forEach(alumno => {
        let fila = document.createElement('tr')

        fila.innerHTML = `
        <td>${alumno.id}</td>
        <td>${alumno.nombre}</td>
        <td>${alumno.apellido}</td>
        <td>${alumno.email}</td>
        <td>${alumno.edad}</td>
        <td>
        <button class ="editar" data-id="${alumno.id}">Editar</button>
        <button class= "eliminar" data-id="${alumno.id}">Eliminar</button>
        </td>
        `;
        tabla.appendChild(fila);

        let btnEditar = fila.querySelector('.editar')
        let btnEliminar = fila.querySelector('.eliminar')
        
        btnEditar.addEventListener('click', () =>{
            abrirDialogoEditar(alumno.id)
        });

        btnEliminar.addEventListener('click', () =>{
            eliminarAlumno(alumno.id)
        });
    });

   
}

function abrirDialogoNuevo() {
    form.reset();
    idEnEdicion = null;
    tituloForm.textContent = 'Nuevo alumno'
    dialogoForm.showModal();
}

async function abrirDialogoEditar(id) {
    let respuesta = await fetch(`${API}/${id}`);
    let alumno = await respuesta.json();
    document.querySelector('#nombre').value = alumno.nombre;
    document.querySelector('#apellido').value = alumno.apellido;
    document.querySelector('#email').value = alumno.email;
    document.querySelector('#edad').value = alumno.edad;
    idEnEdicion = alumno.id;
    tituloForm.textContent = 'Editar alumno'
    dialogoForm.showModal();
}

/**
 * TODO: lee los campos del formulario y llama a la API.
 */
async function guardarAlumno(event) {
    event.preventDefault();
    let respuesta;

    let datos = {
        nombre: document.querySelector('#nombre').value,
        apellido: document.querySelector('#apellido').value,
        email: document. querySelector('#email').value,
        edad: Number(document.querySelector('#edad').value)
    };

    if(idEnEdicion === null){
        respuesta = await fetch(API,{
            method: 'POST',
            headers: cabeceras(),
            body: JSON.stringify(datos)
        });
    }else{
        respuesta = await fetch(`${API}/${idEnEdicion}`, {
            method: 'PUT',
            headers: cabeceras(),
            body: JSON.stringify(datos)
        });
    }

    if(!respuesta.ok){
        let error = await respuesta.json();
        mostrarMensaje(error.error, 'error');
        return;
    }

    dialogoForm.close();
    await cargarAlumnos();

    if (idEnEdicion === null) {
        mostrarMensaje('Alumno creado correctamente');
    } else {
        mostrarMensaje('Alumno actualizado correctamente');
}

}

/**
 * TODO: abre dialogoEliminar guardando el id, y al confirmar hace
 * DELETE
 */
function eliminarAlumno(id) {
    idAEliminar = id;
    dialogoEliminar.showModal();
}


function mostrarMensaje(texto, tipo = 'ok') {
    mensaje.textContent= texto;
    mensaje.className= tipo;
}

// ============================================================
// Conexión de eventos (TODO: completa lo que falte)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    cargarAlumnos();
    document.querySelector('#btnNuevo')
    .addEventListener('click', abrirDialogoNuevo);

    form.addEventListener('submit', guardarAlumno);

    document.querySelector('#btnCancelar').addEventListener('click', () => {
    dialogoForm.close();
    });

    document.querySelector('#btnCancelarEliminar').addEventListener('click', () => {
    dialogoEliminar.close();
    });

    document.querySelector('#btnConfirmarEliminar').addEventListener('click', async () => {

        let respuesta = await fetch(`${API}/${idAEliminar}`, {
            method: 'DELETE',
            headers: cabeceras(false)
        });

        if (!respuesta.ok) {
            let error = await respuesta.json();
            mostrarMensaje(error.error, 'error');
            return;
        }

        dialogoEliminar.close();
        await cargarAlumnos();
        mostrarMensaje('Alumno eliminado correctamente');
    });
});
