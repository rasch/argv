/**
 * ArgVector :: { String: String | Boolean | [String] }
 * @typedef {{ [key: string]: string | boolean | string[], _: string[] }} ArgVector
 */

/**
 * compose :: ((y -> z), (x -> y),  ..., (a -> b)) -> a -> z
 * @param {Function[]} fns
 * @returns {(arg: any) => any}
 */
const compose = (...fns) => arg => fns.reduceRight((res, fn) => fn(res), arg)

/**
 * match :: Regex -> (String | Undefined) -> Boolean
 * @param {RegExp} re
 * @returns {(str: string | undefined) => boolean}
 */
const match = re => str => str != null && re.test(str)

/**
 * isLongArg :: (String | Undefined) -> Boolean
 * @param {string | undefined} arg
 * @returns {boolean}
 */
const isLongArg = match(/^--[^-].*$/)

/**
 * isShortArg :: (String | Undefined) -> Boolean
 * @param {string | undefined} arg
 * @returns {boolean}
 */
const isShortArg = match(/^-[^-]+-?$/)

/**
 * isNegatedArg :: (String | Undefined) -> Boolean
 * @param {string | undefined} arg
 * @returns {boolean}
 */
const isNegatedArg = match(/^--no-[^-].*$/)

/**
 * isArg :: (String | Undefined) -> Boolean
 * @param {string | undefined} arg
 * @returns {boolean}
 */
const isArg = arg => isLongArg(arg) || isShortArg(arg)

/**
 * indexOf :: String -> [a] -> Number
 * @param {string} str
 * @returns {(a: any[]) => number}
 */
const indexOf = str => a => {
  const index = a.indexOf(str)
  return index > -1 ? index : Infinity
}

/**
 * gte :: Number -> Number -> Boolean
 * @param {number} x
 * @returns {(y: number) => boolean}
 */
const gte = x => y => x >= y

/**
 * isLast :: Number -> [String] -> Boolean
 * @param {number} index
 * @returns {(a: string[]) => boolean}
 */
const isLast = index => a => index === a.length - 1

/**
 * isArgsEnd :: Number -> [a] -> Boolean
 * @param {number} index
 * @returns {(a: any[]) => boolean}
 */
const isArgsEnd = index => compose(gte(index), indexOf("--"))

/**
 * stripLeadingDashes :: String -> String
 * @param {string} str
 * @returns {string}
 */
const stripLeadingDashes = str => str.replace(/^--?/, "")

/**
 * stripLeadingNegation :: String -> String
 * @param {string} str
 * @returns {string}
 */
const stripLeadingNegation = str => str.replace(/^--no-/, "")

/**
 * splitEqualArgs :: [String] -> [String]
 * @param {string[]} args
 * @returns {string[]}
 */
const splitEqualArgs = args => args.reduce((res, str) =>
  res.concat(isArg(str) ? str.split(/=(.+)/).filter(x => x) : str),
  /** @type {string[]} */ ([]))

/**
 * splitTrailingIntFromShortArgs :: [String] -> [String]
 * @param {string[]} args
 * @returns {string[]}
 */
const splitTrailingIntFromShortArgs = args => args.reduce((res, str) =>
  res.concat(isShortArg(str) ? str.split(/([\d-]+)$/).filter(x => x) : str),
  /** @type {string[]} */ ([]))

/**
 * splitShortArgs :: [String] -> [String]
 * @param {string[]} args
 * @returns {string[]}
 */
const splitShortArgs = args => args.reduce((res, str) =>
  res.concat(isShortArg(str) ? [...str.slice(1)].map(c => `-${c}`) : str),
  /** @type {string[]} */ ([]))

/**
 * buildArgumentVector :: [String] -> ArgVector
 * @param {string[]} args
 * @returns {ArgVector}
 */
const buildArgumentVector = args => args.reduce((res, str, i, a) => {
  const next = /** @type {string} */ (a[i + 1])
  const prev = /** @type {string} */ (a[i - 1])

  if (isNegatedArg(str)) res[stripLeadingNegation(str)] = false

  else if (isArg(str)) res[stripLeadingDashes(str)] =
    isArg(next) || isLast(i)(a) || isArgsEnd(i + 1)(a) ? true : next

  else if (!isArg(prev) || isNegatedArg(prev)) res._.push(str)

  return res
}, /** @type {ArgVector} */ ({ _: [] }))

/**
 * removeEndOfArgs :: [String] -> [String]
 * @param {string[]} args
 * @returns {string[]}
 */
const removeEndOfArgs = args => args.slice(0, indexOf("--")(args))

/**
 * appendEndOfArgs :: [String] -> ArgVector -> ArgVector
 * @param {string[]} args
 * @returns {(argv: ArgVector) => ArgVector}
 */
const appendEndOfArgs = args => argv => ({
  ...argv, _: [...argv._, ...args.slice(indexOf("--")(args) + 1)]
})

/**
 * argv :: [String] -> ArgVector
 * @param {string[]} args
 * @returns {ArgVector}
 */
export const argv = args => compose(
  appendEndOfArgs(args),
  buildArgumentVector,
  splitShortArgs,
  splitTrailingIntFromShortArgs,
  splitEqualArgs,
  removeEndOfArgs,
)(args)
