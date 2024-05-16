import { recibirJson } from "./Recadero.js";
import { equivalenciasMeteogaliciaMareas } from "../Datos/mascarasAPI/MeteogaliciaMareas.mascara.js";
import { equivalenciasOpenmeteoTiempo } from "../Datos/mascarasAPI/OpenMeteoTiempo.mascara.js";
import { equivalenciasOpenmeteoMar } from "../Datos/mascarasAPI/OpenMeteoMar.mascara.js";
import { equivalenciasMeteogaliciaTempAgua } from "../Datos/mascarasAPI/MeteogaliciaTempAgua.mascara.js";
import { equivalenciasMareasIhm } from "../Datos/mascarasAPI/MareasIhm.mascara.js";

const extraerItem = (objeto, ruta) => {
  // Splitting the property path into an array
  const pathArray = ruta.split(".");

  // Traversing the object using the pathArray
  let result = objeto;
  for (const key of pathArray) {
    const regex = /\[(\d+)\]/; // Check if the key is an array index
    const match = regex.exec(key);
    if (match) {
      result = result[key.substring(0, key.indexOf("["))][parseInt(match[1])];
    } else {
      result = result[key];
    }

    if (result === undefined) {
      break; // Break if the property doesn't exist
    }
  }
  return result;
};

const crearObjetoLimpioOpenmeteoMar = (objeto, equivalencias) => {
  const objetoLimpio = JSON.parse(JSON.stringify(equivalencias));
  delete objetoLimpio.datos.ruta;
  // // Recuperamos los valores desde objeto y los metemos en el objeto limpio
  objetoLimpio.datos.valores = {};
  objetoLimpio.datos.valores.hora = extraerItem(
    objeto,
    equivalencias.datos.valores.hora
  );

  objetoLimpio.datos.valores.altura = extraerItem(
    objeto,
    equivalencias.datos.valores.altura
  );
  objetoLimpio.datos.valores.direccion = extraerItem(
    objeto,
    equivalencias.datos.valores.direccion
  );
  objetoLimpio.datos.valores.periodo = extraerItem(
    objeto,
    equivalencias.datos.valores.periodo
  );
  return objetoLimpio;
};

const crearObjetoLimpioMeteogaliciaMareas = (objeto, equivalencias) => {
  const objetoLimpio = JSON.parse(JSON.stringify(equivalencias));

  delete objetoLimpio.datos.ruta;

  // Recuperamos las propiedades desde objeto y las metemos en el objeto limpio
  for (let item in equivalencias.propiedades) {
    const valor = extraerItem(objeto, equivalencias.propiedades[item]);
    // console.log(valor);
    objetoLimpio.propiedades[item] = valor;
  }

  // Recuperamos los valores desde objeto y los metemos en el objeto limpio
  const ruta_valores = equivalencias.datos.ruta;
  const ruta_dia = equivalencias.datos.valores[0].dia;
  const ruta_mareas = equivalencias.datos.valores[0].mareas;
  const valores = extraerItem(objeto, ruta_valores);
  objetoLimpio.datos.valores = [];
  // console.log(valores);
  for (let i = 0; i < valores.length; i++) {
    objetoLimpio.datos.valores[i] = {};

    // Asignamos valor equivalente al día
    let ruta = ruta_valores + "[" + i + "]." + ruta_dia;
    const valor = extraerItem(objeto, ruta);
    objetoLimpio.datos.valores[i].dia = valor;
    // console.log(equivalencias);
    // Asignamos valores equivalentes a las mareas
    ruta = ruta_valores + "[" + i + "]." + ruta_mareas;
    const mareas = extraerItem(objeto, ruta);
    objetoLimpio.datos.valores[i].mareas = [];
    // console.log(mareas);
    for (let j = 0; j < mareas.length; j++) {
      objetoLimpio.datos.valores[i].mareas[j] = {};
      objetoLimpio.datos.valores[i].mareas[j].marea =
        mareas[j].state === "High tides" ? "pleamar" : "bajamar";
      objetoLimpio.datos.valores[i].mareas[j].hora = mareas[
        j
      ].timeInstant.substring(11, 16);
      objetoLimpio.datos.valores[i].mareas[j].altura = mareas[j].height;
    }
  }
  return objetoLimpio;
};

