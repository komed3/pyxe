'use strict';

import type { HookHandler } from '@pyxe/types';
import { ErrorUtils } from '@pyxe/core/services';

export const hooks: Record<string, HookHandler> = {

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