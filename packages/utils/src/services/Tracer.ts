'use strict';

import { ColorInput, ColorObjectFactory, TracerFactory } from '@pyxe/types';

export class Tracer {

    constructor (
        private state: boolean = false
    ) {}

    public isReady () : boolean {

        return this.state;

    }

    public enable () : void {

        this.state = true;

    }

    public disable () : void {

        this.state = false;

    }

    public add (
        input: ColorObjectFactory,
        entry: Partial<TracerFactory>,
        flush: boolean = false
    ) : void {

        if ( this.isReady() ) {

            input.meta || ( input.meta = {} );
            input.meta.trace || ( input.meta.trace = [] );

            if ( flush && entry.meta?.input ) {

                this.flush( entry.meta.input as ColorObjectFactory );

            }

            input.meta.trace.push( {
                ...entry,
                timestamp: new Date()
            } );

        }

    }

    public flush (
        input: ColorObjectFactory
    ) : void {

        if ( input.meta?.trace ) {

            input.meta.trace = [];

        }

    }

}

export const tracer = new Tracer ();

export const tracerTemplates = {

    parse: (
        input: ColorInput,
        result: ColorObjectFactory
    ) : Partial<TracerFactory> => ( {
        action: 'parse',
        meta: {
            input, result,
            source: 'string',
            target: result.space
        }
    } ),

    convert: (
        input: ColorObjectFactory,
        result: ColorObjectFactory,
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

    method: (
        key: string,
        input: ColorObjectFactory,
        result: ColorObjectFactory
    ) : Partial<TracerFactory> => ( {
        action: key,
        meta: {
            input, result
        }
    } )

};