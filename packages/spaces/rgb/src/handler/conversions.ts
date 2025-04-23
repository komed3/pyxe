'use strict';

import { RGB, ColorObjectFactory, ConversionFactory } from '@pyxe/types';

export const conversions: ConversionFactory = {

    HEX: (
        input: ColorObjectFactory
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'RGB' ) {

            const { r: red, g: green, b: blue, a: alpha } = input.value as RGB;

            const _toHex = (
                v: number
            ) : string => (
                Math.round( v ).toString( 16 ).padStart( 2, '0' )
            );

            return {
                space: 'HEX',
                value: `#${ _toHex( red ) }${ _toHex( green ) }${ _toHex( blue ) }` + (
                    alpha !== undefined ? _toHex( Math.round( alpha * 255 ) ) : ''
                ),
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

        return undefined;

    }

};