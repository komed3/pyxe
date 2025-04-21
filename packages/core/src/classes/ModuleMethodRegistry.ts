'use strict';

import type { ModuleMethodFactory } from '@pyxe/types';
import { Utils } from '@pyxe/utils';
import { ColorMethodRegistry } from './ColorMethodRegistry.js';

export class ModuleMethodRegistry {

    private registry: Map<string, ModuleMethodFactory> = new Map ();

    public add (
        module: string,
        method: ModuleMethodFactory,
        bind: boolean = true
    ) : void {

        try {

            const { id: name, bindAs = false } = method;
            const key = `${module}::${name}`;

            if ( this.has( key ) ) {

                throw new Utils.Services.error( {
                    method: 'ModuleMethodRegistry',
                    msg: `Method named <${key}> is already declared`
                } );

            }

            this.registry.set( key, method );

            if ( bind && bindAs ) {

                ColorMethodRegistry.bind( key, bindAs );

            }

        } catch ( err ) {

            throw new Utils.Services.error( {
                err, method: 'ModuleMethodRegistry',
                msg: `Failed to register method <${method}> for module <${module}>`
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

        if ( ! this.has( key ) ) {

            throw new Utils.Services.error( {
                method: 'ModuleMethodRegistry',
                msg: `Cannot find method named <${key}>`
            } );

        }

        this.registry.delete( key );

        ColorMethodRegistry.unbind( key );

    }

    public removeAll (
        module: string
    ) : void {

        for ( const key of this.filter( `^${module}::` ) ) {

            this.remove( key );

        }

    }

    public list () : string[] {

        return [ ...this.registry.keys() ];

    }

    public filter (
        filter?: string
    ) : string[] {

        return this.list().filter(
            ( key ) => ! filter || key.match(
                new RegExp( filter, 'i' )
            )
        );

    }

    public has (
        key: string
    ) : boolean {

        return this.registry.has( key );

    }

    public get (
        key: string
    ) : ModuleMethodFactory | undefined {

        return this.registry.get( key );

    }

}

export const moduleMethodRegistry = new ModuleMethodRegistry ();