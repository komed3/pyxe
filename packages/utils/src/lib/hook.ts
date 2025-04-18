'use strict';

import type { HookFactory, HookHandler } from '@pyxe/types';
import { PyxeError } from './error.js';

export class Hook {

    private registry: Map<string, HookFactory[]> = new Map ();

    private _register (
        name: string,
        handler: HookHandler,
        priority: number = 10,
        once: boolean = false,
        preSort: boolean = true
    ) {

        if ( ! this.registry.has( name ) ) {

            this.registry.set( name, [] );

        }

        this.registry.get( name )!.push( {
            handler, priority, once
        } );

        if ( preSort ) {

            this._sort( name );

        }

    }

    private _match(
        name: string
    ) : [ string, HookFactory[] ][] {

        if ( ! name.includes( '*' ) ) {

            return this.registry.has( name )
                ? [ [ name, this.registry.get( name )! ] ]
                : [];

        }

        const pattern = new RegExp(
            '^' + name.replace( /\*/g, '.*' ) + '$'
        );

        return Array.from(
            this.registry.entries()
        ).filter(
            ( [ key ] ) => pattern.test( key )
        );

    }

    _sort (
        name: string
    ) {

        this.registry.get( name )!.sort(
            ( a, b ) => a.priority - b.priority
        );

    }

    _sortAll () {

        for ( const name of this.registry.keys() ) {

            this._sort( name );

        }

    }

    add (
        name: string,
        handler: HookHandler,
        priority: number = 10
    ) : void {

        this._register( name, handler, priority );

    }

    once (
        name: string,
        handler: HookHandler,
        priority: number = 10
    ) : void {

        this._register( name, handler, priority, true );

    }

    remove (
        name: string,
        handler?: HookHandler
    ) : void {

        if ( this.registry.has( name ) ) {

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

    do (
        name: string,
        ...args: any[]
    ) : void {

        try {

            for ( const [ key, entries ] of this._match( name ) ) {

                for ( const entry of [ ...entries ] ) {

                    entry.handler( ...args );

                    if ( entry.once ) {

                        this.remove( key, entry.handler );

                    }

                }

            }

        } catch ( err ) {

            throw new PyxeError ( {
                err, method: 'Hook',
                msg: `Failed to run hook for <${name}>`
            } );

        }

    }

    async doAsync (
        name: string,
        ...args: any[]
    ) : Promise<void> {

        try {

            for ( const [ key, entries ] of this._match( name ) ) {

                for ( const entry of [ ...entries ] ) {

                    await entry.handler( ...args );

                    if ( entry.once ) {

                        this.remove( key, entry.handler );

                    }

                }

            }

        } catch ( err ) {

            throw new PyxeError ( {
                err, method: 'Hook',
                msg: `Failed to run async hook for <${name}>`
            } );

        }

    }

    doDeferred (
        name: string,
        ...args: any[]
    ) : void {

        setImmediate ( () => {

            try {

                this.do( name, ...args );

            } catch ( err ) {

                throw new PyxeError ( {
                    err, method: 'Hook',
                    msg: `Failed to run deferred hook for <${name}>`
                } );

            }

        } );

    }

    filter (
        name: string,
        input: any,
        ...args: any[]
    ) : any {

        let result = input;

        try {

            for ( const [ key, entries ] of this._match( name ) ) {

                for ( const entry of [ ...entries ] ) {

                    result = entry.handler( result, ...args );

                    if ( entry.once ) {

                        this.remove( key, entry.handler );

                    }

                }

            }

        } catch ( err ) {

            throw new PyxeError ( {
                err, method: 'Hook',
                msg: `Failed to apply filter for <${name}>`
            } );

        }

        return result;

    }

    async filterAsync (
        name: string,
        input: any,
        ...args: any[]
    ) : Promise<any> {

        let result = input;

        try {

            for ( const [ key, entries ] of this._match( name ) ) {

                for ( const entry of [ ...entries ] ) {

                    result = await entry.handler( result, ...args );

                    if ( entry.once ) {
                        
                        this.remove( key, entry.handler );

                    }

                }

            }

        } catch ( err ) {

            throw new PyxeError ( {
                err, method: 'Hook',
                msg: `Failed to apply async filter for <${name}>`
            } );

        }

        return result;

    }

}

export const hook = new Hook ();