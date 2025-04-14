'use strict';

import { ErrorHandlerFactory } from '@pyxe/types';

export class ErrorHandler {

    static _factory (
        err: ErrorHandlerFactory
    ) : string {

        return `${
            ( new Date() ).toLocaleTimeString( 'en-US', {
                hour12: false, timeStyle: 'medium'
            } )
        } [${ err.method.toUpperCase() }] ${ ( err.msg ?? `` ) }${
            err.err ? `: ${ err.err instanceof Error
                ? err.err.message : String( err )
            }` : ``
        }`;

    }

    static get (
        err: ErrorHandlerFactory
    ) : string {

        return this._factory( err );

    }

    static log (
        err: ErrorHandlerFactory
    ) : void {

        console.log( this._factory( err ) );

    }

    static throw (
        err: ErrorHandlerFactory
    ) : void {

        throw new Error ( this._factory( err ) );

    }

}