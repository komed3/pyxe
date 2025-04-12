/**
 * Calculation Module Engine
 * src/module.ts
 * 
 * ...
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

/**
 * Internal registry for all (calculation) modules.
 */
export class ModuleRegistry {

    private registry = new Map<string, ModuleDefinition> ();

    /**
     * Adds a new module.
     * 
     * @param module - Module definition
     */
    add (
        module: ModuleDefinition
    ) : void {

        const { id, exposeAsMethod } = module;

        this.registry.set( id, module );

        if ( exposeAsMethod ) {

            //

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