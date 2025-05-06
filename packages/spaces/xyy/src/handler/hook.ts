'use strict';

import type { HookHandler } from '@pyxe/types';
import { ErrorUtils } from '@pyxe/core/services';

export const hooks: Record<string, HookHandler> = {

    'Parser::preparseChannels': ( _, match, input, self ) : void => {

        if ( self.colorSpace.name === 'xyy' && /^yxy/i.test( input ) ) {

            const Y = match[ 0 ];

            match[ 0 ] = match[ 1 ];
            match[ 1 ] = match[ 2 ];
            match[ 2 ] = Y;

        }

    },

    'Validator::passed': ( state, factory, _, colorSpace, self ) : boolean => {

        if ( state && colorSpace.name === 'xyy' ) {

            const { x, y } = factory.value;

            state = ErrorUtils.check( x + y <= 1, {
                method: 'ColorSpace::xyY',
                msg: `Invalid chromaticity: <x + y must be ≤ 1> (received ${ Number( ( x + y ).toFixed( 6 ) ) })`
            }, self.safe );

        }

        return state;

    }

};