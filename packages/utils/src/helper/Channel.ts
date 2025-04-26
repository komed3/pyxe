'use strict';

import type { ColorChannel } from '@pyxe/types';

export class ChannelHelper {

    public static clamp (
        value: number,
        channel: ColorChannel
    ) : number {

        return Math.min(
            channel.max ?? Infinity,
            Math.max(
                channel.min ?? -Infinity,
                value
            )
        );

    }

    public static wrap (
        value: number,
        channel: ColorChannel
    ) : number {

        const min = channel.min ?? 0,
              max = channel.max ?? 360,
              range = max - min;

        return ( ( ( value - min ) % range + range ) % range ) + min;

    }

    public static validate (
        value: any,
        channel: ColorChannel
    ) : boolean {

        if ( typeof value === 'number' ) {

            switch ( channel.type ) {

                case 'numeric':
                case 'normalized':
                    return (
                        value >= ( channel.min ?? -Infinity ) &&
                        value <= ( channel.max ?? Infinity )
                    );

                case 'cyclic':
                    return true;

            }

        }

        return false;

    }

}