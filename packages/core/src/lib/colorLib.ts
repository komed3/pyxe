'use strict';

import {
    ColorSpaceID, ColorInstance, ColorObject, ColorLibFactory,
    ColorLibLoader, ColorLibList, ColorLibEntry
} from '@pyxe/types';

import { Utils } from '@pyxe/utils';
import { convert } from './convert.js';

export class ColorLib {

    readonly id: string;

    private factory: ColorLibFactory;
    private loaded: Set<string> = new Set ();
    private entries: ColorLibList = [];

    constructor (
        id: string,
        sources?: string[]
    ) {

        const factory = colorLibRegisty.get( id ) as ColorLibFactory;

        this.id = id;
        this.factory = factory;

        if ( sources ) {

            this._ensureLoaded( sources );

        }

    }

    private async _loadSource (
        source: string
    ) : Promise<void> {

        if ( ! this.hasSource( source, true ) ) {

            try {

                const entries = await (
                    this.factory.sources[ source ] as ColorLibLoader
                )();

                this.entries.push( ...entries );
                this.loaded.add( source );

            } catch ( err ) {

                throw new Utils.error( {
                    err, method: 'ColorLib',
                    msg: `Source <${source}> not found in library <${this.id}>`
                } );

            }

        }

    }

    private async _ensureLoaded (
        sources?: string[]
    ) : Promise<void> {

        for ( const source of ( sources ?? this.getSources() ) ) {

            this._loadSource( source );

        }

    }

    private async _getColor (
        colorID: string,
        sources?: string[]
    ) : Promise<ColorLibEntry | undefined> {

        await this._ensureLoaded( sources );

        return this.entries.find(
            ( e ) => e.id === colorID
        );

    }

    async list (
        sources?: string[]
    ) : Promise<ColorLibList> {

        await this._ensureLoaded( sources );

        return this.entries;

    }

    async match (
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

    async getColor (
        colorID: string,
        preferredSpaces?: ColorSpaceID[],
        options: {
            sources?: string[];
            strict?: boolean;
            tryConvert?: boolean;
        } = {}
    ) : Promise<ColorObject | undefined> {

        try {

            const { sources, strict = false, tryConvert = false } = options;

            const entry = await this._getColor( colorID, sources );

            if ( entry ) {

                for ( const space of [ ...new Set ( [
                    ...preferredSpaces ?? [],
                    ...strict ? Object.keys( entry.spaces ) as ColorSpaceID[] : []
                ].filter( Boolean ) ) ] ) {

                    if ( space in entry.spaces ) {

                        let color: ColorObject = {
                            space, value: entry.spaces[ space ] as ColorInstance,
                            meta: { source: entry }
                        };

                        if (
                            preferredSpaces &&
                            ! preferredSpaces.includes( space ) &&
                            tryConvert
                        ) {

                            color = convert.tryConvert(
                                color, preferredSpaces
                            ) as ColorObject;

                        }

                        return color;

                    }

                }

            }

        } catch {}

        return undefined;

    }

    getSources () : string[] {

        return Object.keys(
            this.factory.sources
        );

    }

    hasSource (
        source: string,
        loaded: boolean = false
    ) : boolean {

        return loaded
            ? this.loaded.has( source )
            : source in this.factory.sources;

    }

}

export class ColorLibRegisty {

    private registry: Map<string, ColorLibFactory> = new Map ();

    _register (
        id: string,
        factory: ColorLibFactory
    ) : void {

        if ( ! this.has( id ) ) {

            this.registry.set( id, factory );

        } else {

            throw new Utils.error( {
                method: 'ColorLib',
                msg: `Color library named <${id}> already registered`
            } );

        }

    }

    _unregister (
        id: string
    ) : void {

        if ( this.check( id ) ) {

            this.registry.delete( id );

        }

    }

    has (
        id: string
    ) : boolean {

        return this.registry.has( id );

    }

    check (
        id: string
    ) : boolean {

        if ( ! this.has( id ) ) {

            throw new Utils.error( {
                method: 'ColorLib',
                msg: `The color library <${id}> is not registered`
            } );

        }

        return true;

    }

    get (
        id: string,
        safe: boolean = true
    ) : ColorLibFactory | undefined {

        if ( ! safe || this.check( id ) ) {

            return this.registry.get( id );

        }

    }

    getLibaries () : string[] {

        return Array.from(
            this.registry.keys()
        );

    }

    getMeta (
        id: string
    ) : any {

        return this.get( id )?.meta;

    }

}

export const colorLibRegisty = new ColorLibRegisty ();