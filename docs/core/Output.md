# Color Object Output Formatter

The `Output` class is a static utility that handles the string and JSON serialization of `ColorObject` instances. It acts as a central delegation layer for output formatting logic, relying on color space-specific handlers that are registered within the `ColorSpace` registry.

Features include:

- dynamically delegates formatting to the appropriate color space handlers
- supports standardized output types such as `string` and `json`
- provides fallback mechanisms when no output handler is defined
- throws structured errors for unknown output formats

By abstracting the output logic into a single static interface, the system remains modular, extensible, and fully decoupled from output format implementations.

**This class cannot be instantiated. All methods are static.**

## Usage

Although most of the time used internally via the `Color` API (e.g. `.toString()`, `.toJSON()`), the `Output` class can also be used manually when formatting arbitrary `ColorObject` data.

```ts
import { Output } from 'pyxe';

const color = { space: 'RGB', value: { r: 255, g: 0, b: 128 } };

Output.toString( color );
Output.format( 'css', color );
```

## Internals

### `_getHandler( is, format )`

```ts
private static _getHandler (
  id: ColorSpaceID,
  format: OutputTypes
) : OutputHandler | undefined
```

Retrieves the output handler for a given color space and format type.

@param `id` - The identifier of the color space  
@param `format` - The output format type (e.g. `string`, `json`)  
@returns The output handler function, if defined and valid

## Methods

### `format( format, input [, options ] )`

```ts
static format (
  format: OutputTypes,
  input: ColorObject,
  options?: Record<string, any>
) : unknown
```

Returns the output of the given color object using the specified format type. If no handler is available for the requested format and color space, a descriptive error is thrown.

@param `format` - The requested output format (e.g., `string`, `json`, or a custom type)  
@param `input` - The color object to be formatted  
@param `options` - Optional arguments to pass to the handler  
@returns The formatted result from the output handler  
@throws If no valid output handler is found for the color space

### `toString( input [, options ] )`

```ts
static toString (
  input: ColorObject,
  options?: Record<string, any>
) : string
```

Returns a string representation of the given color object. Uses a space-specific output handler if defined. If no handler is available, falls back to a generic string format.

@param `input` – The color object to stringify  
@param `options` - Optional arguments to pass to the handler  
@returns A string representation of the color

### `toJSON( input [, options ] )`

```ts
static toJSON (
  input: ColorObject,
  options?: Record<string, any>
) : unknown
```

Returns a JSON-compatible representation of the given `ColorObject`. Uses a color space-defined handler if available; otherwise, a minimal fallback object is returned.

@param `input` – The color object to convert  
@param `options` - Optional arguments to pass to the handler  
@returns A plain object suitable for JSON serialization