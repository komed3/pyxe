'use strict';

import { ColorSpaceID, ColorObject } from '@pyxe/types';

import { ErrorHandler } from '@pyxe/utils/lib/errorHandler.js';
import { tracer, tracerTemplates } from '@pyxe/utils/lib/tracer.js';

import { conversionGraph, type ConversionGraph } from './graph.js';

export class Convert {

    constructor (
        private graph: ConversionGraph
    ) {}

    convert (
        input: ColorObject,
        target: ColorSpaceID
    ) : ColorObject {

        try {

            const handler = this.graph.resolve( input.space, target );
            const result = handler( input );

            if ( tracer.on() ) {

                tracer._trace( result, tracerTemplates.convert(
                    input, result,
                    this.graph.findPath( input.space, target )
                ) );

            }

            return result;

        } catch ( err ) {

            ErrorHandler.throw( {
                err, method: 'Convert',
                msg: `Conversion from color space <${input.space}> to <${target}> has failed`
            } );

        }

    }

    convertMany (
        input: ColorObject[],
        target: ColorSpaceID
    ) : ColorObject[] {

        try {

            return input.map(
                ( obj ) => this.convert( obj, target )
            );

        } catch ( err ) {

            throw err;

        }

    }

    tryConvert (
        input: any,
        target: ColorSpaceID,
        strict: boolean = false
    ) : ColorObject | unknown {

        try {

            return ( input?.space && input?.value && input.space !== target )
                ? ( strict
                    ? this.convert( input, target )
                    : ( () => {
                        try { return this.convert( input, target ); }
                        catch { return input; }
                    } )()
                )
                : input;

        } catch ( err ) {

            ErrorHandler.throw( {
                err, method: 'Convert',
                msg: `Strict mode: The color space conversion has failed`
            } );

        }

    }

    tryConvertMany (
        input: any,
        target: ColorSpaceID,
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