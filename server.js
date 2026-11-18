import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import feedRouter from './server/routes/feed.js';
import swipeRouter from './server/routes/swipe.js';
import matchesRouter from './server/routes/matches.js';
import { handlePostReset } from './server/controllers/discoverController.js';
import { ensureDatabaseInitialized } from './server/services/dbService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  await ensureDatabaseInitialized();

  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Primary API routes
  app.use('/api/feed', feedRouter);
  app.use('/api/swipe', swipeRouter);
  app.use('/api/matches', matchesRouter);
  app.post('/api/reset', handlePostReset);

  // Root-level REST aliases
  app.use('/feed', feedRouter);
  app.use('/swipe', swipeRouter);
  app.use('/matches', matchesRouter);

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Coy Discover server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
