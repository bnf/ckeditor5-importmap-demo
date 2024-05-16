import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';

import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { FindAndReplace } from '@ckeditor/ckeditor5-find-and-replace';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { Indent } from '@ckeditor/ckeditor5-indent';
import { Link } from '@ckeditor/ckeditor5-link';
import { List } from '@ckeditor/ckeditor5-list';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { PastePlainText } from '@ckeditor/ckeditor5-clipboard';
import { PasteFromOffice } from '@ckeditor/ckeditor5-paste-from-office';
import { RemoveFormat } from '@ckeditor/ckeditor5-remove-format';
import { Table, TableToolbar, TableProperties, TableCellProperties, TableCaption } from '@ckeditor/ckeditor5-table';
import { TextTransformation } from '@ckeditor/ckeditor5-typing';
import { SourceEditing } from '@ckeditor/ckeditor5-source-editing';
import { Alignment } from '@ckeditor/ckeditor5-alignment';
import { Style } from '@ckeditor/ckeditor5-style';
import { GeneralHtmlSupport } from '@ckeditor/ckeditor5-html-support';
import { Bold, Italic, Subscript, Superscript, Strikethrough, Underline } from '@ckeditor/ckeditor5-basic-styles';
import { SpecialCharacters, SpecialCharactersEssentials } from '@ckeditor/ckeditor5-special-characters';
import { HorizontalLine } from '@ckeditor/ckeditor5-horizontal-line';

const plugins = [
  BlockQuote,
  Essentials,
  FindAndReplace,
  Heading,
  Indent,
  Link,
  List,
  Paragraph,
  PastePlainText,
  PasteFromOffice,
  RemoveFormat,
  Table, TableToolbar, TableProperties, TableCellProperties, TableCaption,
  TextTransformation,
  SourceEditing,
  Alignment,
  Style,
  GeneralHtmlSupport,
  Bold, Italic, Subscript, Superscript, Strikethrough, Underline,
  SpecialCharacters, SpecialCharactersEssentials,
  HorizontalLine,
];

const toolbar = {
  "items": [
    "heading",
    "|",
    "style",
    "|",
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "subscript",
    "superscript",
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
    "link",
    "|",
    "removeFormat",
    "|",
    "undo",
    "redo",
    "|",
    "insertTable",
    "horizontalLine",
    "specialCharacters",
    "|",
    "sourceEditing"
  ],
  "removeItems": [
    "bold",
    "underline",
    "strikethrough",
    "alignment:justify"
  ],
};

class DemoCKEditor extends HTMLElement
{
  async connectedCallback() {
    const textarea = document.createElement('textarea')
    this.append(textarea);

    await ClassicEditor.create(textarea, {
      plugins,
      toolbar,
    });
  }
}

window.customElements.define('demo-ckeditor', DemoCKEditor);
