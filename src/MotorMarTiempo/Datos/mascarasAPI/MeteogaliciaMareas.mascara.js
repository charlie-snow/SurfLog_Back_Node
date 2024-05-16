export const equivalenciasMeteogaliciaMareas = {
  propiedades: {
    id: "features[0].properties.port.id", // 14
    nombre: "features[0].properties.port.name", //Ferrol Porto Exterior
  },
  datos: {
    unidades: "Mareas por dia",
    ruta: "features[0].properties.days",
    valores: [
      {
        dia: "timePeriod.begin.timeInstant", // 2023-07-18-------
        mareas: "variables[0].summary" /* "summary": [
                        {
                          "id": "0",
                          "state": "High tides",
                          "timeInstant": "-------05:36-------",
                          "height": 3.3
                        },
                        {
                          "id": "1",
                          "state": "Low tides",
                          "timeInstant": "-------11:35-------",
                          "height": 1
                        },
                        {
                          "id": "2",
                          "state": "High tides",
                          "timeInstant": "-------17:50-------",
                          "height": 3.6
                        }
                      ] */,
      },
    ],
  },
};
