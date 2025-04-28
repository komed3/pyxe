'use strict';

import type { ColorInput, ColorSpaceName, TracerFactory } from '@pyxe/types';
import { ColorObject } from '../classes/ColorObject.js';
import { hook } from './Hook.js';
import { debug } from './Debug.js';

export class Tracer {

    constructor (
        private state: boolean = false
    ) {}

    public enable () : void {

        this.state = true;

        debug.log( 'Tracer', `Color object tracer <enabled>` );

    }

    public disable () : void {

        this.state = false;

        debug.log( 'Tracer', `Color object tracer <disabled>` );

    }

    public isReady () : boolean {

        return this.state;

    }

    public flush (
        color: ColorObject
    ) : void {

        color.updateMeta( { trace: [] } );

    }

    public add (
        color: ColorObject,
        entry: Partial<TracerFactory>,
        flush: boolean = false
    ) : void {

        if ( this.state ) {

            debug.log( 'Tracer', `Add color object tracer <${ JSON.stringify( entry ) }>` );

            let trace = this.get( color )!;

            if ( flush ) {

                trace = [];

            }

            trace.push( hook.filter( 'Tracer::entry', {
                ...entry, timestamp: new Date()
            }, color, this ) as TracerFactory );

            color.updateMeta( { trace } );

        }

    }

    public get (
        color: ColorObject
    ) : TracerFactory[] | undefined {

        return color.getMeta( 'trace' ) ?? [];

    }

}

export const tracer = new Tracer ();

export const tracerTemplates = {

    parse: (
        input: ColorInput,
        result: ColorObject
    ) : Partial<TracerFactory> => ( {
        action: 'parse',
        meta: {
            input, result,
            source: 'string',
            target: result.space
        }
    } ),

    convert: (
        input: ColorObject,
        result: ColorObject,
        path?: ColorSpaceName[] | unknown
    ) : Partial<TracerFactory> => ( {
        action: 'convert',
        meta: {
            input, result,
            source: input.space,
            target: result.space,
            path: path ?? null
        }
    } ),

    module: (
        module: string,
        input: ColorObject,
        result: ColorObject
    ) : Partial<TracerFactory> => ( {
        action: `module::${ module.toLowerCase() }`,
        meta: {
            input, result
        }
    } )

};