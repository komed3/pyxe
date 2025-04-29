'use strict';

import type { ColorObjectFactory, ColorSpaceName, ModuleMethodFactory } from '@pyxe/types';
import { moduleMethodRegistry } from '../registries/ModuleMethodRegistry.js';
import { ColorMethodRegistry } from '../registries/ColorMethodRegistry.js';
import { hook } from '../services/Hook.js';
import { assert, catchToError } from '../services/ErrorUtils.js';

const instances: Map<string, ModuleMethod> = new Map ();

export class ModuleMethod {

    readonly name: string;
    private factory: ModuleMethodFactory;

    private constructor (
        name: string
    ) {

        assert( moduleMethodRegistry.has( name ), {
            method: 'ModuleMethod',
            msg: `Module method <${name}> is not declared`
        } );

        this.name = name;
        this.factory = moduleMethodRegistry.get( name )!;

    }

    public supports (
        space: ColorSpaceName
    ) : boolean {

        return this.factory.spaces.includes( space );

    }

    public isBound () : boolean {

        return ColorMethodRegistry.isBound( this.name );

    }

    public spaces () : ColorSpaceName[] {

        return this.factory.spaces;

    }

    public meta (
        key?: string
    ) : any {

        return key ? ( this.factory?.meta ?? {} )[ key ] : this.factory?.meta;

    }

    public apply (
        input: ColorObjectFactory,
        options?: Record<string, any>,
        safe: boolean = true
    ) : any {

        catchToError( () => {

            assert( ! options?.strict || this.supports( input.space ), {
                method: 'ModuleMethod',
                msg: `Method <${ this.name }> does not support color space <${ input.space }>`
            } );

            return hook.filter(
                'ModuleMethod::apply',
                this.factory.handler( input, options ),
                input, options, safe, this
            );

        }, {
            method: 'ModuleMethod',
            msg: `Error occurred in method <${ this.name }>`
        }, safe );

    }

    public static getInstance (
        name: string,
        force: boolean = false
    ) : ModuleMethod {

        if ( force || ! instances.has( name ) ) {

            instances.set( name, new ModuleMethod ( name ) );

        }

        return instances.get( name )!;

    }

    public static destroyInstance (
        name: string
    ) : void {

        instances.delete( name );

    }

    public static list () : string[] {

        return moduleMethodRegistry.list();

    }

    public static filter (
        filter?: string
    ) : string[] {

        return moduleMethodRegistry.filter( filter );

    }

    public static has (
        name: string,
        safe: boolean = false
    ) : boolean {

        return moduleMethodRegistry.has( name, safe );

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