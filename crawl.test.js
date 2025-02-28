const { normalURL } = require('./crawl.js')
const { test, expect } = require('@jest/globals')

test('normalURL cut protocols', ()=> {
    const input = 'https://example.com/path'
    const actual = normalURL(input)
    const expected = 'example.com/path'
    expect(actual).toEqual(expected)
})
test('normalURL cut trailling slash', ()=> {
    const input = 'https://blog.example.com/path/'
    const actual = normalURL(input)
    const expected = 'blog.example.com/path'
    expect(actual).toEqual(expected)
})
test('normalURL capitalize & http', ()=> {
    const input = 'https://BLOG.example.com/path'
    const actual = normalURL(input)
    const expected = 'blog.example.com/path'
    expect(actual).toEqual(expected)
})