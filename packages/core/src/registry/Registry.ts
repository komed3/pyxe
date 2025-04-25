'use strict';

import { PyxeError } from '../services/PyxeError.js';

export abstract class Registry<Key, Factory extends { aliases?: Key[] }> {

    protected items: Map<Key, Factory> = new Map ();

    protected aliases: Map<Key, Key> = new Map ();

    protected _resolveKey (
        test: Key
    ) : Key {

        return this.aliases.get( test ) ?? test;

    }

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

        if ( factory?.aliases && Array.isArray( factory.aliases ) ) {

            for ( const alias of factory.aliases ) {

                if ( this.items.has( alias ) || this.aliases.has( alias ) ) {

                    throw new PyxeError ( {
                        method: 'Registry',
                        msg: `Alias <${alias}> for <${key}> already declared`
                    } );

                }

                this.aliases.set( alias, key );

            }

        }

    }

    protected  _remove (
        test: Key,
        safe: boolean = true
    ) : void {

        const key = this._resolveKey( test );

        if ( safe && ! this.has( key, true ) ) {

            throw new PyxeError ( {
                method: 'Registry',
                msg: `Registry item <${key}> is not declared`
            } );

        }

        const factory = this.items.get( key );

        if ( factory?.aliases && Array.isArray( factory.aliases ) ) {

            for ( const alias of factory.aliases ) {

                this.aliases.delete( alias );

            }

        }

        this.items.delete( key );

    }

    protected _clear () : void {

        this.items.clear();

        this.aliases.clear();

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
        test: Key,
        safe: boolean = false
    ) : boolean {

        const key = this._resolveKey( test );

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
        test: Key,
        safe: boolean = true
    ) : Factory | undefined {

        const key = this._resolveKey( test );

        if ( ! safe || this.has( key, true ) ) {

            return this.items.get( key );

        }

    }

}