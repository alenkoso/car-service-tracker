import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { initializeDatabase } from './db/init.js';
import { auth } from './routes/auth/auth.middleware.js';
import authRoutes from './routes/auth/auth.routes.js';
import vehicleRoutes from './routes/vehicles.js';
import serviceRoutes from './routes/services.js';
import exportRoutes from './routes/exports.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet({
    crossOriginResourcePolicy: false // Allow PDF to be downloaded in modern browsers
}));
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);           // Auth routes don't need auth middleware
app.use('/api/vehicles', auth, vehicleRoutes);     // Protected routes
app.use('/api/services', auth, serviceRoutes);     // Protected routes
app.use('/api/exports', auth, exportRoutes);       // Protected routes

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Initialize database and start server
initializeDatabase()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('Failed to initialize database:', error);
        process.exit(1);
    });