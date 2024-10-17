export class URLCompiler {
    pattern;
    #reea = null;
    constructor(pattern) {
        this.pattern = pattern;
        this.#reea = pattern.match(re);
    }
    compile(obj) {
        let returnStr = this.pattern;
        debugger;
    }
}
const re = /:\w+/g;
