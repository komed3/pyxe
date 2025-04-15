/**
 * Utils Class Tracer
 * src/lib/tracer.ts
 * 
 * The tracer module provides optional runtime tracing of color operations within the
 * pyxe framework. It allows capturing metadata related to parsing, conversion, and
 * color space transformations for debugging, introspection, and analytical purposes.
 * 
 * Tracing is designed to be lightweight and non-intrusive. It is disabled by default
 * and must be explicitly enabled by calling `tracer.enable()`. Once active, all
 * operations that support tracing will push structured metadata entries into a trace
 * log attached to a given `ColorObject` under `meta.trace`.
 * 
 * The module exposes both a `Tracer` class and a singleton instance `tracer`, along
 * with helper templates for common tracing patterns via `tracerTemplates`.
 * 
 * @package @pyxe/utils
 * @requires @pyxe/types
 * 
 * @author Paul Köhler (komed3)
 * @license MIT
 */

'use strict';

import { ColorInput, ColorObject, TracerFactory } from '@pyxe/types';

/**
 * Manages tracing of color operations by storing structured trace entries on color
 * objects. This is used internally by the pyxe framework to support debugging,
 * transformation analysis, and step-by-step color evaluation.
 */
export class Tracer {

    /**
     * Creates a new Tracer instance.
     * 
     * @param state - Whether tracing is currently enabled
     */
    constructor (
        private state: boolean = false
    ) {}

    /**
     * Internal method for adding a trace entry to a color object.
     * 
     * @param obj - The target color object to which the trace entry should be added
     * @param entry - The trace entry describing the action performed
     * @param flush - Whether to flush previous traces on the input object
     */
    _add (
        obj: ColorObject,
        entry: Partial<TracerFactory>,
        flush = false
    ) : void {

        if ( this.state ) {

            obj.meta || ( obj.meta = {} );
            obj.meta.trace || ( obj.meta.trace = [] );

            if ( flush && entry.meta?.input ) {

                this._flush( entry.meta.input as ColorObject );

            }

            obj.meta.trace.push( {
                ...entry,
                timestamp: new Date()
            } );

        }

    }

    /**
     * Clears all trace entries from the given color object.
     * 
     * @param obj - The color object whose trace history should be cleared
     */
    _flush (
        obj: ColorObject
    ) : void {

        if ( obj.meta?.trace ) {

            obj.meta.trace = [];

        }

    }

    /**
     * Enables the tracer globally. Required to activate tracing behavior.
     */
    enable () : void {

        this.state = true;

    }

    /**
     * Disables the tracer globally. Further trace entries will not be recorded.
     */
    disable () : void {

        this.state = false;

    }

    /**
     * Indicates whether tracing is currently enabled.
     * 
     * @returns `true` if tracing is enabled, `false` otherwise
     */
    isReady () : boolean {

        return this.state;

    }

    /**
     * Retrieves the list of trace entries from a given color object.
     * 
     * @param obj - The color object containing trace metadata
     * @returns An array of TracerFactory entries or undefined if none exist
     */
    get (
        obj: ColorObject
    ) : TracerFactory[] | undefined {

        return obj.meta?.trace;

    }

}

/**
 * Singleton instance of the Tracer class.
 * Used for tracing across the pyxe framework.
 */
export const tracer = new Tracer ();

/**
 * Predefined trace templates for common color processing actions.
 * Each template returns a partial TracerFactory object that can be passed to
 * the `tracer._add()` method.
 */
export const tracerTemplates = {

    /**
     * Template for a parsing operation.
     * 
     * @param input - The original user input before parsing
     * @param result - The resulting color object after parsing
     * @returns A trace entry describing the parse action
     */
    parse: (
        input: ColorInput,
        result: ColorObject
    ) : Partial<TracerFactory> => ( {
        action: 'parse',
        meta: {
            input, result,
            source: 'string',
            target: result.space
        }
    } ),

    /**
     * Template for a color space conversion.
     * 
     * @param input - The original color object
     * @param result - The result after conversion
     * @param path - Optional array of intermediate steps or transformation path
     * @returns A trace entry describing the conversion action
     */
    convert: (
        input: ColorObject,
        result: ColorObject,
        path?: string[] | unknown
    ) : Partial<TracerFactory> => ( {
        action: 'convert',
        meta: {
            input, result,
            source: input.space,
            target: result.space,
            path: path ?? null
        }
    } ),

    /**
     * Template for a generic color module operation.
     * 
     * @param module - The name of the module (e.g., 'invert', 'lighten')
     * @param input - The input color object before applying the module
     * @param result - The resulting color object after transformation
     * @returns A trace entry describing the module operation
     */
    module: (
        module: string,
        input: ColorObject,
        result: ColorObject
    ) : Partial<TracerFactory> => ( {
        action: `module::${module.toLowerCase()}`,
        meta: {
            input, result
        }
    } )

};