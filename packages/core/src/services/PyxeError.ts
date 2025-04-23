'use strict';

import type { ErrorFactory } from '@pyxe/types';
import { debug } from './Debug.js';

export class PyxeError extends Error {

    readonly header: string;
    readonly timestamp: string;
    readonly method: string;
    readonly msg?: string;
    readonly extra?: string;

    constructor (
        factory: ErrorFactory
    ) {

        const { method, msg, err } = factory;

        const time = ( new Date() ).toLocaleTimeString(
            'en-US', { hour12: false, timeStyle: 'medium' }
        );

        const extra = err
            ? ( err instanceof Error
                ? err.message
                : String ( err )
            )
            : undefined;

        const header = `${time} [${ method.toUpperCase() }] ${ msg ?? '' }` +
                       `${ ( extra ? `: ${extra}` : '' ) }`;

        super( header );

        this.name = 'PyxeError';

        this.header = header;
        this.timestamp = time;
        this.method = method;
        this.msg = msg;
        this.extra = extra;

    }

    public toString (
        trace: boolean = true
    ) : string {

        if ( trace ) {

            return `${this.header}\n${
                this.stack?.split( '\n' ).slice( 1 ).join( '\n' ) ?? ''
            }`;

        }

        return this.header;

    }

    public log (
        trace: boolean = true
    ) : void {

        debug.log( this.method, this.msg! );

        console.error( this.toString( trace ) );

    }

    public warn (
        trace: boolean = false
    ) : void {

        debug.warn( this.method, this.msg! );

        console.warn( this.toString( trace ) );

    }

    public info (
        trace: boolean = false
    ) : void {

        debug.info( this.method, this.msg! );

        console.info( this.toString( trace ) );

    }

}