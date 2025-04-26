'use strict';

import { PyxeError } from '../services/PyxeError.js';
import { hook } from '../services/Hook.js';

export abstract class Registry<Name extends string, Factory> {

    protected items: Map<Name, Factory> = new Map ();

    protected _sanitize (
        name: Name
    ) : Name {

        return hook.filter( 'Registry::sanitize', ( String ( name )
            .trim().replace( /[^a-zA-Z]/g, '' ).toLowerCase()
        ) as Name, name, this );

    }

    protected _add (
        name: Name,
        factory: Factory,
        safe: boolean = true
    ) : void {

        const sanitized = this._sanitize( name );

        hook.run(
            'Registry::beforeAdd',
            name, sanitized, factory, this
        );

        if ( safe && this.has( sanitized ) ) {

            throw new PyxeError ( {
                method: 'Registry',
                msg: `Registry item <${sanitized}> already declared`
            } );

        }

        this.items.set( sanitized, factory );

        hook.run(
            'Registry::afterAdd',
            name, sanitized, factory, this
        );

    }

    protected _remove (
        name: Name,
        safe: boolean = true
    ) : void {

        const sanitized = this._sanitize( name );

        hook.run(
            'Registry::beforeRemove',
            name, sanitized, this
        );

        if ( safe && ! this.has( sanitized, true ) ) {

            throw new PyxeError ( {
                method: 'Registry',
                msg: `Registry item <${sanitized}> is not declared`
            } );

        }

        this.items.delete( sanitized );

        hook.run(
            'Registry::afterRemove',
            name, sanitized, this
        );

    }

    protected _clear () : void {

        hook.run( 'Registry::clear', this );

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

        const sanitized = this._sanitize( name );

        if ( this.items.has( sanitized ) ) {

            return true;

        } else if ( safe ) {

            throw new PyxeError ( {
                method: 'Registry',
                msg: `Registry item <${sanitized}> not found`
            } );

        }

        return false;

    }

    public get (
        name: Name,
        safe: boolean = true
    ) : Factory | undefined {

        const sanitized = this._sanitize( name );

        if ( ! safe || this.has( sanitized, true ) ) {

            return this.items.get( sanitized );

        }

    }

}