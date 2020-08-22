const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

let categoriaShema = new Schema({
    description: {
        type: String,
        unique: true,
        required: [true, "La descripción es obligatoria"]
    },
    usuario: {
        type: Schema.Types.ObjectId, ref: 'Usuario'
    }
});
categoriaShema.plugin(uniqueValidator, { message: 'La categoría ya ha sido creada: {PATH} debe ser único' });
module.exports = mongoose.model('Categoria', /*categoriaSchema*/categoriaShema);