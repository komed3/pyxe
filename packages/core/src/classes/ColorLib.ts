'use strict';

import type { ColorLibEntry, ColorLibFactory, ColorLibList, ColorSpaceID } from '@pyxe/types';
import { Utils } from '@pyxe/utils';
import { colorLibRegisty } from './ColorLibRegistry.js';
import { ColorObject } from './ColorObject.js';
import { Convert } from './Convert.js';

const instances: Map<string, ColorLib> = new Map();

export class ColorLib {

    readonly id: string;
    private factory: ColorLibFactory;
    private loadDefault: string[] = [];
    private loaded: Set<string> = new Set();
    private entries: ColorLibList = [];

    constructor (
        id: string,
        sources?: string[]
    ) {

        ColorLib.check( id );

        const factory = colorLibRegisty.get( id )!;

        this.id = id;
        this.factory = factory;

        this.loadDefault =
            sources ??
            this.factory?.autoLoad ??
            this.listSources() ??
            [];

    }

    public static list () : string[] {

        return colorLibRegisty.list();

    }

    public static has (
        id: string
    ) : boolean {

        return colorLibRegisty.has( id );

    }

    public static check (
        id: string
    ) : true | undefined {

        if ( ! this.has( id ) ) {

            throw new Utils.Services.error( {
                method: 'ColorLib',
                msg: `Color library <${id}> is not declared`
            } );

        }

        return true;

    }

    public static getInstance (
        id: string,
        sources?: string[]
    ) : ColorLib {

        if ( ! instances.has( id ) ) {

            instances.set( id, new ColorLib( id, sources ) );

        }

        return instances.get( id )!;

    }

    public static destroyInstance (
        id: string
    ) : void {

        instances.delete( id );

    }

    private async _loadSource (
        source: string
    ) : Promise<void> {

        if ( ! this.hasSource( source, true ) ) {

            try {

                const entries = await ( this.factory.sources[ source ]! )();

                this.entries.push( ...entries );
                this.loaded.add( source );

            } catch ( err ) {

                throw new Utils.Services.error( {
                    err, method: 'ColorLib',
                    msg: `Source <${source}> not found in library <${this.id}>`
                } );

            }

        }

    }

    private async _ensureLoaded (
        sources?: string[]
    ) : Promise<void> {

        for ( const source of ( sources ?? this.loadDefault ) ) {

            await this._loadSource( source );

        }

    }

    private async _getColor (
        key: string,
        sources?: string[]
    ) : Promise<ColorLibEntry | undefined> {

        await this._ensureLoaded( sources );

        return this.entries.find(
            ( e ) => e.id === key
        );

    }

    public listSources (
        loaded: boolean = false
    ) : string[] {

        return loaded
            ? Object.keys( this.loaded )
            : Object.keys( this.factory.sources );

    }

    public hasSource (
        source: string,
        loaded: boolean = false
    ) : boolean {

        return this.listSources( loaded ).includes( source );

    }

    public async listColors (
        sources?: string[]
    ) : Promise<ColorLibList> {

        await this._ensureLoaded( sources );

        return this.entries;

    }

    public async match (
        query: string,
        sources?: string[]
    ) : Promise<ColorLibList> {

        await this._ensureLoaded( sources );

        return this.entries.filter(
            ( e ) => JSON.stringify( e.name ).match(
                new RegExp( query, 'i' )
            )
        );

    }

    public async filter (
        tag: string,
        sources?: string[]
    ) : Promise<ColorLibList> {

        await this._ensureLoaded( sources );

        return this.entries.filter(
            ( e ) => e.meta?.tags?.includes( tag )
        );

    }

    public async getColorEntry (
        colorID: string,
        sources?: string[]
    ) : Promise<ColorLibEntry | undefined> {

        const entry = await this._getColor( colorID, sources );

        return entry;

    }

    public async getColor (
        key: string,
        preferredSpaces?: ColorSpaceID[],
        options: {
            sources?: string[];
            strict?: boolean;
            tryConvert?: boolean;
        } = {},
        safe: boolean = true
    ) : Promise<ColorObject | undefined> {

        try {

            const { sources, strict = false, tryConvert = false } = options;

            const entry = await this._getColor( key, sources );

            if ( entry ) {

                for ( const space of [ ...new Set ( [
                    ...preferredSpaces ?? [],
                    ...strict ? [] : Object.keys( entry.spaces ) as ColorSpaceID[]
                ].filter( Boolean ) ) ] ) {

                    if ( space in entry.spaces ) {

                        let color = ColorObject.from( {
                            space, value: entry.spaces[ space ]!,
                            meta: { source: entry }
                        } );

                        if ( preferredSpaces && ! preferredSpaces.includes( space ) && tryConvert ) {

                            color = Convert.tryConvert( color, preferredSpaces ) as ColorObject;

                        }

                        return color;

                    }

                }

            }

        } catch ( err ) {

            if ( safe ) {

                throw new Utils.Services.error( {
                    method: 'ColorLib',
                    msg: `Unable to retrieve color <${key}> from library <${this.id}>`
                } );

            }

        }

    }

}