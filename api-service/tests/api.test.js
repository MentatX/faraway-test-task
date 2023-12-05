import http from 'http';
import EventEmitter from 'events';

import ora from 'ora';
import supertest from 'supertest';

import app from '../dist/app.js';
import config from '../dist/libs/config.js';

const ADDRESS = config.get('operator:address');
const PATH = '/api';
const HASH = '0x04e89ab28b328b66b706fc1b028d53328ea9e8918af62eaf3726d017331e02be';

const FALLBACK_PORT = '7007'
const FALLBACK_URL = `http://localhost:${FALLBACK_PORT}/fallback`;

// const URI = `http://localhost:${process.env.PORT}`;

const spinner = ora();

const request = supertest(app);
const emitter = new EventEmitter();

let server;

// Test fallback route
app.post('/fallback', (req, res) => {
    spinner.stop();
    emitter.emit("fallback", req.body);

    /* res.on("finish", (data) => {
        console.log(data);
    }); */

    res.status(200).json({ success: 1 });
});

/**
 * NOTE: Before first test waiting for API server is ready
 */
describe('GET /ping', () => {
    beforeAll(async (done) => {
        let message = 'Waiting for API server is up';
        spinner.start(message);

        let count = 0;
        while (true) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            count ++;
            spinner.text = `${message} (${count} sec)`;

            if (app.get('ready')) {
                break;
            }
        }
        // await new Promise(resolve => setTimeout(resolve, 5000));
        spinner.info(`API server is ready after ${count} sec(s)`);

        done();
    });

    it('should return 200 OK', async (done) => {
        request
            .get(`${PATH}/ping`)
            .expect('Content-Type', /json/)
            .expect(200, { message: 'get-pong' })
            .end((err, res) => {
                done();
            });
    });
});

describe('POST /ping', () => {
    it('should return 200 OK', async (done) => {
        const res = await request
            .post(`${PATH}/ping`)
            .expect('Content-Type', /json/)
            .expect(200, { message: 'post-pong' });
            /* .end((err, res) => {
                // console.log(res);
                done();
            }); */
        done();
    });
});

describe('GET /info', () => {
    it('should return 200 OK', async (done) => {
        const res = await request
            .get(`${PATH}/info`)
            .expect('Content-Type', /json/);
            // .expect(200);

        expect(res.status).toBe(200);

        expect(res.body).toHaveProperty('apiVersion');
        expect(res.body).toHaveProperty('method', 'GET::info');
        expect(res.body).toHaveProperty('data.operator.address');
        expect(res.body).toHaveProperty('data.operator.balance');
        expect(res.body).toHaveProperty('data.contract');

        done();
    });
});

describe('GET /balance', () => {
    it('should return 200 OK', async (done) => {
        const res = await request
            .get(`${PATH}/balance`)
            .query(`address=${ADDRESS}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/);
            // .expect(200);

        expect(res.status).toBe(200);

        expect(res.body).toHaveProperty('apiVersion');
        expect(res.body).toHaveProperty('method', 'GET::balance');
        expect(res.body).toHaveProperty('data.address', ADDRESS);
        expect(Number.parseFloat(res.body.data.balance)).not.toBeNaN();;

        done();
    });

    it('should return 400 without address', async (done) => {
        const res = await request
            .get(`${PATH}/balance`)
            // .query(`address=${ADDRESS}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/);
            // .expect(400);

        expect(res.status).toBe(400);

        expect(res.body).toHaveProperty('apiVersion');
        expect(res.body).toHaveProperty('method', 'GET::balance');
        expect(res.body.error).toHaveProperty('status', 400);
        expect(res.body.error).toHaveProperty('message', '[address] required');

        done();
    });

    it('should return 500 with invalid address', async (done) => {
        const res = await request
            .get(`${PATH}/balance`)
            .query(`address=${'0x'}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/);

        expect(res.status).toBe(500);

        expect(res.body).toHaveProperty('apiVersion');
        expect(res.body).toHaveProperty('method', 'GET::balance');
        expect(res.body.error).toHaveProperty('status', 500);
        expect(res.body.error.message).toContain('invalid address');

        done();
    });

    it('should return 500 with invalid ENS name', async (done) => {
        const res = await request
            .get(`${PATH}/balance`)
            .query(`address=${ADDRESS + 'x'}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/);

        expect(res.status).toBe(500);

        expect(res.body).toHaveProperty('apiVersion');
        expect(res.body).toHaveProperty('method', 'GET::balance');
        expect(res.body.error).toHaveProperty('status', 500);
        expect(res.body.error.message).toContain('ENS name not configured');

        done();
    });
});