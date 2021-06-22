//Valida el formato DD-MM-YYYY (19-06-2021) 
const validFecha = /^(?:(?:(?:0?[1-9]|1\d|2[0-8])[-](?:0?[1-9]|1[0-2])|(?:29|30)[-](?:0?[13-9]|1[0-2])|31[-](?:0?[13578]|1[02]))[-](?:0{2,3}[1-9]|0{1,2}[1-9]\d|0?[1-9]\d{2}|[1-9]\d{3})|29[-]0?2[-](?:\d{1,2}(?:0[48]|[2468][048]|[13579][26])|(?:0?[48]|[13579][26]|[2468][048])00))$/;
// Valida que el horario sea entre las 9 y las 18 hs
const validHora = /^(9|1[0-8]):([0-5]\d)$/;
const validEmail = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
const validTel = /[\+]?[0-9]{5,20}/;
const lsTratamientos = [
  "Hidrolipoclasia",
  "Lifting",
  "Rinomodelación",
  "Masoterapia",
  "MesoBb",
  "Microblading",
  "Plasma",
  "PushUp",
  "Otros-tratamientos",
]

function isValidDate(data) {
  if (!data.fecha || !validFecha.test(data.fecha)) return false;
  if (!data.hora || !validHora.test(data.hora)) return false;

  // Si no contiene errores
  return true;
}

function isValidForm(data) {
  if (!data.fecha || !validFecha.test(data.fecha)) return false;
  if (!data.hora || !validHora.test(data.hora)) return false;
  if (!data.nombre) return false;
  if (!data.telefono || !validTel.test(data.telefono)) return false;
  if (!data.email || !validEmail.test(data.email)) return false;
  if (!data.tratamiento || !lsTratamientos.includes(data.tratamiento)) return false;
  if (data.comentario.lenght > 300) return false;

  // Si no contiene errores
  return true;
}

function fitrarLsReservas(lista, horaBuscada, fechaBuscada, listaFiltrada) {
  lista = lista.filter(element => {
    return element.horaTurno.includes(horaBuscada);
  })

  if (lista.length > 0) {
    listaFiltrada.push({
      "horaTurno": horaBuscada,
      "disponible": false
    })
  }
  else {
    listaFiltrada.push({
      "fecha": fechaBuscada,
      "horaTurno": horaBuscada,
      "disponible": true
    })
  }
  return listaFiltrada;
}

module.exports = {
  isValidForm,
  isValidDate,
  fitrarLsReservas
};