'use strict';

import { HEX, RGB, ColorObject, ModuleMethodFactory } from '@pyxe/types';

export const invert: ModuleMethodFactory = {
    id: 'invert',
    spaces: [ 'HEX', 'RGB' ],
    bindAs: 'invert',
    handler: (
        input: ColorObject,
        options?: Record<string, any>
    ) : ColorObject | undefined => {

        switch ( input.space ) {

            case 'HEX':
                const hex = ( input.value as HEX ).toString();
                return {
                    space: 'HEX',
                    value: `#${ (
                        ( parseInt( hex.slice( 1 ), 16 ) ^ 0xffffff ).toString( 16 ).padStart( 6, '0' )
                    ) }${ ( hex.length === 9 ? hex.slice( 7 ) : '' ) }`,
                    meta: input.meta ?? {}
                } as ColorObject;

            case 'RGB':
                const { r, g, b, a } = input.value as RGB;
                return {
                    space: 'RGB',
                    value: {
                        r: 255 - r, g: 255 - g, b: 255 - b,
                        ...( a !== undefined ? { a } : {} )
                    },
                    meta: input.meta ?? {}
                } as ColorObject;

            default:
                return undefined;

        }

    }
};