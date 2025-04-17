/**
 * Class Module
 * src/lib/module.ts
 * 
 * The Module class manages dynamically pluggable color manipulation modules in the
 * `pyxe` framework. Each module defines one or more color operations (methods) that
 * can be applied to ColorObjects, such as transformations (e.g. invert, lighten,
 * blend), utilities (e.g. contrast ratio), or evaluations.
 * 
 * Modules are registered by unique IDs and may expose one or more methods.
 * Each method may optionally specify:
 *   - which color spaces it supports
 *   - a bind name for dynamic method extension of the Color class
 *   - metadata for introspection (e.g. arguments, category, tags)
 * 
 * This class handles registration, unregistration, metadata access, and execution
 * of methods. All methods are stored internally using the format:
 *   `<moduleId>::<methodId>`.
 * 
 * The Module system also supports an optional "strict mode" on `apply()`, 
 * which enforces that the color space is supported by the method.
 * 
 * @package @pyxe/core
 * @requires @pyxe/types
 * @requires @pyxe/utils
 * 
 * @author Paul Köhler (komed3)
 * @license MIT
 */

'use strict';

import { ColorObject, ModuleFactory, ModuleMethodFactory } from '@pyxe/types';
import { Utils } from '@pyxe/utils';
import { ColorMethodRegistry } from './color.js';

/**
 * Central registry for pyxe's color operation modules.
 * Supports dynamic registration, safe retrieval, and module invocation.
 */
export class Module {

    /** Registry of all declared modules by ID */
    private registry: Map<string, ModuleFactory> = new Map ();

    /** Registry of all declared methods by full key: `<moduleId>::<methodId>` */
    private methodsRegistry: Map<string, ModuleMethodFactory> = new Map ();

    /**
     * Registers a module and its associated methods.
     * Throws an error if the module ID already exists.
     * 
     * This method is intended to be called by modules during setup.
     * 
     * @param id - Unique module identifier
     * @param factory - Module definition (methods, meta info, etc.)
     * @throws If the module is already declared
     */
    _register (
        id: string,
        factory: ModuleFactory
    ) : void {

        if ( ! this.has( id ) ) {

            this.registry.set( id, factory );

            this._registerMethods( id );

        } else {

            throw new Utils.error( {
                method: 'Module',
                msg: `Module named <${id}> is already declared`
            } );

        }

    }

    /**
     * Unregisters a module, including its Color method binding.
     * If the module is not registered, an error is thrown.
     * 
     * This method is intended for internal use, e.g., in testing or plugin unloading.
     * 
     * @param id - ID of the module to remove
     */
    _unregister (
        id: string
    ) : void {

        if ( this.check( id ) ) {

            this._unregisterMethods( id );

            this.registry.delete( id );

        }

    }

    /**
     * Registers all methods of a given module and binds them to the `Color` class
     * if specified.
     * 
     * @param id - Module ID
     * @param bind - Whether to bind methods to `ColorMethodRegistry`
     * @throws If the module is already declared
     */
    _registerMethods (
        id: string,
        bind: boolean = true
    ) : void {

        if ( this.check( id ) ) {

            const { methods } = this.get( id ) as ModuleFactory;

            for ( const method of methods ) {

                const { id: name, bindAs = false } = method;
                const methodKey = `${id}::${name}`;

                if ( ! this.hasMethod( methodKey ) ) {

                    this.methodsRegistry.set( methodKey, method );

                    if ( bind && bindAs ) {

                        ColorMethodRegistry.bind( methodKey, bindAs );

                    }

                } else {

                    throw new Utils.error( {
                        method: 'Module',
                        msg: `Method named <${methodKey}> is already declared`
                    } );

                }

            }

        }

    }

    /**
     * Unbinds all methods associated with a module.
     * 
     * @param id - Module ID
     */
    _unregisterMethods (
        id: string
    ) : void {

        if ( this.check( id ) ) {

            const { methods } = this.get( id ) as ModuleFactory;

            for ( const { id: name } of methods ) {

                ColorMethodRegistry.unbind( `${id}::${name}` );

            }

        }

    }

    /**
     * Checks whether a module is registered.
     * 
     * @param id - Module ID
     * @returns true if registered
     */
    has (
        id: string
    ) : boolean {

        return this.registry.has( id );

    }

