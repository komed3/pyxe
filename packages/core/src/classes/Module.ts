'use strict';

import type { ModuleFactory } from '@pyxe/types';
import { Entity } from './Entity.js';
import { moduleRegistry } from '../registries/ModuleRegistry.js';
import { ColorMethodRegistry } from '../registries/ColorMethodRegistry.js';
import { ModuleMethod } from './ModuleMethod.js';

export class Module extends Entity<string, ModuleFactory> {

    public static override registry = moduleRegistry;

    private cache: Map<string, ModuleMethod> = new Map ();

    public methods () : string[] {

        return this.factory.methods.map(
            ( method ) => method.name
        );

    }

    public getMethod (
        method: string
    ) : ModuleMethod {

        if ( ! this.cache.has( method ) ) {

            this.cache.set( method, ModuleMethod.getInstance( method ) as ModuleMethod );

        }

        return this.cache.get( method )!;

    }

    public static isBound (
        method: string
    ) : boolean {

        return ColorMethodRegistry.isBound( method );

    }

}