const crearObjetoLimpioIhmMareas = (objeto, equivalencias) => {
  function convertToBerlinTime(utcTimeString) {
    var utcTimeParts = utcTimeString.split(":");
    var utcDate = new Date();
    utcDate.setUTCHours(parseInt(utcTimeParts[0], 10));
    utcDate.setUTCMinutes(parseInt(utcTimeParts[1], 10));

    // Convert to Berlin time (UTC+1 or UTC+2 depending on DST)
    var berlinDate = new Date(
      utcDate.toLocaleString("en-US", { timeZone: "Europe/Berlin" })
    );

    // Format the time as HH:MM
    var berlinTime = berlinDate.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });

    return berlinTime;
  }

  const objetoLimpio = JSON.parse(JSON.stringify(equivalencias));

  delete objetoLimpio.datos.ruta;

  // Recuperamos las propiedades desde objeto y las metemos en el objeto limpio
  for (let item in equivalencias.propiedades) {
    const valor = extraerItem(objeto, equivalencias.propiedades[item]);
    // console.log(valor);
    objetoLimpio.propiedades[item] = valor;
  }

  // Recuperamos los valores desde objeto y los metemos en el objeto limpio
  const ruta_valores = equivalencias.datos.ruta;
  const ruta_dia = objetoLimpio.datos.valores[0].dia;

  const dia = extraerItem(objeto, ruta_dia);
  const valores = extraerItem(objeto, ruta_valores);

  objetoLimpio.datos.valores[0].dia = dia;
  objetoLimpio.datos.valores[0].mareas = valores;

  // AFINAMOS: cambiamos "tipo" por "marea" Y convertimos las alturas a números
  objetoLimpio.datos.valores.forEach(function (entry) {
    entry.mareas.forEach(function (marea, index) {
      marea.hora = convertToBerlinTime(marea.hora);
      if (marea.hora.substring(0, 2) === "24") {
        entry.mareas.splice(index, 1);
      } else {
        marea.marea = marea.tipo;
        delete marea.tipo; // Remove the old attribute
        marea.altura = parseFloat(marea.altura); // Convert string to float
      }
    });
  });

  return objetoLimpio;
};

const crearObjetoLimpioMeteogaliciaTempAgua = (objeto, equivalencias) => {
  try {
    // Hacemos una copia de equivalencias para meter los datos desde el objeto original
    const objetoLimpio = JSON.parse(JSON.stringify(equivalencias));

    delete objetoLimpio.datos.ruta;

    // Recuperamos las propiedades desde objeto y las metemos en el objeto limpio
    for (let item in equivalencias.propiedades) {
      const valor = extraerItem(objeto, equivalencias.propiedades[item]);
      // console.log(valor);
      objetoLimpio.propiedades[item] = valor;
    }
    console.log("objetoLimpio propiedades: ");
    console.log(objetoLimpio);

    // Recuperamos los valores desde objeto y los metemos en el objeto limpio
    // Ruta donde esta la fecha de la previsión
    const ruta_dia = equivalencias.datos.valores[0].dia;
    const ruta_temperaturas = equivalencias.datos.valores[0].temperaturas;

    const ruta_valores = equivalencias.datos.ruta;

    const valores = extraerItem(objeto, ruta_valores);
    objetoLimpio.datos.valores = [];
    // console.log(valores);
    for (let i = 0; i < valores.length; i++) {
      objetoLimpio.datos.valores[i] = {};

      // Asignamos valor equivalente al día
      let ruta = ruta_valores + "[" + i + "]." + ruta_dia;
      const valor = extraerItem(objeto, ruta);
      objetoLimpio.datos.valores[i].dia = valor;
      // console.log(equivalencias);

      objetoLimpio.datos.valores[i].temperaturas = [];
      // A las 23h el array de valores para el dia [0] (hoy) es null, si es así, no incluir el valor en los resultados
      if (objeto.features[0].properties.days[i].variables !== null) {
        // Asignamos valores equivalentes a las temperaturas del agua
        ruta = ruta_valores + "[" + i + "]." + ruta_temperaturas;
        const temperaturas = extraerItem(objeto, ruta);
        // console.log(mareas);
        for (let j = 0; j < temperaturas.length; j++) {
          objetoLimpio.datos.valores[i].temperaturas[j] = {};
          objetoLimpio.datos.valores[i].temperaturas[j].temperatura =
            temperaturas[j].value;
          objetoLimpio.datos.valores[i].temperaturas[j].momento =
            temperaturas[j].timeInstant;
        }
      }
    }
    return objetoLimpio;
  } catch (error) {
    console.log("Error limpiando temp agua: " + error);
  }
};

