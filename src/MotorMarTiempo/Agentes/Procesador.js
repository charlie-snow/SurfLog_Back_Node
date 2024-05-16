import { getUrl } from "../Helpers/APIs.js";
import { limpiar } from "./Limpiador.js";

export const obtenerDatos = async (
  concepto,
  api,
  ahora,
  fecha_pasada,
  momento_redondeado_a_la_hora,
  lugar
) => {
  const url = getUrl(
    concepto,
    api,
    ahora,
    fecha_pasada,
    momento_redondeado_a_la_hora,
    lugar
  );
  // console.log("url: " + url);
  const datos = await limpiar(concepto, api, ahora, fecha_pasada, url);
  console.log(
    `>>>> Datos obtenidos de ${concepto} en ${api} para ${lugar.nombre}: <<<<`
  );
  console.log(JSON.stringify(datos));
  return datos;
};

export function calcularPuntoMarea(data, momento) {
  const values = data.datos.valores;

  let marea_actual = {};

  // const targetDateTime = new Date(targetDate + "T" + targetTime + ":00");
  const momentoDate = new Date(momento);
  const fecha = momento.substring(0, 10);
  // console.log("fecha: ");
  // console.log(fecha);

  let relevantEntry = null;
  for (let i = 0; i < values.length; i++) {
    // const entryDate = new Date(values[i].dia);
    // console.log("values[i].dia: ");
    // console.log(values[i].dia);
    if (values[i].dia.substring(0, 10) === fecha) {
      relevantEntry = values[i];
      break;
    }
  }

  if (!relevantEntry) {
    return "No data available for the given date.";
  }

  const tidePoints = relevantEntry.mareas;
  const tideTimes = tidePoints.map(
    (tide) => new Date(fecha + "T" + tide.hora + ":00")
  );
  const minTideHeight = Math.min(...tidePoints.map((tide) => tide.altura));
  const maxTideHeight = Math.max(...tidePoints.map((tide) => tide.altura));
  if (momentoDate < tideTimes[0]) {
    // SI el momento es anterior a la primera marea
    const t1 = tideTimes[0];
    const t2 = tideTimes[0 + 1];
    const h1 = tidePoints[0].altura;
    const h2 = tidePoints[0 + 1].altura;
    const timeDiff = (t1 - momentoDate) / (t2 - t1);
    const interpolatedHeight = h1 + (h2 - h1) * timeDiff;

    // Normalize tide height between min and max tide heights observed

    const normalizedHeight =
      (interpolatedHeight - minTideHeight) / (maxTideHeight - minTideHeight);

    // Map normalized height to the range of 0.0 to 6.0
    let indexValue = normalizedHeight * 6.0;
    indexValue = indexValue.toFixed(1); // Round to 2 decimal places

    marea_actual = {};
    marea_actual.altura = interpolatedHeight;
    marea_actual.nivel = indexValue;
    marea_actual.subiendo = tideTimes[0].marea === "pleamar" ? 0 : 1;
    return marea_actual;
  } else if (momentoDate > tideTimes[tideTimes.length - 1]) {
    // SI el momento es posterior a la última marea
    const t1 = tideTimes[tideTimes.length - 2];
    const t2 = tideTimes[tideTimes.length - 1];
    const h1 = tidePoints[tideTimes.length - 2].altura;
    const h2 = tidePoints[tideTimes.length - 1].altura;
    const timeDiff = (momentoDate - t2) / (t2 - t1);
    const interpolatedHeight = h2 + (h1 - h2) * timeDiff;

    // Normalize tide height between min and max tide heights observed

    const normalizedHeight =
      (interpolatedHeight - minTideHeight) / (maxTideHeight - minTideHeight);

    // Map normalized height to the range of 0.0 to 6.0
    let indexValue = normalizedHeight * 6.0;
    indexValue = indexValue.toFixed(1); // Round to 2 decimal places

    marea_actual = {};
    marea_actual.altura = interpolatedHeight;
    marea_actual.nivel = indexValue;
    marea_actual.subiendo =
      tideTimes[tideTimes.length - 1].marea === "pleamar" ? 1 : 0;
    return marea_actual;
  } else {
    for (let i = 0; i < tideTimes.length - 1; i++) {
      if (tideTimes[i] <= momentoDate && momentoDate < tideTimes[i + 1]) {
        const t1 = tideTimes[i];
        const t2 = tideTimes[i + 1];
        const h1 = tidePoints[i].altura;
        const h2 = tidePoints[i + 1].altura;
        const timeDiff = (momentoDate - t1) / (t2 - t1);
        const interpolatedHeight = h1 + (h2 - h1) * timeDiff;

        // Normalize tide height between min and max tide heights observed

        const normalizedHeight =
          (interpolatedHeight - minTideHeight) /
          (maxTideHeight - minTideHeight);

        // Map normalized height to the range of 0.0 to 6.0
        let indexValue = normalizedHeight * 6.0;
        indexValue = indexValue.toFixed(1); // Round to 2 decimal places

        let tideDirection = null;
        if (h2 > h1) {
          tideDirection = 1;
        } else if (h2 < h1) {
          tideDirection = 0;
        }

        marea_actual = {};
        marea_actual.altura = interpolatedHeight;
        marea_actual.nivel = indexValue;
        marea_actual.subiendo = tideDirection;
        return marea_actual;
      }
    }
  }

  return "No tide data available for the given time.";
}
