import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';

/* Demo for dynamic list of plugins, could be loaded from an endpoint or injected as runtime config */
const plugins = [
  { module: '@ckeditor/ckeditor5-block-quote', exports: ['BlockQuote'] },
  { module: '@ckeditor/ckeditor5-essentials', exports: ['Essentials'] },
  { module: '@ckeditor/ckeditor5-find-and-replace', exports: ['FindAndReplace'] },
  { module: '@ckeditor/ckeditor5-heading', exports: ['Heading'] },
  { module: '@ckeditor/ckeditor5-indent', exports: ['Indent'] },
  { module: '@ckeditor/ckeditor5-link', exports: ['Link'] },
  { module: '@ckeditor/ckeditor5-list', exports: ['List'] },
  { module: '@ckeditor/ckeditor5-paragraph', exports: ['Paragraph'] },
  { module: '@ckeditor/ckeditor5-clipboard', exports: ['PastePlainText'] },
  { module: '@ckeditor/ckeditor5-paste-from-office', exports: ['PasteFromOffice'] },
  { module: '@ckeditor/ckeditor5-remove-format', exports: ['RemoveFormat'] },
  { module: '@ckeditor/ckeditor5-table', exports: ['Table', 'TableToolbar', 'TableProperties', 'TableCellProperties', 'TableCaption'] },
  { module: '@ckeditor/ckeditor5-typing', exports: ['TextTransformation'] },
  { module: '@ckeditor/ckeditor5-source-editing', exports: ['SourceEditing'] },
  { module: '@ckeditor/ckeditor5-alignment', exports: ['Alignment'] },
  { module: '@ckeditor/ckeditor5-style', exports: ['Style'] },
  { module: '@ckeditor/ckeditor5-html-support', exports: ['GeneralHtmlSupport'] },
  { module: '@ckeditor/ckeditor5-basic-styles', exports: ['Bold', 'Italic', 'Subscript', 'Superscript', 'Strikethrough', 'Underline'] },
  { module: '@ckeditor/ckeditor5-special-characters', exports: ['SpecialCharacters', 'SpecialCharactersEssentials'] },
  { module: '@ckeditor/ckeditor5-horizontal-line', exports: ['HorizontalLine'] },
];

const toolbar = {
  "items": [
    "heading",
    "|",
    "style",
    "fontFamily",
    "fontSize",
    "|",
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "subscript",
    "superscript",
    "softhyphen",
    "|",
    "numberedList",
    "bulletedList",
    "|",
    "indent",
    "outdent",
    "|",
    "blockQuote",
    "|",
    "alignment:left",
    "alignment:center",
    "alignment:right",
    "alignment:justify",
    "-",
    "link",
    "|",
    "removeFormat",
    "|",
    "undo",
    "redo",
    "|",
    "insertImage",
    "insertTable",
    "horizontalLine",
    "specialCharacters",
    "pageBreak",
    "|",
    "sourceEditing"
  ],
  "removeItems": [
    "bold",
    "underline",
    "strikethrough",
    "alignment:justify"
  ],
  "shouldNotGroupWhenFull":false
};

class DemoCKEditor extends HTMLElement
{
  async connectedCallback() {
    const textarea = document.createElement('textarea')
    this.append(textarea);

    await ClassicEditor.create(textarea, {
      plugins: await this.#resolvePlugins(plugins),
      toolbar,
    });
  }

  async #resolvePlugins(plugins) {
   const pluginModules = await Promise.all(
     plugins.map(async (moduleDescriptor) => {
       try {
         return {
           module: await import(moduleDescriptor.module),
           exports: moduleDescriptor.exports,
         }
       } catch (e) {
         console.error(`Failed to load CKEditor5 module ${moduleDescriptor.module}`, e);
         return {
           module: null,
           exports: []
         }
       }
     })
   );

   const declaredPlugins = [];
   pluginModules.forEach(({ module, exports }) => {
     for (const exportName of exports) {
       if (exportName in module) {
         declaredPlugins.push(module[exportName]);
       } else {
         console.error(`CKEditor5 plugin export "${exportName}" not available in`, module);
       }
     }
   });

  console.log(declaredPlugins);

   return declaredPlugins;
 }
}

window.customElements.define('demo-ckeditor', DemoCKEditor);
