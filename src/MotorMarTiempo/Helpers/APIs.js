import { API_KEY_METEOGALICIA } from "../../../env.js";

const proxyUrl = "https://corsproxy.io/?"; // Con este proxy meteogalicia me daba previsiones de hace 2 días
// const proxyUrl = "https://thingproxy.freeboard.io/fetch/"; // Lento

const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, "0");
const day = String(currentDate.getDate()).padStart(2, "0");
const hour = String(currentDate.getHours()).padStart(2, "0");
const minute = String(currentDate.getMinutes()).padStart(2, "0");
const second = String(currentDate.getSeconds()).padStart(2, "0");

const ahora_meteogalicia = `${year}-${month}-${day}T${hour}:${minute}:${second}`;

const APIs = {
  tiempo_openmeteo: {
    nombre: "tiempo_openmeteo",
    caracteristicas:
      "previsión por horas a 7 días: temperatura, probabilidad de precipitación, lluvia, nublado, velocidad del viento, dirección del viento",
    url: [
      "https://api.open-meteo.com/v1/forecast?latitude=",
      "<LATITUD>",
      "&longitude=",
      "<LONGITUD>",
      "&hourly=temperature_2m,precipitation_probability,rain,cloudcover,windspeed_10m,winddirection_10m&timezone=Europe%2FBerlin",
    ],
  },
  tiempo_openmeteo_pasado: {
    nombre: "tiempo_openmeteo_pasado",
    caracteristicas:
      "previsión por horas de días pasados: temperatura, probabilidad de precipitación, lluvia, nublado, velocidad del viento, dirección del viento",
    url: [
      "https://archive-api.open-meteo.com/v1/era5?latitude=",
      "<LATITUD>",
      "&longitude=",
      "<LONGITUD>",
      "&start_date=",
      "<DESDE>", //  2021-01-01
      "&end_date=",
      "<HASTA>", //  2021-12-31
      "&hourly=temperature_2m,precipitation_probability,rain,cloudcover,windspeed_10m,winddirection_10m&timezone=Europe%2FBerlin",
    ],
  },
  mar_openmeteo: {
    nombre: "mar_openmeteo",
    caracteristicas:
      "previsión por horas a 7 días: altura de ola, dirección de ola, período",
    url: [
      "https://marine-api.open-meteo.com/v1/marine?latitude=",
      "<LATITUD>",
      "&longitude=",
      "<LONGITUD>",
      "&hourly=wave_height,wave_direction,wave_period&timezone=Europe%2FBerlin",
    ],
  },
  mar_openmeteo_pasado: {
    nombre: "mar_openmeteo_pasado",
    caracteristicas:
      "previsión por horas de fecha pasada: altura de ola, dirección de ola, período",
    url: [
      "https://marine-api.open-meteo.com/v1/marine?latitude=",
      "<LATITUD>",
      "&longitude=",
      "<LONGITUD>",
      "&start_date=",
      "<DESDE>", //  2021-01-01
      "&end_date=",
      "<HASTA>", //  2021-12-31
      "&hourly=wave_height,wave_direction,wave_period&timezone=Europe%2FBerlin",
    ],
  },
  mareas_meteogalicia: {
    nombre: "mareas_meteogalicia",
    caracteristicas: "previsión de mareas a 5 días",
    url: [
      "https://servizos.meteogalicia.gal/apiv4/getTidesInfo?coords=",
      "<LONGITUD>",
      ",",
      "<LATITUD>",
      "&API_KEY=",
    ],
  },
  mareas_ihm_pasado: {
    nombre: "mareas_ihm_pasado",
    caracteristicas: "previsión de mareas en un día determinado",
    url: [
      "https://ideihm.covam.es/api-ihm/getmarea?request=gettide&id=",
      "<ID de PUERTO>",
      "&format=json&date=",
      "<FECHA>", // 20210304
    ],
  },
  mareas_ihm: {
    nombre: "mareas_ihm",
    caracteristicas: "previsión de mareas en un día determinado",
    url: [
      "https://ideihm.covam.es/api-ihm/getmarea?request=gettide&id=",
      "<ID de PUERTO>",
      "&format=json&date=",
      "<FECHA>", // 20210304
    ],
  },
  temperatura_agua_meteogalicia: {
    nombre: "temperatura_agua_meteogalicia",
    caracteristicas: "previsión de temperatura de agua por horas a 5 días",
    url: [
      "https://servizos.meteogalicia.gal/apiv4/getNumericForecastInfo?coords=",
      "<LONGITUD>",
      ",",
      "<LATITUD>",
      "&variables=sea_water_temperature&API_KEY=",
      "&startTime=",
    ],
  },
  tiempo_aemet: {
    nombre: "tiempo_aemet",
    caracteristicas:
      "previsión del tiempo a 5 días?. Es necesario el id del municipio",
    url: [
      "https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/horaria/",
      "<ID_MUNICIPIO>",
      "/?api_key=",
    ],
  },
};

