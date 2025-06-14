require('dotenv').config(); // Load environment variables
const { app, server, io, PORT } = require('./config/server');
const { initializeWhatsAppClient } = require('./services/whatsapp');
const { loadAIConfigFromDB } = require('./services/aiResponse');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');
const logger = require('./utils/logger');

async function startServer() {
  try {
    // Middleware for parsing JSON and CORS are already configured in config/server.js
    // app.use(express.json());
    // app.use(cors(...));

    // Mount the main router
    app.use('/api', routes);

    // Apply the error handling middleware
    app.use(errorHandler);

    // Initialiser le client WhatsApp seulement si pas dans Docker
    if (process.env.DOCKER_ENV !== 'true') {
      try {
        await initializeWhatsAppClient(io);
      } catch (error) {
        logger.error('Failed to initialize WhatsApp client:', error);
        logger.info('Server will continue without WhatsApp - use /api/whatsapp/initialize to retry');
      }
    } else {
      logger.info('Docker environment detected - WhatsApp client will be initialized manually via API');
    }

    // Charger la configuration AI depuis la base de données
    await loadAIConfigFromDB();

    // Démarrer le serveur
    server.listen(PORT, '0.0.0.0', () => {
      logger.info(`Server started on http://localhost:${PORT}`);
      logger.info(`WebSocket available on ws://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
