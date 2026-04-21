# PostScript Interpreter — TypeScript

A fully functional PostScript interpreter written in TypeScript, supporting all standard stack, arithmetic, dictionary, string, boolean, flow-control, and I/O operators. Includes both **dynamic** and **static (lexical)** scoping modes, an interactive REPL, and a complete Jest test suite.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Running the Interpreter](#running-the-interpreter)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Supported Operators](#supported-operators)
- [Scoping Modes](#scoping-modes)
- [Running Tests](#running-tests)
- [Examples](#examples)

---

## Getting Started

**Prerequisites:** Node.js (v18+) and npm.

```bash
# Clone and install dependencies
git clone <your-repo-url>
cd postscript-interpreter-typescript
npm install
```

---

## Running the Interpreter

### Interactive REPL

```bash
# Dynamic scoping (default)
npx ts-node src/repl.ts

# Static (lexical) scoping
npx ts-node src/repl.ts --lexical
```

The REPL supports multi-line input — if you open a `{` block, it keeps collecting input until the braces are balanced before executing.

```
PostScript Interpreter (TypeScript)
Scoping mode: DYNAMIC
Type 'quit' to exit.

REPL> 3 4 add =
7
REPL> /square { dup mul } def
REPL> 5 square =
25
REPL> quit
Goodbye.
```

### Scoping Demo

```bash
npx ts-node src/index.ts
```

Runs a built-in demo showing the difference between dynamic and lexical scoping (see [Scoping Modes](#scoping-modes)).

---

## Project Structure

```
postscript-interpreter-typescript/
├── src/
│   ├── core/
│   │   ├── Interpreter.ts       # Main execution engine
│   │   ├── OperandStack.ts      # Operand stack (push/pop/peek)
│   │   └── DictionaryStack.ts   # Dictionary stack with dynamic & static lookup
│   ├── lexer/
│   │   └── Lexer.ts             # Tokenizer — classifies tokens into PsObjects
│   ├── operators/
│   │   ├── arithmeticOps.ts     # add, sub, mul, div, idiv, mod, abs, neg, ...
│   │   ├── booleanOps.ts        # eq, ne, ge, gt, le, lt, and, or, not, true, false
│   │   ├── dictionaryOps.ts     # dict, begin, end, def, length, maxlength
│   │   ├── flowOps.ts           # if, ifelse, for, repeat, quit
│   │   ├── ioOps.ts             # print, =, ==
│   │   ├── stackOps.ts          # exch, pop, copy, dup, clear, count
│   │   └── stringOps.ts         # get, getinterval, putinterval, length
│   ├── types/
│   │   └── PsObject.ts          # TypeScript type definitions for all PS values
│   ├── index.ts                 # Scoping demo script
│   └── repl.ts                  # Interactive REPL
└── tests/
    ├── arithmeticOps.test.ts
    ├── booleanOps.test.ts
    ├── dictionaryOps.test.ts
    ├── flowOps.test.ts
    ├── ioOps.test.ts
    ├── stackOps.test.ts
    └── stringOps.test.ts
```

---

## Architecture

### Type System (`PsObject`)

Every value in the interpreter is a tagged union type:

```typescript
type PsObject =
  | { type: 'number';          value: number }
  | { type: 'string';          value: string }
  | { type: 'boolean';         value: boolean }
  | { type: 'name';            value: string }          // literal name: /foo
  | { type: 'executable_name'; value: string }          // executable name: foo
  | { type: 'procedure';       value: PsObject[];
                                staticLink: PsDictionary[] }  // { ... }
  | { type: 'dict';            value: PsDictionary }
```

The `staticLink` field on `procedure` is what enables lexical scoping — it captures a snapshot of the dictionary stack at the moment the procedure was defined.

### Lexer

`Lexer.tokenize(input)` converts a raw PostScript string into an array of `PsObject` tokens. It handles:

- Numbers (`42`, `3.14`, `-7`)
- Booleans (`true`, `false`)
- Literal names (`/foo` → `{ type: 'name', value: 'foo' }`)
- Executable names (`foo` → `{ type: 'executable_name', value: 'foo' }`)
- Procedure delimiters (`{` and `}`)

Nested `{ }` blocks and `( )` string literals are assembled by the interpreter's execution loop, not the lexer.

### Interpreter

`Interpreter.execute(tokens)` processes tokens left to right:

1. **Literals** (number, boolean, string, name) — pushed directly onto the operand stack.
2. **`{`** — collects tokens until the matching `}` and pushes a `procedure` object, capturing `staticLink` from the current dictionary stack.
3. **Executable names** — looked up in the operator table first, then in the dictionary stack. If the resolved value is a `procedure`, it is executed recursively; otherwise it is pushed onto the operand stack.

### Stacks

| Stack | Class | Purpose |
|---|---|---|
| Operand stack | `OperandStack` | Holds values being operated on |
| Dictionary stack | `DictionaryStack` | Holds variable/procedure scopes; searched top-to-bottom on lookup |

---

## Supported Operators

### Stack (6)
| Operator | Description |
|---|---|
| `exch` | Swap top two elements |
| `pop` | Discard top element |
| `dup` | Duplicate top element |
| `copy n` | Copy top `n` elements |
| `clear` | Empty the entire stack |
| `count` | Push number of elements on stack |

### Arithmetic (12)
| Operator | Description |
|---|---|
| `add` | `a b → a+b` |
| `sub` | `a b → a-b` |
| `mul` | `a b → a×b` |
| `div` | `a b → a/b` (real division) |
| `idiv` | `a b → int(a/b)` (truncates toward zero) |
| `mod` | `a b → a mod b` |
| `abs` | Absolute value |
| `neg` | Negation |
| `ceiling` | Round up to nearest integer |
| `floor` | Round down to nearest integer |
| `round` | Round to nearest integer (half-up) |
| `sqrt` | Square root |

### Dictionary (6)
| Operator | Description |
|---|---|
| `n dict` | Create a new dictionary with capacity `n` |
| `begin` | Pop dictionary from operand stack and push onto dictionary stack |
| `end` | Pop current dictionary from dictionary stack |
| `/name value def` | Bind `name` to `value` in current dictionary |
| `dict length` | Push number of entries in dictionary |
| `dict maxlength` | Push capacity of dictionary |

### String (4)
| Operator | Description |
|---|---|
| `string index get` | Push character code at index |
| `string index count getinterval` | Push substring |
| `string index replacement putinterval` | Replace substring in-place |
| `string length` | Push string length |

### Boolean & Relational (11)
| Operator | Description |
|---|---|
| `eq` | Equal |
| `ne` | Not equal |
| `gt` | Greater than |
| `ge` | Greater than or equal |
| `lt` | Less than |
| `le` | Less than or equal |
| `and` | Logical AND (booleans) or bitwise AND (integers) |
| `or` | Logical OR (booleans) or bitwise OR (integers) |
| `not` | Logical NOT (booleans) or bitwise NOT (integers) |
| `true` | Push `true` |
| `false` | Push `false` |

### Flow Control (5)
| Operator | Description |
|---|---|
| `bool proc if` | Execute `proc` if `bool` is true |
| `bool proc1 proc2 ifelse` | Execute `proc1` if true, `proc2` if false |
| `init step limit proc for` | Loop from `init` to `limit` by `step`, executing `proc` each iteration with the current index on the stack |
| `n proc repeat` | Execute `proc` exactly `n` times |
| `quit` | Exit the interpreter |

### I/O (3)
| Operator | Description |
|---|---|
| `string print` | Write string to stdout (no newline) |
| `any =` | Write value to stdout followed by newline |
| `any ==` | Write PostScript representation (strings wrapped in `()`) followed by newline |

---

## Scoping Modes

The interpreter supports two variable resolution strategies, toggled via `interpreter.setScoping(true/false)` or the `--lexical` flag in the REPL.

### Dynamic Scoping (default)

Name lookup searches the dictionary stack **top-to-bottom at the time of the call**. A procedure sees whichever `x` is current in the runtime environment when it executes.

```postscript
/x 10 def
/getX { x } def
5 dict begin
  /x 99 def
  getX =        % prints 99  — sees the runtime x
end
```

### Static (Lexical) Scoping

Name lookup searches the dictionary stack **as it existed when the procedure was defined** (its closure). A procedure always sees the `x` from its definition site, regardless of what later code does.

```postscript
/x 10 def
/getX { x } def    % captures: dict_stack = [system_dict(x=10)]
5 dict begin
  /x 99 def
  getX =        % prints 10  — sees definition-time x
end
```

This is implemented via the `staticLink` field on every `procedure` object. When a procedure is created (`{...}`), the current dictionary stack is snapshotted into `staticLink`. When that procedure is later executed in lexical mode, name lookups search `staticLink` instead of the live dictionary stack.

---

## Running Tests

```bash
npm test
```

73 tests across 7 test suites, one per operator category.

```
Test Suites: 7 passed, 7 total
Tests:       73 passed, 73 total
```

To run a single suite:

```bash
npx jest tests/arithmeticOps.test.ts
```

---

## Examples

### Factorial (recursive)

```postscript
/factorial {
  dup 1 le
  { pop 1 }
  { dup 1 sub factorial mul }
  ifelse
} def

5 factorial =     % 120
```

### Fibonacci

```postscript
/fib {
  dup 2 lt
  { }
  { dup 1 sub fib exch 2 sub fib add }
  ifelse
} def

7 fib =           % 13
```

### Sum with `for`

```postscript
/total 0 def
1 1 10 { total add /total exch def } for
total =           % 55
```

### String operations

```postscript
(hello world) 6 5 getinterval =     % world
(hello) 1 (XY) putinterval =        % hXYlo
(hello) 0 get =                      % 104  (ASCII 'h')
```

### Scoping demo

```postscript
% Dynamic mode (default):
%   getX returns 99 — sees the inner x at call time
/x 10 def
/getX { x = } def
5 dict begin /x 99 def getX end

% Lexical mode (run with: npx ts-node src/repl.ts --lexical):
%   getX returns 10 — sees the outer x from definition time
/x 10 def
/getX { x = } def
5 dict begin /x 99 def getX end
```
