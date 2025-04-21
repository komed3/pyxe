'use strict';

import type { ColorSpaceID, ColorInput } from '@pyxe/types';
import { Utils } from '@pyxe/utils';
import { colorSpaceRegistry } from './ColorSpaceRegistry.js';
import { ColorObject } from './ColorObject.js';

export class Parser {

    public static parseFor (
        input: ColorInput,
        space: ColorSpaceID
    ) : ColorObject | undefined {

        try {

            const { parser: handler } = colorSpaceRegistry.get( space )!;

            if ( handler && typeof handler === 'function' ) {

                const result = handler( input );

                if ( result ) {

                    // Tracer

                    return ColorObject.from( result );

                }

            }

        } catch ( err ) {

            /** Ignore individual parser errors and continue */

        }

    }

    public static parse (
        input: ColorInput,
        safe: boolean = true
    ) : ColorObject | undefined {

        try {

            for ( const space of colorSpaceRegistry.list() ) {

                const result = this.parseFor( input, space );

                if ( result ) {

                    return result;

                }

            }

        } catch ( err ) {

            if ( safe ) {

                throw new Utils.Services.error( {
                    err, method: 'Parser',
                    msg: `No suitable parser found for input <${
                        JSON.stringify( input )
                    }>`
                } );

            }

        }

    }

    public static isParsable (
        input: ColorInput
    ) : boolean {

        return this.parse( input, false ) !== undefined;

    }

}