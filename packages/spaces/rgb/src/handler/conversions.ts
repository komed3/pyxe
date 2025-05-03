'use strict';

import type { RGB, ColorObjectFactory, ConversionFactory } from '@pyxe/types';
import { ChannelHelper } from '@pyxe/utils';
import { channels } from './channels.js';
import { minMaxDelta, computeHue } from './helper.js';

export const conversions: ConversionFactory = {

    hsl: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'rgb' ) {

            const { r, g, b } = ChannelHelper.normalizeInstance( input.value, channels ) as RGB;
            const { min, max, delta } = minMaxDelta( r, g, b );

            const l = ( max + min ) / 2;
            let h = 0, s = 0;

            if ( delta !== 0 ) {

                h = computeHue( r, g, b, max, delta );

                s = l < 0.5
                    ? delta / ( max + min )
                    : delta / ( 2 - max - min );

            }

            return {
                space: 'hsl',
                value: { h, s, l },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    },

    hsv: (
        input: ColorObjectFactory | undefined
    ) : ColorObjectFactory | undefined => {

        if ( input && input.space === 'rgb' ) {

            const { r, g, b } = ChannelHelper.normalizeInstance( input.value, channels ) as RGB;
            const { max, delta } = minMaxDelta( r, g, b );

            const v = max;
            let h = 0, s = 0;

            if ( delta !== 0 ) {

                h = computeHue( r, g, b, max, delta );

                s = delta / max;

            }

            return {
                space: 'hsv',
                value: { h, s, v },
                alpha: input.alpha,
                meta: input.meta ?? {}
            } as ColorObjectFactory;

        }

    }

};