/**
 * Utils Class PyxeError (extends Error)
 * src/lib/error.ts
 * 
 * This module defines the `PyxeError` class, a custom error type for consistent and
 * informative error handling throughout the `pyxe` framework. It extends the native
 * `Error` class and adds support for formatted timestamps, method tagging, optional
 * extra error information, and multiple logging methods (log, warn, info). It is
 * designed to be used across all internal modules and allows easy debugging and
 * structured error reporting.
 * 
 * Errors are formatted in the following structure:
 *     <TIME> [<METHOD>] <MESSAGE>(: <EXTRA>)
 *     <STACK TRACE>
 * 
 * The `toString()` method provides either full stack traces or concise summaries.
 * Use `log()`, `warn()` or `info()` for contextual logging.
 * 
 * @package @pyxe/utils
 * @requires @pyxe/types
 * 
 * @author Paul Köhler (komed3)
 * @license MIT
 */

'use strict';

import { ErrorFactory } from '@pyxe/types';

/**
 * Custom error class for standardized error formatting and output.
 * Used across the pyxe framework for consistent developer-facing error messages.
 */
export class PyxeError extends Error {

    /** Formatted header line including timestamp, method and message */
    readonly header: string;

    /** Time of error creation, formatted as HH:MM:SS */
    readonly timestamp: string;

    /** Name of the method or module where the error originated */
    readonly method: string;

    /** Optional error message provided at creation */
    readonly msg?: string;

    /** Optional extracted message from nested Error or any other input */
    readonly extra?: string;

    /**
     * Constructs a new PyxeError instance using the given factory object.
     * 
     * @param factory - An object containing method name, optional message and inner error
     */
    constructor (
        factory: ErrorFactory
    ) {

        const { method, msg, err } = factory;

        const time = ( new Date() ).toLocaleTimeString(
            'en-US', { hour12: false, timeStyle: 'medium' }
        );

        const extra = err
            ? ( err instanceof Error ? err.message : String ( err ) )
            : undefined;

        const header = `${time} [${
            method.toUpperCase()
        }] ${ msg ?? '' }${
            extra ? `: ${extra}` : ''
        }`;

        super( header );

        this.name = 'PyxeError';

        this.header = header;
        this.timestamp = time;
        this.method = method;
        this.msg = msg;
        this.extra = extra;

    }

    /**
     * Converts the error to a formatted string, optionally including the stack trace.
     * 
     * @param trace - Whether to include the full stack trace (default: true)
     * @returns A human-readable error message
     */
    toString (
        trace: boolean = true
    ) : string {

        if ( trace ) {

            return `${this.header}\n${
                this.stack?.split( '\n' ).slice( 1 ).join( '\n' ) ?? ''
            }`;

        }

        return this.header;

    }

    /**
     * Logs the error using `console.error()`. Includes stack trace by default.
     * 
     * @param trace - Whether to include the full stack trace (default: true)
     */
    log (
        trace: boolean = true
    ) : void {

        console.error( this.toString( trace ) );

    }

    /**
     * Logs the error using `console.warn()`. Omits stack trace by default.
     * 
     * @param trace - Whether to include the stack trace (default: false)
     */
    warn (
        trace: boolean = false
    ) : void {

        console.warn( this.toString( trace ) );

    }

    /**
     * Logs the error using `console.info()`. Omits stack trace by default.
     * 
     * @param trace - Whether to include the stack trace (default: false)
     */
    info (
        trace: boolean = false
    ) : void {

        console.info( this.toString( trace ) );

    }

}