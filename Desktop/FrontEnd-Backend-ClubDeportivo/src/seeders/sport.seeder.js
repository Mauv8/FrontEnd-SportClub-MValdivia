// src/seeders/sport.seeder.js

const { Sport } = require('../models');

async function seedSports() {
    const count = await Sport.count();

    if (count > 0) {
        console.log('Sports already seeded.');
        return;
    }

    await Sport.bulkCreate([
        {
            name: 'CrossFit',
            objective: 'Mejorar fuerza, resistencia y condición física general.',
            duration: 60,
            status: true
        },
        {
            name: 'Yoga',
            objective: 'Mejorar flexibilidad, equilibrio y bienestar mental.',
            duration: 45,
            status: true
        },
        {
            name: 'Spinning',
            objective: 'Aumentar la resistencia cardiovascular mediante ciclismo indoor.',
            duration: 50,
            status: true
        },
        {
            name: 'Entrenamiento Funcional',
            objective: 'Desarrollar movimientos funcionales para las actividades diarias.',
            duration: 60,
            status: true
        },
        {
            name: 'Pilates',
            objective: 'Fortalecer la zona media y mejorar la postura corporal.',
            duration: 45,
            status: true
        },
        {
            name: 'Boxeo',
            objective: 'Mejorar coordinación, resistencia y habilidades de defensa personal.',
            duration: 60,
            status: false
        }
    ]);

    console.log('Sports seeded successfully.');
}

module.exports = { seedSports };