'use strict';

import type { ColorLibList } from '@pyxe/types';

export const RAL_Effect = async () : Promise<ColorLibList> => [

  /** RAL 110 */
  { id: 'RAL 110-1', spaces: { RGB: { r: 230, g: 231, b: 230 } } },
  { id: 'RAL 110-2', spaces: { RGB: { r: 222, g: 221, b: 213 } } },
  { id: 'RAL 110-3', spaces: { RGB: { r: 200, g: 198, b: 190 } } },
  { id: 'RAL 110-4', spaces: { RGB: { r: 198, g: 199, b: 196 } } },
  { id: 'RAL 110-5', spaces: { RGB: { r: 201, g: 204, b: 198 } } },
  { id: 'RAL 110-6', spaces: { RGB: { r: 200, g: 200, b: 199 } } },
  { id: 'RAL 110-M', spaces: { RGB: { r: 160, g: 162, b: 164 } } },

  /** RAL 120 */
  { id: 'RAL 120-1', spaces: { RGB: { r: 237, g: 237, b: 234 } } },
  { id: 'RAL 120-2', spaces: { RGB: { r: 242, g: 241, b: 236 } } },
  { id: 'RAL 120-3', spaces: { RGB: { r: 240, g: 238, b: 229 } } },
  { id: 'RAL 120-4', spaces: { RGB: { r: 233, g: 225, b: 212 } } },
  { id: 'RAL 120-5', spaces: { RGB: { r: 226, g: 217, b: 198 } } },
  { id: 'RAL 120-6', spaces: { RGB: { r: 234, g: 225, b: 206 } } },
  { id: 'RAL 120-M', spaces: { RGB: { r: 143, g: 141, b: 135 } } },

  /** RAL 130 */
  { id: 'RAL 130-1', spaces: { RGB: { r: 242, g: 237, b: 187 } } },
  { id: 'RAL 130-2', spaces: { RGB: { r: 241, g: 238, b: 195 } } },
  { id: 'RAL 130-3', spaces: { RGB: { r: 240, g: 238, b: 205 } } },
  { id: 'RAL 130-4', spaces: { RGB: { r: 248, g: 240, b: 207 } } },
  { id: 'RAL 130-5', spaces: { RGB: { r: 237, g: 228, b: 188 } } },
  { id: 'RAL 130-6', spaces: { RGB: { r: 251, g: 229, b: 176 } } },
  { id: 'RAL 130-M', spaces: { RGB: { r: 171, g: 171, b: 144 } } },

  /** RAL 140 */
  { id: 'RAL 140-1', spaces: { RGB: { r: 250, g: 211, b: 169 } } },
  { id: 'RAL 140-2', spaces: { RGB: { r: 254, g: 218, b: 166 } } },
  { id: 'RAL 140-3', spaces: { RGB: { r: 254, g: 227, b: 193 } } },
  { id: 'RAL 140-4', spaces: { RGB: { r: 253, g: 223, b: 190 } } },
  { id: 'RAL 140-5', spaces: { RGB: { r: 248, g: 228, b: 200 } } },
  { id: 'RAL 140-6', spaces: { RGB: { r: 229, g: 210, b: 182 } } },
  { id: 'RAL 140-M', spaces: { RGB: { r: 176, g: 158, b: 126 } } },

  /** RAL 150 */
  { id: 'RAL 150-1', spaces: { RGB: { r: 247, g: 239, b: 233 } } },
  { id: 'RAL 150-2', spaces: { RGB: { r: 249, g: 235, b: 227 } } },
  { id: 'RAL 150-3', spaces: { RGB: { r: 238, g: 225, b: 215 } } },
  { id: 'RAL 150-4', spaces: { RGB: { r: 251, g: 227, b: 212 } } },
  { id: 'RAL 150-5', spaces: { RGB: { r: 250, g: 232, b: 220 } } },
  { id: 'RAL 150-6', spaces: { RGB: { r: 248, g: 223, b: 215 } } },
  { id: 'RAL 150-M', spaces: { RGB: { r: 171, g: 151, b: 138 } } },

  /** RAL 160 */
  { id: 'RAL 160-1', spaces: { RGB: { r: 227, g: 225, b: 236 } } },
  { id: 'RAL 160-2', spaces: { RGB: { r: 231, g: 226, b: 232 } } },
  { id: 'RAL 160-3', spaces: { RGB: { r: 237, g: 232, b: 232 } } },
  { id: 'RAL 160-4', spaces: { RGB: { r: 238, g: 225, b: 226 } } },
  { id: 'RAL 160-5', spaces: { RGB: { r: 239, g: 228, b: 224 } } },
  { id: 'RAL 160-6', spaces: { RGB: { r: 236, g: 228, b: 233 } } },
  { id: 'RAL 160-M', spaces: { RGB: { r: 173, g: 166, b: 181 } } },

  /** RAL 170 */
  { id: 'RAL 170-1', spaces: { RGB: { r: 199, g: 201, b: 208 } } },
  { id: 'RAL 170-2', spaces: { RGB: { r: 166, g: 173, b: 189 } } },
  { id: 'RAL 170-3', spaces: { RGB: { r: 186, g: 200, b: 218 } } },
  { id: 'RAL 170-4', spaces: { RGB: { r: 206, g: 219, b: 236 } } },
  { id: 'RAL 170-5', spaces: { RGB: { r: 195, g: 198, b: 214 } } },
  { id: 'RAL 170-6', spaces: { RGB: { r: 198, g: 197, b: 214 } } },
  { id: 'RAL 170-M', spaces: { RGB: { r: 167, g: 168, b: 185 } } },

  /** RAL 180 */
  { id: 'RAL 180-1', spaces: { RGB: { r: 174, g: 188, b: 198 } } },
  { id: 'RAL 180-2', spaces: { RGB: { r: 185, g: 205, b: 221 } } },
  { id: 'RAL 180-3', spaces: { RGB: { r: 199, g: 219, b: 235 } } },
  { id: 'RAL 180-4', spaces: { RGB: { r: 201, g: 225, b: 236 } } },
  { id: 'RAL 180-5', spaces: { RGB: { r: 199, g: 221, b: 225 } } },
  { id: 'RAL 180-6', spaces: { RGB: { r: 219, g: 233, b: 235 } } },
  { id: 'RAL 180-M', spaces: { RGB: { r: 150, g: 164, b: 169 } } },

  /** RAL 190 */
  { id: 'RAL 190-1', spaces: { RGB: { r: 165, g: 218, b: 223 } } },
  { id: 'RAL 190-2', spaces: { RGB: { r: 185, g: 230, b: 242 } } },
  { id: 'RAL 190-3', spaces: { RGB: { r: 192, g: 222, b: 225 } } },
  { id: 'RAL 190-4', spaces: { RGB: { r: 189, g: 218, b: 215 } } },
  { id: 'RAL 190-5', spaces: { RGB: { r: 212, g: 229, b: 231 } } },
  { id: 'RAL 190-6', spaces: { RGB: { r: 163, g: 193, b: 191 } } },
  { id: 'RAL 190-M', spaces: { RGB: { r: 146, g: 180, b: 178 } } },

  /** RAL 210 */
  { id: 'RAL 210-1', spaces: { RGB: { r: 207, g: 198, b: 178 } } },
  { id: 'RAL 210-2', spaces: { RGB: { r: 236, g: 231, b: 210 } } },
  { id: 'RAL 210-3', spaces: { RGB: { r: 227, g: 228, b: 217 } } },
  { id: 'RAL 210-4', spaces: { RGB: { r: 214, g: 230, b: 227 } } },
  { id: 'RAL 210-5', spaces: { RGB: { r: 216, g: 232, b: 224 } } },
  { id: 'RAL 210-6', spaces: { RGB: { r: 216, g: 233, b: 214 } } },
  { id: 'RAL 210-M', spaces: { RGB: { r: 165, g: 169, b: 155 } } },

  /** RAL 220 */
  { id: 'RAL 220-1', spaces: { RGB: { r: 102, g: 184, b: 114 } } },
  { id: 'RAL 220-2', spaces: { RGB: { r:  51, g: 154, b:  81 } } },
  { id: 'RAL 220-3', spaces: { RGB: { r:   0, g: 111, b:  60 } } },
  { id: 'RAL 220-4', spaces: { RGB: { r: 127, g: 255, b: 127 } } },
  { id: 'RAL 220-5', spaces: { RGB: { r:   0, g: 255, b:   0 } } },
  { id: 'RAL 220-6', spaces: { RGB: { r:   0, g: 128, b:   0 } } },
  { id: 'RAL 220-M', spaces: { RGB: { r:   0, g: 127, b:  62 } } },

  /** RAL 230 */
  { id: 'RAL 230-1', spaces: { RGB: { r: 187, g: 219, b: 154 } } },
  { id: 'RAL 230-2', spaces: { RGB: { r: 150, g: 200, b: 108 } } },
  { id: 'RAL 230-3', spaces: { RGB: { r: 125, g: 179, b:  68 } } },
  { id: 'RAL 230-4', spaces: { RGB: { r:  95, g: 151, b:  58 } } },
  { id: 'RAL 230-5', spaces: { RGB: { r:  57, g: 105, b:  56 } } },
  { id: 'RAL 230-6', spaces: { RGB: { r:  54, g:  92, b:  48 } } },
  { id: 'RAL 230-M', spaces: { RGB: { r:  98, g: 167, b:  78 } } },

  /** RAL 240 */
  { id: 'RAL 240-1', spaces: { RGB: { r: 220, g: 214, b: 145 } } },
  { id: 'RAL 240-2', spaces: { RGB: { r: 170, g: 175, b: 102 } } },
  { id: 'RAL 240-3', spaces: { RGB: { r: 147, g: 151, b:  85 } } },
  { id: 'RAL 240-4', spaces: { RGB: { r: 126, g: 126, b:  66 } } },
  { id: 'RAL 240-5', spaces: { RGB: { r:  93, g: 109, b:  60 } } },
  { id: 'RAL 240-6', spaces: { RGB: { r:  79, g: 109, b:  53 } } },
  { id: 'RAL 240-M', spaces: { RGB: { r:  98, g: 116, b:  57 } } },

  /** RAL 250 */
  { id: 'RAL 250-1', spaces: { RGB: { r: 238, g: 230, b: 165 } } },
  { id: 'RAL 250-2', spaces: { RGB: { r: 232, g: 222, b: 111 } } },
  { id: 'RAL 250-3', spaces: { RGB: { r: 191, g: 183, b:   0 } } },
  { id: 'RAL 250-4', spaces: { RGB: { r: 164, g: 165, b:  65 } } },
  { id: 'RAL 250-5', spaces: { RGB: { r: 145, g: 145, b:  56 } } },
  { id: 'RAL 250-6', spaces: { RGB: { r: 105, g: 101, b:  44 } } },
  { id: 'RAL 250-M', spaces: { RGB: { r: 174, g: 167, b:  59 } } },

  /** RAL 260 */
  { id: 'RAL 260-1', spaces: { RGB: { r: 243, g: 233, b: 180 } } },
  { id: 'RAL 260-2', spaces: { RGB: { r: 241, g: 228, b: 131 } } },
  { id: 'RAL 260-3', spaces: { RGB: { r: 243, g: 212, b:  70 } } },
  { id: 'RAL 260-4', spaces: { RGB: { r: 232, g: 192, b:  31 } } },
  { id: 'RAL 260-5', spaces: { RGB: { r: 222, g: 176, b:  45 } } },
  { id: 'RAL 260-6', spaces: { RGB: { r: 239, g: 180, b:  22 } } },
  { id: 'RAL 260-M', spaces: { RGB: { r: 184, g: 148, b:  79 } } },

  /** RAL 270 */
  { id: 'RAL 270-1', spaces: { RGB: { r: 255, g: 222, b: 131 } } },
  { id: 'RAL 270-2', spaces: { RGB: { r: 250, g: 204, b:  57 } } },
  { id: 'RAL 270-3', spaces: { RGB: { r: 244, g: 189, b:  22 } } },
  { id: 'RAL 270-4', spaces: { RGB: { r: 235, g: 177, b:   0 } } },
  { id: 'RAL 270-5', spaces: { RGB: { r: 246, g: 182, b:   0 } } },
  { id: 'RAL 270-6', spaces: { RGB: { r: 254, g: 196, b:  63 } } },
  { id: 'RAL 270-M', spaces: { RGB: { r: 203, g: 148, b:  55 } } },

  /** RAL 280 */
  { id: 'RAL 280-1', spaces: { RGB: { r: 253, g: 225, b: 147 } } },
  { id: 'RAL 280-2', spaces: { RGB: { r: 240, g: 211, b: 145 } } },
  { id: 'RAL 280-3', spaces: { RGB: { r: 225, g: 190, b: 120 } } },
  { id: 'RAL 280-4', spaces: { RGB: { r: 214, g: 174, b:  95 } } },
  { id: 'RAL 280-5', spaces: { RGB: { r: 220, g: 161, b:  64 } } },
  { id: 'RAL 280-6', spaces: { RGB: { r: 208, g: 151, b:  60 } } },
  { id: 'RAL 280-M', spaces: { RGB: { r: 178, g: 135, b:  64 } } },

  /** RAL 290 */
  { id: 'RAL 290-1', spaces: { RGB: { r: 216, g: 155, b:  80 } } },
  { id: 'RAL 290-2', spaces: { RGB: { r: 191, g: 133, b:  59 } } },
  { id: 'RAL 290-3', spaces: { RGB: { r: 216, g: 169, b:  96 } } },
  { id: 'RAL 290-4', spaces: { RGB: { r: 204, g: 146, b:  27 } } },
  { id: 'RAL 290-5', spaces: { RGB: { r: 230, g: 176, b:  62 } } },
  { id: 'RAL 290-6', spaces: { RGB: { r: 252, g: 171, b:   4 } } },
  { id: 'RAL 290-M', spaces: { RGB: { r: 184, g: 126, b:  50 } } },

  /** RAL 310 */
  { id: 'RAL 310-1', spaces: { RGB: { r: 245, g: 214, b: 180 } } },
  { id: 'RAL 310-2', spaces: { RGB: { r: 235, g: 194, b: 151 } } },
  { id: 'RAL 310-3', spaces: { RGB: { r: 223, g: 171, b: 115 } } },
  { id: 'RAL 310-4', spaces: { RGB: { r: 208, g: 147, b:  85 } } },
  { id: 'RAL 310-5', spaces: { RGB: { r: 186, g: 124, b:  67 } } },
  { id: 'RAL 310-6', spaces: { RGB: { r: 142, g:  91, b:  45 } } },
  { id: 'RAL 310-M', spaces: { RGB: { r: 184, g: 125, b:  79 } } },

  /** RAL 320 */
  { id: 'RAL 320-1', spaces: { RGB: { r: 210, g: 169, b: 108 } } },
  { id: 'RAL 320-2', spaces: { RGB: { r: 174, g: 129, b:  81 } } },
  { id: 'RAL 320-3', spaces: { RGB: { r: 185, g: 134, b:  76 } } },
  { id: 'RAL 320-4', spaces: { RGB: { r: 160, g: 103, b:  53 } } },
  { id: 'RAL 320-5', spaces: { RGB: { r: 127, g:  78, b:  46 } } },
  { id: 'RAL 320-6', spaces: { RGB: { r: 110, g:  68, b:  40 } } },
  { id: 'RAL 320-M', spaces: { RGB: { r: 185, g: 115, b:  30 } } },

  /** RAL 330 */
  { id: 'RAL 330-1', spaces: { RGB: { r: 168, g: 104, b:  89 } } },
  { id: 'RAL 330-2', spaces: { RGB: { r: 142, g:  75, b:  53 } } },
  { id: 'RAL 330-3', spaces: { RGB: { r: 121, g:  78, b:  62 } } },
  { id: 'RAL 330-4', spaces: { RGB: { r:  92, g:  59, b:  45 } } },
  { id: 'RAL 330-5', spaces: { RGB: { r:  80, g:  49, b:  42 } } },
  { id: 'RAL 330-6', spaces: { RGB: { r:  70, g:  50, b:  46 } } },
  { id: 'RAL 330-M', spaces: { RGB: { r: 139, g:  89, b:  67 } } },

  /** RAL 340 */
  { id: 'RAL 340-1', spaces: { RGB: { r: 190, g: 164, b: 169 } } },
  { id: 'RAL 340-2', spaces: { RGB: { r: 164, g: 140, b: 146 } } },
  { id: 'RAL 340-3', spaces: { RGB: { r: 127, g:  84, b:  82 } } },
  { id: 'RAL 340-4', spaces: { RGB: { r: 104, g:  61, b:  64 } } },
  { id: 'RAL 340-5', spaces: { RGB: { r:  79, g:  42, b:  45 } } },
  { id: 'RAL 340-6', spaces: { RGB: { r:  79, g:  43, b:  49 } } },
  { id: 'RAL 340-M', spaces: { RGB: { r:  83, g:  53, b:  59 } } },

  /** RAL 350 */
  { id: 'RAL 350-1', spaces: { RGB: { r: 157, g:  49, b:  31 } } },
  { id: 'RAL 350-2', spaces: { RGB: { r: 167, g:  63, b:  50 } } },
  { id: 'RAL 350-3', spaces: { RGB: { r: 162, g:  71, b:  51 } } },
  { id: 'RAL 350-4', spaces: { RGB: { r: 129, g:  48, b:  33 } } },
  { id: 'RAL 350-5', spaces: { RGB: { r: 120, g:  49, b:  34 } } },
  { id: 'RAL 350-6', spaces: { RGB: { r: 102, g:  50, b:  43 } } },
  { id: 'RAL 350-M', spaces: { RGB: { r:  88, g:  47, b:  42 } } },

  /** RAL 360 */
  { id: 'RAL 360-1', spaces: { RGB: { r: 224, g: 125, b:  41 } } },
  { id: 'RAL 360-2', spaces: { RGB: { r: 217, g: 117, b:  30 } } },
  { id: 'RAL 360-3', spaces: { RGB: { r: 198, g:  98, b:  23 } } },
  { id: 'RAL 360-4', spaces: { RGB: { r: 183, g:  86, b:  41 } } },
  { id: 'RAL 360-5', spaces: { RGB: { r: 154, g:  79, b:  44 } } },
  { id: 'RAL 360-6', spaces: { RGB: { r: 145, g:  80, b:  51 } } },
  { id: 'RAL 360-M', spaces: { RGB: { r: 164, g:  86, b:  51 } } },

  /** RAL 370 */
  { id: 'RAL 370-1', spaces: { RGB: { r: 255, g: 174, b:  71 } } },
  { id: 'RAL 370-2', spaces: { RGB: { r: 255, g: 155, b:  56 } } },
  { id: 'RAL 370-3', spaces: { RGB: { r: 255, g: 144, b:  29 } } },
  { id: 'RAL 370-4', spaces: { RGB: { r: 230, g: 131, b:  22 } } },
  { id: 'RAL 370-5', spaces: { RGB: { r: 212, g: 120, b:  31 } } },
  { id: 'RAL 370-6', spaces: { RGB: { r: 205, g: 108, b:  16 } } },
  { id: 'RAL 370-M', spaces: { RGB: { r: 180, g: 122, b:  60 } } },

  /** RAL 380 */
  { id: 'RAL 380-1', spaces: { RGB: { r: 255, g: 155, b:  41 } } },
  { id: 'RAL 380-2', spaces: { RGB: { r: 255, g: 146, b:   4 } } },
  { id: 'RAL 380-3', spaces: { RGB: { r: 250, g: 132, b:  26 } } },
  { id: 'RAL 380-4', spaces: { RGB: { r: 226, g: 113, b:  33 } } },
  { id: 'RAL 380-5', spaces: { RGB: { r: 242, g: 120, b:  47 } } },
  { id: 'RAL 380-6', spaces: { RGB: { r: 234, g: 106, b:  36 } } },
  { id: 'RAL 380-M', spaces: { RGB: { r: 167, g:  85, b:  42 } } },

  /** RAL 390 */
  { id: 'RAL 390-1', spaces: { RGB: { r: 235, g: 119, b:  63 } } },
  { id: 'RAL 390-2', spaces: { RGB: { r: 227, g:  97, b:  37 } } },
  { id: 'RAL 390-3', spaces: { RGB: { r: 222, g:  84, b:  17 } } },
  { id: 'RAL 390-4', spaces: { RGB: { r: 216, g:  81, b:  28 } } },
  { id: 'RAL 390-5', spaces: { RGB: { r: 216, g:  72, b:  15 } } },
  { id: 'RAL 390-6', spaces: { RGB: { r: 205, g:  94, b:  42 } } },
  { id: 'RAL 390-M', spaces: { RGB: { r: 191, g:  99, b:  59 } } },

  /** RAL 410 */
  { id: 'RAL 410-1', spaces: { RGB: { r: 237, g: 129, b: 101 } } },
  { id: 'RAL 410-2', spaces: { RGB: { r: 234, g: 115, b:  79 } } },
  { id: 'RAL 410-3', spaces: { RGB: { r: 228, g: 100, b:  64 } } },
  { id: 'RAL 410-4', spaces: { RGB: { r: 220, g:  93, b:  56 } } },
  { id: 'RAL 410-5', spaces: { RGB: { r: 210, g:  85, b:  53 } } },
  { id: 'RAL 410-6', spaces: { RGB: { r: 208, g:  93, b:  66 } } },
  { id: 'RAL 410-M', spaces: { RGB: { r: 171, g:  73, b:  36 } } },

  /** RAL 420 */
  { id: 'RAL 420-1', spaces: { RGB: { r: 237, g: 174, b: 154 } } },
  { id: 'RAL 420-2', spaces: { RGB: { r: 242, g: 157, b: 134 } } },
  { id: 'RAL 420-3', spaces: { RGB: { r: 233, g: 138, b: 108 } } },
  { id: 'RAL 420-4', spaces: { RGB: { r: 228, g: 100, b:  67 } } },
  { id: 'RAL 420-5', spaces: { RGB: { r: 204, g:  87, b:  56 } } },
  { id: 'RAL 420-6', spaces: { RGB: { r: 191, g:  80, b:  46 } } },
  { id: 'RAL 420-M', spaces: { RGB: { r: 157, g:  75, b:  50 } } },

  /** RAL 430 */
  { id: 'RAL 430-1', spaces: { RGB: { r: 242, g: 194, b: 182 } } },
  { id: 'RAL 430-2', spaces: { RGB: { r: 236, g: 153, b: 139 } } },
  { id: 'RAL 430-3', spaces: { RGB: { r: 228, g: 128, b: 116 } } },
  { id: 'RAL 430-4', spaces: { RGB: { r: 221, g:  90, b:  76 } } },
  { id: 'RAL 430-5', spaces: { RGB: { r: 213, g:  67, b:  60 } } },
  { id: 'RAL 430-6', spaces: { RGB: { r: 190, g:  58, b:  36 } } },
  { id: 'RAL 430-M', spaces: { RGB: { r: 168, g:  76, b:  69 } } },

  /** RAL 440 */
  { id: 'RAL 440-1', spaces: { RGB: { r: 202, g:  56, b:  60 } } },
  { id: 'RAL 440-2', spaces: { RGB: { r: 211, g:  76, b:  73 } } },
  { id: 'RAL 440-3', spaces: { RGB: { r: 186, g:  60, b:  62 } } },
  { id: 'RAL 440-4', spaces: { RGB: { r: 155, g:  41, b:  41 } } },
  { id: 'RAL 440-5', spaces: { RGB: { r: 166, g:  49, b:  41 } } },
  { id: 'RAL 440-6', spaces: { RGB: { r: 185, g:  53, b:  37 } } },
  { id: 'RAL 440-M', spaces: { RGB: { r: 155, g:  37, b:  44 } } },

  /** RAL 450 */
  { id: 'RAL 450-1', spaces: { RGB: { r: 244, g: 199, b: 202 } } },
  { id: 'RAL 450-2', spaces: { RGB: { r: 237, g: 165, b: 170 } } },
  { id: 'RAL 450-3', spaces: { RGB: { r: 224, g: 122, b: 129 } } },
  { id: 'RAL 450-4', spaces: { RGB: { r: 200, g:  88, b:  98 } } },
  { id: 'RAL 450-5', spaces: { RGB: { r: 178, g:  49, b:  47 } } },
  { id: 'RAL 450-6', spaces: { RGB: { r: 187, g:  32, b:  29 } } },
  { id: 'RAL 450-M', spaces: { RGB: { r: 167, g:  22, b:  22 } } },

  /** RAL 460 */
  { id: 'RAL 460-1', spaces: { RGB: { r: 239, g: 163, b: 167 } } },
  { id: 'RAL 460-2', spaces: { RGB: { r: 227, g: 127, b: 137 } } },
  { id: 'RAL 460-3', spaces: { RGB: { r: 223, g:  99, b: 104 } } },
  { id: 'RAL 460-4', spaces: { RGB: { r: 211, g:  82, b:  84 } } },
  { id: 'RAL 460-5', spaces: { RGB: { r: 168, g:  55, b:  59 } } },
  { id: 'RAL 460-6', spaces: { RGB: { r: 139, g:  27, b:  40 } } },
  { id: 'RAL 460-M', spaces: { RGB: { r: 174, g:  54, b:  59 } } },

  /** RAL 470 */
  { id: 'RAL 470-1', spaces: { RGB: { r: 240, g: 179, b: 193 } } },
  { id: 'RAL 470-2', spaces: { RGB: { r: 230, g: 139, b: 157 } } },
  { id: 'RAL 470-3', spaces: { RGB: { r: 222, g: 115, b: 131 } } },
  { id: 'RAL 470-4', spaces: { RGB: { r: 202, g:  77, b: 103 } } },
  { id: 'RAL 470-5', spaces: { RGB: { r: 172, g:  45, b:  76 } } },
  { id: 'RAL 470-6', spaces: { RGB: { r: 156, g:  34, b:  63 } } },
  { id: 'RAL 470-M', spaces: { RGB: { r: 177, g:  79, b:  93 } } },

  /** RAL 480 */
  { id: 'RAL 480-1', spaces: { RGB: { r: 245, g: 202, b: 201 } } },
  { id: 'RAL 480-2', spaces: { RGB: { r: 245, g: 192, b: 190 } } },
  { id: 'RAL 480-3', spaces: { RGB: { r: 238, g: 186, b: 188 } } },
  { id: 'RAL 480-4', spaces: { RGB: { r: 238, g: 165, b: 177 } } },
  { id: 'RAL 480-5', spaces: { RGB: { r: 233, g: 144, b: 158 } } },
  { id: 'RAL 480-6', spaces: { RGB: { r: 218, g: 108, b: 130 } } },
  { id: 'RAL 480-M', spaces: { RGB: { r: 168, g: 117, b: 121 } } },

  /** RAL 490 */
  { id: 'RAL 490-1', spaces: { RGB: { r: 243, g: 207, b: 208 } } },
  { id: 'RAL 490-2', spaces: { RGB: { r: 247, g: 202, b: 195 } } },
  { id: 'RAL 490-3', spaces: { RGB: { r: 232, g: 154, b: 146 } } },
  { id: 'RAL 490-4', spaces: { RGB: { r: 195, g: 123, b: 119 } } },
  { id: 'RAL 490-5', spaces: { RGB: { r: 190, g: 127, b: 140 } } },
  { id: 'RAL 490-6', spaces: { RGB: { r: 210, g: 158, b: 168 } } },
  { id: 'RAL 490-M', spaces: { RGB: { r: 167, g: 125, b: 136 } } },

  /** RAL 510 */
  { id: 'RAL 510-1', spaces: { RGB: { r: 236, g: 200, b: 220 } } },
  { id: 'RAL 510-2', spaces: { RGB: { r: 224, g: 165, b: 203 } } },
  { id: 'RAL 510-3', spaces: { RGB: { r: 213, g: 132, b: 177 } } },
  { id: 'RAL 510-4', spaces: { RGB: { r: 196, g:  99, b: 141 } } },
  { id: 'RAL 510-5', spaces: { RGB: { r: 186, g:  72, b: 119 } } },
  { id: 'RAL 510-6', spaces: { RGB: { r: 154, g:  59, b: 106 } } },
  { id: 'RAL 510-M', spaces: { RGB: { r: 140, g:  61, b: 113 } } },

  /** RAL 520 */
  { id: 'RAL 520-1', spaces: { RGB: { r: 239, g: 210, b: 223 } } },
  { id: 'RAL 520-2', spaces: { RGB: { r: 232, g: 186, b: 210 } } },
  { id: 'RAL 520-3', spaces: { RGB: { r: 220, g: 165, b: 192 } } },
  { id: 'RAL 520-4', spaces: { RGB: { r: 186, g: 114, b: 147 } } },
  { id: 'RAL 520-5', spaces: { RGB: { r: 160, g:  78, b: 111 } } },
  { id: 'RAL 520-6', spaces: { RGB: { r: 146, g:  82, b: 110 } } },
  { id: 'RAL 520-M', spaces: { RGB: { r: 158, g:  88, b: 139 } } },

  /** RAL 530 */
  { id: 'RAL 530-1', spaces: { RGB: { r: 152, g:  68, b:  77 } } },
  { id: 'RAL 530-2', spaces: { RGB: { r: 143, g:  63, b:  78 } } },
  { id: 'RAL 530-3', spaces: { RGB: { r: 121, g:  54, b:  68 } } },
  { id: 'RAL 530-4', spaces: { RGB: { r: 124, g:  47, b:  75 } } },
  { id: 'RAL 530-5', spaces: { RGB: { r: 102, g:  37, b:  61 } } },
  { id: 'RAL 530-6', spaces: { RGB: { r:  97, g:  41, b:  74 } } },
  { id: 'RAL 530-M', spaces: { RGB: { r:  92, g:  45, b:  58 } } },

  /** RAL 540 */
  { id: 'RAL 540-1', spaces: { RGB: { r: 212, g: 193, b: 215 } } },
  { id: 'RAL 540-2', spaces: { RGB: { r: 190, g: 161, b: 193 } } },
  { id: 'RAL 540-3', spaces: { RGB: { r: 128, g:  95, b: 131 } } },
  { id: 'RAL 540-4', spaces: { RGB: { r: 150, g: 107, b: 152 } } },
  { id: 'RAL 540-5', spaces: { RGB: { r: 129, g:  83, b: 122 } } },
  { id: 'RAL 540-6', spaces: { RGB: { r:  86, g:  44, b:  81 } } },
  { id: 'RAL 540-M', spaces: { RGB: { r:  86, g:  47, b:  78 } } },

  /** RAL 550 */
  { id: 'RAL 550-1', spaces: { RGB: { r: 224, g: 209, b: 217 } } },
  { id: 'RAL 550-2', spaces: { RGB: { r: 208, g: 187, b: 201 } } },
  { id: 'RAL 550-3', spaces: { RGB: { r: 178, g: 146, b: 168 } } },
  { id: 'RAL 550-4', spaces: { RGB: { r: 156, g: 116, b: 136 } } },
  { id: 'RAL 550-5', spaces: { RGB: { r: 141, g:  97, b: 119 } } },
  { id: 'RAL 550-6', spaces: { RGB: { r: 120, g:  76, b:  94 } } },
  { id: 'RAL 550-M', spaces: { RGB: { r: 167, g: 136, b: 144 } } },

  /** RAL 560 */
  { id: 'RAL 560-1', spaces: { RGB: { r: 204, g: 188, b: 199 } } },
  { id: 'RAL 560-2', spaces: { RGB: { r: 176, g: 156, b: 173 } } },
  { id: 'RAL 560-3', spaces: { RGB: { r: 140, g: 111, b: 128 } } },
  { id: 'RAL 560-4', spaces: { RGB: { r: 119, g:  84, b:  96 } } },
  { id: 'RAL 560-5', spaces: { RGB: { r: 133, g: 114, b: 127 } } },
  { id: 'RAL 560-6', spaces: { RGB: { r: 125, g: 110, b: 127 } } },
  { id: 'RAL 560-M', spaces: { RGB: { r: 165, g: 146, b: 164 } } },

  /** RAL 570 */
  { id: 'RAL 570-1', spaces: { RGB: { r: 209, g: 206, b: 232 } } },
  { id: 'RAL 570-2', spaces: { RGB: { r: 195, g: 191, b: 225 } } },
  { id: 'RAL 570-3', spaces: { RGB: { r: 173, g: 173, b: 221 } } },
  { id: 'RAL 570-4', spaces: { RGB: { r: 155, g: 154, b: 207 } } },
  { id: 'RAL 570-5', spaces: { RGB: { r: 128, g: 120, b: 179 } } },
  { id: 'RAL 570-6', spaces: { RGB: { r: 121, g: 104, b: 155 } } },
  { id: 'RAL 570-M', spaces: { RGB: { r: 107, g:  88, b: 154 } } },

  /** RAL 580 */
  { id: 'RAL 580-1', spaces: { RGB: { r: 194, g: 207, b: 230 } } },
  { id: 'RAL 580-2', spaces: { RGB: { r: 188, g: 199, b: 224 } } },
  { id: 'RAL 580-3', spaces: { RGB: { r: 167, g: 178, b: 209 } } },
  { id: 'RAL 580-4', spaces: { RGB: { r: 105, g: 116, b: 154 } } },
  { id: 'RAL 580-5', spaces: { RGB: { r:  65, g:  80, b: 110 } } },
  { id: 'RAL 580-6', spaces: { RGB: { r:  36, g:  49, b:  84 } } },
  { id: 'RAL 580-M', spaces: { RGB: { r:  99, g: 108, b: 134 } } },

  /** RAL 590 */
  { id: 'RAL 590-1', spaces: { RGB: { r: 102, g: 109, b: 155 } } },
  { id: 'RAL 590-2', spaces: { RGB: { r:  66, g:  66, b: 118 } } },
  { id: 'RAL 590-3', spaces: { RGB: { r:  42, g:  54, b: 107 } } },
  { id: 'RAL 590-4', spaces: { RGB: { r:  39, g:  47, b:  91 } } },
  { id: 'RAL 590-5', spaces: { RGB: { r:  20, g:  45, b:  88 } } },
  { id: 'RAL 590-6', spaces: { RGB: { r:   9, g:  59, b: 122 } } },
  { id: 'RAL 590-M', spaces: { RGB: { r:  41, g:  56, b:  98 } } },

  /** RAL 610 */
  { id: 'RAL 610-1', spaces: { RGB: { r: 110, g: 143, b: 171 } } },
  { id: 'RAL 610-2', spaces: { RGB: { r:  97, g: 122, b: 148 } } },
  { id: 'RAL 610-3', spaces: { RGB: { r: 109, g: 149, b: 185 } } },
  { id: 'RAL 610-4', spaces: { RGB: { r: 137, g: 178, b: 216 } } },
  { id: 'RAL 610-5', spaces: { RGB: { r:  71, g: 119, b: 174 } } },
  { id: 'RAL 610-6', spaces: { RGB: { r:  67, g: 105, b: 153 } } },
  { id: 'RAL 610-M', spaces: { RGB: { r: 120, g: 151, b: 181 } } },

  /** RAL 620 */
  { id: 'RAL 620-1', spaces: { RGB: { r:  52, g: 104, b: 138 } } },
  { id: 'RAL 620-2', spaces: { RGB: { r:  96, g: 146, b: 172 } } },
  { id: 'RAL 620-3', spaces: { RGB: { r: 100, g: 129, b: 143 } } },
  { id: 'RAL 620-4', spaces: { RGB: { r:  58, g:  90, b: 106 } } },
  { id: 'RAL 620-5', spaces: { RGB: { r:  20, g:  53, b:  75 } } },
  { id: 'RAL 620-6', spaces: { RGB: { r:  30, g:  45, b:  63 } } },
  { id: 'RAL 620-M', spaces: { RGB: { r:   9, g:  50, b:  70 } } },

  /** RAL 630 */
  { id: 'RAL 630-1', spaces: { RGB: { r:  81, g: 163, b: 211 } } },
  { id: 'RAL 630-2', spaces: { RGB: { r:  68, g: 107, b: 142 } } },
  { id: 'RAL 630-3', spaces: { RGB: { r:  46, g:  78, b: 111 } } },
  { id: 'RAL 630-4', spaces: { RGB: { r:  45, g:  74, b: 110 } } },
  { id: 'RAL 630-5', spaces: { RGB: { r:  31, g:  52, b:  84 } } },
  { id: 'RAL 630-6', spaces: { RGB: { r:  25, g:  54, b:  84 } } },
  { id: 'RAL 630-M', spaces: { RGB: { r:  22, g:  48, b:  76 } } },

  /** RAL 640 */
  { id: 'RAL 640-1', spaces: { RGB: { r:  73, g: 160, b: 197 } } },
  { id: 'RAL 640-2', spaces: { RGB: { r:   0, g: 135, b: 181 } } },
  { id: 'RAL 640-3', spaces: { RGB: { r:   0, g: 123, b: 174 } } },
  { id: 'RAL 640-4', spaces: { RGB: { r:   0, g:  92, b: 140 } } },
  { id: 'RAL 640-5', spaces: { RGB: { r:   0, g:  84, b: 138 } } },
  { id: 'RAL 640-6', spaces: { RGB: { r:   0, g:  79, b: 125 } } },
  { id: 'RAL 640-M', spaces: { RGB: { r:   0, g:  78, b: 135 } } },

  /** RAL 650 */
  { id: 'RAL 650-1', spaces: { RGB: { r: 100, g: 181, b: 214 } } },
  { id: 'RAL 650-2', spaces: { RGB: { r:   0, g: 119, b: 160 } } },
  { id: 'RAL 650-3', spaces: { RGB: { r:   0, g: 108, b: 151 } } },
  { id: 'RAL 650-4', spaces: { RGB: { r:   0, g:  85, b: 119 } } },
  { id: 'RAL 650-5', spaces: { RGB: { r:  29, g:  91, b: 120 } } },
  { id: 'RAL 650-6', spaces: { RGB: { r:  10, g:  73, b:  98 } } },
  { id: 'RAL 650-M', spaces: { RGB: { r:   0, g: 113, b: 157 } } },

  /** RAL 660 */
  { id: 'RAL 660-1', spaces: { RGB: { r:   0, g: 148, b: 176 } } },
  { id: 'RAL 660-2', spaces: { RGB: { r:  11, g: 141, b: 168 } } },
  { id: 'RAL 660-3', spaces: { RGB: { r:  81, g: 165, b: 184 } } },
  { id: 'RAL 660-4', spaces: { RGB: { r:  63, g: 184, b: 207 } } },
  { id: 'RAL 660-5', spaces: { RGB: { r: 108, g: 195, b: 212 } } },
  { id: 'RAL 660-6', spaces: { RGB: { r: 138, g: 200, b: 213 } } },
  { id: 'RAL 660-M', spaces: { RGB: { r:  85, g: 151, b: 169 } } },

  /** RAL 670 */
  { id: 'RAL 670-1', spaces: { RGB: { r: 138, g: 211, b: 234 } } },
  { id: 'RAL 670-2', spaces: { RGB: { r: 151, g: 218, b: 239 } } },
  { id: 'RAL 670-3', spaces: { RGB: { r: 143, g: 197, b: 214 } } },
  { id: 'RAL 670-4', spaces: { RGB: { r: 105, g: 187, b: 211 } } },
  { id: 'RAL 670-5', spaces: { RGB: { r:  91, g: 185, b: 213 } } },
  { id: 'RAL 670-6', spaces: { RGB: { r:  78, g: 194, b: 230 } } },
  { id: 'RAL 670-M', spaces: { RGB: { r: 116, g: 167, b: 184 } } },

  /** RAL 680 */
  { id: 'RAL 680-1', spaces: { RGB: { r: 114, g: 170, b: 186 } } },
  { id: 'RAL 680-2', spaces: { RGB: { r:  51, g: 143, b: 164 } } },
  { id: 'RAL 680-3', spaces: { RGB: { r:  23, g: 113, b: 133 } } },
  { id: 'RAL 680-4', spaces: { RGB: { r:  38, g: 118, b: 141 } } },
  { id: 'RAL 680-5', spaces: { RGB: { r:   0, g: 106, b: 133 } } },
  { id: 'RAL 680-6', spaces: { RGB: { r:   0, g:  91, b: 116 } } },
  { id: 'RAL 680-M', spaces: { RGB: { r:  14, g:  69, b:  92 } } },

  /** RAL 690 */
  { id: 'RAL 690-1', spaces: { RGB: { r:  63, g: 191, b: 203 } } },
  { id: 'RAL 690-2', spaces: { RGB: { r:   0, g: 162, b: 173 } } },
  { id: 'RAL 690-3', spaces: { RGB: { r:   0, g: 131, b: 142 } } },
  { id: 'RAL 690-4', spaces: { RGB: { r:   0, g: 108, b: 123 } } },
  { id: 'RAL 690-5', spaces: { RGB: { r:   0, g:  83, b:  95 } } },
  { id: 'RAL 690-6', spaces: { RGB: { r:   0, g:  81, b:  96 } } },
  { id: 'RAL 690-M', spaces: { RGB: { r:   0, g: 103, b: 115 } } },

  /** RAL 710 */
  { id: 'RAL 710-1', spaces: { RGB: { r: 120, g: 209, b: 205 } } },
  { id: 'RAL 710-2', spaces: { RGB: { r:   0, g: 170, b: 167 } } },
  { id: 'RAL 710-3', spaces: { RGB: { r:   5, g: 138, b: 139 } } },
  { id: 'RAL 710-4', spaces: { RGB: { r:   0, g: 116, b: 118 } } },
  { id: 'RAL 710-5', spaces: { RGB: { r:   0, g:  92, b:  96 } } },
  { id: 'RAL 710-6', spaces: { RGB: { r:  12, g:  71, b:  70 } } },
  { id: 'RAL 710-M', spaces: { RGB: { r:   0, g: 104, b: 107 } } },

  /** RAL 720 */
  { id: 'RAL 720-1', spaces: { RGB: { r: 194, g: 227, b: 222 } } },
  { id: 'RAL 720-2', spaces: { RGB: { r: 164, g: 226, b: 219 } } },
  { id: 'RAL 720-3', spaces: { RGB: { r: 134, g: 211, b: 212 } } },
  { id: 'RAL 720-4', spaces: { RGB: { r:  88, g: 190, b: 193 } } },
  { id: 'RAL 720-5', spaces: { RGB: { r:  51, g: 147, b: 160 } } },
  { id: 'RAL 720-6', spaces: { RGB: { r:  25, g: 124, b: 134 } } },
  { id: 'RAL 720-M', spaces: { RGB: { r:  26, g: 148, b: 154 } } },

  /** RAL 730 */
  { id: 'RAL 730-1', spaces: { RGB: { r: 203, g: 231, b: 226 } } },
  { id: 'RAL 730-2', spaces: { RGB: { r: 152, g: 211, b: 211 } } },
  { id: 'RAL 730-3', spaces: { RGB: { r: 125, g: 184, b: 186 } } },
  { id: 'RAL 730-4', spaces: { RGB: { r: 123, g: 185, b: 180 } } },
  { id: 'RAL 730-5', spaces: { RGB: { r: 121, g: 172, b: 172 } } },
  { id: 'RAL 730-6', spaces: { RGB: { r:  70, g: 135, b: 127 } } },
  { id: 'RAL 730-M', spaces: { RGB: { r:  98, g: 162, b: 147 } } },

  /** RAL 740 */
  { id: 'RAL 740-1', spaces: { RGB: { r: 197, g: 220, b: 206 } } },
  { id: 'RAL 740-2', spaces: { RGB: { r: 179, g: 214, b: 201 } } },
  { id: 'RAL 740-3', spaces: { RGB: { r: 149, g: 195, b: 178 } } },
  { id: 'RAL 740-4', spaces: { RGB: { r:  73, g: 133, b: 116 } } },
  { id: 'RAL 740-5', spaces: { RGB: { r:   0, g: 111, b:  91 } } },
  { id: 'RAL 740-6', spaces: { RGB: { r:   0, g:  93, b:  78 } } },
  { id: 'RAL 740-M', spaces: { RGB: { r:  58, g: 111, b:  95 } } },

  /** RAL 750 */
  { id: 'RAL 750-1', spaces: { RGB: { r: 191, g: 215, b: 201 } } },
  { id: 'RAL 750-2', spaces: { RGB: { r: 143, g: 180, b: 160 } } },
  { id: 'RAL 750-3', spaces: { RGB: { r:  61, g: 116, b:  97 } } },
  { id: 'RAL 750-4', spaces: { RGB: { r:  22, g:  66, b:  52 } } },
  { id: 'RAL 750-5', spaces: { RGB: { r:  51, g:  84, b:  73 } } },
  { id: 'RAL 750-6', spaces: { RGB: { r:  46, g:  60, b:  59 } } },
  { id: 'RAL 750-M', spaces: { RGB: { r:  23, g:  55, b:  45 } } },

  /** RAL 760 */
  { id: 'RAL 760-1', spaces: { RGB: { r: 213, g: 227, b: 202 } } },
  { id: 'RAL 760-2', spaces: { RGB: { r: 184, g: 205, b: 170 } } },
  { id: 'RAL 760-3', spaces: { RGB: { r: 176, g: 190, b: 155 } } },
  { id: 'RAL 760-4', spaces: { RGB: { r: 139, g: 155, b: 122 } } },
  { id: 'RAL 760-5', spaces: { RGB: { r: 109, g: 126, b:  92 } } },
  { id: 'RAL 760-6', spaces: { RGB: { r:  74, g: 100, b:  72 } } },
  { id: 'RAL 760-M', spaces: { RGB: { r:  51, g:  75, b:  46 } } },

  /** RAL 770 */
  { id: 'RAL 770-1', spaces: { RGB: { r: 152, g: 157, b: 132 } } },
  { id: 'RAL 770-2', spaces: { RGB: { r: 169, g: 168, b: 143 } } },
  { id: 'RAL 770-3', spaces: { RGB: { r: 122, g: 117, b:  90 } } },
  { id: 'RAL 770-4', spaces: { RGB: { r: 129, g: 122, b: 102 } } },
  { id: 'RAL 770-5', spaces: { RGB: { r: 180, g: 175, b: 159 } } },
  { id: 'RAL 770-6', spaces: { RGB: { r: 126, g: 130, b: 115 } } },
  { id: 'RAL 770-M', spaces: { RGB: { r: 141, g: 136, b: 100 } } },

  /** RAL 780 */
  { id: 'RAL 780-1', spaces: { RGB: { r: 233, g: 222, b: 204 } } },
  { id: 'RAL 780-2', spaces: { RGB: { r: 231, g: 214, b: 185 } } },
  { id: 'RAL 780-3', spaces: { RGB: { r: 221, g: 196, b: 154 } } },
  { id: 'RAL 780-4', spaces: { RGB: { r: 209, g: 177, b: 134 } } },
  { id: 'RAL 780-5', spaces: { RGB: { r: 163, g: 142, b: 121 } } },
  { id: 'RAL 780-6', spaces: { RGB: { r: 116, g: 105, b:  92 } } },
  { id: 'RAL 780-M', spaces: { RGB: { r: 178, g: 160, b: 116 } } },

  /** RAL 790 */
  { id: 'RAL 790-1', spaces: { RGB: { r:  62, g:  72, b:  73 } } },
  { id: 'RAL 790-2', spaces: { RGB: { r:  59, g:  65, b:  71 } } },
  { id: 'RAL 790-3', spaces: { RGB: { r:  49, g:  53, b:  56 } } },
  { id: 'RAL 790-4', spaces: { RGB: { r:  48, g:  47, b:  50 } } },
  { id: 'RAL 790-5', spaces: { RGB: { r:  33, g:  34, b:  36 } } },
  { id: 'RAL 790-6', spaces: { RGB: { r:  33, g:  35, b:  45 } } },
  { id: 'RAL 790-M', spaces: { RGB: { r:  34, g:  31, b:  29 } } },

  /** RAL 810 */
  { id: 'RAL 810-1', spaces: { RGB: { r: 151, g: 157, b: 162 } } },
  { id: 'RAL 810-2', spaces: { RGB: { r: 138, g: 148, b: 153 } } },
  { id: 'RAL 810-3', spaces: { RGB: { r: 121, g: 136, b: 142 } } },
  { id: 'RAL 810-4', spaces: { RGB: { r:  94, g: 107, b: 115 } } },
  { id: 'RAL 810-5', spaces: { RGB: { r:  81, g:  89, b:  93 } } },
  { id: 'RAL 810-6', spaces: { RGB: { r:  57, g:  65, b:  70 } } },
  { id: 'RAL 810-M', spaces: { RGB: { r:  64, g:  70, b:  73 } } },

  /** RAL 820 */
  { id: 'RAL 820-1', spaces: { RGB: { r: 197, g: 200, b: 202 } } },
  { id: 'RAL 820-2', spaces: { RGB: { r: 169, g: 174, b: 178 } } },
  { id: 'RAL 820-3', spaces: { RGB: { r: 141, g: 147, b: 149 } } },
  { id: 'RAL 820-4', spaces: { RGB: { r: 125, g: 133, b: 137 } } },
  { id: 'RAL 820-5', spaces: { RGB: { r:  80, g:  85, b:  92 } } },
  { id: 'RAL 820-6', spaces: { RGB: { r:  68, g:  73, b:  81 } } },
  { id: 'RAL 820-M', spaces: { RGB: { r: 146, g: 145, b: 145 } } },

  /** RAL 830 */
  { id: 'RAL 830-1', spaces: { RGB: { r: 186, g: 188, b: 186 } } },
  { id: 'RAL 830-2', spaces: { RGB: { r: 164, g: 167, b: 165 } } },
  { id: 'RAL 830-3', spaces: { RGB: { r: 141, g: 146, b: 145 } } },
  { id: 'RAL 830-4', spaces: { RGB: { r: 108, g: 112, b: 109 } } },
  { id: 'RAL 830-5', spaces: { RGB: { r:  81, g:  85, b:  84 } } },
  { id: 'RAL 830-6', spaces: { RGB: { r:  87, g:  94, b:  96 } } },
  { id: 'RAL 830-M', spaces: { RGB: { r: 130, g: 129, b: 127 } } },

  /** RAL 840 */
  { id: 'RAL 840-1', spaces: { RGB: { r: 231, g: 227, b: 216 } } },
  { id: 'RAL 840-2', spaces: { RGB: { r: 215, g: 213, b: 204 } } },
  { id: 'RAL 840-3', spaces: { RGB: { r: 184, g: 180, b: 168 } } },
  { id: 'RAL 840-4', spaces: { RGB: { r: 128, g: 128, b: 119 } } },
  { id: 'RAL 840-5', spaces: { RGB: { r:  90, g:  93, b:  84 } } },
  { id: 'RAL 840-6', spaces: { RGB: { r:  71, g:  65, b:  53 } } },
  { id: 'RAL 840-M', spaces: { RGB: { r:  73, g:  68, b:  64 } } },

  /** RAL 850 */
  { id: 'RAL 850-1', spaces: { RGB: { r: 195, g: 194, b: 185 } } },
  { id: 'RAL 850-2', spaces: { RGB: { r: 177, g: 177, b: 170 } } },
  { id: 'RAL 850-3', spaces: { RGB: { r: 166, g: 166, b: 160 } } },
  { id: 'RAL 850-4', spaces: { RGB: { r: 145, g: 141, b: 133 } } },
  { id: 'RAL 850-5', spaces: { RGB: { r: 107, g: 103, b:  96 } } },
  { id: 'RAL 850-6', spaces: { RGB: { r:  76, g:  75, b:  70 } } },
  { id: 'RAL 850-M', spaces: { RGB: { r:  98, g:  94, b:  89 } } },

  /** RAL 860 */
  { id: 'RAL 860-1', spaces: { RGB: { r: 216, g: 218, b: 219 } } },
  { id: 'RAL 860-2', spaces: { RGB: { r: 207, g: 210, b: 213 } } },
  { id: 'RAL 860-3', spaces: { RGB: { r: 193, g: 194, b: 196 } } },
  { id: 'RAL 860-4', spaces: { RGB: { r: 154, g: 154, b: 155 } } },
  { id: 'RAL 860-5', spaces: { RGB: { r: 122, g: 122, b: 121 } } },
  { id: 'RAL 860-6', spaces: { RGB: { r:  91, g:  95, b:  95 } } },
  { id: 'RAL 860-M', spaces: { RGB: { r: 164, g: 160, b: 159 } } },

  /** RAL 870 */
  { id: 'RAL 870-1', spaces: { RGB: { r: 211, g: 208, b: 208 } } },
  { id: 'RAL 870-2', spaces: { RGB: { r: 150, g: 147, b: 146 } } },
  { id: 'RAL 870-3', spaces: { RGB: { r:  99, g:  97, b: 100 } } },
  { id: 'RAL 870-4', spaces: { RGB: { r:  81, g:  77, b:  78 } } },
  { id: 'RAL 870-5', spaces: { RGB: { r:  74, g:  71, b:  71 } } },
  { id: 'RAL 870-6', spaces: { RGB: { r:  61, g:  55, b:  55 } } },
  { id: 'RAL 870-M', spaces: { RGB: { r:  77, g:  71, b:  71 } } }

];