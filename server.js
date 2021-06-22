const express = require("express");
const path = require("path");
const expHbs = require("express-handlebars");
const nodemailer = require("nodemailer");
const utils = require("./utils");
const app = express();
const PUERTO = 3456;

const dbReservas = require("./dbReservas");

/*** Configuración de Handlebars para Express ***/
app.engine(
  "handlebars",
  expHbs({
    defaultLayout: "main-layout",
    layoutsDir: "views/layouts",
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));
/************************************************/

// Middleware para archivos de imagen, css, scripts, etc ("recursos estáticos")
app.use(express.static(path.join(__dirname, "client")));

// Middleware para poner el contenido de un form post en req.body
app.use(express.urlencoded({ extended: true }));

/**VISTA PRINCIPAL DE PAGINA*/
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"))
})

/**VISTA DE CALENDARIO RESERVA */
app.get("/reserva", (req, res) => {
  let titulo = "Aún no has seleccionado una fecha"
  res.render("calendario", {
    titulo
  })
})

/**VISTA DE BUSQUEDA DE RESERVAS SEGUN DIA SELECCIONADO */
app.get("/buscarReserva", (req, res) => {
  let textoResultado = "Aún no has seleccionado una fecha";
  let msjErrorQuery = "";
  let textoTitulo = "Reservas de turno online";
  let fechaActual = new Date();
  let diaActual = fechaActual.getDate();
  let extraccionDiaQy = req.query.fecha.slice(0, 2);
  console.log(extraccionDiaQy);

  if (extraccionDiaQy < diaActual) {
    msjErrorQuery = "No puedes seleccionar un dia anterior a la fecha actual"

    res.render("horariosReservas", {
      msjErrorQuery,
      titulo: textoTitulo,
    });
  }

  dbReservas.buscarReserva(
    req.query.fecha,

    (err) => {
      console.log(err);
      res.render("error", {
        mensajeError: err,
      });
    },

    (listaDeReservas) => {

      textoTitulo = "Búsqueda de turnos";

      /*Crea lista objetos con horarios DISPONIBLES*/
      let listaConHorarios = [];
      let hora = 9;
      while (hora <= 18) {
        utils.fitrarLsReservas(listaDeReservas, hora, req.query.fecha, listaConHorarios);
        hora++;
      }
      console.log("LISTA CON HORARIOS");
      console.log(listaConHorarios);
      console.log("LISTA DE RESERVAS ORIGINAL");
      console.log(listaDeReservas);

      // Renderizo la vista "horariosReservas" con esos datos
      res.render("horariosReservas", {
        fecha: req.query.fecha,
        listaConHorarios,
        tituloResultados: textoResultado,
        titulo: textoTitulo,
      });
    }
  );
})

/**VISTA DE FORM DE DATOS PARA HACER RESERVA */
app.post("/datosReserva", (req, res) => {

  let fechaVerif = "Hubo un error en la fecha, inténtalo nuevamente";
  let horaVerif = "Hubo un error en el horario, inténtalo nuevamente";
  console.log("ESTA ES LA FECHA Y HORA DE POST");
  console.log(req.body);

  if (req.body.fecha && req.body.hora && utils.isValidDate(req.body)) {
    fechaVerif = req.body.fecha;
    horaVerif = req.body.hora;
  }

  res.render("formDatos", {
    fecha: fechaVerif,
    hora: horaVerif
  });
})

app.post("/confirmacionReserva", (req, res) => {

  console.log(req.body);

  if (!utils.isValidForm(req.body)) {
    res.render("error", {
      error: "Hubo datos incorrectos en el formulario.",
    });
    return;
  }

  const newReserva = {
    nombre: req.body.nombre,
    fechaTurno: req.body.fecha,
    horaTurno: req.body.hora,
    telefono: req.body.telefono,
    email: req.body.email,
    tratamiento: req.body.tratamiento,
    comentario: req.body.comentario
  }

  /*Envio de email de la cita reservada*/
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "keiracony@gmail.com", // user
      pass: "qhrmxqcsjhlvcedq", // password
    },
  });

  let mailOptions = {
    from: 'Estetica Pilar Studio', // sender address
    to: "guillermo.suruguay@gmail.com", // list of receivers
    subject: "Nueva reserva online de Estética", // Subject line
    //text: "Enviando msj desde nodemailer", // plain text body
    html: `    
    <h3>Nueva cita reservada online</h3>
    <b>NOMBRE:</b> ${req.body.nombre} <br>
    <b>FECHA DE TURNO:</b> ${req.body.fecha} <br>
    <b>HORA DEL TURNO:</b> ${req.body.hora} <br>
    <b>TELEFONO:</b> ${req.body.telefono}<br>
    <b>EMAIL:</b> ${req.body.email}<br>
    <b>TRATAMIENTO:</b> ${req.body.tratamiento}<br>
    <b>COMENTARIO:</b> ${req.body.comentario}
    `, // html body   

  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).send(error.message);
    } else {
      console.log("Email enviado");
      res.status(200).jsonp(req.body)
    }
  });
  /******************* */

  dbReservas.insertarReserva(
    newReserva,
    (err) => {
      res.render("error", {
        error: err,
      });
    },
    () => {
      res.render("reservaConfirmada", {
        nombre: req.body.nombre,
        fecha: req.body.fecha,
        hora: req.body.hora,
        telefono: req.body.telefono,
        email: req.body.email,
        tratamiento: req.body.tratamiento,
        comentario: req.body.comentario
      });
    }
  )
})

app.listen(PUERTO, () => {
    console.log(`Escuchando en puerto ${PUERTO}`);
  })