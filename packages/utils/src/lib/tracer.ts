'use strict';

import { ColorInput, ColorObject, TracerFactory } from '@pyxe/types';

export class Tracer {

    constructor (
        private enabled: boolean = false
    ) {}

    _trace (
        obj: ColorObject,
        entry: Partial<TracerFactory>
    ) : void {

        if ( this.enabled ) {

            obj.meta || ( obj.meta = {} );
            obj.meta.trace || ( obj.meta.trace = [] );

            obj.meta.trace.push( {
                ...entry,
                timestamp: Date.now()
            } );

        }

    }

    set (
        enable: boolean
    ) : void {

        this.enabled = enable;

    }

    on () : boolean {

        return this.enabled;

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
            from: 'string',
            to: result.space
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
            from: input.space,
            to: input.space,
            via: path ?? 'direct'
        }
    } ),

    module: (
        module: string,
        input: ColorObject,
        result: ColorObject
    ) : Partial<TracerFactory> => ( {
        action: `module:${module.toLowerCase()}`,
        meta: {
            input, result
        }
    } )

};