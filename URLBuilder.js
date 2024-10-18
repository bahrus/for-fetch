export class URLBuilder {
    pattern;
    #positions = [0];
    constructor(pattern) {
        this.pattern = pattern;
        let result;
        let i = 0;
        const positions = this.#positions;
        while ((result = reg.exec(pattern)) !== null) {
            const r = result[0];
            const key = r.substring(1);
            i = result.index + r.length;
            positions.push([i, key]);
        }
    }
    build(obj) {
        let pattern = this.pattern;
        const tokens = [];
        let i = 0;
        let result;
        while ((result = reg.exec(pattern)) !== null) {
            tokens.push(pattern.substring(i, result.index));
            const key = result[0].substring(1);
            i = result.index + result[0].length;
            if (key in obj) {
                tokens.push(obj[key]);
            }
        }
        const r = tokens.join('');
        return r;
    }
}
const reg = /:\w+/g;
