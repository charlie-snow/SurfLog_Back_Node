// Accede a la API de la url y devuelve el json

export const recibirJson = async (url) => {
  console.log("URL del FETCH: " + url);
  try {
    const response = await fetch(url);
    const objeto = await response.json();

    console.log("\x1b[38;5;214m%s\x1b[0m", ">> Objeto recibido del fetch:");
    console.log(JSON.stringify(objeto, (key, value) => value, 4));

    return objeto;
  } catch (error) {
    console.error(`Error haciendo fetch para la url ${url}:`, error);
    throw error;
  }
};
