import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import shipmentsRoutes from './routes/shipments';
import syncRoutes from './routes/sync';
import { initDb } from './db';

const app = express();
app.use(cors());
app.use(express.json());

initDb().then(() => console.log('DB initialized')).catch(console.error);

app.use('/api/auth', authRoutes);
app.use('/api/shipments', shipmentsRoutes);
app.use('/api/sync', syncRoutes);

app.get('/', (req, res) => res.json({ ok: true }));

export default app;