const crearObjetoLimpioOpenmeteoTiempo = (objeto, equivalencias) => {
  const objetoLimpio = JSON.parse(JSON.stringify(equivalencias));

  delete objetoLimpio.datos.ruta;

  // // Recuperamos los valores desde objeto y los metemos en el objeto limpio
  objetoLimpio.datos.valores = {};
  objetoLimpio.datos.valores.hora = extraerItem(
    objeto,
    equivalencias.datos.valores.hora
  );
  objetoLimpio.datos.valores.temperatura = extraerItem(
    objeto,
    equivalencias.datos.valores.temperatura
  );
  objetoLimpio.datos.valores.probabilidad_de_precipitacion = extraerItem(
    objeto,
    equivalencias.datos.valores.probabilidad_de_precipitacion
  );
  objetoLimpio.datos.valores.lluvia = extraerItem(
    objeto,
    equivalencias.datos.valores.lluvia
  );
  objetoLimpio.datos.valores.nublado = extraerItem(
    objeto,
    equivalencias.datos.valores.nublado
  );
  objetoLimpio.datos.valores.viento_velocidad = extraerItem(
    objeto,
    equivalencias.datos.valores.viento_velocidad
  );
  objetoLimpio.datos.valores.viento_direccion = extraerItem(
    objeto,
    equivalencias.datos.valores.viento_direccion
  );
  return objetoLimpio;
};

export const limpiar = async (concepto, api, ahora, fecha_pasada, url) => {
  try {
    const objeto = await recibirJson(url);

    const conceptoApi =
      concepto + "_" + api + (!ahora && fecha_pasada ? "_pasado" : "");
    let objetoLimpio = {};
    // limpiar datos
    switch (conceptoApi) {
      case "tiempo_openmeteo":
        objetoLimpio = await crearObjetoLimpioOpenmeteoTiempo(
          objeto,
          equivalenciasOpenmeteoTiempo
        );
        break;
      case "mar_openmeteo":
        objetoLimpio = await crearObjetoLimpioOpenmeteoMar(
          objeto,
          equivalenciasOpenmeteoMar
        );
        break;
      case "mar_openmeteo_pasado":
        objetoLimpio = await crearObjetoLimpioOpenmeteoMar(
          objeto,
          equivalenciasOpenmeteoMar
        );
        break;
      case "mareas_meteogalicia":
        objetoLimpio = await crearObjetoLimpioMeteogaliciaMareas(
          objeto,
          equivalenciasMeteogaliciaMareas
        );
        break;
      case "mareas_ihm":
        objetoLimpio = await crearObjetoLimpioIhmMareas(
          objeto,
          equivalenciasMareasIhm
        );
        break;
      case "mareas_ihm_pasado":
        objetoLimpio = await crearObjetoLimpioIhmMareas(
          objeto,
          equivalenciasMareasIhm
        );
        break;
      case "temperatura_agua_meteogalicia":
        console.log(
          "\x1b[38;5;214m%s\x1b[0m",
          ">> Objeto recibido para limpiar temp agua:"
        );
        console.log(JSON.stringify(objeto, (key, value) => value, 4));
        objetoLimpio = await crearObjetoLimpioMeteogaliciaTempAgua(
          objeto,
          equivalenciasMeteogaliciaTempAgua
        );
        console.log("objetoLimpioTempAgua :");
        console.log(objetoLimpio);
        break;
    }

    // const
    // console.log("objetoLimpioTiempo :");
    // console.log(objetoLimpio);

    return objetoLimpio;
  } catch (error) {
    console.log("Error limpiando datos de " + concepto);
  }
};
