import { O } from 'trans-render/froop/O.js';
import { config } from './config.js';
export class ForFetch extends O /* implements Actions, AllProps*/ {
    static config = config;
    #abortController;
    accept$(self) {
        const { accept, as } = self;
        if (accept !== undefined)
            return accept;
        return as === 'html' ? 'text/html' : 'application/json';
    }
    async doStream(self, href, resolvedTarget) {
        const { streamOrator } = await import('stream-orator/StreamOrator.js');
        streamOrator(href, this.request$(self), resolvedTarget);
    }
    async getData(self, href, resolvedTarget) {
        const { noCache, stream, as } = self;
        let data;
        resolvedTarget.ariaBusy = 'true';
        if (this.#abortController !== undefined) {
            this.#abortController.abort();
        }
        this.#abortController = new AbortController();
        this.request$(self).signal = this.#abortController?.signal;
        let resp;
        try {
            resp = await fetch(href, this.request$(self));
        }
        catch (e) {
            const err = e;
            this.dispatchEvent(new ErrorEvent('error', err));
            return;
        }
        if (!this.validateResp(resp)) {
            throw [resp.statusText, resp.status];
        }
        ;
        //TODO - validate
        switch (as) {
            case 'text':
            case 'html':
                data = await resp.text();
                break;
            case 'json':
                try {
                    data = await resp.json();
                }
                catch (e) {
                    const err = e;
                    this.dispatchEvent(new ErrorEvent('error', err));
                    return;
                }
                break;
        }
        const loadEvent = new LoadEvent(data);
        this.dispatchEvent(loadEvent);
        data = loadEvent.data;
        if (!noCache && !cache.has(this.localName)) {
            cache.set(this.localName, new Map());
        }
        //TODO increment ariaBusy / decrement in case other components are affecting
        if (resolvedTarget)
            resolvedTarget.ariaBusy = 'false';
    }
    async do(self) {
        const { whenCount } = self;
        super.covertAssignment({
            nextWhenCount: whenCount + 1
        });
        const { noCache, as, stream, href } = self;
        const resolvedTarget = await self.resolveTarget(self);
        if (resolvedTarget === null) {
            throw 404;
        }
        if (resolvedTarget.ariaLive === null)
            resolvedTarget.ariaLive = 'polite';
        let data;
        if (!noCache) {
            data = cache.get(this.localName)?.get(href);
        }
        if (data === undefined) {
            if (as === 'html' && stream && resolvedTarget instanceof HTMLElement) {
                this.doStream(self, href, resolvedTarget);
                return;
            }
            data = this.getData(self, href, resolvedTarget);
        }
        switch (as) {
            case 'text':
            case 'json':
                this.hidden = true;
                this.value = data;
                this.dispatchEvent(new Event('change'));
                await this.setTargetProp(self, resolvedTarget, data);
                break;
            case 'html':
                const { shadow } = this;
                if (this.target) {
                    this.hidden = true;
                    await this.setTargetProp(self, resolvedTarget, data, shadow);
                }
                else {
                    const target = this.target || this;
                    let root = this;
                    if (shadow !== undefined) {
                        if (this.shadowRoot === null)
                            this.attachShadow({ mode: shadow });
                        root = this.shadowRoot;
                    }
                    root.innerHTML = data;
                }
                break;
        }
    }
    request$(self) {
        const { method, body, credentials } = self;
        return {
            method: method,
            headers: {
                'Accept': self.accept$(this),
            },
            credentials: credentials,
            body: typeof body === 'object' ? JSON.stringify(body) : body,
        };
    }
    async resolveTarget(self) {
        const { targetSelf, targetSpecifier } = this;
        if (targetSelf)
            return this;
        //if(targetElO?.scope === undefined) throw 'NI';
        const { find } = await import('trans-render/dss/find.js');
        return await find(self, targetSpecifier);
    }
    async setTargetProp(self, resolvedTarget, data, shadow) {
        if (!resolvedTarget)
            return;
        const { targetSpecifier } = self;
        if (targetSpecifier === undefined)
            return;
        const { prop } = targetSpecifier;
        if (prop === undefined)
            throw 'NI';
        if (shadow !== undefined && prop === 'innerHTML') {
            let root = resolvedTarget.shadowRoot;
            if (root === null) {
                root = resolvedTarget.attachShadow({ mode: shadow });
            }
            root.innerHTML = data;
        }
        else {
            resolvedTarget[prop] = data;
        }
    }
    validateResp(resp) {
        return true;
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.#abortController !== undefined) {
            this.#abortController.abort();
        }
    }
}
const cache = new Map();
export class LoadEvent extends Event {
    data;
    static EventName = 'load';
    constructor(data) {
        super(LoadEvent.EventName);
        this.data = data;
    }
}
