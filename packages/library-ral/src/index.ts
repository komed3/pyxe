/**
 * RAL Classic Color Library
 * 
 * This package contains the full set of RAL Classic colors, including their names, HEX
 * codes and CIELAB coordinates (where available).
 * 
 * The RAL color system is a standardized color matching system used in Europe, widely
 * adopted for paints, coatings and plastics. This package provides programmatic access
 * to these color definitions and is designed to integrate seamlessly with the pyxe
 * color framework.
 * 
 * All color entries are accessible via their official identifiers (e.g. "RAL 1001") and
 * include optional metadata and alternate representations.
 * 
 * @package @pyxe/library-ral
 * @requires @pyxe/types
 * 
 * @author Paul Köhler
 * @license MIT
 */

import type { ColorLibrary } from '@pyxe/types';

/**
 * The RAL Classic Color Library
 */
export const RAL : ColorLibrary = {
    meta: {
        id: 'RAL',
        title: 'RAL Classic Colors',
        description: 'Standardized color list for industrial applications, primarily in Europe.',
        version: '1.0.0',
        license: 'Open Data / RAL® references',
        source: 'https://www.ral-farben.de/',
        tags: [ 'standard', 'RAL', 'industry', 'europe' ]
    },
    colors: {
        "RAL 1000": { HEX: "#cdba88", Lab: { L: 80, a: 1, b: 24 }, name: "Green beige" },
        "RAL 1001": { HEX: "#d0b084", Lab: { L: 78, a: 6, b: 23 }, name: "Beige" },
        "RAL 1002": { HEX: "#d2aa6d", Lab: { L: 77, a: 7, b: 33 }, name: "Sand yellow" },
        "RAL 1003": { HEX: "#f9a800", Lab: { L: 79, a: 17, b: 79 }, name: "Signal yellow" },
        "RAL 1004": { HEX: "#e49e00", Lab: { L: 71.42, a: 15.28, b: 69.28 }, name: "Golden yellow" },
        "RAL 1005": { HEX: "#cb8e00", Lab: { L: 69, a: 13, b: 70 }, name: "Honey yellow" },
        "RAL 1006": { HEX: "#e29000", Lab: { L: 72, a: 20, b: 74 }, name: "Maize yellow" },
        "RAL 1007": { HEX: "#e88c00", Lab: { L: 72, a: 24, b: 74 }, name: "Daffodil yellow" },
        "RAL 1011": { HEX: "#af804f", Lab: { L: 59.92, a: 11.35, b: 29.17 }, name: "Brown beige" },
        "RAL 1012": { HEX: "#ddaf27", Lab: { L: 75.04, a: 4.64, b: 61.31 }, name: "Lemon yellow" },
        "RAL 1013": { HEX: "#e3d9c6", Lab: { L: 90, a: 1, b: 9 }, name: "Oyster white" },
        "RAL 1014": { HEX: "#ddc49a", Lab: { L: 84, a: 4, b: 21 }, name: "Ivory" },
        "RAL 1015": { HEX: "#e6d2b5", Lab: { L: 88, a: 3, b: 14 }, name: "Light ivory" },
        "RAL 1016": { HEX: "#f1dd38", Lab: { L: 88.37, a: -9.78, b: 71.3 }, name: "Sulfur yellow" },
        "RAL 1017": { HEX: "#f6a950", Lab: { L: 76.32, a: 19.37, b: 51.02 }, name: "Saffron yellow" },
        "RAL 1018": { HEX: "#faca30", Lab: { L: 83.35, a: 3.46, b: 75.83 }, name: "Zinc yellow" },
        "RAL 1019": { HEX: "#a48f7a", Lab: { L: 62.62, a: 4.31, b: 12.94 }, name: "Grey beige" },
        "RAL 1020": { HEX: "#a08f65", Lab: { L: 61.98, a: 0.39, b: 23.18 }, name: "Olive yellow" },
        "RAL 1021": { HEX: "#f6b600", Lab: { L: 82, a: 10, b: 80 }, name: "Colza yellow" },
        "RAL 1023": { HEX: "#f7b500", Lab: { L: 82, a: 11, b: 80 }, name: "Traffic yellow" },
        "RAL 1024": { HEX: "#ba8f4c", Lab: { L: 64.26, a: 8.49, b: 41.49 }, name: "Ochre yellow" },
        "RAL 1026": { HEX: "#ffff00", Lab: { L: 97, a: -15, b: 90 }, name: "Luminous yellow" },
        "RAL 1027": { HEX: "#a77f0e", Lab: { L: 58.15, a: 5.83, b: 47.68 }, name: "Curry" },
        "RAL 1028": { HEX: "#ff9b00", Lab: { L: 77, a: 25, b: 78 }, name: "Melon yellow" },
        "RAL 1032": { HEX: "#e2a300", Lab: { L: 76, a: 11, b: 76 }, name: "Broom yellow" },
        "RAL 1033": { HEX: "#f99a1c", Lab: { L: 71.74, a: 27.78, b: 71.68 }, name: "Dahlia yellow" },
        "RAL 1034": { HEX: "#eb9c52", Lab: { L: 72.73, a: 21.4, b: 45.09 }, name: "Pastel yellow" },
        "RAL 1035": { HEX: "#908370", Lab: { L: 54.79, a: 0.35, b: 11.86 }, name: "Pearl beige" },
        "RAL 1036": { HEX: "#80643f", Lab: { L: 48.95, a: 4.77, b: 26.69 }, name: "Pearl gold" },
        "RAL 1037": { HEX: "#f09200", Lab: { L: 70.28, a: 26.19, b: 64.79 }, name: "Sun yellow" },
        "RAL 2000": { HEX: "#dd7907", Lab: { L: 64, a: 33, b: 69 }, name: "Yellow orange" },
        "RAL 2001": { HEX: "#be4e20", Lab: { L: 53, a: 41, b: 51 }, name: "Red orange" },
        "RAL 2002": { HEX: "#c63927", Lab: { L: 47.74, a: 47.87, b: 33.73 }, name: "Blood orange" },
        "RAL 2003": { HEX: "#fa842b", Lab: { L: 66.02, a: 41.22, b: 52.36 }, name: "Pastel orange" },
        "RAL 2004": { HEX: "#e75b12", Lab: { L: 56.89, a: 50.34, b: 49.81 }, name: "Pure orange" },
        "RAL 2005": { HEX: "#ff2300", Lab: { L: 72.27, a: 87.78, b: 82.31 }, name: "Luminous orange" },
        "RAL 2007": { HEX: "#ffa421", Lab: { L: 76.86, a: 47.87, b: 97.63 }, name: "Luminous bright orange" },
        "RAL 2008": { HEX: "#f3752c", Lab: { L: 60.33, a: 46.91, b: 60.52 }, name: "Bright red orange" },
        "RAL 2009": { HEX: "#e15501", Lab: { L: 55.83, a: 47.79, b: 48.83 }, name: "Traffic orange" },
        "RAL 2010": { HEX: "#d4652f", Lab: { L: 55.39, a: 40.1, b: 42.42 }, name: "Signal orange" },
        "RAL 2011": { HEX: "#ec7c25", Lab: { L: 65, a: 35, b: 68 }, name: "Deep orange" },
        "RAL 2012": { HEX: "#db6a50", Lab: { L: 57.75, a: 40.28, b: 30.66 }, name: "Salmon orange" },
        "RAL 2013": { HEX: "#954527", Lab: { L: 40.73, a: 32.14, b: 34.92 }, name: "Pearl orange" },
        "RAL 2017": { HEX: "#fa4402", name: "RAL orange" },
        "RAL 3000": { HEX: "#ab2524", Lab: { L: 44, a: 50, b: 39 }, name: "Flame red" },
        "RAL 3001": { HEX: "#a02128", Lab: { L: 41, a: 49, b: 33 }, name: "Signal red" },
        "RAL 3002": { HEX: "#a1232b", Lab: { L: 41, a: 49, b: 35 }, name: "Carmine red" },
        "RAL 3003": { HEX: "#8d1d2c", Lab: { L: 36, a: 47, b: 27 }, name: "Ruby red" },
        "RAL 3004": { HEX: "#701f29", Lab: { L: 31, a: 38, b: 18 }, name: "Purple red" },
        "RAL 3005": { HEX: "#5e2028", Lab: { L: 26, a: 33, b: 15 }, name: "Wine red" },
        "RAL 3007": { HEX: "#402225", Lab: { L: 23, a: 17, b: 7 }, name: "Black red" },
        "RAL 3009": { HEX: "#703731", Lab: { L: 29.27, a: 24.59, b: 16.51 }, name: "Oxide red" },
        "RAL 3011": { HEX: "#7e292c", Lab: { L: 34.52, a: 28.66, b: 13.44 }, name: "Brown red" },
        "RAL 3012": { HEX: "#cb8d73", Lab: { L: 63.81, a: 20.79, b: 20.45 }, name: "Beige red" },
        "RAL 3013": { HEX: "#9c322e", Lab: { L: 40.7, a: 36.67, b: 21.37 }, name: "Tomato red" },
        "RAL 3014": { HEX: "#d47479", Lab: { L: 60.17, a: 32.49, b: 12.58 }, name: "Antique pink" },
        "RAL 3015": { HEX: "#e1a6ad", Lab: { L: 71.23, a: 21.59, b: 4.98 }, name: "Light pink" },
        "RAL 3016": { HEX: "#ac4034", Lab: { L: 44.7, a: 37.92, b: 23.96 }, name: "Coral red" },
        "RAL 3017": { HEX: "#d3545f", Lab: { L: 54.24, a: 44.26, b: 16.87 }, name: "Rose" },
        "RAL 3018": { HEX: "#d14152", Lab: { L: 50.77, a: 49.15, b: 19.86 }, name: "Strawberry red" },
        "RAL 3020": { HEX: "#c1121c", Lab: { L: 46, a: 59, b: 54 }, name: "Traffic red" },
        "RAL 3022": { HEX: "#d56d56", Lab: { L: 56.06, a: 38.9, b: 29.7 }, name: "Salmon pink" },
        "RAL 3024": { HEX: "#f70000", Lab: { L: 51.32, a: 82.52, b: 71.62 }, name: "Luminous red" },
        "RAL 3026": { HEX: "#ff0000", Lab: { L: 59, a: 70, b: 59 }, name: "Luminous bright red" },
        "RAL 3027": { HEX: "#b42041", Lab: { L: 43.07, a: 46.96, b: 15.81 }, name: "Raspberry red" },
        "RAL 3028": { HEX: "#e72512", Lab: { L: 51, a: 58, b: 46 }, name: "Pure red" },
        "RAL 3031": { HEX: "#ac323b", Lab: { L: 46, a: 45, b: 25 }, name: "Orient red" },
        "RAL 3032": { HEX: "#711521", Lab: { L: 26.88, a: 41.34, b: 19.4 }, name: "Pearl ruby red" },
        "RAL 3033": { HEX: "#b24c43", Lab: { L: 44.29, a: 45.11, b: 28.62 }, name: "Pearl pink" },
        "RAL 4001": { HEX: "#8a5a83", Lab: { L: 49.1, a: 17.35, b: -12.85 }, name: "Red lilac" },
        "RAL 4002": { HEX: "#933d50", Lab: { L: 41.91, a: 30.05, b: 5.67 }, name: "Red violet" },
        "RAL 4003": { HEX: "#d15b8f", Lab: { L: 54.25, a: 44.66, b: -5.02 }, name: "Heather violet" },
        "RAL 4004": { HEX: "#691639", Lab: { L: 32.22, a: 24.83, b: 0.06 }, name: "Claret violet" },
        "RAL 4005": { HEX: "#83639d", Lab: { L: 50.92, a: 15.38, b: -23.06 }, name: "Blue lilac" },
        "RAL 4006": { HEX: "#992572", Lab: { L: 42.38, a: 39.48, b: -14.94 }, name: "Traffic purple" },
        "RAL 4007": { HEX: "#4a203b", Lab: { L: 30.05, a: 13.16, b: -5.1 }, name: "Purple violet" },
        "RAL 4008": { HEX: "#904684", Lab: { L: 40.76, a: 32.53, b: -20.56 }, name: "Signal violet" },
        "RAL 4009": { HEX: "#a38995", Lab: { L: 60.59, a: 10.38, b: -2.88 }, name: "Pastel violet" },
        "RAL 4010": { HEX: "#c63678", Lab: { L: 50.39, a: 48.95, b: -4.24 }, name: "Telemagenta" },
        "RAL 4011": { HEX: "#8773a1", Lab: { L: 47.92, a: 18.89, b: -20.83 }, name: "Pearl violet" },
        "RAL 4012": { HEX: "#6b6880", Lab: { L: 46.33, a: 7.27, b: -11.94 }, name: "Pearl blackberry" },
        "RAL 5000": { HEX: "#384c70", Lab: { L: 32.59, a: -1.28, b: -21.69 }, name: "Violet blue" },
        "RAL 5001": { HEX: "#1f4764", Lab: { L: 37, a: -16, b: -21 }, name: "Green blue" },
        "RAL 5002": { HEX: "#2b2c7c", Lab: { L: 31, a: 2, b: -43 }, name: "Ultramarine blue" },
        "RAL 5003": { HEX: "#2a3756", Lab: { L: 30.53, a: -0.37, b: -16.68 }, name: "Sapphire blue" },
        "RAL 5004": { HEX: "#1d1f2a", Lab: { L: 16, a: 0, b: -9 }, name: "Black blue" },
        "RAL 5005": { HEX: "#154889", Lab: { L: 40, a: -11, b: -35 }, name: "Signal blue" },
        "RAL 5007": { HEX: "#41678d", Lab: { L: 46.37, a: -6.24, b: -21.71 }, name: "Brilliant blue" },
        "RAL 5008": { HEX: "#313c48", Lab: { L: 32, a: -2.09, b: -6.07 }, name: "Grey blue" },
        "RAL 5009": { HEX: "#2e5978", Lab: { L: 41.22, a: -9.56, b: -18.34 }, name: "Azure blue" },
        "RAL 5010": { HEX: "#13447c", Lab: { L: 39, a: -12, b: -32 }, name: "Gentian blue" },
        "RAL 5011": { HEX: "#232c3f", Lab: { L: 23, a: -4, b: -15 }, name: "Steel blue" },
        "RAL 5012": { HEX: "#3481b8", Lab: { L: 55.62, a: -13.84, b: -30.72 }, name: "Light blue" },
        "RAL 5013": { HEX: "#232d53", Lab: { L: 26, a: -2, b: -26 }, name: "Cobalt blue" },
        "RAL 5014": { HEX: "#6c7c98", Lab: { L: 53.79, a: -2.64, b: -15.59 }, name: "Pigeon blue" },
        "RAL 5015": { HEX: "#2874b2", Lab: { L: 51.13, a: -12.69, b: -34.21 }, name: "Sky blue" },
        "RAL 5017": { HEX: "#0e518d", Lab: { L: 34.82, a: -13.49, b: -36.36 }, name: "Traffic blue" },
        "RAL 5018": { HEX: "#21888f", Lab: { L: 55.13, a: -27.27, b: -8.47 }, name: "Turquoise blue" },
        "RAL 5019": { HEX: "#1a5784", Lab: { L: 41.18, a: -9.97, b: -25.87 }, name: "Capri blue" },
        "RAL 5020": { HEX: "#0b4151", Lab: { L: 32.3, a: -13.01, b: -9.39 }, name: "Ocean blue" },
        "RAL 5021": { HEX: "#07737a", Lab: { L: 47.15, a: -29.26, b: -9.32 }, name: "Water blue" },
        "RAL 5022": { HEX: "#2f2a5a", Lab: { L: 26, a: 6, b: -30 }, name: "Night blue" },
        "RAL 5023": { HEX: "#4d668e", Lab: { L: 47.64, a: -2.96, b: -21.18 }, name: "Distant blue" },
        "RAL 5024": { HEX: "#6a93b0", Lab: { L: 60.5, a: -9.53, b: -17.38 }, name: "Pastel blue" },
        "RAL 5025": { HEX: "#296478", Lab: { L: 35.93, a: -11.81, b: -16.28 }, name: "Pearl gentian" },
        "RAL 5026": { HEX: "#102c54", Lab: { L: 16, a: 7.84, b: -29.1 }, name: "Pearl night blue" },
        "RAL 6000": { HEX: "#327662", Lab: { L: 51, a: -24, b: 3 }, name: "Patina green" },
        "RAL 6001": { HEX: "#28713e", Lab: { L: 46, a: -27, b: 22 }, name: "Emerald green" },
        "RAL 6002": { HEX: "#276235", Lab: { L: 41, a: -24, b: 24 }, name: "Leaf green" },
        "RAL 6003": { HEX: "#4b573e", Lab: { L: 42, a: -5, b: 13 }, name: "Olive green" },
        "RAL 6004": { HEX: "#0e4243", Lab: { L: 32, a: -24, b: -6 }, name: "Blue green" },
        "RAL 6005": { HEX: "#0f4336", Lab: { L: 31, a: -25, b: 4 }, name: "Moss green" },
        "RAL 6006": { HEX: "#40433b", Lab: { L: 31, a: 0, b: 8 }, name: "Grey olive" },
        "RAL 6007": { HEX: "#283424", Lab: { L: 26, a: -6, b: 11 }, name: "Bottle green" },
        "RAL 6008": { HEX: "#35382e", Lab: { L: 29, a: 0, b: 8 }, name: "Brown green" },
        "RAL 6009": { HEX: "#26392f", Lab: { L: 27, a: -9, b: 5 }, name: "Fir green" },
        "RAL 6010": { HEX: "#3e753b", Lab: { L: 50, a: -21, b: 25 }, name: "Grass green" },
        "RAL 6011": { HEX: "#68825b", Lab: { L: 57, a: -11, b: 16 }, name: "Reseda green" },
        "RAL 6012": { HEX: "#31403d", Lab: { L: 32, a: -7, b: 0 }, name: "Black green" },
        "RAL 6013": { HEX: "#797c5a", Lab: { L: 57, a: -1, b: 15 }, name: "Reed green" },
        "RAL 6014": { HEX: "#444337", Lab: { L: 35, a: 1, b: 9 }, name: "Yellow olive" },
        "RAL 6015": { HEX: "#3d403a", Lab: { L: 33, a: -1, b: 5 }, name: "Black olive" },
        "RAL 6016": { HEX: "#026a52", Lab: { L: 45, a: -37, b: 6 }, name: "Turquoise green" },
        "RAL 6017": { HEX: "#468641", Lab: { L: 56, a: -23, b: 28 }, name: "May green" },
        "RAL 6018": { HEX: "#48a43f", Lab: { L: 63, a: -31, b: 39 }, name: "Yellow green" },
        "RAL 6019": { HEX: "#b7d9b1", Lab: { L: 84, a: -10, b: 12 }, name: "Pastel green" },
        "RAL 6020": { HEX: "#354733", Lab: { L: 34, a: -9, b: 11 }, name: "Chromium green" },
        "RAL 6021": { HEX: "#86a47c", Lab: { L: 67, a: -9, b: 14 }, name: "Pale green" },
        "RAL 6022": { HEX: "#3e3c32", Lab: { L: 29, a: 2, b: 10 }, name: "Brown olive" },
        "RAL 6024": { HEX: "#008754", Lab: { L: 53, a: -45, b: 14 }, name: "Traffic green" },
        "RAL 6025": { HEX: "#53753c", Lab: { L: 51, a: -13, b: 26 }, name: "Fern green" },
        "RAL 6026": { HEX: "#005d52", Lab: { L: 42, a: -33, b: 0 }, name: "Opal green" },
        "RAL 6027": { HEX: "#81c0bb", Lab: { L: 76, a: -19, b: -4 }, name: "Light green" },
        "RAL 6028": { HEX: "#2d5546", Lab: { L: 40, a: -18, b: 6 }, name: "Pine green" },
        "RAL 6029": { HEX: "#007243", Lab: { L: 47, a: -43, b: 17 }, name: "Mint green" },
        "RAL 6032": { HEX: "#0f8558", Lab: { L: 53, a: -39, b: 13 }, name: "Signal green" },
        "RAL 6033": { HEX: "#478a84", Lab: { L: 58, a: -23, b: -4 }, name: "Mint turquoise" },
        "RAL 6034": { HEX: "#7fb0b2", Lab: { L: 72, a: -16, b: -6 }, name: "Pastel turquoise" },
        "RAL 6035": { HEX: "#1b542c", Lab: { L: 35, a: -30, b: 19 }, name: "Pearl green" },
        "RAL 6036": { HEX: "#005d4c", Lab: { L: 39, a: -30, b: -2 }, name: "Pearl opal green" },
        "RAL 6037": { HEX: "#25e712", Lab: { L: 55, a: -54, b: 39 }, name: "Pure green" },
        "RAL 6038": { HEX: "#00f700", Lab: { L: 67, a: -66, b: 56 }, name: "Luminous green" },
        "RAL 6039": { HEX: "#b3c43e", name: "Fibrous green" },
        "RAL 7000": { HEX: "#7e8b92", Lab: { L: 63, a: -4, b: -5 }, name: "Squirrel grey" },
        "RAL 7001": { HEX: "#8f999f", Lab: { L: 63.81, a: -2.22, b: -4.05 }, name: "Silver grey" },
        "RAL 7002": { HEX: "#817f68", Lab: { L: 58, a: 1, b: 12 }, name: "Olive grey" },
        "RAL 7003": { HEX: "#7a7b6d", Lab: { L: 57, a: 0, b: 7 }, name: "Moss grey" },
        "RAL 7004": { HEX: "#9ea0a1", Lab: { L: 63.83, a: 0.19, b: -0.44 }, name: "Signal grey" },
        "RAL 7005": { HEX: "#6b716f", Lab: { L: 50, a: -1.55, b: 0.82 }, name: "Mouse grey" },
        "RAL 7006": { HEX: "#756f61", Lab: { L: 48.53, a: 2.15, b: 7.57 }, name: "Beige grey" },
        "RAL 7008": { HEX: "#746643", Lab: { L: 49, a: 5, b: 23 }, name: "Khaki grey" },
        "RAL 7009": { HEX: "#5b6259", Lab: { L: 48, a: -2, b: 4 }, name: "Green grey" },
        "RAL 7010": { HEX: "#575d57", Lab: { L: 46, a: -3, b: 3 }, name: "Tarpaulin grey" },
        "RAL 7011": { HEX: "#555d61", Lab: { L: 41.52, a: -1.68, b: -2.72 }, name: "Iron grey" },
        "RAL 7012": { HEX: "#596163", Lab: { L: 47, a: -2, b: -1 }, name: "Basalt grey" },
        "RAL 7013": { HEX: "#555548", Lab: { L: 42, a: 1, b: 8 }, name: "Brown grey or NATO olive" },
        "RAL 7015": { HEX: "#51565c", Lab: { L: 40.5, a: -0.25, b: -3.4 }, name: "Slate grey" },
        "RAL 7016": { HEX: "#373f43", Lab: { L: 33, a: -2, b: -4 }, name: "Anthracite grey" },
        "RAL 7021": { HEX: "#2e3234", Lab: { L: 27, a: -1, b: -2 }, name: "Black grey" },
        "RAL 7022": { HEX: "#4b4d46", Lab: { L: 37.75, a: -0.07, b: 2.23 }, name: "Umbra grey" },
        "RAL 7023": { HEX: "#818479", Lab: { L: 55.6, a: -1.45, b: 4.52 }, name: "Concrete grey" },
        "RAL 7024": { HEX: "#474a50", Lab: { L: 36.97, a: -0.13, b: -3.32 }, name: "Graphite grey" },
        "RAL 7026": { HEX: "#374447", Lab: { L: 34.71, a: -3.02, b: -2.48 }, name: "Granite grey" },
        "RAL 7030": { HEX: "#939388", Lab: { L: 61.31, a: -0.26, b: 4.53 }, name: "Stone grey" },
        "RAL 7031": { HEX: "#5d6970", Lab: { L: 51, a: -4, b: -4 }, name: "Blue grey" },
        "RAL 7032": { HEX: "#b9b9a8", Lab: { L: 77, a: 0, b: 7 }, name: "Pebble grey" },
        "RAL 7033": { HEX: "#818979", Lab: { L: 56.78, a: -3.36, b: 6.32 }, name: "Cement grey" },
        "RAL 7034": { HEX: "#939176", Lab: { L: 56.86, a: 0.03, b: 14.83 }, name: "Yellow grey" },
        "RAL 7035": { HEX: "#cbd0cc", Lab: { L: 81.29, a: -1.24, b: 0.79 }, name: "Light grey" },
        "RAL 7036": { HEX: "#9a9697", Lab: { L: 63.49, a: 1.27, b: 0.78 }, name: "Platinum grey" },
        "RAL 7037": { HEX: "#7c7f7e", Lab: { L: 59, a: 0, b: 0 }, name: "Dusty grey" },
        "RAL 7038": { HEX: "#b4b8b0", Lab: { L: 72.97, a: -1.5, b: 2.97 }, name: "Agate grey" },
        "RAL 7039": { HEX: "#6b695f", Lab: { L: 43.5, a: 0.37, b: 5.56 }, name: "Quartz grey" },
        "RAL 7040": { HEX: "#9da3a6", Lab: { L: 66.63, a: -1.17, b: -2.82 }, name: "Window grey" },
        "RAL 7042": { HEX: "#8f9695", Lab: { L: 62.58, a: -1.51, b: -0.21 }, name: "Traffic grey A" },
        "RAL 7043": { HEX: "#4e5451", Lab: { L: 40.23, a: -1.28, b: 0 }, name: "Traffic grey B" },
        "RAL 7044": { HEX: "#bdbdb2", Lab: { L: 74.66, a: -0.04, b: 5.08 }, name: "Silk grey" },
        "RAL 7045": { HEX: "#91969a", Lab: { L: 60.35, a: -1.43, b: -1.84 }, name: "Telegrey 1" },
        "RAL 7046": { HEX: "#82898e", Lab: { L: 57.75, a: -1.6, b: -3 }, name: "Telegrey 2" },
        "RAL 7047": { HEX: "#cfd0cf", Lab: { L: 81.43, a: 0.01, b: 0.1 }, name: "Telegrey 4" },
        "RAL 7048": { HEX: "#888175", Lab: { L: 54.55, a: -0.45, b: 7.59 }, name: "Pearl mouse grey" },
        "RAL 8000": { HEX: "#887142", Lab: { L: 54, a: 8, b: 29 }, name: "Green brown" },
        "RAL 8001": { HEX: "#9c6b30", Lab: { L: 47.08, a: 18.95, b: 39.87 }, name: "Ochre brown" },
        "RAL 8002": { HEX: "#7b5141", Lab: { L: 45, a: 17, b: 17 }, name: "Signal brown" },
        "RAL 8003": { HEX: "#80542f", Lab: { L: 45, a: 18, b: 33 }, name: "Clay brown" },
        "RAL 8004": { HEX: "#8f4e35", Lab: { L: 43.78, a: 22.83, b: 20.22 }, name: "Copper brown" },
        "RAL 8007": { HEX: "#6f4a2f", Lab: { L: 38.99, a: 12.62, b: 17.08 }, name: "Fawn brown" },
        "RAL 8008": { HEX: "#6f4f28", Lab: { L: 35.15, a: 13.22, b: 28.5 }, name: "Olive brown" },
        "RAL 8011": { HEX: "#5a3a29", Lab: { L: 33.98, a: 10.04, b: 10.97 }, name: "Nut brown" },
        "RAL 8012": { HEX: "#673831", Lab: { L: 35, a: 23, b: 17 }, name: "Red brown" },
        "RAL 8014": { HEX: "#49392d", Lab: { L: 32, a: 8, b: 15 }, name: "Sepia brown" },
        "RAL 8015": { HEX: "#633a34", Lab: { L: 33.52, a: 15.02, b: 9.25 }, name: "Chestnut brown" },
        "RAL 8016": { HEX: "#4c2f26", Lab: { L: 21.4, a: 14.37, b: 13.84 }, name: "Mahogany brown" },
        "RAL 8017": { HEX: "#44322d", Lab: { L: 29, a: 10, b: 9 }, name: "Chocolate brown" },
        "RAL 8019": { HEX: "#3f3a3a", Lab: { L: 31.46, a: 2.12, b: 1.1 }, name: "Grey brown" },
        "RAL 8022": { HEX: "#211f20", Lab: { L: 25.08, a: 1.18, b: 0.67 }, name: "Black brown" },
        "RAL 8023": { HEX: "#a65e2f", Lab: { L: 49.37, a: 24.91, b: 30.25 }, name: "Orange brown" },
        "RAL 8024": { HEX: "#79553c", Lab: { L: 38.04, a: 14.14, b: 20.82 }, name: "Beige brown" },
        "RAL 8025": { HEX: "#755c49", Lab: { L: 44, a: 7.95, b: 11.73 }, name: "Pale brown" },
        "RAL 8028": { HEX: "#4e3b2b", Lab: { L: 34.19, a: 5.72, b: 8.58 }, name: "Terra brown" },
        "RAL 8029": { HEX: "#773c27", Lab: { L: 35.06, a: 25.58, b: 27.32 }, name: "Pearl copper" },
        "RAL 9001": { HEX: "#efebdc", Lab: { L: 92, a: 10, b: 9 }, name: "Cream" },
        "RAL 9002": { HEX: "#ddded4", Lab: { L: 88, a: 0, b: 4 }, name: "Grey white" },
        "RAL 9003": { HEX: "#ffffff", Lab: { L: 94.13, a: -0.55, b: 0.81 }, name: "Signal white" },
        "RAL 9004": { HEX: "#2e3032", Lab: { L: 28.66, a: 0.24, b: -0.66 }, name: "Signal black" },
        "RAL 9005": { HEX: "#0a0a0d", Lab: { L: 5, a: 0, b: -2 }, name: "Jet black" },
        "RAL 9006": { HEX: "#a5a8a6", Lab: { L: 72, a: 0, b: 0 }, name: "White aluminium" },
        "RAL 9007": { HEX: "#8f8f8c", Lab: { L: 55.55, a: -0.06, b: 2.14 }, name: "Grey aluminium" },
        "RAL 9010": { HEX: "#f7f9ef", Lab: { L: 94.57, a: -0.47, b: 4.14 }, name: "Pure white" },
        "RAL 9011": { HEX: "#292c2f", Lab: { L: 26.54, a: -0.05, b: -1.13 }, name: "Graphite black" },
        "RAL 9012": { HEX: "#fffde6", name: "Clean room white" },
        "RAL 9016": { HEX: "#f7fbf5", Lab: { L: 95.26, a: -0.76, b: 2.11 }, name: "Traffic white" },
        "RAL 9017": { HEX: "#2a2d2f", Lab: { L: 27.25, a: 0.44, b: 0.51 }, name: "Traffic black" },
        "RAL 9018": { HEX: "#cfd3cd", Lab: { L: 81.34, a: -2.29, b: 2.96 }, name: "Papyrus white" },
        "RAL 9022": { HEX: "#9c9c9c", Lab: { L: 65.38, a: -0.43, b: 0.34 }, name: "Pearl light grey" },
        "RAL 9023": { HEX: "#7e8182", Lab: { L: 57.32, a: -0.31, b: -0.98 }, name: "Pearl dark grey" }
    }
};