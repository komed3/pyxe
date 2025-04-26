'use strict';

import type { ModuleFactory } from '@pyxe/types';
import { Registry } from './Registry.js';
import { moduleMethodRegistry } from './ModuleMethodRegistry.js';
import { hook } from '../services/Hook.js';

export class ModuleRegistry extends Registry<string, ModuleFactory> {

    public add (
        name: string,
        module: ModuleFactory
    ) : void {

        hook.run( 'ModuleRegistry::beforeAdd', name, module, this );

        super._add( name, module );

        if ( module?.methods ) {

            moduleMethodRegistry.addMany( name, module.methods );

        }

        hook.run( 'ModuleRegistry::afterAdd', name, module, this );

    }

    public remove (
        name: string
    ) : void {

        hook.run( 'ModuleRegistry::beforeRemove', name, this );

        super._remove( name );

        moduleMethodRegistry.removeAll( name );

        hook.run( 'ModuleRegistry::afterRemove', name, this );

    }

    public clear () {

        hook.run( 'ModuleRegistry::clear', this );

        super._clear();

    }

}

export const moduleRegistry = new ModuleRegistry ();