'use strict';

import type { ColorChannel, ColorSpaceFactory, ColorSpaceName } from '@pyxe/types';
import { colorSpaceRegistry } from '../registries/ColorSpaceRegistry.js';
import { assert } from '../services/ErrorUtils.js';

const instances: Map<ColorSpaceName, ColorSpace> = new Map ();

export class ColorSpace {

    readonly space: ColorSpaceName;
    private factory: ColorSpaceFactory;

    private constructor (
        name: ColorSpaceName
    ) {

        assert( colorSpaceRegistry.has( name ), {
            method: 'ColorSpace',
            msg: `Color space <${name}> is not declared`
        } );

        this.space = name;
        this.factory = colorSpaceRegistry.get( name )!;

    }

    public aliases () : ColorSpaceName[] {

        return this.factory.aliases ?? [];

    }

    public channels () : string[] {

        return [ ...Object.keys( this.factory.channels ) ];

    }

    public getChannels () : Record<string, ColorChannel> {

        return this.factory.channels;

    }

    public getChannel (
        key: string,
        safe: boolean = false
    ) : ColorChannel | undefined {

        const channel = this.factory.channels[ key ];

        assert( channel || ! safe, {
            method: 'ColorSpace',
            msg: `Channel <${key}> is not defined in color space <${this.space}>`
        } );

        return channel;

    }

    public alpha () : boolean {

        return this.factory.alpha;

    }

    public meta (
        key?: string
    ) : any {

        return key ? ( this.factory?.meta ?? {} )[ key ] : this.factory?.meta;

    }

    public static getInstance (
        name: ColorSpaceName,
        force: boolean = false
    ) : ColorSpace {

        const resolved = ColorSpace.resolve( name );

        if ( force || ! instances.has( resolved ) ) {

            instances.set( resolved, new ColorSpace ( resolved ) );

        }

        return instances.get( name )!;

    }

    public static destroyInstance (
        name: ColorSpaceName
    ) : void {

        instances.delete( ColorSpace.resolve( name ) );

    }

    public static list () : ColorSpaceName[] {

        return colorSpaceRegistry.list();

    }

    public static filter (
        filter?: string
    ) : ColorSpaceName[] {

        return colorSpaceRegistry.filter( filter );

    }

    public static has (
        name: ColorSpaceName,
        safe: boolean = false
    ) : boolean {

        return colorSpaceRegistry.has( name, safe );

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