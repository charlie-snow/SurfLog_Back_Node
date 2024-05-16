export const equivalenciasMareasIhm = {
  propiedades: {
    id: "mareas.id", // 19
    nombre: "mareas.puerto", //Sada FontÃ¡n (RÃ­a de Betanzos)
  },
  datos: {
    unidades: "Mareas para un día determinado",
    ruta: "mareas.datos.marea",
    valores: [
      {
        dia: "mareas.fecha",
        mareas: [
          {
            marea: "tipo",
            hora: "hora",
            altura: "altura",
          },
          {
            hora: "hora",
            altura: "altura",
            tipo: "tipo",
          },
        ],
      },
    ],
  },
};
