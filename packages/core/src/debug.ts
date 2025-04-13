/**
 * Debugger
 * src/debug.ts
 * 
 * The `Debugger` class provides a centralized mechanism for enabling and recording
 * debug information related to color object transformations within the pyxe framework.
 * It is primarily responsible for tracing intermediate conversion steps, which are
 * stored inside the `meta.trace` property of a `ColorObject`.
 * 
 * This class is designed for internal use, allowing optional activation of tracing
 * for development, diagnostics, or advanced analysis. It can be integrated into all
 * transformation pipelines, such as parsing, converting, or applying modules.
 * 
 * This component serves for visual tracing, logging and runtime analysis.
 * 
 * @package @pyxe/core
 * @requires @pyxe/types
 * 
 * @author Paul Köhler (komed3)
 * @license MIT
 */

import {
    DebugTrace,
    ColorInput,
    ColorObject
} from '@pyxe/types';

/**
 * Centralized debug and trace handler for internal diagnostics and transformation tracking.
 */
export class Debugger {

    constructor(
        private enabled = false
    ) {}

    /**
     * Enables or disables debug mode globally.
     * 
     * @param enable - Activate or deactivate the debugger
     */
    set (
        enable: boolean
    ) : void {

        this.enabled = enable;

    }

    /**
     * Returns whether debug mode is currently enabled.
     * 
     * @returns True if debugger is enabled, false otherwise
     */
    on () : boolean {

        return this.enabled;

    }

    /**
     * Records a trace entry on a given color object, if debugging is enabled.
     * This is used to track transformations, module calls, or other internal operations.
     * 
     * @param obj - Color object whose trace history should be extended
     * @param entry - A partial trace entry containing metadata about the operation
     */
    trace (
        obj: ColorObject,
        entry: Partial<DebugTrace>
    ) : void {

        if ( this.enabled ) {

            obj.meta || ( obj.meta = {} );
            obj.meta.trace || ( obj.meta.trace = [] );

            obj.meta.trace.push( {
                ...entry,
                timestamp: Date.now()
            } );

        }

    }

}

/**
 * Singleton instance of the Debugger.
 * Use this instance to globally enable, disable or write debug traces.
 */
export const debug = new Debugger ();

/**
 * Debug templates serve as normalized patterns to generate a
 * consistent trace for different operations.
 */
export const debugTemplates = {

    parse: (
        input: ColorInput,
        result: ColorObject
    ) : Partial<DebugTrace> => ( {
        action: 'parse',
        meta: {
            input, result,
            from: 'string',
            to: result.space
        }
    } ),

    convert: (
        input: ColorObject,
        result: ColorObject,
        path?: string[] | unknown
    ) : Partial<DebugTrace> => ( {
        action: 'convert',
        meta: {
            input, result,
            from: input.space,
            to: input.space,
            via: path ?? 'direct'
        }
    } ),

    module: (
        id: string,
        input: ColorObject,
        result: ColorObject
    ) : Partial<DebugTrace> => ( {
        action: `module:${id}`,
        meta: {
            input, result
        }
    } )

};