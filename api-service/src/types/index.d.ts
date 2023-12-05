/**
 * Type definitions for API
 * Definitions by: Oleg Kuzmenko <oleg.kuzmenko@firstbridge.io>
 * TypeScript Version: 3.9.7
 */

/** Lib loader status */
interface ILoaderStatus {
    success: number;
    message: string;
}

/** API Routes response */
interface IResponse {
    apiVersion: string | undefined;
    id?: string;
    method?: string;
    data?: IResponseData;
    error?: IResponseError;
    // [identifier: string]: any;
}

/** API Routes response context */
interface IResponseContext {
    // req: Express.Request;
    // res: Response;
    // method: string;
    [identifier: string]: any;
}

/** API Routes response data */
interface IResponseData {
    [identifier: string]: any;
}

/** API Routes response error */
interface IResponseError {
    status: numbier;
    message: string;
    // [identifier: string]: any;
}

/** API Routes error */
interface IError extends Error {
    [identifier: string]: any;
}

/** API Send responce/fallback */
interface ISendFunction {
    (error: IError | null, status: number, context: IResponseContext, data?: IResponseData): void;
}

/** Contracts data */
interface IContractData {
    [identifier: string]: any;
}

/** Ethereum send transaction result */
interface ITransactionData {
    status: number;
    hash: string;
}