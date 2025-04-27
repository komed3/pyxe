'use strict';

import type { HookFactory, HookHandler } from '@pyxe/types';
import { debug } from './Debug.js';
import { catchToError } from './ErrorUtils.js';

export class Hook {

    private registry: Map<string, HookFactory[]> = new Map ();
    private cache: Map<string, [ string, HookFactory[] ][]> = new Map ();

    constructor (
        private safe: boolean = true
    ) {}

    private _register (
        name: string,
        handler: HookHandler,
        priority: number = 10,
        once: boolean = false,
        preSort: boolean = true
    ) : void {

        if ( ! this.registry.has( name ) ) {

            this.registry.set( name, [] );

        }

        this.registry.get( name )!.push( {
            handler, priority, once
        } );

        if ( preSort ) {

            this._sort( name );

        }

        this.cache.clear();

    }

    private _match (
        name: string
    ) : Array<[ string, HookFactory[] ]> {

        if ( this.cache.has( name ) ) {

            return this.cache.get( name )!;

        }

        let matches: Array<[ string, HookFactory[] ]> = [];

        if ( ! name.includes( '*' ) ) {

            const hooks = this.registry.get( name );

            matches = hooks ? [ [ name, hooks ] ] : [];

        } else {

            const pattern = new RegExp (
                '^' + name.split( '*' ).map(
                    ( s ) => s.replace( /[-/\\^$+?.()|[\]{}]/g, '\\$&' )
                ).join( '.*' ) + '$'
            );

            matches = [ ...this.registry.entries() ].filter (
                ( [ key ] ) => pattern.test( key )
            );

        }

        this.cache.set( name, matches );

        return matches;

    }

    private _sort (
        name: string
    ) : void {

        this.registry.get( name )!.sort(
            ( a, b ) => a.priority - b.priority
        );

    }

    public sortAll () : void {

        for ( const name of this.registry.keys() ) {

            this._sort( name );

        }

    }

    public add (
        name: string,
        handler: HookHandler,
        priority: number = 10
    ) : void {

        this._register( name, handler, priority );

    }

    public once (
        name: string,
        handler: HookHandler,
        priority: number = 10
    ) : void {

        this._register( name, handler, priority, true );

    }

    public remove (
        name: string,
        handler?: HookHandler
    ) : void {

        if ( this.registry.has( name ) ) {

            this.cache.clear();

            if ( ! handler ) {

                this.registry.delete( name );

            } else {

                const filtered = this.registry.get( name )!.filter(
                    ( hook ) => hook.handler !== handler
                );

                if ( filtered.length ) {

                    this.registry.set( name, filtered );

                    this._sort( name );

                } else {

                    this.registry.delete( name );

                }

            }

        }

    }

    public clear (
        pattern: string
    ) : void {

        this.cache.clear();

        for ( const [ key ] of this._match( pattern ) ) {

            this.registry.delete( key );

        }

    }

    public run (
        name: string,
        ...args: any[]
    ) : void {

        debug.log( 'Hook', `run hook <${name}>` );

        catchToError( () => {

            for ( const [ key, hooks ] of this._match( name ) ) {

                for ( const hook of hooks ) {

                    hook.handler( ...args );

                    if ( hook.once ) {

                        this.remove( key, hook.handler );

                    }

                }

            }

        }, {
            method: 'Hook',
            msg: `Failed to run hook for <${name}>`
        }, this.safe );

    }

    public async runAsync (
        name: string,
        ...args: any[]
    ) : Promise<void> {

        debug.log( 'Hook', `run async hook <${name}>` );

        catchToError( async () => {

            for ( const [ key, hooks ] of this._match( name ) ) {

                for ( const hook of hooks ) {

                    await hook.handler( ...args );

                    if ( hook.once ) {

                        this.remove( key, hook.handler );

                    }

                }

            }

        }, {
            method: 'Hook',
            msg: `Failed to run async hook for <${name}>`
        }, this.safe );

    }

    public runDeferred (
        name: string,
        ...args: any[]
    ) : void {

        setImmediate ( () => {

            catchToError( () => this.run( name, ...args ), {
                method: 'Hook',
                msg: `Failed to run deferred hook for <${name}>`
            }, this.safe );

        } );

    }

    public filter (
        name: string,
        input: any,
        ...args: any[]
    ) : any {

        debug.log( 'Hook', `apply filter <${name}>` );

        let result = input;

        catchToError( () => {

            for ( const [ key, hooks ] of this._match( name ) ) {

                for ( const hook of hooks ) {

                    result = hook.handler( result, ...args );

                    if ( hook.once ) {

                        this.remove( key, hook.handler );

                    }

                }

            }

        }, {
            method: 'Hook',
            msg: `Failed to apply filter for <${name}>`
        }, this.safe );

        return result;

    }

    public async filterAsync (
        name: string,
        input: any,
        ...args: any[]
    ) : Promise<any> {

        debug.log( 'Hook', `apply async filter <${name}>` );

        let result = input;

        catchToError( async () => {

            for ( const [ key, hooks ] of this._match( name ) ) {

                for ( const hook of hooks ) {

                    result = await hook.handler( result, ...args );

                    if ( hook.once ) {

                        this.remove( key, hook.handler );

                    }

                }

            }

        }, {
            method: 'Hook',
            msg: `Failed to apply async filter for <${name}>`
        }, this.safe );

        return result;

    }

    public list (
        pattern: string = '*'
    ) : string[] {

        return this._match( pattern ).map( ( [ key ] ) => key );

    }

    public has (
        name: string
    ) : boolean {

        return this.registry.has( name );

    }

}

export const hook = new Hook ();