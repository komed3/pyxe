'use strict';

import type { ColorObjectFactory, ColorSpaceName, ModuleMethodFactory, ColorObjectFactoryLike } from '@pyxe/types';
import { Entity } from './Entity.js';
import { moduleMethodRegistry } from '../registries/ModuleMethodRegistry.js';
import { ColorMethodRegistry } from '../registries/ColorMethodRegistry.js';
import { hook } from '../services/Hook.js';
import { assert, catchToError } from '../services/ErrorUtils.js';

export class ModuleMethod extends Entity<string, ModuleMethodFactory> {

    protected static override instances: Map<string, ModuleMethodFactory> = new Map ();
    protected static override registry = moduleMethodRegistry;

    public supports (
        space: ColorSpaceName
    ) : boolean {

        return ! this.factory.spaces.length || this.factory.spaces.includes( space );

    }

    public isBound () : boolean {

        return ColorMethodRegistry.isBound( this.name );

    }

    public spaces () : ColorSpaceName[] {

        return this.factory.spaces ?? [];

    }

    public apply (
        input: ColorObjectFactory,
        options?: Record<string, any>,
        safe: boolean = true
    ) : ColorObjectFactoryLike {

        return catchToError( () => {

            assert( ! options?.strict || this.supports( input.space ), {
                method: 'ModuleMethod',
                msg: `Method <${this.name}> does not support color space <${input.space}>`
            } );

            return hook.filter(
                'ModuleMethod::apply',
                this.factory.handler( input, options ),
                input, options, safe, this
            );

        }, {
            method: 'ModuleMethod',
            msg: `Error occurred in method <${this.name}>`
        }, safe );

    }

    public static map () : Record<string, string[]> {

        return [ ...moduleMethodRegistry.list() ].reduce(
            ( map, key ) => (
                ( map[ key.split( '::' )[ 0 ] ] ??= [] ).push(
                    key.split( '::' )[ 1 ]
                ), map
            ), {} as Record<string, string[]>
        );

    }

}