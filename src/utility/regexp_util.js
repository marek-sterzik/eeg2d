export default class RegexpUtil
{
    constructor(pattern)
    {
        if (!(pattern instanceof RegExp)) {
            return new StringUtil(pattern)
        }

        var newPattern, trimPattern
        var newFlags
        newPattern = '(' + pattern.source + ')(.*)$'
        trimPattern = '(' + pattern.source + ')$'
        newFlags = pattern.flags.replace(/[gs]/, '')

        this.readTokenPattern = new RegExp('^' + newPattern, newFlags)
        this.splitPattern = new RegExp(newPattern, newFlags)
        this.trimToken = new RegExp(trimPattern, newFlags)
    }

    split2 = (string) => {
        var match = string.match(this.splitPattern)
        if (!match) {
            return [string]
        }

        return [string.replace(this.splitPattern, ''), match[match.length - 1]]
    }

    readToken = (string) => {
        var matches = string.match(this.readTokenPattern)
        if (!matches) {
            return [null, string]
        }
        return [matches[1], matches[matches.length - 1]]
    }

    readTokenFromEnd = (string) => {
        var match = string.match(this.trimToken)
        if (!match) {
            return [null, string]
        }
        return [match[1], string.replace(this.trimToken, '')]
    }

    trim = (string) => {
        var s
        [s, string] = this.readToken(string);
        [s, string] = this.readTokenFromEnd(string)

        return string
    }

    matchAll = (string) => {
        var m = this.readToken(string)
        return (m[0] !== null && m[1] === '')
    }
}

class StringUtil
{
    constructor(pattern)
    {
        if (typeof pattern !== 'string') {
            throw 'cannot create a string matching pattern from non-string';
        }
        this.pattern = pattern
    }

    split2 = (string) => {
        var index = string.indexOf(this.pattern)
        if (index < 0) {
            return [string]
        }
        return [string.substr(0, index), string.substr(index + this.pattern.length)]
    }

    readToken = (string) => {
        if (string.substr(0, this.pattern.length) === this.pattern) {
            return [this.pattern, string.substr(this.pattern.length)]
        } else {
            return [null, string]
        }
    }

    readTokenFromEnd = (string) => {
        if (
            string.length > this.pattern.length &&
            string.substr(string.length - this.pattern.length, this.pattern.length) === this.pattern
        ) {
            return [this.pattern,  string.substr(0, string.length - this.pattern.length)]
        }

        return [null, string]
    }

    trim = (string) => {
        var s
        [s, string] = this.readToken(string);
        [s, string] = this.readTokenFromEnd(string)

        return string
    }

    matchAll = (string) => {
        var m = this.readToken(string)
        return (m[0] !== null && m[1] === '')
    }
}
