/**
 * Log routines
 * @see https://www.npmjs.com/package/morgan
 *
 * @file logger.js
 * @author Oleg Kuzmenko <oleg.kuzmenko@firstbridge.io>
 */

import winston from 'winston';
import DayilyRotateFile from 'winston-daily-rotate-file';

const { createLogger, format, transports } = winston;

// eslint-disable-next-line
const customFormat = format.printf((info) => {
    return `${info.level}: ${info.timestamp} [${info.label}] ${info.message}`;
});

export default (path: string) => {
    let modulePath = path.split('/').slice(-2).join('/');
    modulePath = modulePath.substr(0, modulePath.length - 3);

    const logger = createLogger({
        format: format.combine(
            format.label({ label: modulePath }),
            format.timestamp({
                format: 'DD-MM-YYYY HH:mm:ss.SSSS',
            }),
            customFormat,
            // format.json(),
        ),
        transports: [
            new DayilyRotateFile({
                handleExceptions: true,
                level: 'error',
                auditFile: './logs/error-audit.json',
                filename: './logs/error-%DATE%',
                datePattern: 'DD-MM-YYYY',
                utc: !true,
                extension: '.log',
                // zippedArchive: true,
                maxSize: process.env.NODE_ENV === 'production' ? '100m' : '100k',
                maxFiles: '2',
                createSymlink: true,
                symlinkName: 'error.log',
            }),
            new DayilyRotateFile({
                handleExceptions: true,
                level:  process.env.NODE_ENV === 'production' ? 'http' : 'silly',
                auditFile: './logs/info-audit.json',
                filename: './logs/info-%DATE%',
                datePattern: 'DD-MM-YYYY',
                utc: !true,
                extension: '.log',
                // zippedArchive: true,
                maxSize: process.env.NODE_ENV === 'production' ? '100m' : '100k',
                maxFiles: '2',
                createSymlink: true,
                symlinkName: 'info.log',
            }),
        ],
    });

    // If we're not in production then log to the `console` with the custom format:
    if (process.env.NODE_ENV === 'development') {
        logger.add(new transports.Console({
            level: 'silly',
            handleExceptions: true,
            format: format.combine(
                format.colorize(),
                format.label({ label: modulePath }),
                format.timestamp({
                    format: 'HH:mm:ss.SSSS',
                }),
                customFormat,
            ),
        }));
    }

    return logger;
}