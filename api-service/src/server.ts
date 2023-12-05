#!/usr/bin/env node

/**
 * Server - application entry point.
 *
 * @file server.js
 * @author Oleg Kuzmenko
 */

import http from 'http';
import app from './app.js';

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

// app.set('port', normalizePort(process.env.PORT || '3000'));

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Error Handler. Provides full stack - remove for production
 */
// app.use(errorHandler());

/**
 * Start Express server.
 */
server.listen(port, () => {
    if ( app.get('env') !== 'production') {
        console.log(`  Server is running at ${JSON.stringify(server.address())}\n  Press CTRL-C to stop\n`);
    }
});

export default server;