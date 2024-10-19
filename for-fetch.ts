import {O} from 'trans-render/froop/O.js';
import {
    Actions, AllProps, loadEventName, ProPP, PP,
    ForData, EventForFetch, inputEventName, EventName, EndUserProps
} from './ts-refs/for-fetch/types';
import {config} from './config.js';

export class ForFetch extends O /* implements Actions, AllProps*/ {
    static override config = config;

    #abortController: AbortController | undefined;

    accept$(self: this){
        const {accept, as} = self;
        if(accept !== undefined) return accept;
        return as === 'html' ? 'text/html' : 'application/json';
    
    }
    #whenController: AbortController | undefined;
    async initializeWhen(self: this){
        const {when, nextWhenCount} = self;
        if(!when){
            return {
                whenCount: nextWhenCount
            } as PP
        }
        if(this.#whenController !== undefined) this.#whenController.abort();
        this.#whenController = new AbortController();
        const {parse} = await import('trans-render/dss/parse.js');
        const specifier = await parse(when);
        const {evt} = specifier;
        const {find} = await import('trans-render/dss/find.js');
        const srcEl = await find(self, specifier);
        if(!srcEl) throw 404;
        srcEl.addEventListener(evt || 'click', e => {
            self.whenCount = self.nextWhenCount;
        }, {signal: this.#whenController.signal});
    }

    async doStream(self: this, href: string, resolvedTarget: HTMLElement){
        const {streamOrator} = await import('stream-orator/StreamOrator.js');
        streamOrator(href!, this.request$(self), resolvedTarget);
    }

    async getData(self: this, href: string, resolvedTarget: Element){
        const {noCache, as} = self;
        let data: any;
        resolvedTarget.ariaBusy = 'true';
        if(this.#abortController !== undefined){
            this.#abortController.abort();
        }
        this.#abortController = new AbortController();
        this.request$(self).signal = this.#abortController?.signal;

        let resp: Response | undefined;
        try{
            resp = await fetch(href!, this.request$(self));
        }catch(e){
            const err = e as Error
            this.dispatchEvent(new ErrorEvent('error', err));
            return;
        }
        if(!this.validateResp(resp)) {
            throw [resp.statusText, resp.status]
        };
        //TODO - validate
        switch(as){
            case 'text':
            case 'html':
                data = await resp.text();
                break;
            case 'json':
                try{
                    data = await resp.json();
                }catch(e){
                    const err = e as Error
                    this.dispatchEvent(new ErrorEvent('error', err));
                    return;
                }
                
                break;
        }
        const loadEvent = new LoadEvent(data);
        this.dispatchEvent(loadEvent);
        data = loadEvent.data;
        if(!noCache && !cache.has(this.localName)){
            cache.set(this.localName, new Map());
        }
        //TODO increment ariaBusy / decrement in case other components are affecting
        if(resolvedTarget) resolvedTarget.ariaBusy = 'false';
        return data;
    }
    async do(self: this){
        
            const {whenCount} = self;
            super.covertAssignment({
                nextWhenCount: whenCount! + 1
            } as PP);

            const {noCache, as, stream, href} = self;
            const resolvedTarget = await self.resolveTarget(self);
            if(resolvedTarget === null){
                throw 404;
            }
            if(resolvedTarget.ariaLive === null) resolvedTarget.ariaLive = 'polite';
            let data: any;
            if(!noCache) {
                data = cache.get(this.localName)?.get(href!);
            } 
            if(data === undefined){
                if(as === 'html' && stream && resolvedTarget instanceof HTMLElement){
                    this.doStream(self, href!, resolvedTarget);
                    return;
                }
                data = await this.getData(self, href!, resolvedTarget);
            }
            
            switch(as){
                case 'text':
                case 'json':
                    this.hidden = true;
                    this.value = data;
                    this.dispatchEvent(new Event('change'));
                    await this.setTargetProp(self, resolvedTarget, data);
                    break;
                case 'html':
                    const {shadow} = this;
                    if(this.target){
                        this.hidden = true;
                        await this.setTargetProp(self, resolvedTarget, data, shadow);
                    }else{
                        const target = this.target || this;
                        let root : Element | ShadowRoot = this;
                        if(shadow !== undefined){
                            if(this.shadowRoot === null) this.attachShadow({mode: shadow});
                            root = this.shadowRoot!;
                        }
                        root.innerHTML = data;
                    }

                    break;
            }
        
    }

    async parseTarget(self: this){
        const {target} = self;
        if(!target){
            return {
                targetSelf: true,
            } as PP
        }
        const {parse} = await import('trans-render/dss/parse.js');
        const targetSpecifier = await parse(target);
        return {
            targetSelf: false,
            targetSpecifier    
        } as PP;
    }

    request$(self: this){
        const {method, body, credentials} = self;
        return {
            method: method,
            headers: {
                'Accept': self.accept$(this),
            },
            credentials: credentials,
            body: typeof body === 'object' ? JSON.stringify(body) : body,
        } as RequestInit;
    }

    async resolveTarget(self: this): Promise<Element | null>{
        const {targetSelf, targetSpecifier} = this;
        if(targetSelf) return this;
        //if(targetElO?.scope === undefined) throw 'NI';
        const {find} = await import('trans-render/dss/find.js')
        return await find(self, targetSpecifier!) as Element | null;
    }

    async setTargetProp(self: this, resolvedTarget: Element | null | undefined, data: any, shadow?: ShadowRootMode){
        if(!resolvedTarget) return;
        const {targetSpecifier} = self;
        if(targetSpecifier === undefined) return;
        const {prop} = targetSpecifier;
        if(prop === undefined) throw 'NI';
        if(shadow !== undefined && prop === 'innerHTML'){
            let root = resolvedTarget.shadowRoot;
            if(root === null) {
                root = resolvedTarget.attachShadow({mode: shadow});
            }
            root.innerHTML = data;
        }else{
            (<any>resolvedTarget)[prop] = data;
        }
        
    }

    validateResp(resp: Response){
        return true;
    }

    disconnectedCallback(){
        super.disconnectedCallback();
        if(this.#abortController !== undefined){
            this.#abortController.abort();
        }
    }
}

const cache: Map<string, Map<string, any>> = new Map();

export class LoadEvent extends Event{

    static EventName: loadEventName = 'load';

    constructor(public data: any){
        super(LoadEvent.EventName);
    }
}

export interface ForFetch extends AllProps{}