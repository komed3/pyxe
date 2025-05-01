'use strict';

import type { ColorSpaceName, ColorLibEntry, ColorLibFactory, ColorLibList, ColorObjectFactory } from '@pyxe/types';
import { Entity } from './Entity.js';
import { colorLibRegistry } from '../registries/ColorLibRegistry.js';
import { ColorSpace } from './ColorSpace.js';
import { Convert } from './Convert.js';
import { hook } from '../services/Hook.js';
import { catchToError } from '../services/ErrorUtils.js';

export class ColorLib extends Entity<string, ColorLibFactory> {

    protected static override instances: Map<string, ColorLibFactory> = new Map ();
    protected static override registry = colorLibRegistry;

    private loadDefault: string[] = [];
    private loaded: Set<string> = new Set();
    private entries: ColorLibList = [];

    private constructor (
        name: string,
        sources?: string[]
    ) {

        super( name );

        this.loadDefault = hook.filter(
            'ColorLib::defaultSources',
            sources ?? this.factory?.autoLoad ?? this.listSources() ?? [],
            name, sources, this
        );

    }

    private async _loadSource (
        source: string
    ) : Promise<void> {

        if ( ! this.hasSource( source, true ) ) {

            await catchToError( async () => {

                const entries = await ( this.factory.sources[ source ]! )();

                await hook.runAsync( 'ColorLib::loadSource', entries, source, this );

                this.entries.push( ...entries );
                this.loaded.add( source );

            }, {
                method: 'ColorLib',
                msg: `Source <${source}> not found in library <${this.name}>`
            } );

        }

    }

    private async _ensureLoaded (
        sources?: string[]
    ) : Promise<void> {

        await Promise.all(
            ( sources ?? this.loadDefault ).map(
                ( source ) => this._loadSource( source )
            )
        );

    }

    private async _entry (
        key: string,
        sources?: string[]
    ) : Promise<ColorLibEntry | undefined> {

        await this._ensureLoaded( sources );

        return await hook.filterAsync(
            'ColorLib::entry',
            this.entries.find( ( e ) => e.id === key ),
            key, sources, this
        );

    }

    public listSources (
        loaded: boolean = false
    ) : string[] {

        return loaded
            ? Array.from( this.loaded )
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

        const regex = new RegExp( query, 'i' );

        return hook.filterAsync( 'ColorLib::match', this.entries.filter(
            ( e ) => JSON.stringify( e.name ).match( regex )
        ), query, sources, regex, this );

    }

    public async filter (
        tag: string,
        sources?: string[]
    ) : Promise<ColorLibList> {

        await this._ensureLoaded( sources );

        return hook.filterAsync( 'ColorLib::filter', this.entries.filter(
            ( e ) => e.meta?.tags?.includes( tag )
        ), tag, sources, this );

    }

    public async getColorEntry (
        colorID: string,
        sources?: string[]
    ) : Promise<ColorLibEntry | undefined> {

        return await this._entry( colorID, sources );

    }

    public async getColor (
        key: string,
        preferredSpaces?: ColorSpaceName[],
        options: {
            sources?: string[];
            strict?: boolean;
            tryConvert?: boolean;
        } = {},
        safe: boolean = true
    ) : Promise<ColorObjectFactory | undefined> {

        return await catchToError( async () => {

            const { sources, strict = false, tryConvert = false } = options;

            const entry = await this._entry( key, sources );

            if ( entry ) {

                const candidates = await hook.filterAsync( 'ColorLib::candidates', [ ...new Set ( [
                    ...ColorSpace.resolveMany( preferredSpaces ?? [] ),
                    ...strict ? [] : Object.keys( entry.spaces ) as ColorSpaceName[]
                ].filter( Boolean ) ) ], key, preferredSpaces, entry, this );

                for ( const space of candidates ) {

                    if ( space in entry.spaces ) {

                        let color: ColorObjectFactory = {
                            space: space,
                            value: entry.spaces[ space ]!,
                            alpha: entry.alpha,
                            meta: { source: entry }
                        };

                        if ( preferredSpaces && ! preferredSpaces.includes( space ) && tryConvert ) {

                            const convert = new Convert ( color, false );

                            color = convert.as( preferredSpaces, false )!;

                        }

                        return await hook.filterAsync( 'ColorLib::color', key, color, this );

                    }

                }

            }

        }, {
            method: 'ColorLib',
            msg: `Unable to retrieve color <${key}> from library <${this.name}>`
        }, safe );

    }

}