'use strict';

import type { OutputFactory } from '@pyxe/types';
import { ErrorUtils } from '@pyxe/core/services';

export const output: OutputFactory = {

    yxy: ( input, options, self ) : string => {

        ErrorUtils.assert( input.space === 'xyy', {
            method: 'Space::xyY',
            msg: `Output format <yxy> does not support color space <${input.space}>`
        } );

        const hasAlpha = self._hasAlpha( input, options );

        return self.string( input, { ...options, ...{
            schema: `Yxy${ ( hasAlpha ? 'a' : '' ) }( \${Y}, \${x}, \${y}${ (
                hasAlpha ? `, \${a}` : ''
            ) } )`
        } } );

    }

};