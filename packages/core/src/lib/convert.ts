'use strict';

import type { ColorSpaceID, ColorObject } from '@pyxe/types';

import { ErrorHandler } from '@pyxe/utils/lib/errorHandler.js';
import { tracer, tracerTemplates } from '@pyxe/utils/lib/tracer.js';
import { conversionGraph, type ConversionGraph } from './graph.js';

export class Convert {

    constructor (
        private graph: ConversionGraph
    ) {}

    convert (
        input: ColorObject,
        target: ColorSpaceID | ColorSpaceID[]
    ) : ColorObject | undefined {

        const targets = Array.isArray( target ) ? target : [ target ];

        try {

            for ( const t of targets ) {

                try {

                    const handler = this.graph.resolve( input.space, t );
                    const result = handler( input );

                    if ( result && tracer.on() ) {

                        tracer._trace( result, tracerTemplates.convert(
                            input, result,
                            this.graph.findPath( input.space, t )
                        ) );

                    }

                    return result as ColorObject;

                } catch {

                    /** Ignore individual conversion errors and continue */

                }

            }

        } catch ( err ) {

            ErrorHandler.throw( {
                err, method: 'Convert',
                msg: `Conversion from color space <${input.space}> to any of <${
                    targets.join( ', ' )
                }> has failed`
            } );

        }

    }

    convertMany (
        input: ColorObject[],
        target: ColorSpaceID | ColorSpaceID[]
    ) : ColorObject[] {

        try {

            return input.map(
                ( obj ) => this.convert( obj, target )
            ) as ColorObject[];

        } catch ( err ) {

            throw err;

        }

    }

    tryConvert (
        input: any,
        target: ColorSpaceID | ColorSpaceID[],
        strict: boolean = false
    ) : ColorObject | unknown {

        try {

            return this.convert( input, target );

        } catch ( err ) {

            if ( strict ) {

                ErrorHandler.throw( {
                    err, method: 'Convert',
                    msg: `Strict mode: The color space conversion has failed`
                } );

            } else {

                return input;

            }

        }

    }

    tryConvertMany (
        input: any,
        target: ColorSpaceID | ColorSpaceID[],
        strict: boolean = false
    ) : ColorObject[] | ColorObject | unknown {

        try {

            return Array.isArray( input )
                ? input.map( ( obj ) => this.tryConvert( obj, target, strict ) )
                : this.tryConvert( input, target, strict );

        } catch ( err ) {

            ErrorHandler.throw( {
                err, method: 'Convert',
                msg: `Strict mode: A color space conversion has failed`
            } );

        }

    }

}

export const convert = new Convert ( conversionGraph );