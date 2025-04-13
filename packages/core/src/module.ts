/**
 * Pyxe Module Engine
 * src/module.ts
 * 
 * The Module Engine is an essential element of the pyxe core package and is used for
 * both the registration and execution of (calculation) modules containing a handler
 * function, supported color spaces and further arguments. During registration, if
 * specified, a method will be dynamically attached to the Color class to enable simple,
 * user-friendly API calls.
 * 
 * If a handler does not support a given color space, the module engine automatically
 * attempts to transform the color into a compatible one. After the calculation is
 * complete, the color will be converted back to its original color space. This behavior
 * can be prevented using the strict mode.
 * 
 * @package @pyxe/core
 * @requires @pyxe/types
 * 
 * @author Paul Köhler (komed3)
 * @license MIT
 */

import type {
    ColorObject,
    ModuleDefinition
} from '@pyxe/types';

import { ColorMethodRegistry } from './color.js';
import { conversionGraph } from './graph.js';

/**
 * Internal registry for all (calculation) modules.
 */
export class ModuleRegistry {

    private registry = new Map<string, ModuleDefinition> ();

    /**
     * Adds a new module to the registry.
     * If "expose" is true, the module will be attached as method to the Color class.
     * 
     * @param module - Module definition
     */
    add (
        module: ModuleDefinition
    ) : void {

        const { id, exposeAsMethod = false } = module;

        this.registry.set( id, module );

        if ( exposeAsMethod ) {

            ColorMethodRegistry.add( module );

        }

    }

    /**
     * Checks whether a module is registered or not.
     * 
     * @param id - Module name
     * @returns True if registered, false otherwise
     */
    has (
        id: string
    ) : boolean {

        return this.registry.has( id );

    }

    /**
     * Returns a full module object.
     * 
     * @param id - Module name
     * @returns Module or undefined
     */
    get (
        id: string
    ) : ModuleDefinition | undefined {

        return this.registry.get( id );

    }

    /**
     * Returns the full list of all registered modules.
     * 
     * @returns Array for module definitions
     */
    getModules () : ModuleDefinition[] {

        return Array.from( this.registry.values() );

    }

}

/**
 * The central module engine for apply handler functions.
 */
export class ModuleEngine {

    constructor (
        private registry: ModuleRegistry
    ) {}

    /**
     * Applying a module handler function.
     * 
     * @param id - Module name
     * @param color - Input color object
     * @param options - Optional arguments for the handler
     * @param strict - Enable strict mode
     * @returns The handlers return value (e.g. color object, numeric value etc.)
     * @throws Throws an error, if the handler cannot run or gets an error
     */
    apply (
        id: string,
        color: ColorObject,
        options?: Record<string, any>,
        strict = false
    ) : any {

        /** Check if the module is registered */
        if ( ! this.registry.has( id ) ) {

            throw new Error(
                `Module <${id}> is not registered.`
            );

        }

        /** Get module from registry, save initial color space */
        const { handler, spaces, options: defaultOptions } = this.registry.get( id ) as ModuleDefinition;
        const inputSpace = color.space;
        

        /** Check whether the color space is compatible */
        if ( ! spaces.includes( inputSpace ) ) {

            /** Try to convert color into supported color space */
            if ( ! strict && spaces.length ) {

                let converted = null;

                for ( const target of spaces ) {

                    try {

                        converted = conversionGraph.convert( color, target );
                        color = converted;

                        break;

                    } catch {

                        /**
                         * Individual conversion failed, continue
                         */

                    }

                }

                if ( ! converted ) {

                    throw new Error(
                        `Module <${id}> could not convert from <${inputSpace}> to any supported space.`
                    );

                }

            }

        }

        /** Call the module handler function */
        let result: any;

        try {

            result = handler( color, {
                ...defaultOptions,
                ...options
            } );

        } catch ( err ) {

            throw new Error(
                `Module <${id}> handler failed: ${err}`
            );

        }

        /** Convert back if needed and return result */
        try {

            const _tryConvert = ( obj: any ) : any =>
                ( obj?.space && obj?.value && obj.space !== inputSpace )
                    ? ( strict
                        ? conversionGraph.convert( obj, inputSpace )
                        : ( () => {
                            try { return conversionGraph.convert( obj, inputSpace ); }
                            catch { return obj; }
                        } )() )
                    : obj;

            return Array.isArray( result )
                ? result.map( _tryConvert )
                : _tryConvert( result );

        } catch ( err ) {

            throw new Error(
                `Module <${id}>: Failed to convert result back to <${inputSpace}>: ${err}`
            );

        }

    }

}

/**
 * Singleton instances of the module engine and registry.
 */
export const moduleRegistry = new ModuleRegistry ();
export const moduleEngine = new ModuleEngine ( moduleRegistry );