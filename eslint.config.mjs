import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  rules: {
    // 1) Allow _prefix (or suffix) in any identifier:
    'no-underscore-dangle': ['error', {
      allow: [],            // here you can whitelist specific names like ['_id']
      allowAfterThis: true, // e.g. this._private
      allowAfterSuper: true,
      enforceInMethodNames: false,
      // use allowPattern to permit ANY name starting with _:
      allowPattern: '^_'
    }],

    // 2) If you also want to treat _foo as “used” for unused‑vars:
    'no-unused-vars': ['warn', {
      vars: 'all',
      args: 'after-used',
      ignoreRestSiblings: false,
      argsIgnorePattern: '^_',   // ignore unused args named _*
      varsIgnorePattern: '^_'    // ignore unused vars named _*
    }],

    // …other rules…
  }
  
];

export default eslintConfig;
