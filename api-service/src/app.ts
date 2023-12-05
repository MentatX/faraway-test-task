/**
 * Application.
 *
 * @file app.js
 * @author Oleg Kuzmenko
 */

import { inspect } from 'util';

import rfs from 'rotating-file-stream'
import morgan from 'morgan';
import bodyParser from "body-parser";
import express, { Request, Response, Application, NextFunction } from 'express';

import loader from './helper/loader.js';
import logger from './utils/logger.js';

const log = logger(import.meta.url);

/**
 * Create and configure Express server
 */

const app: Application = express();

/** Application is not ready to use (for tests) */
app.set('ready', false);

/**
 * bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

/**
 * bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Write HTTP logs to the file
 * @see {@link https://github.com/expressjs/morgan#log-file-rotation|LogRotation}
 */
let stream = rfs.createStream((date, index) => {
    if (index === undefined) {
        return 'access.log';
    }

    // const HH = (<Date>date).getHours();
    const DD = ((<Date>date).getDate()).toString().padStart(2, '0');
    const MM = ((<Date>date).getMonth() + 1).toString().padStart(2, '0');
    const YYYY = (<Date>date).getFullYear();

    return `access-${DD}-${MM}-${YYYY}.${index}.log`;
}, {
    history: "access-history",
    // maxSize: '1G',
    maxFiles: 1,
    size: process.env.NODE_ENV === 'production' ? '100M' : '100K',
    teeToStdout: process.env.NODE_ENV === 'development',
    // teeToStdout: process.env.NODE_ENV !== 'production',
    path: 'logs',
}).on('error', (err) => {
    log.error(`Create scream: ${inspect(err)}`);
}).on('warning', (warn) => {
    log.warn(`Create scream: ${inspect(warn)}`);
});

app.use(morgan('[:date[clf]] :method :url :status :res[content-length] - :response-time ms / :total-time ms [:user-agent] [:remote-addr] [:remote-user]', {
    stream: stream
}));


(async () => {
    try {
        let loads: ILoaderStatus[] = await loader();
        log.info(`Modules are loaded: ${inspect(loads)}`);
        log.info(`[Node ${process.version}] [API v.${process.env.npm_package_version}] started [${process.env.NODE_ENV}] on port [${process.env.PORT}]`);
        // Primary app routes
        const apiRouter = (await import('./routes/api.js')).default;
        app.use('/api', apiRouter);

        // Error handlers
        app.use((req: Request, res: Response, next: NextFunction) => {
            console.log(`===================== App 404 Error Handler ===========================`);
            let payload: IResponse = {
                apiVersion: process.env.npm_package_version,
                error: {
                    status: 404,
                    message: 'Not Found'
                }
            };
            res.status(404).json(payload);
        });

        app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
            console.log(`===================== App Error Handler ===============================`);
            console.log(error);
            // process.exit(1);
        });

        app.set('ready', true);

    } catch (error) {
        console.log(`===================== App Load Error Handler ===========================`);
        log.error(inspect(error));
        // process.exit(1);
    }
})();

process.on("uncaughtException", e => {
    console.log(`===================== uncaughtException ===============================`);
    console.log(e);
    // process.exit(1);
});

process.on("unhandledRejection", e => {
    console.log(`===================== unhandledRejection ==============================`);
    console.log(e);
    // process.exit(1);
});

export default app;