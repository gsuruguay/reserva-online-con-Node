const mongodb = require("mongodb");
const dbConfig = require("./dbConfig");

function buscarReserva(reserva, cbErr, cbListaReservas) {
  // Conexión. Función asincrónica. Recibe por callback error o cliente.
  mongodb.MongoClient.connect(dbConfig.url, function (err, client) {
    if (err) {
      console.log("Hubo un error conectando con el servidor:", err);
      // Si hay error lo retorno al callback de error y termino la función.
      cbErr(err);
      return;
    }

    // Conecto base de datos y colección
    const dbReservasTurno = client.db(dbConfig.db);
    const colReservas = dbReservasTurno.collection(dbConfig.coleccion);

    // Consulto todos los documentos y los paso a Array (función asincrónica)
    colReservas.find({ fechaTurno: RegExp(reserva) }).toArray(function (err, datos) {
      // Ya tengo los datos, cierro la conexión.
      client.close();

      if (err) {
        console.log("Hubo un error convirtiendo la consulta a Array:", err);
        cbErr(err);
        return;
      }

      console.log(datos);

      // Si llegué acá no hubo errores, los retorno al callback de datos
      cbListaReservas(datos);
    });
  });
}

/**Funcion para insertar datos a la DB */
function insertarReserva(datosReserva, cbError, cbResultado) {

  mongodb.MongoClient.connect(dbConfig.url, function(err, client) {

    if (err) {
      console.log("Hubo un error conectando con el servidor:", err);
      cbError(err);
      return;
    }

    const dbReservasTurno = client.db(dbConfig.db);
    const colReservas = dbReservasTurno.collection(dbConfig.coleccion);

    colReservas.insertOne(datosReserva, function(err, resultado) {

      client.close();

      if (err) {
        console.log("Hubo un error al intentar hacer la reserva: ", err);
        cbError(err);
        return;
      }

      cbResultado(resultado);
    });
  });
}

module.exports = {
  buscarReserva,
  insertarReserva
};

