export class URLCompiler{
    constructor(public pattern: string){

    }
}

const re = /\:([a-zA-Z0-9]+)/g;