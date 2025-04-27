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