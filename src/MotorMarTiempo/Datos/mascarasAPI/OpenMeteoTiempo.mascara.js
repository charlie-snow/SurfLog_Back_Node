export const equivalenciasOpenmeteoTiempo = {
  propiedades: {
    nombre: "Previsión del tiempo en ",
  },
  datos: {
    unidades: "Valores de previsión por hora",
    ruta: "hourly",
    valores: {
      hora: "hourly.time",
      temperatura: "hourly.temperature_2m",
      probabilidad_de_precipitacion: "hourly.precipitation_probability",
      lluvia: "hourly.rain",
      nublado: "hourly.cloudcover",
      viento_velocidad: "hourly.windspeed_10m",
      viento_direccion: "hourly.winddirection_10m",
    },
  },
};
