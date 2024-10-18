type BeforeToken = string;
type TokenKey = string | undefined
export class URLBuilder{
    #tokenStream: Array<[BeforeToken, TokenKey]> = [];
    constructor(public pattern: string){
        let result;
        let i = 0;
        const positions = this.#tokenStream;
        while ((result = reg.exec(pattern)) !== null) {
            const beforeToken = pattern.substring(i, result.index);
            const r = result[0]
            const tokenKey = r.substring(1);
            i = result.index + r.length;
            positions.push([beforeToken, tokenKey]);
        }
        if(i < pattern.length){
            positions.push([pattern.substring(i), undefined]);
        }
        console.log({positions})
    }

    build(obj: any){
        const tokens = [];
        for(const tokenItem of this.#tokenStream){
            const [beforeToken, key] = tokenItem;
            tokens.push(beforeToken);
            if(key !== undefined && key in obj){
                tokens.push(obj[key]);
            }
        }
        return tokens.join('');
        // let pattern = this.pattern;
        // const tokens = [];
        // let i = 0;
        // let result;
        // while ((result = reg.exec(pattern)) !== null) {
        //     tokens.push(pattern.substring(i, result.index));
        //     const key = result[0].substring(1);
        //     i = result.index + result[0].length;
        //     if(key in obj){
        //         tokens.push(obj[key]);
        //     }
        // }
        // const r = tokens.join('');
        // return r;
    }
}

const reg = /:\w+/g;
