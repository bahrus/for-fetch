export class URLBuilder {
    pattern;
    //#reea: RegExpMatchArray | null = null;
    constructor(pattern) {
        this.pattern = pattern;
    }
    build(obj) {
        let returnStr = this.pattern;
        //const reg = /:\w+/g;
        const tokens = [];
        let i = 0;
        let result;
        while ((result = reg.exec(returnStr)) !== null) {
            tokens.push(returnStr.substring(i, result.index));
            const key = result[0].substring(1);
            i = result.index + result[0].length;
            if (key in obj) {
                tokens.push(obj[key]);
            }
            console.log({ result });
        }
        const r = tokens.join('');
        console.log({ r, tokens });
        return r;
    }
}
const reg = /:\w+/g;
