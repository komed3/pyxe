'use strict';

import { ColorSpaceID, ColorInput, ColorSpaceFactory } from '@pyxe/types';
import { Utils } from '@pyxe/utils';
import { colorSpaceRegistry } from './ColorSpaceRegistry.js';
import { ColorObject } from './ColorObject.js';

export class Parser {

    public static parseFor (
        input: ColorInput,
        space: ColorSpaceID
    ) : ColorObject | undefined {

        Utils.Services.hook.run( 'Parser.beforeParse', input, space );

        try {

            const { parser: handler } = colorSpaceRegistry.get( space ) as ColorSpaceFactory;

            if ( handler && typeof handler === 'function' ) {

                const result = handler( input );

                if ( result ) {

                    return new ColorObject ( result.space, result.value );

                }

            }

        } catch ( err ) {

            /** Ignore individual parser errors and continue */

            Utils.Services.hook.runDeferred( 'Parser.failed', input, space, err );

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

                Utils.Services.hook.run( 'Parser.failSafe', input, err );

                throw new Utils.Services.error ( {
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