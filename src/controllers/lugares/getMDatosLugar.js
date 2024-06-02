import {
  calcularPuntoMarea,
  obtenerDatos,
} from "../../MotorMarTiempo/Agentes/Procesador.js";

const encontrarTemperatura = async (momento, objeto) => {
  const data = objeto;
  if (momento == "ahora") {
    let temperatura_agua_meteogalicia = null;
    // A las 23h el array de temperaturas para el dia [0] (hoy) está vacío (meteogalicia devuelve null), así que damos el dato para las 0h de mañana
    if (objeto.datos.valores[0].temperaturas.length !== 0) {
      temperatura_agua_meteogalicia =
        data.datos.valores[0].temperaturas[0].temperatura;
    } else {
      temperatura_agua_meteogalicia =
        data.datos.valores[1].temperaturas[0].temperatura;
    }

    console.log("Temperatura ahora: " + temperatura_agua_meteogalicia);
    const objeto_temperatura = {
      momento: "ahora",
      temperatura: temperatura_agua_meteogalicia,
    };
    return objeto_temperatura;
  } else {
    console.log("\x1b[38;5;214m%s\x1b[0m", `>> Momento:  ${momento}`);
    const dia = momento.substring(0, 10);
    // const momento_completo = momento + ":00+01";
    // Iterate through the values to find the corresponding temperature
    for (const item of data.datos.valores) {
      if (item.dia.substring(0, 10) === dia) {
        // Found the matching time instance
        // console.log("item. " + item.dia);

        for (const temperatura of item.temperaturas) {
          // console.log("temp. " + temperatura.momento);

          if (temperatura.momento.includes(momento)) {
            console.log(
              "Temperature at",
              momento,
              ":",
              temperatura.temperatura
            );
            return temperatura; // Exit the function after finding the value
          }
        }
      }
    }

    console.log("No temperature value found for", momento);

    return -1;
  }
};

