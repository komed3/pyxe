'use strict';

import type { ColorInput, TracerFactory } from '@pyxe/types';
import { ColorObject } from '@pyxe/core';

export class Tracer {

    constructor (
        private state: boolean = false
    ) {}

    public enable () : void {

        this.state = true;

    }

    public disable () : void {

        this.state = false;

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

            let trace = this.get( color )!;

            if ( flush ) {

                trace = [];

            }

            trace.push( {
                ...entry, timestamp: new Date()
            } as TracerFactory );

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
        path?: string[] | unknown
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