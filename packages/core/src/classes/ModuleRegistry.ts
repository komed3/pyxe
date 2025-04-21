'use strict';

import type { ModuleFactory } from '@pyxe/types';
import { Utils } from '@pyxe/utils';
import { moduleMethodRegistry } from './ModuleMethodRegistry.js';

export class ModuleRegistry {

    private registry: Map<string, ModuleFactory> = new Map();

    public add (
        id: string,
        factory: ModuleFactory
    ) : void {

        if ( this.has( id ) ) {

            throw new Utils.Services.error( {
                method: 'ModuleRegistry',
                msg: `Module named <${id}> is already declared`
            } );

        }

        this.registry.set( id, factory );

        if ( factory?.methods ) {

            moduleMethodRegistry.addMany( id, factory.methods );

        }

    }

    public remove (
        id: string
    ) : void {

        if ( ! this.has( id ) ) {

            throw new Utils.Services.error( {
                method: 'ModuleRegistry',
                msg: `Cannot find module named <${id}>`
            } );

        }

        moduleMethodRegistry.removeAll( id );

        this.registry.delete( id );

    }

    public list () : string[] {

        return [ ...this.registry.keys() ];

    }

    public has (
        id: string
    ) : boolean {

        return this.registry.has( id );

    }

    public get (
        id: string
    ) : ModuleFactory | undefined {

        return this.registry.get( id );

    }

}

export const moduleRegistry = new ModuleRegistry();