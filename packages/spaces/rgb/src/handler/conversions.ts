'use strict';

import type { RGB, ColorObjectFactory, ConversionFactory } from '@pyxe/types';
import { Numeral } from '@pyxe/utils';

export const conversions: ConversionFactory = {

    HEX: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'RGB' ) {

            const { r, g, b, a } = input.value as RGB;

            const parts = [ r, g, b ].map(
                ( c ) => Numeral.dechex( c )
            );

            return {
                space: 'HEX',
                value: `#${ parts.join( '' ) }${ Numeral.dechexAlpha( a ) }`,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    }

};