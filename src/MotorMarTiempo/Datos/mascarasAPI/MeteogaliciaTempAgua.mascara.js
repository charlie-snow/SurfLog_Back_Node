export const equivalenciasMeteogaliciaTempAgua = {
  propiedades: {
    coordenadas: "features[0].geometry.coordinates", //[-8.83816, 43.48991]
  },
  datos: {
    unidades: "Temperaturas de agua por horas a 5 días",
    ruta: "features[0].properties.days",
    valores: [
      {
        dia: "timePeriod.begin.timeInstant", // 2023-07-18-------
        temperaturas: "variables[0].values",

        /* "variables": [
              {
                "values": [
                  {
                    "timeInstant": "2024-03-13T13:00:00+01",
                    "value": 13
                  },
                  {
                    "timeInstant": "2024-03-13T14:00:00+01",
                    "value": 14
                  },
                  {
                    "timeInstant": "2024-03-13T15:00:00+01",
                    "value": 13
                  },*/
      },
    ],
  },
};
