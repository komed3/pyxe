'use strict';

import type { ColorSpaceName } from '@pyxe/types';
import { ConversionGraph } from './ConversionGraph.js';
import { ColorObject } from './ColorObject.js';
import { tracer, tracerTemplates as tpl } from './services/Tracer.js';
import { PyxeError } from './services/PyxeError.js';

export class Convert {

    public static convert (
        input: ColorObject,
        target: ColorSpaceName | ColorSpaceName[],
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

                        if ( tracer.isReady() ) {

                            tracer.add( color, tpl.convert(
                                input, color, ConversionGraph.findPath( input.space, t )
                            ) );

                        }

                        return color;

                    }

                } catch {

                    /** Skip failed target and continue */

                }

            }

        } catch ( err ) {

            if ( safe ) {

                throw new PyxeError ( {
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
        target: ColorSpaceName | ColorSpaceName[]
    ) : ColorObject[] {

        return input.map(
            ( obj ) => this.convert( obj, target, true )
        ) as ColorObject[];

    }

    public static tryConvert (
        input: any,
        target: ColorSpaceName | ColorSpaceName[],
        strict: boolean = false
    ) : ColorObject | unknown {

        try {

            return this.convert( input, target, false );

        } catch ( err ) {

            if ( strict ) {

                throw new PyxeError ( {
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
        target: ColorSpaceName | ColorSpaceName[],
        strict: boolean = false
    ) : ColorObject[] | ColorObject | unknown {

        return Array.isArray( input )
            ? input.map( ( obj ) => this.tryConvert( obj, target, strict ) )
            : this.tryConvert( input, target, strict );

    }

}