# Pagina estética con reserva online

## Objetivo

**Se Desarrolla una web app que contiene una página con 3 secciones y la sección de reserva online donde se muestra un calendario para poder seleccionar un día en particular. Al seleccionarse se muestran los horarios disponibles en este día. Y luego con un boton para reservar se redirige a un formulario para completar los datos y elegir el tratamiento que desea hacerse.**
**Los datos introducidos una vez enviado el formulario se guardan en la base de datos y también son enviados al email del dueño de la estética.**

### index.html

* Muestra la página institucional de una estética. 
* Tiene 3 secciones, nosotros, tratamientos, contacto.
* Posse un boton de reserva que redirige a la sección para hacer la reserva online.

### Server

Contiene 4 endpoints

* GET "/": entrega la página inicial index.html
* GET "/reserva": Muestra el calendario generado por javascript.
* GET "/buscarReserva": Busca en la base de datos las reservas anteriores, y muestra solo los horarios disponibles, comprendidos entre las 9 a 18 hs.
* POST "/datosReserva": Una vez seleccionado un horario disponible se muestra un formulario para poder completar con datos personales.
* POST "/confirmacionReserva": Muestra los datos colocados en el formulario. Guarda esos datos en la DB, y se envía por email con el formulario lleno y la reserva efectuada.


## Instalación
* Clonar el proyecto con **git clone https://github.com/gsuruguay/reserva-online-con-Node.git**
* Ejecutar por consola desde la carpeta raiz del proyecto **npm install** para instalar las dependencias usadas (express, handlebars, nodemailer).
* Se accede por **http://localhost:3456/**

## Skills usados
* Html
* Css
* Javascript
* Node.js
* MongoDb
* Bootstrap

