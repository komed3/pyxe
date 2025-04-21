'use strict';

import type { ColorSpaceID } from '@pyxe/types';
import { Utils } from '@pyxe/utils';
import { ConversionGraph } from './ConversionGraph.js';
import { ColorObject } from './ColorObject.js';

export class Convert {

    public static convert (
        input: ColorObject,
        target: ColorSpaceID | ColorSpaceID[],
        safe: boolean = false
    ) : ColorObject | undefined {

        const targets = Array.isArray( target ) ? target : [ target ];

        try {

            for ( const t of targets ) {

                try {

                    const handler = ConversionGraph.resolve( input.space, t );
                    const result = handler( input.toObject() );

                    if ( result ) {

                        const color = ColorObject.from( result );

                        if ( Utils.Services.tracer.isReady() ) {

                            Utils.Services.tracer.add(
                                color, Utils.tracerTemplates.convert(
                                    input, color, ConversionGraph.findPath( input.space, t )
                                )
                            );

                        }

                        return color;

                    }

                } catch ( err ) {

                    /** Skip failed target and continue */

                }

            }

        } catch ( err ) {

            if ( safe ) {

                throw new Utils.Services.error( {
                    err, method: 'Convert',
                    msg: `Conversion from color space <${input.space}> to any of <${
                        targets.join( ', ' )
                    }> has failed`
                } );

            }

        }

    }

    public static convertMany (
        input: ColorObject[],
        target: ColorSpaceID | ColorSpaceID[]
    ) : ColorObject[] {

        return input.map(
            ( obj ) => this.convert( obj, target, true )
        ) as ColorObject[];

    }

    public static tryConvert (
        input: any,
        target: ColorSpaceID | ColorSpaceID[],
        strict: boolean = false
    ) : ColorObject | unknown {

        try {

            return this.convert( input, target, false );

        } catch ( err ) {

            if ( strict ) {

                throw new Utils.Services.error( {
                    err, method: 'Convert',
                    msg: `Strict mode: The color space conversion has failed`
                } );

            } else {

                return input;

            }

        }

    }

    public static tryConvertMany (
        input: any | any[],
        target: ColorSpaceID | ColorSpaceID[],
        strict: boolean = false
    ) : ColorObject[] | ColorObject | unknown {

        return Array.isArray( input )
            ? input.map( ( obj ) => this.tryConvert( obj, target, strict ) )
            : this.tryConvert( input, target, strict );

    }

}