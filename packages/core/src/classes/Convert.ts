'use strict';

import { ColorSpaceID, ColorObjectFactory } from '@pyxe/types';
import { Utils } from '@pyxe/utils';
import { ConversionGraph } from './ConversionGraph.js';
import { ColorObject } from './ColorObject.js';

export class Convert {

    public static convert (
        input: ColorObjectFactory,
        target: ColorSpaceID | ColorSpaceID[],
        safe: boolean = false
    ) : ColorObject | undefined {

        Utils.Services.hook.run( 'Convert.beforeConvert', input, target, safe );

        const targets = Array.isArray( target ) ? target : [ target ];

        try {

            for ( const t of targets ) {

                try {

                    const handler = ConversionGraph.resolve( input.space, t );
                    const result = handler( input );

                    if ( result ) {

                        // Tracer

                        return ColorObject.from( result );

                    }

                } catch ( err ) {

                    /** Skip failed target and continue */

                    Utils.Services.hook.runDeferred( 'Convert.failed', input, target, err );

                }

            }

        } catch ( err ) {

            if ( safe ) {

                throw new Utils.Services.error ( {
                    err, method: 'Convert',
                    msg: `Conversion from color space <${input.space}> to any of <${
                        targets.join( ', ' )
                    }> has failed`
                } );

            }

        }

    }

    public static convertMany (
        input: ColorObjectFactory[],
        target: ColorSpaceID | ColorSpaceID[]
    ) : ColorObject[] {

        try {

            return input.map(
                ( obj ) => this.convert( obj, target, true )
            ) as ColorObject[];

        } catch ( err ) {

            throw err;

        }

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

                throw new Utils.Services.error ( {
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

        try {

            return Array.isArray( input )
                ? input.map( ( obj ) => this.tryConvert( obj, target, strict ) )
                : this.tryConvert( input, target, strict );

        } catch ( err ) {

            throw new Utils.Services.error ( {
                err, method: 'Convert',
                msg: `Strict mode: A color space conversion has failed`
            } );

        }

    }

}