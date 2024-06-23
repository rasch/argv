# argv

> a command-line argument parser for ECMAScript CLI applications

This `argv` module accepts an array of strings containing the command line
arguments and reduces them to an object of key-value pairs. Any arguments that
don't have an option associated with them are appended to an array on the `_`
(underscore) key. Arguments appearing after "--" are also appended to the array
on the `_` key. Negated arguments such as, `--no-opt` will set `opt: false` on
the `argv` object. All of the values in the `argv` object are strings or
booleans.

```javascript
// example.js
import { argv } from "@rasch/argv"
console.log(argv(process.argv.slice(2)))
```

```sh
node example.js serve -v 3 -xyz --host=127.0.0.1 -p80 --no-debug -q
```

```javascript
{
  _: ["serve"],
  v: "3",
  x: true,
  y: true,
  z: true,
  host: "127.0.0.1"
  p: "80",
  debug: false,
  q: true,
}
```

[Additional usage examples](test.js) are available in the unit tests.

## install

```sh
pnpm add @rasch/argv
```

<details><summary>npm</summary><p>

```sh
npm install @rasch/argv
```

</p></details>
<details><summary>yarn</summary><p>

```sh
yarn add @rasch/argv
```

</p></details>

## license

[0BSD](LICENSE)
