'use strict';

import type { ErrorFactory } from '@pyxe/types';
import { PyxeError } from './PyxeError.js';

export function handleError (
    factory: ErrorFactory,
    safe: boolean = true
) : false {

    const pyxeError = new PyxeError ( factory );

    if ( safe ) {

        throw pyxeError;

    } else {

        pyxeError.log();

    }

    return false;

}

export function catchToError<T> (
    fn: () => T,
    factory: ErrorFactory,
    safe: boolean = true
) : T | undefined {

    try {

        return fn();

    } catch ( err ) {

        handleError( { ...factory, ...{ err } }, safe );

        return undefined;

    }

}

export function assert (
    condition: unknown,
    factory: ErrorFactory
) : asserts condition {

    if ( ! condition ) {

        throw new PyxeError ( factory );

    }

}

export function check (
    condition: unknown,
    factory: ErrorFactory,
    safe: boolean = true
) : boolean {

    if ( ! condition ) {

        handleError( factory, safe );

        return false;

    }

    return true;

}

export function checkAll (
    conditions: [ unknown, ErrorFactory ][],
    safe: boolean = true
) : boolean {

    for ( const [ condition, factory ] of conditions ) {

        if ( ! check( condition, factory, safe ) ) {

            return false;

        }

    }

    return true;

}