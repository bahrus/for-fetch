export class URLCompiler{
    #reea: RegExpMatchArray | null = null;
    constructor(public pattern: string){
        this.#reea = pattern.match(re);
    }

    compile(obj: any){
        let returnStr = this.pattern;
        debugger;
    }
}

const re = /:\w+/g;