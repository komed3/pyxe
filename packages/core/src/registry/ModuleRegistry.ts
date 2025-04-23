'use strict';

import type { ModuleFactory } from '@pyxe/types';
import { Registry } from './Registry.js';
import { moduleMethodRegistry } from './ModuleMethodRegistry.js';

export class ModuleRegistry extends Registry<string, ModuleFactory> {

    public add (
        name: string,
        module: ModuleFactory
    ) : void {

        super._add( name, module );

        if ( module?.methods ) {

            moduleMethodRegistry.addMany( name, module.methods );

        }

    }

    public remove (
        name: string
    ) : void {

        moduleMethodRegistry.removeAll( name );

        super._remove( name );

    }

    public clear () {

        super._clear();

    }

}

export const moduleRegistry = new ModuleRegistry ();