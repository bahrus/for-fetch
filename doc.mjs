import { CustomElementManifestGenerator } from 'wc-info/doc.js';
import { resolve } from "path";
const cemg = new CustomElementManifestGenerator(resolve("./doc.d.ts"), 'Package', console.log);
