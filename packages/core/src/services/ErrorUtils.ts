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

    }

    pyxeError.log();

    return false;

}

export function catchToError<T> (
    fn: () => T,
    factory: ErrorFactory,
    safe: boolean = true
) : T | false {

    try {

        return fn();

    } catch ( err ) {

        return handleError( { ...factory, err }, safe );

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

    return ! condition
        ? handleError( factory, safe )
        : true;

}

export function checkAll (
    conditions: Array<[unknown, ErrorFactory]>,
    safe: boolean = true
) : boolean {

    for ( const [ condition, factory ] of conditions ) {

        if ( ! check( condition, factory, safe ) ) {

            return false;

        }

    }

    return true;

}