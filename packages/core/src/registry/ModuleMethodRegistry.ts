'use strict';

import type { ModuleMethodFactory } from '@pyxe/types';
import { PyxeError } from '../services/PyxeError.js';
import { ColorMethodRegistry } from './ColorMethodRegistry.js';
import { Registry } from './Registry.js';

export class ModuleMethodRegistry extends Registry<string, ModuleMethodFactory> {

    public add (
        module: string,
        method: ModuleMethodFactory,
        bind: boolean = true
    ) : void {

        try {

            const name = `${module}::${method.name}`;

            super._add( name, method );

            if ( bind && method?.bindAs ) {

                ColorMethodRegistry.bind( name, method.bindAs );

            }

        } catch ( err ) {

            throw new PyxeError ( {
                err, method: 'ModuleMethodRegistry',
                msg: `Failed to register method <${method.name}> for module <${module}>`
            } );

        }

    }

    public addMany (
        module: string,
        methods: ModuleMethodFactory[],
        bind: boolean = true
    ) : void {

        for ( const method of methods ) {

            this.add( module, method, bind );

        }

    }

    public remove (
        name: string
    ) {

        ColorMethodRegistry.unbind( name );

        super._remove( name );

    }

    public removeAll (
        module: string
    ) : void {

        for ( const name of this.filter( `^${module}::` ) ) {

            this.remove( name );

        }

    }

    public clear () : void {

        super._clear();

    }

}

export const moduleMethodRegistry = new ModuleMethodRegistry ();