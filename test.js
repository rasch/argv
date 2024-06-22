import { argv } from "./index.js"
import { test } from "fvb"

test("given no arguments", t => {
  t.equal(argv([]), { _: [] }, "should return empty ArgVector object")
  t.plan(1)
})

test("given only non-option arguments", t => {
  t.equal(
    argv(["hello", "world"]),
    { _: ["hello", "world"] },
    "should only populate the '_' property"
  )

  t.plan(1)
})

test("given strings containing slashes in argument opts", t => {
  t.equal(
    argv(["run", "--begin", "2022/10/31", "--end", "2022/12/31", "boo"]),
    { _: ["run", "boo"], begin: "2022/10/31", end: "2022/12/31" },
    "should properly handle opts containing dates and dir paths"
  )

  t.plan(1)
})

test("given options with value separated by '='", t => {
  t.equal(
    argv(["--hello=mars", "--goodbye=earth"]),
    { _: [], hello: "mars", goodbye: "earth" },
    "should split at the '=' and set the props"
  )

  t.plan(1)
})

test("given multiple short args joined together", t => {
  t.equal(
    argv(["run", "-lac", "none"]),
    { _: ["run"], l: true, a: true, c: "none" },
    "should split the args and set their values"
  )

  t.plan(1)
})

test("given multiple negated arguments", t => {
  t.equal(
    argv(["run", "--no-debug", "--no-color"]),
    { _: ["run"], debug: false, color: false },
    "should set their values to false"
  )

  t.plan(1)
})

test("given args of various styles (from example in minimist docs)", t => {
  const actual = argv([
    "-x", "3",
    "-y", "4",
    "-n5",
    "-abc",
    "--beep=boop",
    "--no-ding",
    "foo", "bar", "baz",
  ])

  const expect = {
    _: [ "foo", "bar", "baz" ],
    x: "3",
    y: "4",
    n: "5",
    a: true,
    b: true,
    c: true,
    beep: "boop",
    ding: false,
  }

  t.equal(actual, expect, "should give similar results except number values")
  t.equal(actual._.length, 3, "should include 3 results in the '_' property")
  t.plan(2)
})

test("given an argument with multiple equals", t => {
  t.equal(argv(["--a=b=c"]), { _: [], a: "b=c" }, "should split on first '='")
  t.plan(1)
})

test("given a short argument with multiple equals", t => {
  t.equal(argv(["-a=b=c"]), { _: [], a: "b=c" }, "should split on first '='")
  t.plan(1)
})

test("given short arguments joined together and equals", t => {
  t.equal(argv(["-ab=c"]), { _: [], a: true, b: "c" }, "should split on '='")
  t.plan(1)
})

test("given an invalid argument", t => {
  t.equal(
    argv(["-a-b-c"]),
    { _: ["-a-b-c"] },
    "should put invalid argument in '_' property",
  )

  t.plan(1)
})

test("given an argument array that contains '--' to signal end of args", t => {
  t.equal(
    argv(["run", "--balance", "--", "-these", "--are", "--not", "-opts"]),
    { _: ["run", "-these", "--are", "--not", "-opts"], balance: true },
    "should put args after '--' in '_' property"
  )

  t.plan(1)
})

test("given an argument array that ends with a short option", t => {
  t.equal(
    argv(["a", "-1", "one", "-2", "two", "b", "c", "-q"]),
    { _: ["a", "b", "c"], "1": "one", "2": "two", q: true },
    "should set the final keys value to true"
  )

  t.plan(1)
})

test("given weird single character arguments", t => {
  t.equal(
    argv(["-+@%=50"]),
    { _: [], "+": true, "@": true, "%": "50" },
    "should split the arguments and set the properties"
  )

  t.plan(1)
})

test("given a looong argument vector", t => {
  const actual = argv([
    "run",
    "-zm42",
    "world",
    "more",
    "--date",
    "now",
    "--one",
    "1",
    "--two",
    "2",
    "--three",
    "3",
    "y",
    "-q",
    "hey you",
    "-+",
    "B POSITIVE",
    "-xy",
    "--abc",
    "mars",
    "--van-der-graaf=generator",
    "--punky=brewster",
    "--ollie=x10",
    "apple",
    "-%",
    "50",
    "-npr",
    "banana",
    "-@",
    "--",
    "alpha",
    "-beta",
    "--gamma"
  ])

  const expect = {
    _: ["run", "world", "more", "y", "apple", "alpha", "-beta", "--gamma"],
    z: true,
    m: "42",
    date: "now",
    one: "1",
    two: "2",
    three: "3",
    q: "hey you",
    "+": "B POSITIVE",
    x: true,
    y: true,
    abc: "mars",
    "van-der-graaf": "generator",
    punky: "brewster",
    ollie: "x10",
    "%": "50",
    n: true,
    p: true,
    r: "banana",
    "@": true
  }

  t.equal(actual, expect, "should test nearly every type of argument together")
  t.equal(actual._.length, 8, "should include 8 results in the '_' property")
  t.plan(2)
})
