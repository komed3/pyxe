'use strict';

import type { ModuleMethodFactory } from '@pyxe/types';
import { Registry } from './Registry.js';
import { ColorMethodRegistry } from './ColorMethodRegistry.js';
import { PyxeError } from '../utils/PyxeError.js';

export class ModuleMethodRegistry extends Registry<string, ModuleMethodFactory> {

    public add (
        module: string,
        method: ModuleMethodFactory,
        bind: boolean = true
    ) : void {

        try {

            const key = `${module}::${method.id}`;

            super._add( key, method );

            if ( bind && method?.bindAs ) {

                ColorMethodRegistry.bind( key, method.bindAs );

            }

        } catch ( err ) {

            throw new PyxeError ( {
                err, method: 'ModuleMethodRegistry',
                msg: `Failed to register method <${method.id}> for module <${module}>`
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
        key: string
    ) {

        ColorMethodRegistry.unbind( key );

        super._remove( key );

    }

    public removeAll (
        module: string
    ) : void {

        for ( const key of this.filter( `^${module}::` ) ) {

            this.remove( key );

        }

    }

    public clear () : void {

        super._clear();

    }

}

export const moduleMethodRegistry = new ModuleMethodRegistry ();