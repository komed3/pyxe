'use strict';

import { RGB, ColorObject, ConversionFactory } from '@pyxe/types';

export const conversions: ConversionFactory = {

    HEX: (
        input: ColorObject | undefined
    ) : ColorObject | undefined => {

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
            } as ColorObject;

        }

        return undefined;

    }

};