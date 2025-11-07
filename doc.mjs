import { CustomElementManifestGenerator } from 'wc-info/doc.js';
import { resolve } from "path";
const cemg = new CustomElementManifestGenerator(resolve("./ts-refs/for-fetch/doc.d.ts"), 'Package', console.log);
