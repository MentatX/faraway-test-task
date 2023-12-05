/**
 * Load configuration files
 * @see https://www.npmjs.com/package/nconf
 *
 * @file config.js
 * @author Oleg Kuzmenko
 */

import nconf from 'nconf';

const FOLDER = process.env.NODE_ENV;

/**
 * Init Config library.
 * @return {Promise<ILoaderStatus>} Resolve with init status.
 * @public
 */
export async function init(): Promise<ILoaderStatus> {
    nconf
        .argv()
        .env()
        .file('common-file', { file: `config/${FOLDER}/config.json` })
        .file('secret-file', { file: `config/${FOLDER}/secret.json` })
        .required([
            'contracts',
            'auth-jwt-secret',
            'provider-uri'
        ]);

    return { success: 1, message: 'Config OK' };
}

export default nconf;