const getMDatosLugar = async (lugar, momento) => {
  try {
    let mdatos_lugar = {
      altura_marea: "",
      altura_ola: "",
      direccion_ola: "",
      direccion_viento: "",
      lluvia: "",
      nubes: "",
      periodo_ola: "",
      punto_marea: "",
      subiendo_marea: "",
      temperatura_agua: "",
      temperatura_ambiente: "",
      tiempo: "",
      velocidad_viento: "",
    };

    function roundToHour(date) {
      const p = 60 * 60 * 1000; // milliseconds in an hour
      const remainder = date.getTime() % p;

      // If the remainder is greater than half an hour, round up; otherwise, round down
      const roundedTime =
        remainder >= p / 2
          ? date.getTime() + (p - remainder)
          : date.getTime() - remainder;

      return new Date(roundedTime);
    }

    function formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    let momentoDate = new Date(momento);
    var ahoraDate = new Date();
    console.log("\x1b[38;5;214m%s\x1b[0m", "momentoDate: " + momentoDate);
    console.log("\x1b[38;5;214m%s\x1b[0m", "ahoraDate: " + ahoraDate);

    const diferencia = ahoraDate - momentoDate;
    const ahora = !(Math.abs(diferencia) > 3600000);

    let fecha_pasada = null;
    if (!ahora) {
      if (diferencia > 0) {
        fecha_pasada = true;
      } else {
        fecha_pasada = false;
      }
    }

    momentoDate = roundToHour(momentoDate);

    const momento_redondeado_a_la_hora = formatDate(momentoDate);

    let datos = {};

    // Insertar datos MAR/TIEMPO ________________________________________________ >

    console.log(">> OBTENIENDO datos del mar.......");
    let posicionMomento = 0;

    try {
      datos = await obtenerDatos(
        "mar",
        "openmeteo",
        ahora,
        fecha_pasada,
        momento_redondeado_a_la_hora,
        lugar
      );

      // console.log("Datos procesadosMar:");
      // console.log(JSON.stringify(datos));

      posicionMomento = datos.datos.valores.hora.indexOf(
        momento_redondeado_a_la_hora
      );

      console.log("posmomento: " + posicionMomento);

      mdatos_lugar.altura_ola = datos.datos.valores.altura[posicionMomento];
      mdatos_lugar.direccion_ola =
        datos.datos.valores.direccion[posicionMomento];
      mdatos_lugar.periodo_ola = datos.datos.valores.periodo[posicionMomento];
    } catch (error) {
      console.log(
        "\x1b[38;5;214m%s\x1b[0m",
        "XXXXXXXX - ERROR OBTENIENDO DATOS DE MAR: " + error
      );
      mdatos_lugar.altura_ola = null;
      mdatos_lugar.direccion_ola = null;
      mdatos_lugar.periodo_ola = null;
    }

    console.log("Mdatos lugar:");
    console.log(JSON.stringify(mdatos_lugar));

    // Insertar datos MAREAS ______________________________________________________________________

    console.log("> OBTENIENDO datos mareas .......");

    try {
      datos = await obtenerDatos(
        "mareas",
        "ihm",
        ahora,
        fecha_pasada,
        momento_redondeado_a_la_hora,
        lugar
      );

      const marea_actual = calcularPuntoMarea(datos, momento);

      // console.log(marea_actual);
      if (marea_actual) {
        // -> NO IMPLEMENTADO > (marea_actual.altura es null, no se calcula aún en calcularPuntoMarea)
        mdatos_lugar.altura_marea = marea_actual.altura.toFixed(2);
        // -> NO IMPLEMENTADO <

        mdatos_lugar.punto_marea = marea_actual.nivel;
      } else {
        mdatos_lugar.altura_marea = null;
        mdatos_lugar.punto_marea = null;
      }

      mdatos_lugar.subiendo_marea = marea_actual.subiendo;
      // marea_actual.estado === "subiendo"
      //   ? (subiendo_marea = 1)
      //   : (subiendo_marea = 0);
    } catch (error) {
      console.log(
        "\x1b[38;5;214m%s\x1b[0m",
        "XXXXXXXX - ERROR OBTENIENDO DATOS DE MAREAS: " + error
      );
      mdatos_lugar.altura_marea = null;
      mdatos_lugar.punto_marea = null;
      mdatos_lugar.subiendo_marea = null;
    }

    console.log("Mdatos lugar:");
    console.log(JSON.stringify(mdatos_lugar));

    // Insertar datos TEMPERATURA DEL AGUA  ________________________________________

    console.log("> OBTENIENDO datos temperatura agua .......");

    try {
      if (!fecha_pasada) {
        datos = await obtenerDatos(
          "temperatura_agua",
          "meteogalicia",
          ahora,
          fecha_pasada,
          momento_redondeado_a_la_hora,
          lugar
        );

        // SOLO devuelve la temperatura ahora mismo, no busca; tampoco la predicción de meteogalicia me da la temperatura pasada

        // const objeto_temperatura = await encontrarTemperatura(
        //   momento_redondeado_a_la_hora,
        //   datos
        // );

        const objeto_temperatura = await encontrarTemperatura("ahora", datos);

        mdatos_lugar.temperatura_agua = objeto_temperatura.temperatura;
      } else {
        console.log(
          "\x1b[38;5;214m%s\x1b[0m",
          "No se de dónde coger la temperatura del agua en el pasado aún"
        );
      }
    } catch (error) {
      console.log(
        "\x1b[38;5;214m%s\x1b[0m",
        "XXXXXXXX - ERROR OBTENIENDO DATOS DE TEMPERATURA DE AGUA: " + error
      );
      mdatos_lugar.temperatura_agua = null;
    }

    console.log("Mdatos lugar:");
    console.log(JSON.stringify(mdatos_lugar));

    // Insertar datos TIEMPO _____________________________________________________ >
    console.log("> OBTENIENDO datos tiempo.......");

    try {
      datos = await obtenerDatos(
        "tiempo",
        "openmeteo",
        ahora,
        fecha_pasada,
        momento_redondeado_a_la_hora,
        lugar
      );

      // console.log("Datos procesados Tiempo:");
      // console.log(JSON.stringify(datos));

      posicionMomento = datos.datos.valores.hora.indexOf(
        momento_redondeado_a_la_hora
      );

      mdatos_lugar.velocidad_viento =
        datos.datos.valores.viento_velocidad[posicionMomento];
      mdatos_lugar.direccion_viento =
        datos.datos.valores.viento_direccion[posicionMomento];
      mdatos_lugar.temperatura_ambiente =
        datos.datos.valores.temperatura[posicionMomento];
      mdatos_lugar.lluvia = datos.datos.valores.lluvia[posicionMomento];
      mdatos_lugar.nubes = datos.datos.valores.nublado[posicionMomento];
    } catch (error) {
      console.log(
        "\x1b[38;5;214m%s\x1b[0m",
        "XXXXXXXX - ERROR OBTENIENDO DATOS DE TIEMPO: " + error
      );
      mdatos_lugar.velocidad_viento = null;
      mdatos_lugar.direccion_viento = null;
      mdatos_lugar.temperatura_ambiente = null;
      mdatos_lugar.lluvia = null;
      mdatos_lugar.nubes = null;
    }

    console.log("Mdatos lugar:");
    console.log(JSON.stringify(mdatos_lugar));

    // Insertar datos MAR/TIEMPO ________________________________________________ <

    return mdatos_lugar;
  } catch (error) {
    console.log("Error obteniendo datos del lugar: " + error);
  }
};

// Exportaciones
export default getMDatosLugar;
