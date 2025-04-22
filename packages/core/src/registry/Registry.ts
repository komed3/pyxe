'use strict';

import { PyxeError } from '../utils/PyxeError.js';

export abstract class Registry<Key, Factory> {

    protected items: Map<Key, Factory> = new Map ();

    protected _add (
        key: Key,
        factory: Factory,
        safe: boolean = true
    ) : void {

        if ( safe && this.has( key ) ) {

            throw new PyxeError ( {
                method: 'Registry',
                msg: `Registry item <${key}> already declared`
            } );

        }

        this.items.set( key, factory );

    }

    protected  _remove (
        key: Key,
        safe: boolean = true
    ) : void {

        if ( safe && ! this.has( key, true ) ) {

            throw new PyxeError ( {
                method: 'Registry',
                msg: `Registry item <${key}> is not declared`
            } );

        }

        this.items.delete( key );

    }

    protected _clear () : void {

        this.items.clear();

    }

    public list () : Key[] {

        return [ ...this.items.keys() ];

    }

    public filter (
        filter?: string
    ) : Key[] {

        return this.list().filter(
            ( key ) => ! filter || ( key as string ).match(
                new RegExp( filter, 'i' )
            )
        );

    }

    public all () : IterableIterator<Factory> {

        return this.items.values();

    }

    public has (
        key: Key,
        safe: boolean = false
    ) : boolean {

        if ( this.items.has( key ) ) {

            return true;

        } else if ( safe ) {

            throw new PyxeError ( {
                method: 'Registry',
                msg: `Registry item <${key}> not found`
            } );

        }

        return false;

    }

    public get (
        key: Key,
        safe: boolean = true
    ) : Factory | undefined {

        if ( ! safe || this.has( key, true ) ) {

            return this.items.get( key );

        }

    }

}