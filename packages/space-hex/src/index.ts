'use strict';

import { _ColorSpace } from '@pyxe/core/dev';
import { validator } from './lib/validator.js';
import { parser } from './lib/parser.js';

_ColorSpace.colorSpace._register( 'HEX', {
    id: 'HEX',
    validator: validator,
    parser: parser
} );