'use strict';

import type { ColorChannel, ColorSpaceFactory, ColorSpaceName } from '@pyxe/types';
import { Entity } from './Entity.js';
import { colorSpaceRegistry } from '../registries/ColorSpaceRegistry.js';
import { assert } from '../services/ErrorUtils.js';

export class ColorSpace extends Entity<ColorSpaceName, ColorSpaceFactory> {

    public static override registry = colorSpaceRegistry;

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

    public static getInstance<ColorSpace> (
        name: ColorSpaceName,
        force: boolean = false
    ) : ColorSpace {

        return super.getInstance( ColorSpace.resolve( name ), force );

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