'use strict';

import type { ModuleMethodFactory } from '@pyxe/types';
import { Registry } from './Registry.js';
import { ColorMethodRegistry } from './ColorMethodRegistry.js';
import { catchToError } from '../services/ErrorUtils.js';
import { hook } from '../services/Hook.js';

export class ModuleMethodRegistry extends Registry<string, ModuleMethodFactory> {

    public add (
        module: string,
        method: ModuleMethodFactory,
        bind: boolean = true
    ) : void {

        hook.run( 'ModuleMethodRegistry::beforeAdd', module, method, bind, this );

        catchToError( () => {

            const name = `${module}::${method.name}`;

            super._add( name, method );

            if ( bind && method?.bindAs ) {

                ColorMethodRegistry.bind(
                    name, method.bindAs,
                    ( self, method, options ) => self.apply( method, options )
                );

            }

        }, {
            method: 'ModuleMethodRegistry',
            msg: `Failed to register method <${method.name}> for module <${module}>`
        } );

        hook.run( 'ModuleMethodRegistry::afterAdd', module, method, bind, this );

    }

    public addMany (
        module: string,
        methods: ModuleMethodFactory[],
        bind: boolean = true
    ) : void {

        hook.run( 'ModuleMethodRegistry::addMany', module, methods, bind, this );

        for ( const method of methods ) {

            this.add( module, method, bind );

        }

    }

    public remove (
        name: string
    ) {

        hook.run( 'ModuleMethodRegistry::beforeRemove', name, this );

        super._remove( name );

        ColorMethodRegistry.unbind( name );

        hook.run( 'ModuleMethodRegistry::afterRemove', name, this );

    }

    public removeAll (
        module: string
    ) : void {

        hook.run( 'ModuleMethodRegistry::removeAll', module, this );

        for ( const name of this.filter( `^${module}::` ) ) {

            this.remove( name );

        }

    }

    public clear () : void {

        hook.run( 'ModuleMethodRegistry::clear', this );

        super._clear();

    }

}

export const moduleMethodRegistry = new ModuleMethodRegistry ();