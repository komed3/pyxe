'use strict';

import type { ColorObjectFactory, ColorSpaceName, OutputFactory, OutputHandler, OutputOptions } from '@pyxe/types';
import { Entity } from './Entity.js';
import { outputRegistry } from '../registries/OutputRegistry.js';
import { assert, catchToError } from '../services/ErrorUtils.js';

export class Output extends Entity<ColorSpaceName, OutputFactory> {

    public static override registry = outputRegistry;

    private _resolve(
        type: string
    ) : OutputHandler | undefined {

        const visited: Set<string> = new Set ();

        while ( true ) {

            assert( ! visited.has( type ), {
                method: 'Output',
                msg: `Circular reference detected in output chain: ${ (
                    [ ...visited, type ].join( ' → ' )
                ) }`
            } );

            visited.add( type );

            const handler = this.supports().includes( type )
                ? this.factory[ type ] || this[ type as keyof this ]
                : undefined;

            assert( handler, {
                method: 'Output',
                msg: `Output handler <${type}> is not declared`
            } );

            if ( typeof handler === 'function' ) {

                return handler as OutputHandler;

            }

            type = handler as string;

        }

    }

    public format (
        type: string,
        input: ColorObjectFactory,
        options?: OutputOptions,
        safe: boolean = true
    ) : any {

        return catchToError( () => {

            return this._resolve( type )!( input, options );

        }, {
            method: 'Output',
            msg: `Failed to execute output handler <${type}>`
        }, safe );

    }

    public string (
        input: ColorObjectFactory,
        options?: OutputOptions
    ) : string {

        return '';

    }

    public cli (
        input: ColorObjectFactory,
        options?: OutputOptions
    ) : string {

        return '';

    }

    public json (
        input: ColorObjectFactory,
        options?: OutputOptions
    ) : any {

        return {};

    }

    public supports () : string[] {

        return [
            ...[ 'string', 'cli', 'json' ],
            ...Object.keys( this.factory )
        ];

    }

}