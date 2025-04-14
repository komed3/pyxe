# Color Input Parser

The `Parser` class is responsible for automatically identifying and converting arbitrary color inputs (`ColorInput`) into validated internal `ColorObjects`.

It iterates over all registered color spaces using the centralized `ColorSpace` registry and invokes the corresponding parser functions until one of them returns a valid result. This process enables flexible input handling without requiring users to specify a color mode upfront.

The class is completely static and does not require instantiation.

## Internals

The Parser class delegates all actual parsing logic to the `parser` handler function of each registered `ColorSpaceFactory`. It operates in two modes:

- `parse(…)` – Returns the first successful ColorObject
- `try(…)` – Boolean check without throwing

Debug tracing is automatically integrated and invoked via `tracer._trace(…)` if enabled.

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