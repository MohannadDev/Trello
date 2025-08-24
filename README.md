# CodeStyle

<a name="naming" /></a>

## Naming

- use **camelCase** to name functions and variables
- use **PascalCase** to name classes and react components
- use **kebab-case** to name files and const strings/keys;

Functions love verbs, name them so that at a glance it is clear what it does: `sendFeedback, convertDateToString, getUserFullName, calculateTotal, isEmptyArray, hasValue`.

Booleans: Use **is** with variables and functions to indicate that the value or returned value is boolean.

Avoid magic numbers/strings in the code, move them to a separate file **constants.ts** or to the **constants** folder.

Duplicate helper functions should be moved to file **module-name.utils.ts** and/or folder **utils**.