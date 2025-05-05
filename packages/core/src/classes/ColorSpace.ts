'use strict';

import type { ColorChannel, ColorSpaceFactory, ColorSpaceName, GammaHandler } from '@pyxe/types';
import { Entity } from './Entity.js';
import { colorSpaceRegistry } from '../registries/ColorSpaceRegistry.js';
import { assert } from '../services/ErrorUtils.js';

export class ColorSpace extends Entity<ColorSpaceName, ColorSpaceFactory> {

    protected static override instances: Map<ColorSpaceName, ColorSpaceFactory> = new Map ();
    protected static override get registry () { return colorSpaceRegistry; }

    public aliases () : ColorSpaceName[] {

        return this.factory.aliases ?? [];

    }

    public channels () : string[] {

        return Object.keys( this.factory.channels );

    }

    public getChannels () : Record<string, ColorChannel> {

        return this.factory.channels;

    }

    public getChannel (
        key: string,
        safe: boolean = false
    ) : ColorChannel | undefined {

        const channel = this.factory.channels[ key ];

        assert( ! safe || channel, {
            method: 'ColorSpace',
            msg: `Channel <${key}> is not defined in color space <${this.name}>`
        } );

        return channel;

    }

    public alpha () : boolean {

        return this.factory.alpha;

    }

    public linear () : boolean {

        return this.factory.linear;

    }

    public gamma (
        direction: 'encode' | 'decode'
    ) : GammaHandler {

        return this.factory.gamma
            ? this.factory.gamma[ direction ]
            : ( v => v );

    }

    public static getInstance<ColorSpace> (
        name: ColorSpaceName,
        force: boolean = false
    ) : ColorSpace {

        return super.getInstance( ColorSpace.resolve( name ), force ) as ColorSpace;

    }

    public static resolve (
        name: ColorSpaceName
    ) : ColorSpaceName {

        return colorSpaceRegistry.resolve( name );

    }

    public static resolveMany (
        names: ColorSpaceName[]
    ) : ColorSpaceName[] {

        return [ ...new Set( names.map(
            ( name ) => colorSpaceRegistry.resolve( name )
        ).filter( Boolean ) ) ];

    }

}