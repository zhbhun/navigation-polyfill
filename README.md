# js-serialization

`js-serialization` is a js serializer that support `undefined`, `NaN`, `Infinity`, `BigInt`, `Date`, etc.

## API

### `jss.parse(text[, reviver])`

The `jss.parse()` method parses a JS Serialization string, constructing the JavaScript value or object described by the string. An optional reviver function can be provided to perform a transformation on the resulting object before it is returned.

- Syntax

  ```js
  jss.parse(text)
  jss.parse(text, reviver)
  ```

- Parameters

  - text
    
    The string to parse as JS Serialization.
    
  - reviver: Optional

    If a function, this prescribes how the value originally produced by parsing is transformed, before being returned.

- Return value

  The Object, Array, string, number, boolean, or null value corresponding to the given JS Serialization text.

- Exceptions

  Throws a SyntaxError exception if the string to parse is not valid JS Serialization.

### `jss.stringify(value[, replacer[, space]])`

The `jss.stringify()` method converts a JavaScript object or value to a JS Serialization string, optionally replacing values if a replacer function is specified or optionally including only the specified properties if a replacer array is specified.

- Syntax

  ```js
  jss.stringify(value);
  jss.stringify(value, replacer);
  jss.stringify(value, replacer, space);
  ```

- Parameters

  - value
    
    The value to convert to a JS Serialization string.

  - replacer：Optional

    A function that alters the behavior of the stringification process, or an array of strings or numbers naming properties of value that should be included in the output. If replacer is null or not provided, all properties of the object are included in the resulting JS Serialization string.

  - space: Optional

    A String or Number object that's used to insert white space (including indentation, line break characters, etc.) into the output JS Serialization string for readability purposes.

    If this is a Number, it indicates the number of space characters to use as white space for indenting purposes; this number is capped at 10 (if it is greater, the value is just 10). Values less than 1 indicate that no space should be used.

    If this is a String, the string (or the first 10 characters of the string, if it's longer than that) is used as white space.

    If this parameter is not provided (or is null), no white space is used.

- Return value

  A JS Serialization string representing the given value, or undefined.

- Exceptions

  - Throws a TypeError ("cyclic object value") exception when a circular reference is found.

## Examples

```js
jss.stringify([undefined, null, NaN, Infinity, new Date()]); // '["data:undefined,",null,"data:number,NaN","data:number,Infinity","data:date,1653882660435"]'
jss.parse('["data:undefined,",null,"data:number,NaN","data:number,Infinity","data:date,1653882660435"]'); // [undefined, null, NaN, Infinity, new Date()]
```