    /**
     * Ensures a module is registered. Throws an error if not.
     * 
     * @param id - Module ID
     * @returns true if check passes
     * @throws If the module is not registered
     */
    check (
        id: string
    ) : boolean {

        if ( ! this.has( id ) ) {

            throw new Utils.error( {
                method: 'Module',
                msg: `The module <${id}> is not registered`
            } );

        }

        return true;

    }

    /**
     * Retrieves a module factory by its ID.
     * 
     * @param id - Module ID to retrieve
     * @param safe - Whether to throw an error if the module does not exist (default: `true`)
     * @returns The factory if found or `undefined` in safe mode
     */
    get (
        id: string,
        safe: boolean = true
    ) : ModuleFactory | undefined {

        if ( ! safe || this.check( id ) ) {

            return this.registry.get( id );

        }

    }

    /**
     * Returns a list of all registered module IDs.
     * 
     * @returns An array of registered module identifiers
     */
    getModules () : string[] {

        return Array.from(
            this.registry?.keys() ?? []
        );

    }

    /**
     * Retrieves optional meta-information associated with a module.
     * Returns `undefined` if no metadata is defined.
     * 
     * @param id - Module ID
     * @returns The `meta` field from the module factory, if defined
     */
    getMeta (
        id: string
    ) : any {

        return this.get( id )?.meta;

    }

    /**
     * Checks whether a module method is registered.
     * 
     * @param id - Method key in the format `<moduleId>::<methodId>`
     * @returns true if registered
     */
    hasMethod (
        key: string
    ) : boolean {

        return this.methodsRegistry.has( key );

    }

    /**
     * Ensures a module method is registered. Throws an error if not.
     * 
     * @param id - Method key
     * @returns true if check passes
     * @throws If the method is not registered
     */
    checkMethod (
        key: string
    ) : boolean {

        if ( ! this.hasMethod( key ) ) {

            throw new Utils.error( {
                method: 'Module',
                msg: `The method <${key}> is not registered`
            } );

        }

        return true;

    }

    /**
     * Returns all registered method keys, optionally filtered by string through regex.
     * 
     * @param filter - Optional string (regex) to filter method keys
     * @returns Array of (filtered) method keys
     */
    getMethods (
        filter?: string
    ) : string[] {

        return Array.from(
            this.methodsRegistry?.keys() ?? []
        ).filter(
            ( key ) => ! filter || key.match(
                new RegExp( filter, 'i' )
            )
        );

    }

    /**
     * Returns a map of all registered methods grouped by module ID.
     * 
     * @returns Object with keys as module IDs and values as arrays of method names
     */
    getMethodMap () : Record<string, string[]> {

        return Array.from(
            this.methodsRegistry.keys()
        ).reduce(
            ( map, key ) => (
                ( map[ key.split( '::' )[ 0 ] ] ??= [] ).push(
                    key.split( '::' )[ 1 ]
                ), map
            ), {} as Record<string, string[]>
        );

    }

    /**
     * Returns metadata associated with a specific method.
     * 
     * @param key - Method key `<moduleId>::<methodId>`
     * @returns Metadata object or undefined
     */
    getMethodMeta (
        key: string
    ) : any {

        return this.methodsRegistry.get( key )?.meta;

    }

    /**
     * Applies a registered method's logic to the input color object and optional
     * arguments.
     * 
     * Module methods are responsible for input validation and must adhere to the
     * expected behavior defined in their `ModuleMethodFactory.handler`.
     * 
     * @param key - Method key `<moduleId>::<methodId>`
     * @param input - ColorObject to be processed
     * @param args - Additional arguments forwarded to the module handler
     * @returns Any result returned by the module handler, e.g. ColorObject, array, or value
     * @throws If the module fails, color space is not supported or throws internally
     */
    apply (
        key: string,
        input: ColorObject,
        ...args: any[]
    ) : ColorObject | ColorObject[] | any {

        if ( this.checkMethod( key ) ) {

            try {

                const { spaces, handler } = this.methodsRegistry.get( key ) as ModuleMethodFactory;

                if ( 'strict' in args && ! spaces.includes( input.space ) ) {

                    throw new Utils.error( {
                        method: 'Module',
                        msg: `Method <${key}> does not support color space <${input.space}>`
                    } );

                }

                return handler( input, ...args );

            } catch ( err ) {

                throw new Utils.error( {
                    err, method: 'Module',
                    msg: `Error occurred in method <${key}>`
                } );

            }

        }

    }

}

/**
 * Singleton instance of the Module registry.
 * Used across all core packages and dynamic modules.
 */
export const module = new Module ();