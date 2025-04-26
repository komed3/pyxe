'use strict';

import { tracer } from './Tracer.js';

export class Debug {

    readonly state: boolean;

    constructor (
        enable?: boolean
    ) {

        this.state = enable ?? !!process.env.DEBUG;

        if ( this.state ) {

            this.log( 'DEBUG', `debug mode <enabled>` );

            this.enableTracer();

        }

    }

    public log (
        method: string,
        msg: string,
        show: boolean = false,
        mode?: 'debug' | 'info' | 'warn' | 'log' | 'error'
    ) : void {

        if ( this.state || show ) {

            console[ mode ?? 'debug' ]( `${ ( new Date() ).toLocaleTimeString(
                'en-US', { hour12: false, timeStyle: 'medium' }
            ) } [PYXE ${ method.trim().toUpperCase() }] ${ msg.trim() }` );

        }

    }

    public info (
        method: string,
        msg: string,
        show: boolean = false
    ) : void {

        this.log( method, msg, show, 'info' );

    }

    public warn (
        method: string,
        msg: string,
        show: boolean = false
    ) : void {

        this.log( method, msg, show, 'warn' );

    }

    public enableTracer () : void {

        tracer.enable();

        if ( tracer.isReady() ) {

            this.log( 'DEBUG', `color object tracer <enabled>` );

        }

    }

    public disableTracer () : void {

        tracer.disable();

        if ( ! tracer.isReady() ) {

            this.log( 'DEBUG', `color object tracer <disabled>` );

        }

    }

}

export const debug = new Debug ();