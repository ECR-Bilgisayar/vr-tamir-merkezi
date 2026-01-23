import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Import routes
import serviceRoutes from './routes/serviceRoutes.js';
import rentalRoutes from './routes/rentalRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Import Supabase to test connection
import supabase from './config/supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - CORS ayarı güncellendi
app.use(cors({
  origin: [
    'http://localhost:5173', // Local development
    'http://localhost:5174', // Alternatif local port
    'https://vr-tamir-merkezi-five.vercel.app', // Vercel frontend
    'https://vrtamirmerkezi.com', // Özel domain
    'https://www.vrtamirmerkezi.com' // www ile de çalışsın
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}

// API Routes
app.use('/api/service-requests', serviceRoutes);
app.use('/api/rental-requests', rentalRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        // Test Supabase connection
        const { data, error } = await supabase.from('service_requests').select('count').limit(1);
        
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            database: error ? 'error' : 'connected',
            message: error ? error.message : 'Supabase bağlantısı aktif',
            environment: process.env.NODE_ENV || 'development'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Supabase connection failed',
            error: error.message
        });
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'VR Tamir Merkezi Backend API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            health: '/api/health',
            serviceRequests: '/api/service-requests',
            rentalRequests: '/api/rental-requests',
            admin: '/api/admin'
        }
    });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    // Serve frontend build
    app.use(express.static(path.join(__dirname, '../dist')));

    // Handle SPA routing - serve index.html for all non-API routes
    app.get('*', (req, res) => {
        // Don't serve index.html for API routes
        if (req.path.startsWith('/api')) {
            return res.status(404).json({ error: 'API endpoint not found' });
        }
        res.sendFile(path.join(__dirname, '../dist/index.html'));
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Sunucu hatası oluştu',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║     VR Tamir Merkezi Backend Server        ║
╠════════════════════════════════════════════╣
║  🚀 Server: http://localhost:${PORT}            ║
║  📦 API: http://localhost:${PORT}/api          ║
║  🔐 Admin: http://localhost:${PORT}/api/admin  ║
║  ✨ Database: Supabase                     ║
║  🌍 Environment: ${process.env.NODE_ENV || 'development'}       ║
╚════════════════════════════════════════════╝
  `);
});

export default app;