const express = require('express');
const salaController = require('../controllers/salaController');

const salaRouter = express.Router();

salaRouter.post('/add-sala', salaController.addSala);
salaRouter.get('/get-sala/:id', salaController.getSala);
salaRouter.get('/get-all-salas', salaController.getAllSalas);
salaRouter.get('/get-edificio-salas/:eid', salaController.getSalasOfEdificio);
salaRouter.put('/update-sala/:id', salaController.updateSala);
salaRouter.delete('/delete-sala/:id', salaController.deleteSala);
salaRouter.put('/solve-sala/:id', salaController.solveSala);

module.exports = salaRouter;
