import express from 'express';
const router = express.Router();

// importar el modelo nota
import Nota from '../models/nota';

var MongoClient = require('mongodb').MongoClient;
//var url = "mongodb://localhost:27017/";
var url = "mongodb+srv://Will:2132045@cluster0.i6fgf.mongodb.net/empleados?retryWrites=true&w=majority";

/**var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
MongoClient.connect(url, function (err, db) {
    if (err) throw err; var dbo = db.db("mydb");
    var myobj = { name: "Company Inc", address: "Highway 37" };
    dbo.collection("customers").insertOne(myobj, function (err, res) {
        if (err) throw err; console.log("1 document inserted");
        db.close();
    });
}); */

function ingresoTurno(cc) {

    MongoClient.connect(url, function (err, db) {
        var hora = new Date().getHours();
        var minutos = new Date().getMinutes();
        if (err) throw err; var dbo = db.db("empleados");
        var myquery = { cedula: cc };
        var newvalues = { $set: { ingresoTurno: [hora, minutos] } };
        dbo.collection("notas").updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log("Hora de ingreso a turno actualizada");
            db.close();
        });
    });
}

function ingresoReceso() {

    MongoClient.connect(url, function (err, db) {
        var cc = "101201";
        var hora = new Date().getHours();
        var minutos = new Date().getMinutes();
        if (err) throw err; var dbo = db.db("empleados");
        var myquery = { cedula: cc };
        var newvalues = { $set: { ingresoReceso: [hora, minutos] } };
        dbo.collection("notas").updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log("Hora de ingreso a Receso actualizada");
            db.close();
        });
    });
}

function salidaReceso(cc) {

    MongoClient.connect(url, function (err, db) {
        var hora = new Date().getHours();
        var minutos = new Date().getMinutes();
        if (err) throw err; var dbo = db.db("empleados");
        var myquery = { cedula: cc };
        var newvalues = { $set: { salidaReceso: [hora, minutos] } };
        dbo.collection("notas").updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log("Hora de salida a Receso actualizada");
            db.close();
        });
    });
}

function salidaTurno(cc) {

    MongoClient.connect(url, function (err, db) {
        var hora = new Date().getHours();
        var minutos = new Date().getMinutes();
        if (err) throw err; var dbo = db.db("empleados");
        var myquery = { cedula: cc };
        var newvalues = { $set: { salidaTurno: [hora, minutos] } };
        dbo.collection("notas").updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log("Hora de salida actualizada");
            //db.close();
        });
        dbo.collection("notas").findOne({ cedula: cc }, function (err, result) {
            if (err) throw err;
            var ingresoturno = result.ingresoTurno;
            var ingresoreceso = result.ingresoReceso;
            var salidareceso = result.salidaReceso;
            var horas = result.totalHoras;
            var hreceso;
            var mreceso;
            var saldo;
            if (salidareceso[1] < ingresoturno[1]) {
                salidareceso[0] -= 1;
                salidareceso[1] += 60;
            }
            if (minutos < ingresoturno[1]) {
                hora -= 1;
                minutos += 60;
            }
            hreceso = salidareceso[0] - ingresoreceso[0];
            mreceso = salidareceso[1] - ingresoreceso[1];
            hora -= ingresoturno[0];
            minutos -= ingresoturno[1];
            horas += ((hora + ((minutos * 100) / 6000)) - (hreceso + ((mreceso * 100) / 6000)));
            saldo = 5200 * horas;
            console.log(horas);
            var newvalues2 = { $set: { totalHoras: Number(horas.toFixed(2)) } };
            var newvalues3 = { $set: { saldo: Number(saldo.toFixed(0)) } };
            dbo.collection("notas").updateOne(myquery, newvalues2, function (err, res) {
                if (err) throw err;
                console.log("Horas actualizadas");
                //db.close();
            });
            dbo.collection("notas").updateOne(myquery, newvalues3, function (err, res) {
                if (err) throw err;
                console.log("Saldo actualizado");
                db.close();
            });
            //db.close();
        });
    });

}

//salidaTurno("101201");
//ingresoReceso();
//salidaReceso();
// Agregar una nota
router.post('/nuevo-empleado', async (req, res) => {
    const body = req.body;
    try {
        const notaDB = await Nota.create(body);
        res.status(200).json(notaDB);
    } catch (error) {
        return res.status(500).json({
            mensaje: 'Ocurrio un error',
            error
        })
    }
});

// Get con parámetros
router.get('/nota/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const notaDB = await Nota.findOne({ _id });
        res.json(notaDB);
    } catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrio un error',
            error
        })
    }
});

// Get con todos los documentos
router.get('/nota', async (req, res) => {
    try {
        const notaDb = await Nota.find();
        res.json(notaDb);
    } catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrio un error',
            error
        })
    }
});

// Delete eliminar una nota
router.delete('/nota/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const notaDb = await Nota.findByIdAndDelete({ _id });
        if (!notaDb) {
            return res.status(400).json({
                mensaje: 'No se encontró el id indicado',
                error
            })
        }
        res.json(notaDb);
    } catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrio un error',
            error
        })
    }
});

// Put actualizar una nota
router.put('/nota/:id', async (req, res) => {
    const _id = req.params.id;
    const body = req.body;
    try {
        const notaDb = await Nota.findByIdAndUpdate(
            _id,
            body,
            { new: true });
        res.json(notaDb);
    } catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrio un error',
            error
        })
    }
});


// Exportamos la configuración de express app
module.exports = router;