const getUrl = (concepto, api, ahora, fecha_pasada, momento, lugar) => {
  let url = "";

  try {
    const conceptoApi =
      concepto + "_" + api + (!ahora && fecha_pasada ? "_pasado" : "");

    console.log("\x1b[38;5;214m%s\x1b[0m", `conceptoApi ${conceptoApi}`);
    console.log("\x1b[38;5;214m%s\x1b[0m", "lugar: ");
    console.log("\x1b[38;5;214m%s\x1b[0m", lugar);

    const latitud = lugar.coordenadas.split(",")[0];
    const longitud = lugar.coordenadas.split(",")[1];

    const fecha_ihm = momento.substring(0, 10).replace(/-/g, "");

    const url_api = APIs[conceptoApi].url;

    // console.log("url_api: " + url_api.toString());

    let url_servicio = "";

    switch (conceptoApi) {
      case "mar_openmeteo":
        url = url_api[0] + latitud + url_api[2] + longitud + url_api[4];
        break;
      case "mar_openmeteo_pasado":
        url =
          url_api[0] +
          latitud +
          url_api[2] +
          longitud +
          url_api[4] +
          momento.substring(0, 10) +
          url_api[6] +
          momento.substring(0, 10) +
          url_api[8];
        break;
      case "tiempo_openmeteo":
        url = url_api[0] + latitud + url_api[2] + longitud + url_api[4];
        break;
      case "tiempo_openmeteo_pasado":
        url =
          url_api[0] +
          latitud +
          url_api[2] +
          longitud +
          url_api[4] +
          momento.substring(0, 10) +
          url_api[6] +
          momento.substring(0, 10) +
          url_api[8];
        break;
      case "mareas_meteogalicia":
        url_servicio =
          url_api[0] +
          longitud +
          url_api[2] +
          latitud +
          url_api[4] +
          API_KEY_METEOGALICIA;
        url = proxyUrl + url_servicio;
        break;
      case "mareas_ihm":
        url = url_api[0] + lugar.id_puerto + url_api[2] + fecha_ihm;
        break;
      case "mareas_ihm_pasado":
        url = url_api[0] + lugar.id_puerto + url_api[2] + fecha_ihm;
        break;
      case "temperatura_agua_meteogalicia":
        url_servicio =
          url_api[0] +
          longitud +
          url_api[2] +
          latitud +
          url_api[4] +
          API_KEY_METEOGALICIA +
          url_api[5] +
          ahora_meteogalicia;
        url = proxyUrl + url_servicio;
        break;

        url =
          proxyUrl +
          encodeURIComponent(
            url_api[0] +
              longitud +
              url_api[2] +
              latitud +
              url_api[4] +
              API_KEY_METEOGALICIA
          );
        break;
    }
  } catch (error) {
    console.error(error);
  }

  console.log("url: " + url);
  return url;
};

export { getUrl };
