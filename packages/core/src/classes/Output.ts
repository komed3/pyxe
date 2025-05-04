'use strict';

import type { ColorObjectFactory, ColorSpaceName, OutputFactory, OutputHandler, OutputOptions } from '@pyxe/types';
import { ChannelHelper } from '@pyxe/utils';
import { Entity } from './Entity.js';
import { outputRegistry } from '../registries/OutputRegistry.js';
import { ColorSpace } from './ColorSpace.js';
import { assert, catchToError } from '../services/ErrorUtils.js';
import { hook } from '../services/Hook.js';

export class Output extends Entity<ColorSpaceName, OutputFactory> {

    protected static override instances: Map<ColorSpaceName, OutputFactory> = new Map ();
    protected static override get registry () { return outputRegistry; }

    private colorSpace: ColorSpace;

    protected constructor (
        name: ColorSpaceName
    ) {

        super( name );

        this.colorSpace = ColorSpace.getInstance( name );

    }

    private _resolve(
        type: string
    ) : OutputHandler | undefined {

        const visited: Set<string> = new Set ();

        while ( true ) {

            assert( ! visited.has( type ), {
                method: 'Output',
                msg: `Circular reference detected in output chain: ${ (
                    [ ...visited, type ].join( ' → ' )
                ) }`
            } );

            visited.add( type );

            const handler = this.supports().includes( type )
                ? this.factory[ type ] || this[ type as keyof this ]
                : undefined;

            assert( handler, {
                method: 'Output',
                msg: `Output handler <${type}> is not declared`
            } );

            if ( typeof handler === 'function' ) {

                return ( handler as OutputHandler ).bind( this );

            }

            type = handler as string;

        }

    }

    public format (
        type: string,
        input: ColorObjectFactory,
        options: OutputOptions = {},
        safe: boolean = true
    ) : any {

        return catchToError( () => {

            return this._resolve( type )!( input, options );

        }, {
            method: 'Output',
            msg: `Failed to execute output handler <${type}>`
        }, safe );

    }

    public json (
        input: ColorObjectFactory,
        options: OutputOptions = {}
    ) : {
        space: ColorSpaceName;
        channels: Record<string, any>;
        alpha: Record<string, any>;
    } {

        const { space, value, alpha } = input;
        const channels = this.colorSpace.getChannels();
        const result: Record<string, any> = {
            space, channels: {}, alpha: undefined
        };

        for ( const [ c, val ] of Object.entries( value ) ) {

            result.channels[ c ] = { raw: val, formatted: ChannelHelper.format(
                val, channels[ c ], options, true
            ) };

        }

        if ( ( alpha !== undefined && alpha !== 1 ) || options?.forceAlpha ) {

            result.alpha = { raw: alpha ?? 1, formatted: ChannelHelper.alpha(
                'format', alpha ?? 1, options, true
            ) };

        }

        return hook.filter( 'Output::json', result, input, options, this );

    }

    public string (
        input: ColorObjectFactory,
        options: OutputOptions = {}
    ) : string {

        const { space, channels, alpha } = this.json( input, options );
        const { schema } = options ?? {};

        if ( schema ) {

            return hook.filter( 'Output::schema', schema.replace(
                /\$\{(\w+)\}/ig, ( _, key ) => key === 'a' && this.colorSpace.alpha() 
                    ? alpha?.formatted ?? 1 
                    : channels[ key ]?.formatted ?? _
            ).trim(), input, options, this );

        }

        const values = Object.values( channels ).map( c => c.formatted );

        if ( this.colorSpace.alpha() && alpha ) {

            values.push( alpha.formatted );

        }

        return hook.filter( 'Output::string', `${ (
            this.colorSpace.alpha() && alpha ? `${space}a` : space
        ) }( ${ values.join( ', ' ) } )`, input, options, this );

    }

    public cli (
        input: ColorObjectFactory,
        options: OutputOptions = {}
    ) : string {

        const hasAlpha = this.colorSpace.alpha() && (
            input.alpha !== undefined && input.alpha !== 1 ||
            options?.forceAlpha
        );

        return hook.filter( 'Output::cli', `${ (
            ( hasAlpha ? `${input.space}a` : input.space ).toUpperCase()
        ) } ${ (
            this.string( input, { ...options, ...{
                schema: Object.keys(
                    this.colorSpace.getChannels()
                ).join( ' ' ) + (
                    hasAlpha ? ' a' : ''
                )
            } } )
        ) }`, input, options, this );

    }

    public supports () : string[] {

        return [
            ...[ 'json', 'string', 'cli' ],
            ...Object.keys( this.factory )
        ];

    }

}