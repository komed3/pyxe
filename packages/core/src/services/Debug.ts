'use strict';

import type { DebugLevel, DebugTypes } from '@pyxe/types';
import { tracer } from './Tracer.js';

export class Debug {

    readonly level: DebugLevel;

    private levelPriority = {
        silent: 0, error: 1, warn: 2,
        info: 3, debug: 4, all: 5
    };
    
    private modePriority = {
        error: 1, warn: 2, info: 3,
        debug: 4, log: 5
    };

    constructor (
        enable?: boolean | DebugLevel
    ) {

        switch ( enable ?? !!process.env.DEBUG ) {

            case true:
                this.level = 'debug';
                break;

            case false:
                this.level = 'silent';
                break;

            default:
                this.level = enable as DebugLevel;
                break;

        }

        if ( this.level !== 'silent' ) {

            this.log( 'DEBUG', `debug mode <enabled> (level: ${this.level})` );

            this.enableTracer();

        }

    }

    private _canLog (
        mode: DebugTypes
    ) : boolean {

        return this.levelPriority[ this.level ] >= this.modePriority[ mode ];

    }

    public log (
        method: string,
        msg: string,
        show: boolean = false,
        mode: DebugTypes = 'debug'
    ) : void {

        if ( this._canLog( mode ) || show ) {

            ( console[ mode ] ?? console.debug )( `${ ( new Date() ).toLocaleTimeString(
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