'use strict';

import type { ColorObjectFactory, HookHandler } from '@pyxe/types';
import { ErrorUtils } from '@pyxe/core/services';
import { Basic, ChannelHelper } from '@pyxe/utils';

export const hooks: Record<string, HookHandler> = {

    'Parser::earlyParse': ( _, input, self ) : ColorObjectFactory | undefined | false => {

        if ( self.colorSpace.name === 'rgb' && input.startsWith( '#' ) ) {

            return ErrorUtils.catchToError( () => {

                const clean = input.replace( /^#/, '' );

                if ( [ 3, 4, 6, 8 ].includes( clean.length ) ) {

                    const [ r, g, b, a ] = clean.length <= 4
                        ? [ ...clean ].map( c => Basic.hexdec( c.repeat( 2 ) ) )
                        : clean.match( /../g )!.map( Basic.hexdec );

                    return {
                        space: 'rgb',
                        value: ChannelHelper.parseInstance( { r, g, b }, self.colorSpace.getChannels() ),
                        alpha: ChannelHelper.parseAlpha( a / 255, ! self.strict ),
                        meta: { source: input }
                    } as ColorObjectFactory;

                }

            }, {
                method: 'Space::RGB',
                msg: `Parsing failed for HEX string <${input}>`
            }, self.strict );

        }

        return undefined;

    }

};