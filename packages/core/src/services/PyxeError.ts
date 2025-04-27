'use strict';

import type { ErrorFactory } from '@pyxe/types';
import { debug } from './Debug.js';

export class PyxeError extends Error {

    readonly header?: string;
    readonly time?: string;
    readonly method?: string;
    readonly fullMsg?: string;
    readonly msg?: string;
    readonly extra?: string;

    constructor (
        factory: ErrorFactory
    ) {

        const { method, msg, err } = factory;

        const time = ( new Date() ).toLocaleTimeString(
            'en-US', { hour12: false, timeStyle: 'medium' }
        );

        const extra = typeof err === 'string'
            ? err : err instanceof Error
                ? err.message : err != null
                    ? String ( err ) : undefined;

        const fullMsg = `${ ( msg ?? '' ) }${ ( extra ? `: ${extra}` : '' ) }`;
        const header = `${ time } [${ method.toUpperCase() }] ${ fullMsg }`;

        super( header );

        this.name = 'PyxeError';

        Object.assign( this, { header, time, method, fullMsg, msg, extra } );

    }

    public static fromError (
        method: string,
        err: unknown
    ) : PyxeError {

        return new PyxeError ( {
            err, method, msg: err instanceof Error
                ? err.message : String ( err )
        } );

    }

    private _getTrace () : string {

        return this.stack?.split( '\n' ).slice( 1 ).join( '\n' ) || '';

    }

    public toString (
        trace: boolean = true
    ) : string {

        return trace && this.stack
            ? `${ this.header }\n${ this._getTrace() }`
            : this.header || this.name;

    }

    public log () : void {

        debug.error( this.method ?? this.name, `${ this.fullMsg }\n${ this._getTrace() }`.trim() );

    }

    public warn () : void {

        debug.warn( this.method ?? this.name, this.msg! );

    }

    public info () : void {

        debug.info( this.method ?? this.name, this.msg! );

    }

}