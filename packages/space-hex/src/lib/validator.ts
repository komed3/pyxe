'use strict';

import { ColorObject, ValidatorHandler } from '@pyxe/types';

export const validator: ValidatorHandler = (
    input: ColorObject
) => {

    return !! (
        input.space === 'HEX' &&
        /^#([0-9a-f]{6}|[0-9a-f]{8})$/i.test(
            input.value.toString()
        )
    );

}