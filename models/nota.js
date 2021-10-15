import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const notaSchema = new Schema({
 cedula: {type: String, required: [true, 'Cedula obligatoria']},
 nombre: String,
 cargo: String,
 totalHoras: Number,
 ingresoReceso: Number,
 salidaReceso: Number,
 ingresoTurno: Number,
 salidaTurno: Number,
 saldo: Number,
 //mes:{type: Number, default: new Date().getMonth()},
 //dia:{type: Number, default: new Date().getDay()},
 //hora:{type: Number, default: new Date().getHours()},
 //minutos:{type: Number, default: new Date().getMinutes()},
 activo: {type: Boolean, default: true}
});

//convertir a modelo
const Nota = mongoose.model('Nota', notaSchema);

export default Nota;

