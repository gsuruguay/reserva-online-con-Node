window.onload = function () {
  calendario();
};

function diasMes(fecha) {
  const d = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
  return d.getDate();
}

function calendario() {
  fecha = new Date(); // Para iniciar en otra fecha, x ej: new Date("6/3/2008")
  mostrarFechaActual(fecha);
  const dias = diasMes(fecha);
  const nombreDias = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];
  const diacomienzo = empezarDia(fecha);
  escribirCalendario(fecha, nombreDias, diacomienzo, dias);
}

function mesFecha(mes) {
  switch (mes) {
    case 0:
      return "Enero";
      break;
    case 1:
      return "Febrero";
      break;
    case 2:
      return "Marzo";
      break;
    case 3:
      return "Abril";
      break;
    case 4:
      return "Mayo";
      break;
    case 5:
      return "Junio";
      break;
    case 6:
      return "Julio";
      break;
    case 7:
      return "Agosto";
      break;
    case 8:
      return "Septiembre";
      break;
    case 9:
      return "Octubre";
      break;
    case 10:
      return "Noviembre";
      break;
    case 11:
      return "Diciembre";
      break;
  }
}

function mostrarFechaActual(fecha) {
  const anyo = fecha.getFullYear();
  const mes = mesFecha(fecha.getMonth());
  const msg = mes + " de " + anyo;
  document.getElementById("fechaActual").innerHTML = msg;
}

function empezarDia(fecha) {
  const primerDiaMes = new Date(fecha.getFullYear(), fecha.getMonth(), 0);
  return primerDiaMes.getDay();
}

function escribirCalendario(fecha, nombreDias, diaComienzo, dias) {
  const tds = document.getElementsByTagName("td");
  let contador = 1;
  // Para los dias de la semana;
  for (let i = 0; i < tds.length; i++) {
    if (i > 0 && i < 8) {
      tds[i].innerHTML = nombreDias[i - 1];
    }
    if (i > 7 && diaComienzo != 0) {
      tds[i].innerHTML = " ";
      diaComienzo--;
    } else if (i > 7 && diaComienzo == 0 && contador <= dias) {


      tds[i].innerHTML = contador;

      /*Funcion click para seleccionar dia de reserva*/
      tds[i].addEventListener("click", function(){
        const mesSeleccionado = document.getElementById("fechaActual").innerHTML;
        let mesEnNro;
        let anioSolo = mesSeleccionado.slice(mesSeleccionado.lastIndexOf(" ")+1);
        let fechaFormateada;
        //alert(i-8);
        const diaSeleccionado = i-8;
        //alert(diaSeleccionado + " de " + mesSeleccionado);
        const mesesDelAnio = ["inicial","Enero","Febrero","Marzo", "Abril", "Mayo", "Junio", "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
        for(let i=0; i<= mesesDelAnio.length; i++){
          if(mesSeleccionado.slice(0, mesSeleccionado.indexOf(" ")) === mesesDelAnio[i]){
            mesEnNro = (i < 10)?"0"+i:i;
          }
        }
        fechaFormateada = diaSeleccionado + "-" + mesEnNro + "-" + anioSolo;

        if (diaSeleccionado < fecha.getDate()) {
          alert("No puedes seleccionar un dia anterior a la fecha actual");          
        } else {          
          window.location.href = "/buscarReserva?fecha=" + fechaFormateada;
        }

      })

      /** Estilo al dia actual de color rojo*/
      if (fecha.getDate() == contador) {
        tds[i].style.color = "red";
        tds[i].style.backgroundColor = "rgb(34, 73, 90);";
      }
      contador++;
    }
  }
}
