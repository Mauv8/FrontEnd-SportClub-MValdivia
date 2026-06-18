// src/validators/sport.validator.js

function validateSportPayload(payload, options = {}) {
    const errors = {};
    const data = {};
    const isPartial = options.partial === true;

    if (!isPartial || payload.name !== undefined) {
        if (!payload.name || String(payload.name).trim().length < 3) {
            errors.name = 'El nombre del deporte es obligatorio y debe tener al menos 3 caracteres.';
        } else {
            data.name = String(payload.name).trim();
        }
    }

    if (!isPartial || payload.objective !== undefined) {
        if (!payload.objective || String(payload.objective).trim().length < 5) {
            errors.objective = 'El objetivo es obligatorio y debe tener al menos 5 caracteres.';
        } else {
            data.objective = String(payload.objective).trim();
        }
    }

    if (!isPartial || payload.duration !== undefined) {
        const duration = Number(payload.duration);

        if (!duration || Number.isNaN(duration) || duration < 1) {
            errors.duration = 'La duración debe ser un número mayor a 0.';
        } else {
            data.duration = duration;
        }
    }

    if (payload.status !== undefined) {
        if (typeof payload.status !== 'boolean') {
            errors.status = 'El estado debe ser verdadero o falso.';
        } else {
            data.status = payload.status;
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        data
    };
}

module.exports = {
    validateSportPayload
};