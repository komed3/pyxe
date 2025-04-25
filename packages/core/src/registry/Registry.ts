'use strict';

import { PyxeError } from '../services/PyxeError.js';

export abstract class Registry<Key, Factory extends { aliases?: Key[] }> {

    protected items: Map<Key, Factory> = new Map ();

    protected aliases: Map<Key, Key> = new Map ();

    protected _resolveKey (
        key: Key
    ) : Key {

        return this.aliases.get( key ) ?? key;

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
        key: Key,
        safe: boolean = true
    ) : void {

        const resolved = this._resolveKey( key );

        if ( safe && ! this.has( resolved, true ) ) {

            throw new PyxeError ( {
                method: 'Registry',
                msg: `Registry item <${resolved}> is not declared`
            } );

        }

        const factory = this.items.get( resolved );

        if ( factory?.aliases && Array.isArray( factory.aliases ) ) {

            for ( const alias of factory.aliases ) {

                this.aliases.delete( alias );

            }

        }

        this.items.delete( resolved );

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
        key: Key,
        safe: boolean = false
    ) : boolean {

        const resolved = this._resolveKey( key );

        if ( this.items.has( resolved ) ) {

            return true;

        } else if ( safe ) {

            throw new PyxeError ( {
                method: 'Registry',
                msg: `Registry item <${resolved}> not found`
            } );

        }

        return false;

    }

    public get (
        key: Key,
        safe: boolean = true
    ) : Factory | undefined {

        const resolved = this._resolveKey( key );

        if ( ! safe || this.has( resolved, true ) ) {

            return this.items.get( resolved );

        }

    }

}