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

    
    async do(self: this){
        
            const {whenCount} = self;
            super.covertAssignment({
                nextWhenCount: whenCount! + 1
            } as PP);

            const {noCache, as, stream, href} = self;
            const resolvedTarget = await self.resolveTarget(self);
            if(resolvedTarget && resolvedTarget.ariaLive === null) resolvedTarget.ariaLive = 'polite';
            let data: any;
            if(!noCache) {
                data = cache.get(this.localName)?.get(href!);
            } 
            if(data === undefined){
                if(resolvedTarget){
                    resolvedTarget.ariaBusy = 'true';
                }
                if(this.#abortController !== undefined){
                    this.#abortController.abort();
                }
                this.#abortController = new AbortController();
                this.request$(self).signal = this.#abortController?.signal;
                if(as === 'html' && stream){
                    const {streamOrator} = await import('stream-orator/StreamOrator.js');
                    const {target} = self;
                    const targetEl = (this.getRootNode() as DocumentFragment).querySelector(target!) as HTMLElement;
                    streamOrator(href!, this.request$(self), targetEl);
                    return;
                }
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
        if(targetSelf) return null;
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