'use strict';

import { _Module } from '@pyxe/core/dev';

import { invert } from './lib/invert.js';

_Module.module._register( 'basic', {
    id: 'basic',
    methods: [
        invert
    ],
    meta: {}
} );