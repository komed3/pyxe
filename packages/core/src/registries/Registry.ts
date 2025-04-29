'use strict';

import { hook } from '../services/Hook.js';
import { assert, handleError } from '../services/ErrorUtils.js';

export abstract class Registry<Name extends string, Factory> {

    protected items: Map<Name, Factory> = new Map ();

    protected _sanitize (
        name: Name
    ) : Name {

        return hook.filter( 'Registry::sanitize', ( String ( name )
            .trim().replace( /[^a-zA-Z0-9\-]/g, '' ).toLowerCase()
        ) as Name, name, this );

    }

    protected _add (
        name: Name,
        factory: Factory,
        safe: boolean = true
    ) : void {

        const sanitized = this._sanitize( name );

        hook.run( 'Registry::beforeAdd', name, sanitized, factory, this );

        assert( ! safe || ! this.items.has( sanitized ), {
            method: 'Registry',
            msg: `Registry item <${sanitized}> already declared`
        } );

        this.items.set( sanitized, factory );

        hook.run( 'Registry::afterAdd', name, sanitized, factory, this );

    }

    protected _remove (
        name: Name,
        safe: boolean = true
    ) : void {

        const sanitized = this._sanitize( name );

        hook.run( 'Registry::beforeRemove', name, sanitized, this );

        assert( ! safe || this.items.has( sanitized ), {
            method: 'Registry',
            msg: `Registry item <${sanitized}> is not declared`
        } );

        this.items.delete( sanitized );

        hook.run( 'Registry::afterRemove', name, sanitized, this );

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

        let list = this.list();

        if ( filter ) {

            const regex = new RegExp( filter, 'i' );

            return list.filter(
                ( name ) => regex.test( name as string )
            );

        }

        return list;

    }

    public all () : IterableIterator<Factory> {

        return this.items.values();

    }

    public has (
        name: Name,
        safe: boolean = false
    ) : boolean {

        const sanitized = this._sanitize( name );

        return this.items.has( sanitized ) || handleError( {
            method: 'Registry',
            msg: `Registry item <${sanitized}> not found`
        }, safe );

    }

    public get (
        name: Name,
        safe: boolean = true
    ) : Factory | undefined {

        const sanitized = this._sanitize( name );

        if ( this.has( sanitized, safe ) ) {

            return this.items.get( sanitized );

        }

    }

}