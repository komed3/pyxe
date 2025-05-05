'use strict';

import type { ColorInput, ColorObjectFactory, ColorSpaceName, TracerFactory } from '@pyxe/types';
import { Color } from '../classes/Color.js';
import { ColorObject } from '../classes/ColorObject.js';
import { hook } from './Hook.js';
import { debug } from './Debug.js';

export class Tracer {

    constructor (
        private state: boolean = !!process.env.TRACE
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
        input: any
    ) : void {

        if ( input instanceof ColorObject ) {

            input.deleteMeta( 'trace' );

        } else if ( input.meta?.trace ) {

            delete input.meta.trace;

        }

    }

    public add (
        color: ColorObject,
        entry: Partial<TracerFactory>,
        options: {
            flush?: boolean,
            clear?: boolean
        } = {}
    ) : void {

        if ( this.state ) {

            debug.log( 'Tracer', `Add color object tracer for action: <${entry.action}>` );

            if ( options.flush ) {

                this.flush( entry.meta?.input );
                this.flush( entry.meta?.result );

            }

            let trace = options.clear ? [] : this.get( color )!;

            trace.push( hook.filter( 'Tracer::entry', {
                ...entry, timestamp: new Date()
            }, color, this ) as TracerFactory );

            color.updateMeta( { trace } );

        }

    }

    public get (
        color: Color | ColorObject
    ) : TracerFactory[] {

        return color.getMeta( 'trace' ) ?? [];

    }

    public export (
        color: Color | ColorObject,
        options: {
            format?: 'json' | 'object';
            pretty?: boolean;
            limit?: number;
        } = {}
    ) : TracerFactory[] | string {

        const { format = 'object', pretty = false, limit = 0 } = options;

        const _walker: TracerFactory[] = hook.filter(
            'Tracer::export',
            this.get( color ).slice( -limit ).map(
                ( entry ) => ( { 
                    ...entry, 
                    meta: Object.fromEntries(
                        Object.entries( entry.meta ?? {} ).map(
                            ( [ key, value ] ) => [
                                key, value instanceof ColorObject
                                    ? ( this.flush( value ), value.toObject() )
                                    : value
                            ]
                        )
                    )
                } )
            ),
            color, options, this
        );

        return format === 'json' 
            ? JSON.stringify( _walker, null, pretty ? 2 : 0 ) 
            : _walker;

    }

}

export const tracer = new Tracer ();

export const tracerTemplates = {

    parse: (
        input: ColorInput,
        result: ColorObject | ColorObjectFactory
    ) : Partial<TracerFactory> => ( {
        action: 'parse',
        meta: {
            result, input,
            source: 'string',
            target: result.space
        }
    } ),

    library: (
        library: string,
        key: string,
        result: ColorObject | ColorObjectFactory
    ) : Partial<TracerFactory> => ( {
        action: 'library',
        meta: {
            result,
            source: { library, key }
        }
    } ),

    convert: (
        input: ColorObject | ColorObjectFactory,
        result: ColorObject | ColorObjectFactory,
        path?: ColorSpaceName[] | unknown
    ) : Partial<TracerFactory> => ( {
        action: 'convert',
        meta: {
            result, input,
            source: input.space,
            target: result.space,
            path: path ?? null
        }
    } ),

    module: (
        module: string,
        input: ColorObject | ColorObjectFactory,
        result: ColorObject | ColorObjectFactory
    ) : Partial<TracerFactory> => ( {
        action: `module::${ module.toLowerCase() }`,
        meta: {
            result, input
        }
    } )

};