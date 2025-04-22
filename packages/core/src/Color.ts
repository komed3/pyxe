'use strict';

import type { ColorInput } from '@pyxe/types';
import { ColorObject } from './ColorObject.js';
import { Parser } from './Parser.js';
import { PyxeError } from './utils/PyxeError';

export class Color extends ColorObject {

    public static parse (
        input: ColorInput,
        safe: boolean = true
    ) : Color | undefined {

        try {

            return Color.from( Parser.parse( input )!.toObject() );

        } catch ( err ) {

            if ( safe ) {

                throw new PyxeError ( {
                    err, method: 'Color',
                    msg: `Failed to parse input <${input}>`
                } );

            }

        }

    }

}