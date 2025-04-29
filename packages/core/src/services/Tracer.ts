'use strict';

import type { ColorInput, ColorObjectFactory, ColorSpaceName, TracerFactory } from '@pyxe/types';
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
        input: any
    ) : void {

        if ( input instanceof ColorObject ) {

            input.updateMeta( { trace: [] } );

        } else if ( input?.trace ) {

            input.trace = [];

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
        color: ColorObject
    ) : TracerFactory[] {

        return color.getMeta( 'trace' ) ?? [];

    }

    public export (
        color: ColorObject,
        options: {
            format?: 'json' | 'object';
            pretty?: boolean;
            limit?: number;
        } = {}
    ) : string | TracerFactory[] {

        const trace: TracerFactory[] = hook.filter(
            'Tracer::export',
            this.get( color )
                .slice( -( options.limit ?? 0 ) )
                .map( ( entry ) => {

                    entry.meta ??= {};

                    [ 'input', 'result' ].forEach( ( key ) => {

                        if ( entry.meta![ key ] instanceof ColorObject ) {

                            entry.meta![ key ] = entry.meta![ key ].toObject();

                        }

                    } );

                    this.flush( entry.meta?.input );
                    this.flush( entry.meta?.result );

                    return entry;

                } ),
            color,
            options,
            this
        );

        switch ( options?.format ) {

            case 'json':
                return JSON.stringify( trace, null, options?.pretty ? 2 : 0 );

            default:
                return trace;

        }

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
            input, result,
            source: 'string',
            target: result.space
        }
    } ),

    convert: (
        input: ColorObject | ColorObjectFactory,
        result: ColorObject | ColorObjectFactory,
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
        input: ColorObject | ColorObjectFactory,
        result: ColorObject | ColorObjectFactory
    ) : Partial<TracerFactory> => ( {
        action: `module::${ module.toLowerCase() }`,
        meta: {
            input, result
        }
    } )

};