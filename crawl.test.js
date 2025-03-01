const { normalURL, getURL } = require("./crawl.js");
const { test, expect } = require("@jest/globals");

test("normalURL cut protocols", () => {
  const input = "https://example.com/path";
  const actual = normalURL(input);
  const expected = "example.com/path";
  expect(actual).toEqual(expected);
});
test("normalURL cut trailling slash", () => {
  const input = "https://blog.example.com/path/";
  const actual = normalURL(input);
  const expected = "blog.example.com/path";
  expect(actual).toEqual(expected);
});
test("normalURL capitalize & http", () => {
  const input = "https://BLOG.example.com/path";
  const actual = normalURL(input);
  const expected = "blog.example.com/path";
  expect(actual).toEqual(expected);
});

test("getURL absolute urls", () => {
  const inputBody = `
<html>
    <body>
        <a href="https://example.com/path/">
            HTML link
        </a>
    </body>
</html>
`;
  const inputBaseURL = "https://example.com/path/";
  const actual = getURL(inputBody, inputBaseURL);
  const expected = ["https://example.com/path/"];
  expect(actual).toEqual(expected);
});

test("getURL relative urls", () => {
  const inputBody = `
<html>
    <body>
        <a href="/path/">
            HTML link
        </a>
    </body>
</html>
`;
  const inputBaseURL = "https://example.com";
  const actual = getURL(inputBody, inputBaseURL);
  const expected = ["https://example.com/path/"];
  expect(actual).toEqual(expected);
});

test("getURL both urls", () => {
  const inputBody = `
<html>
    <body>
        <a href="https://example.com/path1/">
            HTML link
        </a>
        <a href="/path2/">
            HTML link
        </a>
    </body>
</html>
`;
  const inputBaseURL = "https://example.com";
  const actual = getURL(inputBody, inputBaseURL);
  const expected = ["https://example.com/path1/", "https://example.com/path2/"];
  expect(actual).toEqual(expected);
});

test("getURL Invalid urls", () => {
  const inputBody = `
<html>
    <body>
        <a href="invalid">
            Invalid HTML link
        </a>
    </body>
</html>
`;
  const inputBaseURL = "https://example.com/path/";
  const actual = getURL(inputBody, inputBaseURL);
  const expected = [ ];
  expect(actual).toEqual(expected);
});