// Creación de la función validation con un Schema Joi como argumento
const validation = (Schema) => {

    // Middleware de validación
    let joiValidation = (req, res, next) => {
        let { error } = Schema.validate(req.body);
        // Verificación de errores y control de los mismos
        if (error){
            res.status(400).send({
                status: "error",
                data: error.details[0].message 
            });
        }else {
            // Si no hay error avanzar
            next();
        }
    };
    // Devuelve el middleware de la validación para su posterior uso
    return joiValidation;
};
// Exportamos la función para utilizarla junto a los Schemas en los routers
export default validation;