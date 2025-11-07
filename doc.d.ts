
import {SimpleWCInfo} from './ts-refs/wc-info/SimpleWCInfo';

export interface EndUserProps {

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

}

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