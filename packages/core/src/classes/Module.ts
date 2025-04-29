'use strict';

import type { ModuleFactory } from '@pyxe/types';
import { moduleRegistry } from '../registries/ModuleRegistry.js';
import { ColorMethodRegistry } from '../registries/ColorMethodRegistry.js';
import { ModuleMethod } from './ModuleMethod.js';
import { assert } from '../services/ErrorUtils.js';

const instances: Map<string, Module> = new Map ();

export class Module {

    readonly name: string;
    private factory: ModuleFactory;

    private constructor (
        name: string
    ) {

        assert( moduleRegistry.has( name ), {
            method: 'Module',
            msg: `Module <${name}> is not declared`
        } );

        this.name = name;
        this.factory = moduleRegistry.get( name )!;

    }

    public methods () : string[] {

        return this.factory.methods.map(
            ( method ) => method.name
        );

    }

    public getMethod (
        method: string
    ) : ModuleMethod {

        return ModuleMethod.getInstance( method );

    }

    public meta (
        key?: string
    ) : any {

        return key ? ( this.factory?.meta ?? {} )[ key ] : this.factory?.meta;

    }

    public static getInstance (
        name: string,
        force: boolean = false
    ) : Module {

        if ( force || ! instances.has( name ) ) {

            instances.set( name, new Module ( name ) );

        }

        return instances.get( name )!;

    }

    public static destroyInstance (
        name: string
    ) : void {

        instances.delete( name );

    }

    public static list () : string[] {

        return moduleRegistry.list();

    }

    public static filter (
        filter?: string
    ) : string[] {

        return moduleRegistry.filter( filter );

    }

    public static has (
        name: string,
        safe: boolean = false
    ) : boolean {

        return moduleRegistry.has( name, safe );

    }

    public static isBound (
        method: string
    ) : boolean {

        return ColorMethodRegistry.isBound( method );

    }

}