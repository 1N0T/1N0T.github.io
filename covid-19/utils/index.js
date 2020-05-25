function convertUTCDateToLocalDate(date) {
  var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

  var offset = date.getTimezoneOffset() / 60;
  var hours = date.getHours();

  newDate.setHours(hours - offset);

  return newDate;
}

var date_diff_indays = function(date1, date2) {
  dt1 = new Date(date1);
  dt2 = new Date(date2);
  return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
}

// Esta función devuelve la cadena recibida como parámetro
// en minúsculas y sin acentos.

function normalizeString(cadena) {
  // Convertimos las cadenas a minúsculas. Previamente, nos
  // aseguramos de convertir el parámetro a sting (por si no lo fuera)
  cadena  = cadena.toString().toLowerCase()

  // Sustituimos las letras con acentos por la misma sin acento
  cadena = cadena.replace(/[áäâà]/gi,"a")
  cadena = cadena.replace(/[éëêè]/gi,"e")
  cadena = cadena.replace(/[íïîì]/gi,"i")
  cadena = cadena.replace(/[óöôò]/gi,"o")
  cadena = cadena.replace(/[úüûù]/gi,"u")
  cadena = cadena.replace(/ñ/gi,"n")
  cadena = cadena.replace(/ç/gi,"c")

  return cadena;
}


function searchIgnoringAccents(cadena, aBuscar) {
  cadena  = normalizeString(cadena)
  aBuscar = normalizeString(aBuscar)
  
  let expresionRegular = new RegExp(aBuscar, "i")
  if ( expresionRegular.test(cadena) || aBuscar == '' ) {
    return true;
  } else {
    return false;
  }
}

function sortObjectArrayByKey(arr, key, order="asc") { 
  return arr.sort(
            function( el_1, el_2 ) {
              eln_1 = normalizeString(el_1[key])
              eln_2 = normalizeString(el_2[key])
              result = ( eln_1 < eln_2 ) ? -1 : ( eln_1 > eln_2 ? 1 : 0 );
              if (order == "asc") {
                return result;
              } else { 
                if (order == "desc") {
                  return result * -1;
                } else {
                  throw "El tipo de ordenación tiene que ser 'asc' o 'desc'."
                }
              }
            }
          )
}

function objetoContieneValor( valor, objeto ) {
  if ( typeof valor != 'string' ) {
     return false;
  }

  for ( var propiedad in objeto ) {
     if ( typeof objeto[propiedad] == 'object' || typeof objeto[propiedad] == 'array' ) {
        return objetoContieneValor( valor, objeto[propiedad] )
     } else {
        if ( typeof objeto[propiedad] == 'string' ) {
           if ( objeto[propiedad].toLowerCase().indexOf(valor.toLowerCase()) > -1 ) {
              return true;
           }
        } else {
           if ( typeof objeto[propiedad] == 'number' ) {
              if ( objeto[propiedad].toString().toLowerCase().indexOf(valor.toLowerCase()) > -1 ) {
                 return true;
              }
           }
        }
     }
  }
  return false;
}