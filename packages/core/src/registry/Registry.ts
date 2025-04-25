'use strict';

import { PyxeError } from '../services/PyxeError.js';

export abstract class Registry<Name, Factory> {

    protected items: Map<Name, Factory> = new Map ();

    protected _add (
        name: Name,
        factory: Factory,
        safe: boolean = true
    ) : void {

        if ( safe && this.has( name ) ) {

            throw new PyxeError ( {
                method: 'Registry',
                msg: `Registry item <${name}> already declared`
            } );

        }

        this.items.set( name, factory );

    }

    protected _remove (
        name: Name,
        safe: boolean = true
    ) : void {

        if ( safe && ! this.has( name, true ) ) {

            throw new PyxeError ( {
                method: 'Registry',
                msg: `Registry item <${name}> is not declared`
            } );

        }

        this.items.delete( name );

    }

    protected _clear () : void {

        this.items.clear();

    }

    public list () : Name[] {

        return [ ...this.items.keys() ];

    }

    public filter (
        filter?: string
    ) : Name[] {

        return this.list().filter(
            ( name ) => ! filter || ( name as string ).match(
                new RegExp( filter, 'i' )
            )
        );

    }

    public all () : IterableIterator<Factory> {

        return this.items.values();

    }

    public has (
        name: Name,
        safe: boolean = false
    ) : boolean {

        if ( this.items.has( name ) ) {

            return true;

        } else if ( safe ) {

            throw new PyxeError ( {
                method: 'Registry',
                msg: `Registry item <${name}> not found`
            } );

        }

        return false;

    }

    public get (
        name: Name,
        safe: boolean = true
    ) : Factory | undefined {

        if ( ! safe || this.has( name, true ) ) {

            return this.items.get( name );

        }

    }

}