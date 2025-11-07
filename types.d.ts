
import { JSONObject } from './ts-refs/trans-render/lib/types';
import { Specifier } from './ts-refs/trans-render/dss/types';
import { URLBuilder } from './URLBuilder';
import {SimpleWCInfo} from './ts-refs/wc-info/SimpleWCInfo';

declare class WeakRef<TProps = any>{}
/**
 * fetch-for props
 */
export interface EndUserProps{

    accept?: string,
    /**
     * Url to invoke
     * @readonly true
     */
    src?: string,

    ':src': string,

    /**
     * Specifier for list of form associated or contentEditable peer elements that 
     * should partake in forming the URL.
     */
    for?: string,

    /**
     * Indicates whether to treat the response as HTML or JSON or Text
     */
    as?: 'html' | 'json' | 'text',

    /**
     * The http verb to be used for the request
     */
    method?: 
        | 'GET' 
        | 'HEAD' 
        | 'POST' 
        | 'PUT' 
        | 'DELETE' 
        | 'OPTIONS' 
        | 'TRACE'
        | 'PATCH',
    /**
     * Either the JSON stringified or the parsed JSON object 
     * If parsed, the web component will stringify it.
     */
    body?: any,

    /**
     * Request credentials
     */
    credentials?: RequestCredentials,

    /**
     * Directed Scoped Specifier to the 
     * DOM element where the retrieved content should be applied.
     */
    target?: string,

    /**
     * If as=html, specify whether to (stream) the contents into an attached shadow DOM or not.
     */
    shadow?: ShadowRootMode,

    /**
     * Do not cache results even if the url has been invoked before.
     */
    noCache?: boolean,

    /**
     * Stream the contents into the target element
     */
    stream?: boolean,

    /**
     * Directed Scoped Specifier to a 
     * (button) element, to delay submitting the fetch request until that button is clicked.
     */
    when?: string,

    /**
     * Directed Scoped Specifier to a form element
     * that we should use to form the url and body from.
     */
    form?: string,

}

export interface OverridableGetters{
    //request$: RequestInit,
    //accept$?: string,
    value?: any,
    //isAttrParsed?: boolean,
    targetSelf?: boolean
    targetSpecifier?: Specifier
    whenCount?: number,
    nextWhenCount?: number,


}

export type EventName = string;

export interface AllProps extends EndUserProps, OverridableGetters{

    readonly resolvedTarget?: Element | null,

    /**
     * @readonly
     * Weak references to input elements
     */
    readonly forRefs: Map<string, [WeakRef<HTMLInputElement>, EventName]>,
    readonly formData?: FormData,
    readonly formRef?: WeakRef<HTMLFormElement>,
    readonly formSpecifier?: Specifier,
    readonly urlBuilder?: URLBuilder,
}

export type PAP = Partial<AllProps>;

export type ProPP = Promise<PAP>;


/**
 * methods for fetch-for
 */
export interface Methods extends Actions{
    validateResp(resp: Response): boolean,
    validateOn(): boolean,
    setTargetProp(target: Element | null, data: any, shadow?: ShadowRootMode): void,
}

export interface Actions{
    do(self: this): Promise<void>;
    bindSrc(self: this): void;
    parseFor(self: this): ProPP;
    parseTarget(self: this): ProPP;
    // listenForInput(self: this): ProPP;
    // doInitialLoad(self: this): ProPP;
    initializeWhen(self: this): Promise<PAP | undefined>;
    // onForm(self: this): ProPP;
    // onFormSpecifier(self: this): ProPP;
    // onFormRef(self: this): Promise<void>,
}

// https://github.com/webcomponents-cg/community-protocols/issues/12#issuecomment-872415080
export type loadEventName = 'load';
export type inputEventName = 'input';
export type selectionChangeEventName = 'select';

export interface EventForFetch {
    href?: string;
    trigger?: Element,
    forData: ForData,
    formData: FormData,
    body?: string | JSONObject
}

export type ForData = {[key: string]: HTMLInputElement}

/**
 * fetch-for web component
 */
export abstract class ForFetchInfo implements SimpleWCInfo {
    src: './for-fetch.js';
    tagName: 'for-fetch';
    props: EndUserProps;
    name: 'for-fetch';
    homepage: 'https://github.com/bahrus/for-fetch'; 
    license: 'MIT'; 
    description: 'Base web component for fetch'
    cssParts: {
        
    }
}

export type Package = [ForFetchInfo];



