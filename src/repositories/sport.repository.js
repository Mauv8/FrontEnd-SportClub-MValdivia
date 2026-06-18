// src/repositories/sport.repository.js

const { Sport } = require("../models");
// src/repositories/sport.repository.js

async function findAll(filters = {}) {
    const where = {};

    if (filters.status !== undefined) {
        where.status = filters.status === 'true' || filters.status === true;
    }

    return Sport.findAll({
        where,
        order: [['created_at', 'DESC']]
    });
}

async function findById(id) {
    return Sport.findByPk(id);
}

async function findByName(name) {
    return Sport.findOne({
        where: {
            name
        }
    });
}

async function create(payload) {
    return Sport.create(payload);
}

async function updateById(id, payload) {
    const sport = await Sport.findByPk(id);

    if (!sport) {
        return null;
    }

    await sport.update(payload);

    return sport;
}

async function deleteById(id) {
    const deletedRows = await Sport.destroy({
        where: {
            id
        }
    });

    return deletedRows > 0;
}

module.exports = {
    findAll,
    findById,
    findByName,
    create,
    updateById,
    deleteById
};