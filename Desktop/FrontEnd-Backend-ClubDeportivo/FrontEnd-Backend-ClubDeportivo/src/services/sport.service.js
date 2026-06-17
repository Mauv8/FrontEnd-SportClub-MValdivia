// src/services/sport.service.js

const sportRepository = require('../repositories/sport.repository');

async function listSports(filters = {}) {
    return sportRepository.findAll(filters);
}

async function getSportById(id) {
    const sport = await sportRepository.findById(id);

    if (!sport) {
        const error = new Error('Deporte no encontrado.');
        error.statusCode = 404;
        throw error;
    }

    return sport;
}

async function createSport(payload) {
    const existingSport = await sportRepository.findByName(payload.name);

    if (existingSport) {
        const error = new Error('Ya existe un deporte con ese nombre.');
        error.statusCode = 409;
        throw error;
    }

    return sportRepository.create(payload);
}

async function updateSport(id, payload) {
    const currentSport = await sportRepository.findById(id);

    if (!currentSport) {
        const error = new Error('Deporte no encontrado.');
        error.statusCode = 404;
        throw error;
    }

    if (payload.name && payload.name !== currentSport.name) {
        const existingSport = await sportRepository.findByName(payload.name);

        if (existingSport) {
            const error = new Error('Ya existe un deporte con ese nombre.');
            error.statusCode = 409;
            throw error;
        }
    }

    return sportRepository.updateById(id, payload);
}

async function deleteSport(id) {
    const deleted = await sportRepository.deleteById(id);

    if (!deleted) {
        const error = new Error('Deporte no encontrado.');
        error.statusCode = 404;
        throw error;
    }

    return true;
}

async function changeSportStatus(id, status) {
    const currentSport = await sportRepository.findById(id);

    if (!currentSport) {
        const error = new Error('Deporte no encontrado.');
        error.statusCode = 404;
        throw error;
    }

    return sportRepository.updateById(id, { status });
}

module.exports = {
    listSports,
    getSportById,
    createSport,
    updateSport,
    deleteSport,
    changeSportStatus
};