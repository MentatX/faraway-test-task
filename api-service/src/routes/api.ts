/**
 * API routes.
 *
 * @file api.js
 * @author Oleg Kuzmenko
 */

import { inspect } from 'util';

import express, { Request, Response } from 'express';

import ethereum from '../libs/ethereum.js';
import logger from '../utils/logger.js';

const log = logger(import.meta.url);

const router = express.Router();

enum Methods {
    GET_INFO = 'GET::info',
    GET_BALANCE = 'GET::balance',
    GET_EVENTS = 'GET::events'
}

enum Symbols {
    // ⮱ Request
    Q = '\u2BB1',
    // ⮰ Response
    R = '\u2BB0',
    // ⥃ Fallback
    F = '\u2943',
    // ⮎ Fallback
    FR = '\u2B8E',
}

/**
 * Define routes
 */
router.get('/ping', getPing);
router.post('/ping', postPing);

router.get('/info', getInfo);
router.get('/balance', getBalance);

router.get('/events', getEvents);


/**
 * GET Just ping-pong check
 *
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @return {void}
 * @public
 */
function getPing(req: Request, res: Response): void {
    res.status(200).json({ message: 'get-pong' });
}

/**
 * POST Just ping-pong check
 *
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @return {void}
 * @public
 */
function postPing(req: Request, res: Response): void {
    res.status(200).json({ message: 'post-pong' });
}

/**
 * GET Balance of address
 *
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @return {void}
 * @public
 */
async function getBalance(req: Request, res: Response): Promise<void> {
    const { query: { /* id, */ address } } = req;
    const context: IResponseContext = { req, res, method: Methods.GET_BALANCE };

    if (/* id === undefined ||  */address === undefined) {
        return sendResponse(new Error('[address] required'), 400, context);
    }

    try {
        let balance = await ethereum.balance(<string>address);
        return sendResponse(null, 200, context, { address, balance });
    } catch (err: any) {
        return sendResponse(err, 500, context);
    }
}

/**
 * GET Server info
 *
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @return {void}
 * @public
 */
async function getInfo(req: Request, res: Response): Promise<void> {
    // const { query: { id } } = req;
    const context: IResponseContext = { req, res, method: Methods.GET_INFO };

    try {
        let data = await ethereum.info();
        return sendResponse(null, 200, context, data);
    } catch (err: any) {
        return sendResponse(err, 500, context);
    }
}

/**
 * GET Raw events
 *
 * @param  {Request}  req Request object
 * @param  {Response} res Response object
 * @return {void}
 * @public
 */
async function getEvents(req: Request, res: Response): Promise<void> {
    const context: IResponseContext = { req, res, method: Methods.GET_EVENTS };

    try {
        let data = ethereum.getEvents();
        return sendResponse(null, 200, context, data);
    } catch (err: any) {
        return sendResponse(err, 500, context);
    }
}

/**
 * Send regular response
 *
 * @param  {Error|null}  error   Error object
 * @param  {Object}      context Response context
 * @param  {Object|null} data    Response body
 * @return {void}
 * @private
 */
function sendResponse(error: IError | null, status: number, context: IResponseContext, data?: IResponseData): void {
    let payload: IResponse = {
        apiVersion: process.env.npm_package_version,
        id: context.req.body.id || context.req.query.id,
        method: context.method,
    };

    // Comlex errors
    if (error?.error !== undefined) {
        error = error.error;
    }

    if (error != null) {
        payload.error = {
            status: status,
            message: error.message || error.reason || error.error
        }
    } else {
        payload.data = data;
    }

    // Log response
    if (error === null) {
        log.http(`${Symbols.R} [R:${payload.id ?? ''}:${payload.method}] ${inspect(data)}`);
    } else if (status === 400) {
        log.http(`${Symbols.R} [R:${payload.id ?? ''}:${payload.method}] ${inspect(payload.error)}`);
    } else {
        log.warn(`${Symbols.R} [R:${payload.id ?? ''}:${payload.method}] ${inspect(payload.error)}`);
    }

    context.res.status(status).json(payload);
}

export default router;
