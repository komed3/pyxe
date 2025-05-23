'use strict';

import type { ColorInput, ColorInstance, ColorObjectFactory, ColorSpaceName } from '@pyxe/types';
import { ChannelHelper } from '@pyxe/utils';
import { ColorSpace } from './ColorSpace.js';
import { hook } from '../services/Hook.js';
import { handleError } from '../services/ErrorUtils.js';
import { debug } from '../services/Debug.js';

const instances: Map<ColorSpaceName, Parser> = new Map ();

export class Parser {

    private colorSpace: ColorSpace;
    private regex: RegExp;

    private constructor (
        name: ColorSpaceName,
        readonly strict: boolean = false
    ) {

        this.colorSpace = ColorSpace.getInstance( name );

        this.regex = new RegExp( this._buildRegex(), 'i' );

    }

    private _buildRegex () : string {

        /** color space name + aliases */
        const names = [ this.colorSpace.name, ...this.colorSpace.aliases() ]
            .map( name => name.replace( /[.*+?^${}()|[\]\\]/g, '\\$&' ).replace( /[-_]/g, '[-_]?' ) )
            .join( '|' );

        /** patterns for individual channels */
        const channels = Object.values( this.colorSpace.getChannels() ).map(
            ( channel ) => channel.type === 'cyclic'
                ? '(-?[\\d.]+(?:deg|°|)?%?)'
                : '(-?[\\d.]+%?)'
        );

        /** expand alpha channel if supported */
        if ( this.colorSpace.alpha() ) channels.push( '(-?[\\d.]+%?)' );

        /** flexible separators */
        const separator = '\\s*(?:[,/]|\\s)\\s*';

        /** create final search pattern */
        return hook.filter( 'Parser::regex', `^(?:${names})\\s*\\(?\\s*${ ( channels.map(
            ( c, i ) => i === channels.length - 1 ? `(?:${separator}${c})?` : i === 0 ? c : `${separator}${c}`
        ).join( '' ) ) }\\s*\\)?$`, this );

    }

    public parse (
        input: ColorInput
    ) : ColorObjectFactory | false {

        input = input.toString().trim();

        /** early hook allows parsing special cases */

        const early = hook.filter( 'Parser::earlyParse', undefined, input, this );

        if ( early !== undefined ) return early;

        /** now run the actual parser / match against regex */

        hook.run( 'Parser::beforeParse', input, this );

        const match = hook.filter( 'Parser::match', input.match( this.regex )?.slice( 1 ), input, this );

        if ( ! match || match.length < this.colorSpace.channels().length ) {

            debug.info( 'Parser', `Input <${ JSON.stringify( input ) }> does not match color space <${this.colorSpace.name}>` );

            return false;

        }

        /** parse color space channels */

        const channels: Record<string, number> = {};

        hook.run( 'Parser::preparseChannels', channels, match, input, this );

        for ( const [ key, channel ] of Object.entries( this.colorSpace.getChannels() ) ) {

            if ( ! ( key in channels ) ) {

                const value = ChannelHelper.parse( match.shift(), channel, ! this.strict );

                if ( value === undefined || isNaN( value ) ) {

                    debug.info( 'Parser', `Missing or invalid value for channel <${key}>: ${value}` );

                    return false;

                }

                channels[ key ] = value;

            }

        }

        /** return result as color object factory */

        hook.run( 'Parser::afterParse', channels, input, this );

        return hook.filter( 'Parser::result', {
            space: this.colorSpace.name,
            value: channels as Partial<ColorInstance>,
            alpha: ChannelHelper.alpha( 'parse', match.shift(), ! this.strict ),
            meta: { source: input }
        }, input, this ) as ColorObjectFactory;

    }

    public static getInstance (
        name: ColorSpaceName,
        strict: boolean = false,
        force: boolean = false
    ) : Parser {

        const resolved = ColorSpace.resolve( name );

        if (
            force || ! instances.has( resolved ) ||
            instances.get( resolved )?.strict !== strict
        ) {

            instances.set( resolved, new Parser ( resolved, strict ) );

        }

        return instances.get( resolved )!;

    }

    public static destroyInstance (
        name: ColorSpaceName
    ) : void {

        instances.delete( ColorSpace.resolve( name ) );

    }

    public static parseAs (
        input: ColorInput,
        space: ColorSpaceName,
        strict: boolean = false
    ) : ColorObjectFactory | false {

        hook.run( 'Parser::parseAs', input, space, strict, this );

        try {

            if ( ColorSpace.has( space, false ) ) {

                const parser = Parser.getInstance( space, strict );

                return parser.parse( input );

            }

        } catch {}

        return false;

    }

    public static parseAuto (
        input: ColorInput,
        strict: boolean = false,
        safe: boolean = true
    ) : ColorObjectFactory | false {

        input = input.toString().trim();

        hook.run( 'Parser::beforeAutoParse', input, strict, safe, this );

        for ( const space of [
            ...[
                input.split( /[\s(]+/ )[ 0 ].toLowerCase(),
                input.substring( 0, 1 )
            ],
            ...ColorSpace.list()
        ] ) {

            if ( space && space !== input ) {

                const result = this.parseAs( input, space, strict );

                if ( result !== false ) {

                    hook.run( 'Parser::afterAutoParse', input, strict, safe, result, this );

                    return result;

                }

            }

        }

        hook.run( 'Parser::allFailed', input, strict, safe, this );

        return handleError( {
            method: 'Parser',
            msg: `No suitable parser found for input <${ JSON.stringify( input ) }>`
        }, safe );

    }

}