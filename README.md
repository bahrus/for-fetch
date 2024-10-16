# for-fetch [TODO]

[![NPM version](https://badge.fury.io/js/for-fetch.png)](http://badge.fury.io/js/for-fetch)
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/for-fetch?style=for-the-badge)](https://bundlephobia.com/result?p=for-fetch)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/for-fetch?compression=gzip">
<!--[![Playwright Tests](https://github.com/bahrus/for-fetch/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/for-fetch/actions/workflows/CI.yml)-->

## [API Documentation](https://cf-sw.bahrus.workers.dev/?href=https%3A%2F%2Fcdn.jsdelivr.net%2Fnpm%2Ffor-fetch%400.0.9%2Fcustom-elements.json&stylesheet=https%3A%2F%2Fcdn.jsdelivr.net%2Fnpm%2Fwc-info%2Fsimple-ce-style.css&embedded=false&tags=&ts=2024-04-14T13%3A35%3A04.990Z&tocXSLT=https%3A%2F%2Fcdn.jsdelivr.net%2Fnpm%2Fwc-info%2Ftoc.xsl)

## [Demo](https://jsfiddle.net/bahrus/ma0vtbnx/1/)

for-fetch is a small-ish, bare-bones simple fetch web component.  

*for-fetch* can act as a base web component for "web components as a service".  [be-fetch](https://github.com/bahrus/be-fetch) actually does just that - it can dynamically create such a web component on the fly, declaratively, that extends this base class.

# Part 1 -- HTML inclusion

## Example 1 -- Simple html include [TODO]

The following allows you to see future headlines in the mainstream media, today:

```html
<for-fetch 
stream href=https://cors-anywhere.herokuapp.com/https://www.theonion.com/ 
as=html shadow=open></for-fetch>
    
```

For this very specific example shown above, due to restrictions of the cors-anywhere utility the link above uses, you will first need to go to https://cors-anywhere.herokuapp.com/corsdemo to unlock the service for a limited amount of time.

for-fetch automatically caches, in memory, "get's", not POSTS or other HTTP methods, based on the localName of the custom element as the base key of the cache, and of course on the exact string of the href property. To disable this feature, specify attribute/property: no-cache/noCache.

## Alternatives

There are a huge number of alternatives to this component to consider.

Among them:

1.  [HTMX](https://htmx.org/docs/)
2.  [i-html](https://www.keithcirkel.co.uk/i-html/)
3.  [sl-include](https://shoelace.style/components/include/)
4.  [html-include-element](https://www.npmjs.com/package/html-include-element)
5.  [htmz](https://leanrada.com/htmz/)
6.  [include-fragment-element](https://www.npmjs.com/package/@github/include-fragment-element)

and many more

## Security

The platform provides plenty of built-in elements with attributes that can load url's.  But the fundamental difference is those components open as a separate page, or in the case of iframes, the content is restricted to a rectangle, which significantly reduces the possibility of abuse.  

When we lift those restrictions, the security / safety concern becomes more pronounced.

As pointed out by the [i-html discussion on security](https://www.keithcirkel.co.uk/i-html/#security):

> Injecting arbitrary HTML into a page can pose some security risks, so it's important that there's a defence in depth approach to mitigating the risk surface area...

> \<i-html\> will never explicitly append certain elements into the page, unless you opt in. For example if a response contains an \<iframe\> element, this will simply be deleted before the contents are injected. If you want \<iframe\> elements to be injected, you'll need to add the allow="iframe" attribute to the element.


To support this kind of selective inclusion, consider using *i-html* or the other alternatives linked to above, instead of this component.  *for-fetch* has a slightly different emphasis when it comes to including HTML.  One thing this component supports, which the others may not, is taking advantage of the  HTML streaming API's that become available across the board in all three major browser engines in 2022.  The streaming is done via a fetch request (as opposed to via server-sent events).  Due to [current platform limitations](https://github.com/whatwg/dom/issues/1222), as far as adjusting server-streamed content, the ability to finesse the content the way *i-html* and *sl-include* alternatives do (for example) is nearly impossible.  (Other differences is this component emphasizes the "fetch" underlying protocol, so that it supports HTML as well as restful services).

So for that reason, *for-fetch* provides more support for clamping down on the allowed attributes, by allowing the developer to integrate the [*be-hashing-out*](https://github.com/bahrus/be-hashing-out) enhancement: 

## Example 2 -- Optional security check [TODO]

```html
<script blocking=render>
    (await import('be-hashing-out/register.js'))
    .register('63c93d6c1dbef1929c0320ef1c4396cce1e0485ec743fe877b12e35a66b9f228');
</script>

<for-fetch be-hashing-out=63c93d6c1dbef1929c0320ef1c4396cce1e0485ec743fe877b12e35a66b9f228
href=https://cors-anywhere.herokuapp.com/https://www.theonion.com/ 
as=html shadow=open ></for-fetch>
```

This pacakge contains two alternative classes -- one for which the be-hashing-out check is opt-in, the other which requires it.


## Example 3 - Sending data to a target: [TODO]

```html
<for-fetch 
    href=https://newton.now.sh/api/v2/integrate/x^2 
    target=-object
>
</for-fetch>
...
<json-viewer -object></json-viewer>
```

for-fetch passes the results of the fetch to camel cased property obtained from the attribute marker, i.e. it will set:

```JavaScript
oJsonViewer.object = ...
```

What this example illustrates is that the target attribute is *not* using simple css selectors to find the target.  Rather it is using a custom syntax that is optimized for creating linkages between elements of peer elements, and/or between elements and its custom element host container.

It uses a custom syntax for describing, as concisely as possible and optimized for common scenarios, how to search for a nearby element, and also what event to respond to if applicable.  This syntax is referred to as ["directed scoping specifiers" (DSS)](https://github.com/bahrus/trans-render/wiki/VIII.--Directed-Scoped-Specifiers-(DSS)).

## Specifying dependencies

Like the built-in Form and Output elements, for-fetch supports integrating input from peer elements (form elements, form associated elements, contenteditable elements) by [id](https://github.com/whatwg/html/issues/10143), name, itemprop, class and part.  This also uses ["directed scoped specifier" syntax (or DSS)](https://github.com/bahrus/trans-render/wiki/VIII.--Directed-Scoped-Specifiers-(DSS)). We can formulate the href to use for the fetch request:

## Specify dynamic href [TODO]

```html
<input name=op value=integrate>
<input name=expr value=x^2>
<for-fetch
    for="@op::change @expr"
    :href=https://newton.now.sh/api/v2/:op/:expr
    target=-object
>
</for-fetch>
...
<json-viewer -object></json-viewer>
```

Syntax adheres to the [URL Pattern API](https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API) which unfortunately doesn't support [going in the opposite direction](https://github.com/whatwg/urlpattern/issues/73).

## Block fetch without user interaction [TODO]

```html
<button type=button name=submit>Submit</button>
<for-fetch when=@submit::click></for-fetch>
```

The click event is assumed if not specified.

## Progressively routing the form element

```html
<form name=newtonService>
    <input name=op value=integrate>
    <input name=expr value=x^2>
    <noscript>
        <button name=submit>Submit</button>
    </noscript>
    
</form>

<for-fetch
    form="@newtonService"
    :href=https://newton.now.sh/api/v2/:op/:expr
    target=-object
>
</for-fetch>
...
<json-viewer -object></json-viewer>
```

Only submits when the form is valid

## Showcasing all the bells and whistles [TODO]

```html
<other-stuff>
    <input name=greeting>
    <span itemprop=surname contenteditable></span>
    <div part=myPart contenteditable></div>
    <my-form-associated-custom-element></my-form-associated-custom-element>
</other-stuff>
<form itemscope>
    <section>
        <input id=isVegetarian type=checkbox switch>
        <sl-input></sl-input>
        <input name=greeting>
        <span itemprop=surname contenteditable></span>
        <div part=myPart contenteditable></div>
        <my-form-associated-custom-element></my-form-associated-custom-element>
        <div itemscope>
            <for-fetch 
                href=https://newton.now.sh/api/v2/integrate/x^2 
                target=json-viewer[-object]
                for="#isVegetarian /myHostElementEventTargetSubObject @greeting! |surname %myPart ~myFormAssociatedCustomElement ~sl-input::sl-input"
            >
            </for-fetch>
        </div>
    </section>
</form>
```


To specify the closest element to search within, use the ^ character:


```html
<other-stuff>
    <input name=greeting>
    <span itemprop=surname contenteditable></span>
    <div part=myPart contenteditable></div>
    <my-form-associated-custom-element></my-form-associated-custom-element>
</other-stuff>
<form itemscope>
    <section>
        <input id=isVegetarian type=checkbox switch>
        <input name=greeting>
        <span itemprop=surname contenteditable></span>
        <div part=myPart contenteditable></div>
        <my-form-associated-custom-element></my-form-associated-custom-element>
        <div itemscope>
            <for-fetch 
                href=https://newton.now.sh/api/v2/integrate/x^2 
                target=-object
                onerror=console.error(href)
                for="#isVegetarian /myHostElementEventTargetSubObject @greeting! ^section|surname ^section%myPart ^section~myFormAssociatedCustomElement"
                oninput=...
                
            >
            </for-fetch>
        </div>
    </section>
</form>
```

## Progressively routing the hyperlink [TODO]

This may be an invalid use case, better handled with the Navigation api, this might just get in the way of that.

```html
<div>I don't care if <a itemprop=monday href="https://example.org/Monday">Monday</a>'s blue</div>
<div>
    <a itemprop=tuesday href=https://example.org/Tuesday>Tuesday</a>'s gray and 
    <a itemprop=wednesday href=https://example.org/Wednsday>Wednesday</a> too.
    
</div>
<div><a itemprop=thursday href=https://example.org/Thursday>Thursday</a> I don't care about you</div>
<div>It's <a itemprop=friday href=https://example.org/Friday>Friday</a> I'm in love</div>

...

<for-fetch
    for="|monday::click |tuesday::click |wednesday::click |thursday::click |friday::click"
    prevent-default
    once
    stream
    as=html
    oninput="
        const dayOfWeek = event.trigger.getAttribute('itemprop');
        event.target = `${dayOfWeek}-tab`;
        event.href = event.trigger.href;
        querySelector('my-tabs').selectedTab = event.target;
    "
></for-fetch>

<my-tabs>
    <monday-tab></monday-tab>
    <tuesday-tab></tuesday-tab>
    <wednesday-tab></wednesday-tab>
    <thursday-tab></thursday-tab>
    <friday-tab></friday-tab>
</my-tabs>
```

This will create a separate for-fetch tag (or whatever the superclass localName is) with the actual href.  This instance won't actually do the fetching.



## Specify location of cache [TODO]

We can specify to cache the results of the fetch in indexeddb instead of in the more expensive RAM:

```html
<for-fetch cache-to=indexedDB store-name=myStore></for-fetch>
```


## Filtering the data [TODO]

Ideally, to [utilize the platform most effectively](https://dassur.ma/things/react-redux-comlink/), and serve the user better, this component would integrate with a service worker, which could:

1.  Do the fetch, 
2.  Parse the results, 
3.  Cache the parsed full results in indexedDB, 
4.  Filter the full results in the service worker.
5.  Store the filtered results, also in indexedDB, in another location.
6.  Return a key identifier to indexDB, rather than the object.

Since, to my knowledge, there isn't a standard for doing this, or even a widely used library that follows this pattern, we are opting not to make this web component tightly coupled to such a service worker.  Instead, the focus is on making sure this component provides all the support that is needed to make such a solution work with a minimum of fuss.

Being that this class is specifically intended to be extended, we could certainly envision such a sub-classing web component adopting some sort of convention to do exactly what is described above, in partnership with an associated service worker.

The way I could see that working is if this web component added an http header in the request, which the service worker watches for, and acts accordingly when it encounters the header, removing the header before it passes through to the final end point.

Then the service worker could add a special header in the response indicating where to find the results in indexedDB.

This web component already does support headers, but perhaps some better visibility could be added for this functionality.

## Filtering with the onload event / import maps / preconnect

However, for the less ambitious, the way we can do filtering or other manipulation of the results in the main thread is via the onload event:

```html
<html>
    <head>
        <script type=importmap>
        {
            "newton-svc/": "https://newton.now.sh/api/v2/"
        }
        </script>
    </head>
    <body>

        <input name=op value=integrate>
        <input name=expr value=x^2>
        <script type=module blocking=render>
            (await import('for-fetch'))
            .filter(['newton-svc/', ':op/:expr'], async resp => {
                ...
            })

        </script>
        <for-fetch
            for="@op @expr"
            base=newton-svc
            :href=:op/:expr
            target=-object
        >
        </for-fetch>
        ...
        <json-viewer -object></json-viewer>
        
    </body>
```

Alternatively, can work with link href rel=preconnect tags to resolve the base. [TODO]

## Connecting to indexed db in the filter code [TODO]

*for-fetch* provides easy access to indexed db in the onload event, via the popular [idb-keyval](https://www.npmjs.com/package/idb-keyval) package.  This would help significantly with achieving the goals set out earlier of integrating for-fetch with a smart service worker.

To opt-in (which imposes a small cost due to needing to load the library first):

```html
<for-fetch use-idb
    onload="
    event.idb.set('hello', 'world')
        .then(() => console.log('It worked!'))
        .catch((err) => console.log('It failed!', err));
    "
></for-fetch>
```

> [!NOTE]
> This package uses the built-in support for oninput and onload.  It allows the browser to parse the JS, and simply dispatches events "load" and "input" to integrate with the custom code.  One current limitation is that the code inside doesn't assume it is asynchronous.  It is possible to wrap the code in an async IIFE block to achieve this, which could be worthwhile for particularly complex manipulations.

## Reflecting attributes?

This web component is based on a [web component library](https://github.com/bahrus/trans-render/wiki/III.--O-components#attributes-on-demand) that prefers to only reflect attributes "on demand", so as to reduce unnecessary greenhouse emissions.  To see the values of the properties passed in directly (i.e. not via attributes) or calculated internally, specify which ones you want reflected via css.  The following example asks that **all** such attributes be reflected:

```html
<html>
    <head>
        ...
        <style>
            for-fetch {
                --attrs-to-reflect: *;
            }
            for-fetch * {
                --attrs-to-reflect: initial;
            }
        </style>
    </head>
    ...
</html>
```

However, this is somewhat wasteful, to emit every single attribute if no one cares what they are.  Each attribute change can trigger the browser having to figure out if any of them affect any styling rules, plus the memory consumption etc.

So you can list the specif ones you would like to see reflected for your specific scenario:

```html
<html>
    <head>
        ...
        <style>
            for-fetch {
                --attrs-to-reflect: href method for form target when credentials as no-cache stream target-self when-count next-when-count;
            }
            for-fetch * {
                --attrs-to-reflect: initial;
            }
        </style>
    </head>
    ...
</html>
```

## Viewing Demos Locally

Any web server that can serve static files will do, but...

1.  Install git.
2.  Fork/clone this repo.
3.  Install node.js.
4.  Open command window to folder where you cloned this repo.
5.  > npm install
6.  > npm run serve
7.  Open http://localhost:3030/demo/ in a modern browser.

<!--## Running Tests

```
> npm run test
```
-->
## Using from ESM Module:

```JavaScript
import 'for-fetch/for-fetch.js';
```

## Using from CDN:

```html
<script type=module crossorigin=anonymous>
    import 'https://esm.run/for-fetch';
</script>
```


