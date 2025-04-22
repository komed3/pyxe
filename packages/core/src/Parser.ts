'use strict';

import type { ColorSpaceName, ColorInput } from '@pyxe/types';
import { colorSpaceRegistry } from './registry/ColorSpaceRegistry.js';
import { tracer, tracerTemplates as tpl } from './utils/Tracer.js';
import { ColorObject } from './ColorObject.js';
import { PyxeError } from './utils/PyxeError.js';

export class Parser {

    public static parseFor (
        input: ColorInput,
        space: ColorSpaceName
    ) : ColorObject | undefined {

        try {

            const { parser: handler } = colorSpaceRegistry.get( space )!;

            if ( handler && typeof handler === 'function' ) {

                const result = handler( input );

                if ( result ) {

                    const color = ColorObject.from( result );

                    if ( tracer.isReady() ) {

                        tracer.add( color, tpl.parse( input, color ) );

                    }

                    return color;

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

                throw new PyxeError ( {
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