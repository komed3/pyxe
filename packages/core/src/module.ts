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
    ColorSpaceId,
    ColorObject,
    ModuleDefinition
} from '@pyxe/types';

import { ColorMethodRegistry } from './color.js';
import { convert } from './convert.js';

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
     * Applies a registered color module.
     *
     * @param id - Module name
     * @param input - Primary input color object
     * @param args - Additional colors or parameters (ColorObject[], options?, strict?)
     * @returns The module result (converted back to original input space if applicable)
     * @throws Throws an error, if the handler cannot run or encounters an error
     */
    apply (
        id: string,
        input: ColorObject,
        ...args: any[]
    ) : ColorObject | ColorObject[] | any {

        /** Check if the module is registered */
        if ( ! this.registry.has( id ) ) {

            throw new Error(
                `Module <${id}> is not registered.`
            );

        }

        /** Get module from registry */
        const {
            handler, spaces, multiInput = false,
            options: defaultOptions = []
        } = this.registry.get( id ) as ModuleDefinition;

        /** Extract optional options from the tail */
        const options = (
            typeof args.at( -1 ) === 'object' &&
            !Array.isArray( args.at( -1 ) )
        ) ? args.pop() : {};

        /** Check, if strict mode is enabled */
        const strict = options?.strict ?? false;

        /** Collect all color inputs */
        const allColors = [
            input, ...args.filter(
                ( val ) => val && typeof val === 'object' && 'space' in val
            )
        ];

        /** Map original color spaces */
        const originalSpaces = allColors.map(
            ( obj ) => obj.space
        );

        /** Convert color object to desired color space */
        let convertedColors: ColorObject[];

        // ...

    }

}

/**
 * Singleton instances of the module engine and registry.
 */
export const moduleRegistry = new ModuleRegistry ();
export const moduleEngine = new ModuleEngine ( moduleRegistry );