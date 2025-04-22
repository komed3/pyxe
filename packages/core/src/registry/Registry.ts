'use strict';

export abstract class Registry<Key, Factory> {

    protected items: Map<Key, Factory> = new Map();

    protected _add (
        key: Key,
        factory: Factory,
        safe: boolean = true
    ) : void {

        if ( ! safe || ! this.has( key, true ) ) {

            this.items.set( key, factory );

        }

    }

    protected  _remove (
        key: Key,
        safe: boolean = true
    ) : void {

        if ( ! safe || this.has( key, true ) ) {

            this.items.delete( key );

        }

    }

    protected _clear () : void {

        this.items.clear();

    }

    public list () : Key[] {

        return [ ...this.items.keys() ];

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

            // ERROR

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