'use strict';

import type { ColorInstance, ColorChannel, OutputOptions } from '@pyxe/types';

export class ChannelHelper {

    private static _handler (
        method: string
    ) : Function {

        return ( this[ method as keyof ChannelHelper ] as Function ).bind( this );

    }

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

    public static instance (
        method: string,
        input: Partial<ColorInstance>,
        channels: Record<string, ColorChannel>,
        ...args: any
    ) : Partial<ColorInstance> {

        return Object.fromEntries( Object.entries( input ).map(
            ( [ key, val ] ) => ( [ key, key in channels
                ? this._handler( method )( val, channels[ key ], ...args )
                : undefined
            ] )
        ) );

    }

    public static alpha (
        method: string,
        value: number | any,
        ...args: any
    ) : any {

        return this._handler( method )( value, { type: 'normalized' }, ...args );

    }

    public static tolerance (
        value: number
    ) {

        return Number ( value.toFixed( 12 ) );

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

        return this.tolerance(
            ( ( ( value - min ) % range + range ) % range ) + min
        );

    }

    public static normalize (
        value: number,
        channel: ColorChannel
    ) : number {

        const { min, max } = this._channel( channel );

        return this.tolerance(
            ( value - min ) / ( max - min )
        );

    }

    public static denormalize (
        value: number,
        channel: ColorChannel
    ) : number {

        const { min, max } = this._channel( channel );

        return this.tolerance(
            value * ( max - min ) + min
        );

    }

    public static validate (
        value: any,
        channel: ColorChannel,
        isNormalized: boolean
    ) : boolean {

        if ( typeof value === 'number' && Number.isFinite( value ) ) {

            const { min, max } = isNormalized ? { min: 0, max: 1 } : this._channel( channel );

            return value >= min && value <= max;

        }

        return false;

    }

    public static parse (
        value: any,
        channel: ColorChannel,
        clamp: boolean = true
    ) : number | undefined {

        if ( value !== null && value !== '' ) {

            const { type, min, max } = this._channel( channel );
            const str = String( value ).trim();

            let parsed = parseFloat( str.replace( /[^\d.\-+eE]/g, '' ) );

            if ( Number.isFinite( parsed ) ) {

                if ( str.includes( '%' ) ) {

                    parsed = type === 'normalized' ? parsed / 100
                        : type === 'percent' ? parsed
                        : ( parsed / 100 ) * ( max - min ) + min;

                } else if ( type === 'percent' ) {

                    parsed *= 100;

                }

                return type === 'cyclic'
                    ? this.wrap( parsed, channel )
                    : clamp ? this.clamp( parsed, channel )
                    : parsed;

            }

        }

        return undefined;

    }

    public static format (
        value: number,
        channel: ColorChannel,
        options?: OutputOptions,
        isNormalized: boolean = true
    ) : string {

        if ( Number.isFinite( value ) ) {

            const { format = 'auto', type, decimals, unit = '' } = {
                ...this._channel( channel ), ...( options ?? {} )
            };

            const normalized = isNormalized ? value : this.normalize(
                type === 'cyclic' ? this.wrap( value, channel ) : this.clamp( value, channel ),
                channel
            );

            return format === 'percent' ? Number( ( normalized * 100 ).toFixed( decimals ) ) + '%'
                : format === 'normalized' ? Number( normalized.toFixed( decimals ) ).toString()
                : Number( this.denormalize( normalized, channel ).toFixed( decimals ) ) + unit;

        }

        return '';

    }

    public static compare (
        a: any, b: any,
        channel: ColorChannel,
        tolerance: number = 0.0005
    ) : boolean {

        return a === b || (
            ( a = this.parse( a, channel ) ) !== undefined &&
            ( b = this.parse( b, channel ) ) !== undefined &&
            Math.abs( a - b ) <= Math.abs( a * tolerance )
        );

    }

    public static compareAlpha (
        a: any, b: any,
        tolerance: number = 0.0005
    ) : boolean {

        return this.compare( a, b, { type: 'normalized' }, tolerance );

    }

    public static compareInstance (
        a: Partial<ColorInstance>,
        b: Partial<ColorInstance>,
        channels: Record<string, ColorChannel>,
        tolerance: number = 0.0005
    ) : boolean {

        return Object.entries( channels ).every(
            ( [ key, channel ] ) => this.compare(
                a[ key as keyof ColorInstance ],
                b[ key as keyof ColorInstance ],
                channel, tolerance
            )
        );

    }

}