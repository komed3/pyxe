# RAL Color System

The **RAL color system** is one of the most widely recognized standardized color collections used across industrial, architectural, and design sectors—especially in Europe. It offers a practical, codified way to refer to colors unambiguously in production and specification processes.

## Overview

Originally introduced in 1927 by the German Reich Committee for Delivery Conditions (Reichsausschuss für Lieferbedingungen), RAL began with just 40 defined colors. Over the decades, the system has expanded significantly to include various subcatalogs, each tailored to specific use cases.

Unlike proprietary color systems (e.g. Pantone), RAL is openly documented and widely implemented in public infrastructure, product design, and signage. It is the official reference for many European regulations and continues to evolve.

The system currently comprises three main collections:

- **RAL Classic:** The original and most recognized set of standardized colors, still widely used today in industrial and safety applications.
- **RAL Effect:** A modern addition that incorporates metallics and nuanced color shades for advanced material and surface representation.
- **RAL Design:** A perceptually uniform color model based on CIELab, designed for architecture and design professionals requiring more granular control.

## Structure and Logic

Each color entry is defined by a unique numeric code and is associated with a standardized name. The structure of these codes varies by catalog:

| System      | Format                                       | Color Count | Example                    |
| ----------- | -------------------------------------------- | ----------- | -------------------------- |
| RAL Classic | 4-digit (1xxx–9xxx)                          |         218 | `RAL 3020` – Traffic Red   |
| RAL Effect  | 4-digit codes, split into solid and metallic |         490 | `RAL 140-M` – Metallic Red |
| RAL Design  | Hue-Lightness-Chroma                         |       1,825 | `H270L30C25`               |

**Note:** While RAL Classic and Effect are based on specific pigments and surface finishes, RAL Design is mathematically defined in CIELab space, making it more precise and systematized for modern digital workflows.

## Integration in `pyxe`

This library integrates the RAL system into the modular `pyxe` framework by exposing each palette as a source within the `RAL` library:

```ts
import { Color } from 'pyxe';

const color = await Color.fromLib( 'RAL', '3020', [ 'HEX' ] );

console.log( color.toString() );
// Output: "#c1121c"
```

Under the hood, color definitions are normalized and converted across supported color spaces (e.g., `RGB`, `Lab`, `HEX`), allowing seamless use in UI, rendering, and conversion workflows.

## Use Cases

- Industrial coating and manufacturing
- Public sector signage and safety
- Architecture and construction
- Graphic and UI design with standardized palettes
- Color conversion and harmonization in software

## Licensing

While the RAL system is a standardized reference, its use in commercial applications should respect applicable trademarks and intellectual property rights, particularly regarding naming and branding. The color definitions themselves are available under open data assumptions.

> ***“RAL” is a registered trademark of RAL gemeinnützige GmbH. This library is not affiliated with or endorsed by RAL GmbH.***