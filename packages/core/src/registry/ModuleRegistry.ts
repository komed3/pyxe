'use strict';

import type { ModuleFactory } from '@pyxe/types';
import { Registry } from './Registry.js';
import { moduleMethodRegistry } from './ModuleMethodRegistry.js';

export class ModuleRegistry extends Registry<string, ModuleFactory> {

    public add (
        key: string,
        module: ModuleFactory
    ) : void {

        super._add( key, module );

        if ( module?.methods ) {

            moduleMethodRegistry.addMany( key, module.methods );

        }

    }

    public remove (
        key: string
    ) : void {

        moduleMethodRegistry.removeAll( key );

        super._remove( key );

    }

    public clear () {

        super._clear();

    }

}

export const moduleRegistry = new ModuleRegistry ();