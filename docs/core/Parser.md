# Color Input Parser

The `Parser` class is responsible for automatically identifying and converting arbitrary color inputs (`ColorInput`) into validated internal `ColorObjects`.

It iterates over all registered color spaces using the centralized `ColorSpace` registry and invokes the corresponding parser functions until one of them returns a valid result. This process enables flexible input handling without requiring users to specify a color mode upfront.

Debug tracing is automatically integrated and invoked via `tracer._trace(…)` if enabled.

**The class is completely static and does not require instantiation.**

## Usage

The parser class is used by the central Color API via `Color.parse( <input> )`. However, the parser can also be used outside of the Color class by importing additionally. Because all of its methods are static, the parser does not need to be instantiated and works “out of the box”.

```ts
import { Parser } from 'pyxe';

Parser.parse( 'rgba( 124 63 250 / 0.6 )' );
Parser.parse( '#ff00ff' );
Parser.parse( 'hsl( 109, 0.42, 0.27 )' );
```

## Methods

### `parse( input )`

```ts
static parse (
  input: ColorInput
) : ColorObject
```

Attempts to parse the given color input using all available color space parsers.

@param `input` - A string, array, object or any value accepted by a color space parser  
@return A fully validated `ColorObject`  
@throws A descriptive error via `ErrorHandler` if no match is found

### `try( input )`

```ts
static try (
  input: ColorInput
) : boolean
```

Returns `true` if the given input can be parsed by any registered parser, or `false` otherwise.

@param `input` - Any input that could potentially be parsed into a color  
@return `true` if parsing is successful, `false` if not