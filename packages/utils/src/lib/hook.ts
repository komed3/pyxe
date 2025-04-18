/**
 * Utils Class Hook
 * src/lib/hook.ts
 * 
 * This module provides a lightweight and extensible Hook System for the `pyxe`
 * framework. It allows registration and execution of synchronous and asynchronous
 * hooks, both in action (side-effect driven) and filter (value-transforming) modes.
 * Hooks can be registered with custom priorities and executed once or multiple
 * times. Wildcard matching is supported, and deferred hook execution is available
 * via Node.js' event loop.
 * 
 * The hook system is designed to be robust, predictable, and easy to extend. It
 * is suitable for modular plugins, lifecycle events, configuration pipelines, and
 * many other cross-cutting concerns.
 * 
 * It supports:
 *   - synchronous and asynchronous execution
 *   - hook priorities for ordering
 *   - one-time and persistent hooks
 *   - wildcard pattern matching
 *   - action hooks (side-effects) and filter hooks (value transformations)
 *   - deferred (event-loop) execution
 * 
 * @package @pyxe/utils
 * @requires @pyxe/types
 * 
 * @author Paul Köhler (komed3)
 * @license MIT
 */

'use strict';

import type { HookFactory, HookHandler } from '@pyxe/types';
import { PyxeError } from './error.js';

/**
 * The utils hook system class providing registration, execution,
 * and filtering mechanisms.
 */
export class Hook {

    /** Internal registry storing hook handlers grouped by hook name */
    private registry: Map<string, HookFactory[]> = new Map ();

    /**
     * Internal method to register a hook handler.
     * 
     * @param name - The name of the hook (can contain wildcards)
     * @param handler - The callback to be executed
     * @param priority - Sorting priority (lower executes earlier)
     * @param once - Whether the handler should be removed after first execution
     * @param preSort - Whether to sort the handlers immediately after registration
     */
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

    /**
     * Resolves all matching hook entries for a given hook name,
     * including wildcards.
     * 
     * @param name - The hook name to match against
     * @returns Array of matching hook name and handler pairs
     */
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

    /**
     * Sorts the hook handlers for a specific hook name by priority.
     * 
     * @param name - The name of the hook group to sort
     */
    _sort (
        name: string
    ) {

        this.registry.get( name )!.sort(
            ( a, b ) => a.priority - b.priority
        );

    }

    /**
     * Sorts all hook groups currently in the registry.
     */
    _sortAll () {

        for ( const name of this.registry.keys() ) {

            this._sort( name );

        }

    }

    /**
     * Registers a persistent hook.
     * 
     * @param name - The name of the hook
     * @param handler - The callback to register
     * @param priority - Execution priority (default: 10)
     */
    add (
        name: string,
        handler: HookHandler,
        priority: number = 10
    ) : void {

        this._register( name, handler, priority );

    }

    /**
     * Registers a hook that will be removed after its first execution.
     * 
     * @param name - The name of the hook
     * @param handler - The callback to register
     * @param priority - Execution priority (default: 10)
     */
    once (
        name: string,
        handler: HookHandler,
        priority: number = 10
    ) : void {

        this._register( name, handler, priority, true );

    }

    /**
     * Removes a hook handler or all handlers for a hook name.
     * 
     * @param name - The name of the hook
     * @param handler - Specific handler to remove; if omitted, all handlers are removed
     */
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

    /**
     * Executes all registered handlers for the given hook name synchronously.
     * 
     * @param name - The name of the hook
     * @param args - Arguments to pass to the handlers
     * @throws If a hook failed to run
     */
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

    /**
     * Executes all registered handlers asynchronously and in order.
     * 
     * @param name - The name of the hook
     * @param args - Arguments to pass to the handlers
     * @returns Promise that resolves when all handlers have completed
     * @throws If a hook failed to run asynchronously
     */
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

    /**
     * Executes all registered handlers in a deferred (non-blocking) manner.
     * 
     * @param name - The name of the hook
     * @param args - Arguments to pass to the handlers
     * @throws If a hook failed to run deferred
     */
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

    /**
     * Applies all matching filter hooks synchronously to an input value.
     * 
     * @param name - The name of the hook
     * @param input - The initial value to be filtered
     * @param args - Additional arguments to pass to each handler
     * @returns The final, filtered value
     * @throws If an applied filter leads to an error
     */
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

    /**
     * Applies all matching filter hooks asynchronously to an input value.
     * 
     * @param name - The name of the hook
     * @param input - The initial value to be filtered
     * @param args - Additional arguments to pass to each handler
     * @returns Promise resolving to the final filtered value
     * @throws If an applied filter leads to an error
     */
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

/**
 * Singleton instance of the Hook system.
 * Used as the standard entry point to register or invoke hooks.
 */
export const hook = new Hook ();