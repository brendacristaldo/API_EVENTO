const { Router } = require('express');
const userRoutes = require('./user.routes');
const eventRoutes = require('./event.routes');
const guestRoutes = require('./guest.routes');

const routes = Router();

routes.use('/users', userRoutes);
routes.use('/events', eventRoutes);
routes.use('/guests', guestRoutes);

module.exports = routes;