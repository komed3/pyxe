'use strict';

import type { ColorChannel } from '@pyxe/types';

export class ChannelHelper {

    private static _channel (
        channel: ColorChannel
    ) : ColorChannel & {
        min: number;
        max: number;
    } {

        return {
            ...{
                normalized: { min: 0, max: 1 },
                numeric: { min: -Infinity, max: Infinity },
                cyclic: { min: 0, max: 360 },
                percent: { min: 0, max: 100 }
            }[ channel.type ],
            ...channel
        };

    }

    public static clamp (
        value: number,
        channel: ColorChannel
    ) : number {

        const { min, max } = this._channel( channel );

        return Math.min( max, Math.max( min, value ) );

    }

    public static wrap (
        value: number,
        channel: ColorChannel
    ) : number {

        const { min, max } = this._channel( channel );
        const range = max - min;

        return ( ( ( value - min ) % range + range ) % range ) + min;

    }

    public static normalize (
        value: number,
        channel: ColorChannel
    ) : number {

        const { min, max } = this._channel( channel );

        return ( value - min ) / ( max - min );

    }

    public static denormalize (
        value: number,
        channel: ColorChannel
    ) : number {

        const { min, max } = this._channel( channel );

        return value * ( max - min ) + min;

    }

    public static validate (
        value: any,
        channel: ColorChannel
    ) : boolean {

        if ( typeof value === 'number' && Number.isFinite( value ) ) {

            const { type, min, max } = this._channel( channel );

            switch ( type ) {

                case 'normalized':
                case 'numeric':
                case 'percent':
                    return value >= min && value <= max;

                case 'cyclic':
                    return true;

            }

        }

        return false;

    }

    public static parse (
        value: any,
        channel: ColorChannel,
        clamp: boolean = true
    ) : number | undefined {

        if ( value != null ) {

            const { type, min, max } = this._channel( channel );
            const str = String ( '' + value ).trim();
            const isPercent = /\s*%$/.test( str );

            let parsed = parseFloat( str.replace( /[^\d.\-+eE]/g, '' ) );

            if ( Number.isFinite( parsed ) ) {

                switch ( type ) {

                    case 'normalized':
                        if ( isPercent ) parsed /= 100;
                        break;

                    case 'numeric':
                    case 'cyclic':
                        if ( isPercent ) parsed = ( parsed / 100 ) * ( max - min ) + min;
                        break;

                    case 'percent':
                        if ( ! isPercent ) parsed *= 100;
                        break;

                }

                if ( type === 'cyclic' ) {

                    parsed = ChannelHelper.wrap( parsed, channel );

                } else if ( clamp ) {

                    parsed = ChannelHelper.clamp( parsed, channel );

                }

                return parsed;

            }

        }

        return undefined;
        
    }

    public static parseAlpha (
        value: any,
        clamp: boolean = true
    ) : number | undefined {

        return this.parse( value, { name: 'Alpha', type: 'normalized' }, clamp );

    }

}