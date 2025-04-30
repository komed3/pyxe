'use strict';

import { ColorObjectFactory, ColorSpaceName, OutputFactory, OutputHandler } from '@pyxe/types';
import { Entity } from './Entity.js';
import { outputRegistry } from '../registries/OutputRegistry.js';
import { assert, catchToError } from '../services/ErrorUtils.js';

export class Output extends Entity<ColorSpaceName, OutputFactory> {

    public static override registry = outputRegistry;

    private _handler(
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

            const handler = this.factory[ type ] || this[ type as keyof this ];

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
        options?: Record<string, any>,
        safe: boolean = true
    ) : any {

        return catchToError( () => {

            return this._handler( type )!( input, options );

        }, {
            method: 'Output',
            msg: `Failed to execute output handler <${type}>`
        }, safe );

    }

    public string (
        input: ColorObjectFactory,
        options?: Record<string, any>
    ) : string {

        return '';

    }

    public cli (
        input: ColorObjectFactory,
        options?: Record<string, any>
    ) : string {

        return '';

    }

    public json (
        input: ColorObjectFactory,
        options?: Record<string, any>
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