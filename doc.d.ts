
import {SimpleWCInfo} from './ts-refs/wc-info/SimpleWCInfo';

export interface EndUserProps {
    
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