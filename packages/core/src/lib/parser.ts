'use strict';

import type { ColorInput, ColorObject, ColorSpaceFactory } from '@pyxe/types';

import { ErrorHandler } from '@pyxe/utils/lib/errorHandler.js';
import { tracer, tracerTemplates } from '@pyxe/utils/lib/tracer.js';

import { colorSpace } from './colorSpace.js';

export class Parser {

    static parse (
        input: ColorInput
    ) : ColorObject {

        try {

            for ( const space of colorSpace.getSpaces() ) {

                try {

                    const { parser: handler } = colorSpace.get( space ) as ColorSpaceFactory;

                    if ( handler && typeof handler === 'function' ) {

                        const result = handler( input );

                        if ( result ) {

                            if ( tracer.on() ) {

                                tracer._trace( result, tracerTemplates.parse(
                                    input, result
                                ) );
        
                            }

                            return result;

                        }

                    }

                } catch {}

            }

        } catch ( err ) {

            ErrorHandler.throw( {
                err, method: 'Parser',
                msg: `No suitable parser found for input <${
                    JSON.stringify( input )
                }>`
            } );

        }

    }

    static try (
        input: ColorInput
    ) : boolean {

        try {

            this.parse( input );

        } catch {

            return false;

        }

        return true;

    }

}