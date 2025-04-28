'use strict';

import type { ColorObjectFactory } from '@pyxe/types';

export class TypeCheck {

    public static ColorObjectFactory (
        obj: any
    ) : obj is ColorObjectFactory {

        return (
            typeof obj === 'object' && obj !== null &&
            'space' in obj && 'value' in obj &&
            ( typeof obj.alpha === 'undefined' || typeof obj.alpha === 'number' ) &&
            ( typeof obj.meta === 'undefined' || typeof obj.meta === 'object' )
        );

    }

}