# Core Class of the pyxe Framework

The `Color` class serves as the primary user-facing API within the `pyxe` framework. It provides a consistent interface for parsing, validating, converting, formatting, and manipulating color data across various color spaces and input formats.

The `Color` class encapsulates a single `ColorObject` instance and provides a unified interface for:

- creating colors from raw objects, parsed input, or external color libraries
- converting between color spaces using the centralized conversion graph
- formatting color values into different output formats
- applying dynamic operations through registered calculation modules
- validating and inspecting the underlying color structure

In addition, the `ColorMethodRegistry` provides runtime binding of module functions directly to the `Color` class, allowing for dynamic extension of its capabilities (e.g. `color.invert()`).

This class serves as the main entry point for all color-related operations across the pyxe ecosystem.

**Use static methods like `Color.parse()`, `Color.from()` or `Color.fromLib()` instead of calling the `Color` class directly.**

## Methods

### `isColor( input )`

```ts
isColor (
  input: ColorObject
) : boolean
```

Checks whether a given object conforms to the `ColorObject` structure.

@param `object` - The object to evaluate  
@returns `true` if valid, otherwise `false`

### `from( input )`

```ts
from (
  input: ColorObject
) : Color
```

Creates a new Color instance from a validated `ColorObject`. This is useful when working directly with structured color data.

@param `colorObject` - A valid and normalized `ColorObject`  
@returns A new Color instance  
@throws If the object is malformed or references an unknown color space

### `parse( input )`

```ts
parse (
  input: ColorInput
) : Color
```

Parses any color input (e.g. "#f80", [255, 128, 0], { r: 255, g: 128, b: 0 }) into the appropriate color space and returns a Color instance.

@param `input` - A supported color input: `string`, `array`, or `object`  
@returns A valid Color instance  
@throws If the input cannot be parsed or validated

### `fromLib( colorLib, colorID [, preferredSpaces [, options ] ] )`

```ts
fromLib (
  colorLib: string,
  colorID: string,
  preferredSpaces?: ColorSpaceID[],
  options: {
    sources?: string[];
    strict?: boolean;
    tryConvert?: boolean;
  } = {}
) : Promise<Color>
```

Retrieves a color by ID from a registered color library (e.g. RAL, HTML) and optionally converts it to a preferred color space.

@param `colorLib` - The library identifier  
@param `colorID` - The ID of the color entry  
@param `preferredSpaces` - Optional list of preferred color spaces  
@param `options` - Additional load options (`strict`, `sources`, `tryConvert`, etc.)  
@returns A Promise resolving to a Color instance  
@throws If the library or color ID is unknown, or conversion fails

### `validate()`

```ts
validate () : boolean
```

Validates the internal color representation against the definition of its color space.

@returns `true` if the color is valid, otherwise `false`

### `instanceOf( space )`

```ts
instanceOf (
  space: ColorSpaceID
) : boolean
```

Checks if the internal data structure matches the given color space ID.

@param `space` - The color space identifier (e.g. `RGB`, `Lab`)  
@returns `true` if the structure matches, otherwise `false`

### `toObject()`

```ts
toObject () : ColorObject
```

Returns the internal `ColorObject` of this instance, useful for low-level operations or export.

@returns A validated color data object

### `toString()`

```ts
toString (
  ...args: any[]
) : string
```

Returns a formatted string representation of the color using the default output format for its color space.

@param `args` - Optional arguments to pass to the handler  
@returns A stringified representation of the color

### `toJSON()`

```ts
toJSON (
  ...args: any[]
) : unknown
```

Returns a JSON-compatible version of the color, suitable for serialization.

@param `args` - Optional arguments to pass to the handler  
@returns A format-agnostic, JSON-friendly representation of the color

### `format( format )`

```ts
format (
  format: OutputTypes,
  ...args: any[]
) : unknown
```

Formats the color as an object, array, or string based on the requested output format.

@param `format` - Output type: `object`, `array`, `string`, etc.  
@param `args` - Optional arguments to pass to the handler  
@returns The formatted color  
@throws If the format is not supported

### `convert( target )`

```ts
convert (
  target: ColorSpaceID
) : Color
```

Converts the current color to a different color space using the internal conversion graph.

@param `target` - Target color space (e.g. `HSL`, `XYZ`)  
@returns A new Color instance in the target color space  
@throws If no conversion path is available

### `tryConvert( target )`

```ts
tryConvert (
  target: ColorSpaceID
) : Color
```

Attempts to convert the color to the specified color space, using fallback behavior if necessary.

@param `target` - Target color space  
@returns A new Color instance, or a best-effort fallback result

### `getSpace()`

```ts
getSpace () : ColorSpaceID
```

Returns the color space identifier of the current color.

@returns A string like `RGB`, `HSL`, `Lab` etc.

### `getInstance()`

```ts
getInstance () : ColorInstance
```

Returns the raw color instance data without metadata.

@returns A plain color value object corresponding to the color space

### `getMeta()`

```ts
getMeta () : Record<string, any> | undefined
```

Retrieves the metadata from the color instance.

@return The color object meta or undefined

### `apply( key [, ...args ] )`

```ts
apply (
  key: string,
  ...args: any[]
) : Color | Color[] | any
```

Applies a registered color module (e.g., `invert`, `blend`, `lighten`) to the current color instance. Supports modular extension.

@param `key` - Module identifier like `<moduleId>::<methodId>`  
@param `args` - Optional arguments, depending on the module  
@returns A new Color, an array of colors, or a computed result  
@throws If the module is not registered or input is incompatible

## Color Method Registry

The `ColorMethodRegistry` allows for the dynamic binding and unbinding of color manipulation functions (e.g., `.invert()`, `.lighten()`) directly to the `Color` class at runtime. These methods are backed by modular function handlers that can be registered independently.

### `bind( method, name )`

```ts
bind (
  method: string,
  name: string
) : void
```

Binds a module as a named method directly to the `Color` class, enabling syntax like `.invert()` or `.blend()`.

@param `method` - The internal module ID  
@param `name` - The name of the method to expose  
@throws If the method name is invalid or already in use

### `unbind( name )`

```ts
unbind (
  name: string
) : void
```

Removes a dynamically registered method from the `Color` class.

@param `name` - The name of the method to remove  
@throws If the method does not exist