'use strict';

import type { DebugLevel, DebugTypes } from '@pyxe/types';

export class Debug {

    private level: DebugLevel = 'debug';

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
                this.enable();
                break;

            case false:
                this.disable();
                break;

            default:
                this.setLevel( enable as DebugLevel );
                break;

        }

    }

    private _canLog (
        mode: DebugTypes
    ) : boolean {

        return this.levelPriority[ this.level ] >= this.modePriority[ mode ];

    }

    public setLevel (
        level: DebugLevel
    ) {

        this.level = level in this.levelPriority ? level : 'debug';

        this.log( 'DEBUG', `Set debug mode to <${this.level}>` );

    }

    public enable () {

        this.setLevel( 'debug' );

    }

    public disable () {

        this.setLevel( 'silent' );

    }

    public error (
        msg: string,
        show: boolean = false
    ) {

        if ( this._canLog( 'error' ) || show ) {

            console.error( msg );

        }

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

}

export const debug = new Debug ();