import { Router } from 'express';

// Controllers

// Middleware
// isAuthenticated
// isAdmin ?
// can ?

const routes = new Router();

routes.get('/', (req, res) => res.json({ message: 'Hello World' }));

export default routes;
