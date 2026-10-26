import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './server/routes/auth';
import userRoutes from './server/routes/users';
import configRoutes from './server/routes/config';
import claimsRoutes from './server/routes/claims';
import payoutsRoutes from './server/routes/payouts';
import ledgerRoutes from './server/routes/ledger';
import auditRoutes from './server/routes/audit';
import { db } from './server/db';
import { authenticate } from './server/auth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT: number = parseInt(process.env.PORT || '3000', 10);

  // JSON request parser
  app.use(express.json({ limit: '15mb' }));

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/config', configRoutes);
  app.use('/api/claims', claimsRoutes);
  app.use('/api/payouts', payoutsRoutes);
  app.use('/api/ledger', ledgerRoutes);
  app.use('/api/audit', auditRoutes);

  // Stores route
  app.get('/api/stores', (req, res) => {
    return res.json({ stores: db.stores });
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    return res.json({
      status: 'healthy',
      platform: 'RetailPulse Loyalty CRM',
      version: 'v4.2.0',
      timestamp: new Date().toISOString()
    });
  });

  // Vite middleware in development mode
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[RetailPulse Server] Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[RetailPulse Server Startup Error]', err);
  process.exit(1);
});
