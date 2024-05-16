import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import svg from 'rollup-plugin-svg';
import terser from '@rollup/plugin-terser';
import * as path from 'path';
import { readdirSync, statSync, existsSync } from 'fs';
import { createRequire } from 'node:module';
import ckeditor5dev from '@ckeditor/ckeditor5-dev-utils';

const require = createRequire(import.meta.url);

const postCssConfig = ckeditor5dev.styles.getPostCssConfig({
  themeImporter: {
    themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
  },
  minify: true
});

const packages = readdirSync('node_modules/@ckeditor')
  .filter(dir =>
    statSync(`node_modules/@ckeditor/${dir}`).isDirectory() &&
    existsSync(`node_modules/@ckeditor/${dir}/package.json`) &&
    !['ckeditor5-dev-translations', 'ckeditor5-dev-utils'].includes(dir)
  );

export default [
  ...packages.map(pkg => {
    const packageName = `@ckeditor/${pkg}`;
    const packageJson = `./node_modules/${packageName}/package.json`;
    let input = `./node_modules/${packageName}/${require(packageJson).main}`;
    return {
      input: [
        input,
      ],
      output: {
        compact: true,
        file: `./assets/${packageName}.js`,
        format: 'es',
        plugins: [terser({ ecma: 8 })],
      },
      plugins: [
        {
          name: 'externals',
          resolveId: (source, from) => {
            if (source === '@ckeditor/ckeditor5-utils/src/version.js' && from.includes('@ckeditor/ckeditor5-engine')) {
              return { id: '@ckeditor/ckeditor5-utils', external: true }
            }
            if (source.startsWith('@ckeditor/') && !source.startsWith(packageName) && !source.endsWith('.svg') && !source.endsWith('.css')) {
              if (source.split('/').length > 2) {
                throw new Error(`Non package-entry point was imported: ${source}`);
              }
              return { id: source.replace(/.js$/, ''), external: true }
            }
            if (source.startsWith('ckeditor5/src/')) {
              return { id: '@ckeditor/ckeditor5-' + source.substring(14).replace(/.js$/, ''), external: true };
            }
            if (source === 'lodash-es') {
              return { id: 'lodash-es', external: true }
            }
            if (source.startsWith('@ckeditor/') && source.endsWith('.js') && source.split('/').length === 2) {
              throw new Error(`JS File with suffix: ${source} import from ${from}`);
            }
            if (
              !source.startsWith('@ckeditor/') &&
              !source.startsWith('.') &&
              !source.startsWith('/') &&
              !source.startsWith('Sources/JavaScript/rte_ckeditor/contrib') &&
              source !== 'vanilla-colorful/hex-color-picker.js' &&
              source !== 'vanilla-colorful/lib/entrypoints/hex' &&
              source !== 'color-convert' &&
              source !== 'color-name' &&
              source !== 'color-parse'
            ) {
              throw new Error(`HEADS UP: New CKEditor5 import "${source}" (import from ${from}). Please decide whether to bundle or package separately and adapt Build/rollup/ckeditor.js accordingly.`);
            }
            return null
          }
        },
        postcss({
          ...postCssConfig,
        }),
        nodeResolve({
          extensions: ['.js']
        }),
        commonjs(),
        svg(),
      ]
    }
  }),
  {
    input: 'node_modules/lodash-es/lodash.js',
    output: {
      file: './assets/lodash-es.js',
      format: 'esm',
    },
    plugins: [
      terser({ ecma: 8 }),
      {
        name: 'externals',
        resolveId: (source, importer) => {
          if (source.startsWith('.') && importer) {
            const require = createRequire(import.meta.url);
            const path = require('path');
            return require.resolve(path.resolve(path.dirname(importer), source))
          }
          return null
        }
      }
    ],
  },
];
