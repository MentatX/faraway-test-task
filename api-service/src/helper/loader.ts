/**
 * Runs initialization of modules in series.
 *
 * @file loader.js
 * @author Oleg Kuzmenko
 */

/**
 * Init libraries.
 * @return {Promise<ILoaderStatus>} Resolve with init status.
 * @public
 */
export default async (): Promise<ILoaderStatus[]> => {
    let loads: ILoaderStatus[] = [];

    loads.push(await (await import('../libs/config.js')).init());
    loads.push(await (await import('../libs/ethereum.js')).init());

    return loads;
}