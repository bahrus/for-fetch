import {OConfig} from './ts-refs/trans-render/froop/types';
import { Actions, AllProps } from './ts-refs/for-fetch/types';
export const config: OConfig<AllProps, Actions> = {
    propDefaults:{
        accept: '',
        /**
         * this is a test
         */
        credentials: 'omit',
        method: 'GET',
        as: 'json',
        noCache: false,
        stream: false,
        targetSelf: false,
        whenCount: 0,
        nextWhenCount: 1,
        target: '',
        when: '',
    },
    propInfo: {
        accept: {
            type: 'String',
            parse: true,
            attrName: 'accept'
        },
        for: {
            type: 'String',
            parse: true,
            attrName: 'for',
        },
        forRefs:{
            type: 'Object',
            ro: true,
        },
        form: {
            type: 'String',
            parse: true,
            attrName: 'form'
        },
        formData:{
            type: 'Object',
            ro: true,
        },
        formRef: {
            type: 'Object',
            ro: true,
        },
        formSpecifier:{
          type: 'String',
          ro: true,  
        },
        src:{
            type: 'String',
            parse: true,
            attrName: 'src'
        },
        ':src':{
            type: 'String',
            parse: true,
            attrName: ':src',
        },
        shadow:{
            type: 'String',
        },

        targetSpecifier: {
            type: 'Object'
        },
        target:{
            type: 'String',
            parse: true,
            attrName: 'target'
        },
        when: {
            type: 'String',
            parse: true,
            attrName: 'when'
        },
        urlBuilder: {
            type: 'Object'
        }

    },
    actions:{
        initializeWhen: {
            ifKeyIn: ['when']
        },
        do: {
            ifAllOf: ['src'],
            ifAtLeastOneOf: ['targetSpecifier', 'targetSelf'],
            ifEquals: ['whenCount', 'nextWhenCount']
        },
        parseTarget: {
            ifKeyIn: ['target']
        },
        bindSrc: {
            ifAllOf: [':src'],
        },
        // calcSrc: {
        //     ifAllOf: ['be']
        // }
        // parseFor: {
        //     ifAllOf: ['for'],
        //     ifAtLeastOneOf: ['oninput', 'onselect'],
        // },
        // listenForInput:{
        //     ifAllOf: ['forRefs', 'oninput']
        // },
        // doInitialLoad:{
        //     ifAllOf: ['forRefs'],
        //     ifAtLeastOneOf: ['oninput', 'onselect'],
        // },
        // onForm: {
        //     ifAllOf: ['form'],
        // },
        // onFormSpecifier: {
        //     ifAllOf: ['formSpecifier']
        // },
        // onFormRef: {
        //     ifAllOf: ['formRef']
        // }
    }
};