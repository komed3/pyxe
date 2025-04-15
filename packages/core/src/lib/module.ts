/**
 * Class Module
 * src/lib/module.ts
 * 
 * The core module manager for `pyxe` calculation modules provides a central registry and
 * runtime handler for all dynamic color modules (e.g., invert, lighten, contrast, gradients).
 * 
 * Each module registers itself via `_register()` using a `ModuleFactory` object. If
 * `exposeAsMethod` is true, the module is automatically attached to the Color class through
 * the `ColorMethodRegistry`.
 * 
 * Modules are invoked via `apply()` and are expected to handle their own input validation.
 * This design encourages separation of concerns and ensures that each module can define 
 * its own argument structure, constraints, and return types.
 * 
 * @package @pyxe/core
 * @requires @pyxe/types
 * @requires @pyxe/utils
 * 
 * @author Paul Köhler (komed3)
 * @license MIT
 */

'use strict';

import type { ColorObject, ModuleFactory } from '@pyxe/types';
import { Utils } from '@pyxe/utils';
import { ColorMethodRegistry } from './color.js';

/**
 * Central registry for pyxe's color operation modules.
 * Supports dynamic registration, safe retrieval, and module invocation.
 */
export class Module {

    /**
     * Internal registry for all declared modules.
     * Each entry is a module ID mapped to its corresponding factory.
     */
    private registry: Map<string, ModuleFactory> = new Map ();

    /**
     * Registers a new module by ID. If the module's `exposeAsMethod` flag is set to true,
     * it is automatically exposed on the Color instance via `ColorMethodRegistry`.
     * 
     * This method is intended to be called by modules during setup.
     * 
     * @param id - Unique identifier for the module
     * @param factory - Factory object implementing the module definition
     * @throws Error if a module with the same ID is already registered
     */
    _register (
        id: string,
        factory: ModuleFactory
    ) : void {

        if ( ! this.has( id ) ) {

            const { exposeAsMethod = false } = factory;

            this.registry.set( id, factory );

            if ( exposeAsMethod ) {

                ColorMethodRegistry.add( id, factory );

            }

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
     * @param id - Module ID to remove
     * @throws Error if the module does not exist
     */
    _unregister (
        id: string
    ) : void {

        if ( this.check( id ) ) {

            ColorMethodRegistry.remove( id );

            this.registry.delete( id );

        }

    }

    /**
     * Checks if a module with the given ID is registered.
     * 
     * @param id - The module ID to look up
     * @returns `true` if the module is registered, `false` otherwise
     */
    has (
        id: string
    ) : boolean {

        return this.registry.has( id );

    }

    /**
     * Verifies that a module is registered and throws an error if not.
     * 
     * @param id - Module ID to check
     * @returns `true` if the module exists
     * @throws Error if the module is not registered
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
     * @returns The factory if found, or `undefined` if `safe` is `false` and not found
     * @throws Error if `safe` is `true` and the module is not registered
     */
    get (
        id: string,
        safe = true
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
            this.registry.keys()
        );

    }

    /**
     * Retrieves optional meta-information associated with a module.
     * Returns `undefined` if no metadata is defined.
     * 
     * @param id - Module ID
     * @returns The `meta` field from the module factory, if defined
     * @throws Error if the module is not registered
     */
    getMeta (
        id: string
    ) : any {

        return this.get( id )?.meta;

    }

    /**
     * Applies a registered module's logic to the input color object and optional arguments.
     * 
     * Modules are responsible for input validation and must adhere to the expected
     * behavior defined in their `ModuleFactory.handler`.
     * 
     * @param id - Module ID
     * @param input - ColorObject to be processed
     * @param args - Additional arguments forwarded to the module handler
     * @returns Any result returned by the module handler, e.g. ColorObject, array, or value
     * @throws Error if the module fails to execute or throws internally
     */
    apply (
        id: string,
        input: ColorObject,
        ...args: any[]
    ) : ColorObject | ColorObject[] | any {

        if ( this.check( id ) ) {

            try {

                const { handler } = this.get( id ) as ModuleFactory;

                return handler( input, ...args );

            } catch ( err ) {

                throw new Utils.error( {
                    err, method: 'Module',
                    msg: `Error occurred in module <${id}>`
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