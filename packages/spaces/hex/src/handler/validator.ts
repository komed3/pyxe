'use strict';

import { ColorObjectFactory, ValidatorHandler } from '@pyxe/types';

export const validator: ValidatorHandler = (
    input: ColorObjectFactory
) : boolean => {

    return !! (
        input.space === 'HEX' &&
        /^#([0-9a-f]{6}|[0-9a-f]{8})$/i.test(
            input.value.toString()
        )
    );

}