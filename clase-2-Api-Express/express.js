import express from 'express';
import usersRoutes from './users/routes/user.routes.js';

const app = express();

app.use(express.json());
app.use('/users', usersRoutes);

export default app;