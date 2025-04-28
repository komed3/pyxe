'use strict';

import type { ColorSpaceName, ColorObjectFactory } from '@pyxe/types';
import { TypeCheck } from '@pyxe/utils';
import { conversionGraph } from './ConversionGraph.js';
import { hook } from '../services/Hook.js';
import { assert, catchToError } from '../services/ErrorUtils.js';
import { debug } from '../services/Debug.js';

export class Convert {

    constructor (
        private input: ColorObjectFactory | any,
        private safe: boolean = false
    ) {

        assert( ! this.safe || TypeCheck.ColorObjectFactory( this.input ), {
            method: 'Convert',
            msg: `Conversion from <${ JSON.stringify( this.input ) }> not possible`
        } );

    }

    public to (
        target: ColorSpaceName[] | ColorSpaceName,
        strict: boolean = true
    ) : ColorObjectFactory | undefined {

        hook.run( 'Convert::beforeConvert', target, strict, this );

        if ( TypeCheck.ColorObjectFactory( this.input ) ) {

            const targets = Array.isArray( target ) ? target : [ target ];

            catchToError( () => {

                for ( const t of targets ) {

                    try {

                        const handler = conversionGraph.resolve( this.input.space, t );
                        const result = handler && handler( this.input );

                        if ( result ) {

                            hook.run( 'Convert::afterConvert', result, target, strict, this );

                            return hook.filter( 'Convert::result', result, target, strict, this ) as ColorObjectFactory;

                        }

                    } catch {

                        /** Skip failed target and continue */

                        debug.info( 'Convert', `Unable to convert <${ JSON.stringify( this.input ) }> to <${t}>` );

                    }

                }

            }, {
                method: 'Convert',
                msg: `Conversion of <${ JSON.stringify( this.input ) }> to any of <${ targets.join( ', ' ) }> has failed`
            }, this.safe );

        }

        return hook.filter( 'Convert::any', strict ? undefined : this.input, target, strict, this );

    }

    public toAll (
        targets: ColorSpaceName[],
        strict: boolean = true
    ) : Record<ColorSpaceName, ColorObjectFactory | any | undefined> {

        return Object.fromEntries( targets.map(
            ( t ) => [ t, this.to( t, strict ) ]
        ) );

    }

    public static manyTo (
        inputs: ( ColorObjectFactory | any )[],
        target: ColorSpaceName[] | ColorSpaceName,
        strict: boolean = false
    ) : ( ColorObjectFactory | undefined )[] {

        return inputs.map(
            ( input ) => ( new Convert ( input, false ) ).to( target, strict )
        );

    }

    public static manyToAll (
        inputs: ( ColorObjectFactory | any )[],
        target: ColorSpaceName[],
        strict: boolean = false
    ) : Record<string, any>[] {

        return inputs.map(
            ( input ) => ( new Convert ( input, false ) ).toAll( target, strict )
        );

    }

}