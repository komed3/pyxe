'use strict';

import type { ColorChannel, OutputOptions } from '@pyxe/types';

export class ChannelHelper {

    private static _channel (
        channel: ColorChannel
    ) : ColorChannel & {
        min: number;
        max: number;
        decimals: number;
        unit?: string;
    } {

        return {
            ...{
                normalized: { min: 0, max: 1, decimals: 2 },
                numeric: { min: -Infinity, max: Infinity, decimals: 1 },
                cyclic: { min: 0, max: 360, decimals: 1, unit: 'deg' },
                percent: { min: 0, max: 100, decimals: 1, unit: '%' }
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

        if ( value && value !== null && value !== '' ) {

            const { type, min, max } = this._channel( channel );
            const str = String ( value ).trim();
            const isPercent = str.includes( '%' );

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

                    parsed = this.wrap( parsed, channel );

                } else if ( clamp ) {

                    parsed = this.clamp( parsed, channel );

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

    public static format (
        value: number,
        channel: ColorChannel,
        options: OutputOptions = {}
    ) : string {

        if ( Number.isFinite( value ) ) {

            const { format = 'auto', type, decimals, unit = '' } = {
                ...this._channel( channel ),
                ...options
            };

            if ( type === 'cyclic' ) {

                value = this.wrap( value, channel );

            } else {

                value = this.clamp( value, channel );

            }

            switch ( format ) {

                case 'percent':
                    return `${ Number (
                        ( this.normalize( value, channel ) * 100 ).toFixed( decimals )
                    ) }%`;

                case 'normalized':
                    return Number (
                        this.normalize( value, channel ).toFixed( decimals )
                    ).toString();

                case 'auto':
                default:
                    return `${ Number (
                        value.toFixed( decimals )
                    ) }${unit}`;

            }

        }

        return '';

    }

    public static formatAlpha (
        value: any,
        options: OutputOptions = {}
    ) : string {

        return value !== undefined || options.forceAlpha
            ? this.format( value, { name: 'Alpha', type: 'normalized' }, options )
            : '';

    }

}