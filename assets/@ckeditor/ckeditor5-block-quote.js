import{Command as e,Plugin as t,icons as o}from"@ckeditor/ckeditor5-core";import{Enter as i}from"@ckeditor/ckeditor5-enter";import{Delete as n}from"@ckeditor/ckeditor5-typing";import{first as r}from"@ckeditor/ckeditor5-utils";import{ButtonView as c,MenuBarMenuListItemButtonView as s}from"@ckeditor/ckeditor5-ui";
/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */class l extends e{refresh(){this.value=this._getValue(),this.isEnabled=this._checkEnabled()}execute(e={}){const t=this.editor.model,o=t.schema,i=t.document.selection,n=Array.from(i.getSelectedBlocks()),r=void 0===e.forceValue?!this.value:e.forceValue;t.change((e=>{if(r){const t=n.filter((e=>d(e)||a(o,e)));this._applyQuote(e,t)}else this._removeQuote(e,n.filter(d))}))}_getValue(){const e=this.editor.model.document.selection,t=r(e.getSelectedBlocks());return!(!t||!d(t))}_checkEnabled(){if(this.value)return!0;const e=this.editor.model.document.selection,t=this.editor.model.schema,o=r(e.getSelectedBlocks());return!!o&&a(t,o)}_removeQuote(e,t){u(e,t).reverse().forEach((t=>{if(t.start.isAtStart&&t.end.isAtEnd)return void e.unwrap(t.start.parent);if(t.start.isAtStart){const o=e.createPositionBefore(t.start.parent);return void e.move(t,o)}t.end.isAtEnd||e.split(t.end);const o=e.createPositionAfter(t.end.parent);e.move(t,o)}))}_applyQuote(e,t){const o=[];u(e,t).reverse().forEach((t=>{let i=d(t.start);i||(i=e.createElement("blockQuote"),e.wrap(t,i)),o.push(i)})),o.reverse().reduce(((t,o)=>t.nextSibling==o?(e.merge(e.createPositionAfter(t)),t):o))}}function d(e){return"blockQuote"==e.parent.name?e.parent:null}function u(e,t){let o,i=0;const n=[];for(;i<t.length;){const r=t[i],c=t[i+1];o||(o=e.createPositionBefore(r)),c&&r.nextSibling==c||(n.push(e.createRange(o,e.createPositionAfter(r))),o=null),i++}return n}function a(e,t){const o=e.checkChild(t.parent,"blockQuote"),i=e.checkChild(["$root","blockQuote"],t);return o&&i}
/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */class m extends t{static get pluginName(){return"BlockQuoteEditing"}static get requires(){return[i,n]}init(){const e=this.editor,t=e.model.schema;e.commands.add("blockQuote",new l(e)),t.register("blockQuote",{inheritAllFrom:"$container"}),e.conversion.elementToElement({model:"blockQuote",view:"blockquote"}),e.model.document.registerPostFixer((o=>{const i=e.model.document.differ.getChanges();for(const e of i)if("insert"==e.type){const i=e.position.nodeAfter;if(!i)continue;if(i.is("element","blockQuote")&&i.isEmpty)return o.remove(i),!0;if(i.is("element","blockQuote")&&!t.checkChild(e.position,i))return o.unwrap(i),!0;if(i.is("element")){const e=o.createRangeIn(i);for(const i of e.getItems())if(i.is("element","blockQuote")&&!t.checkChild(o.createPositionBefore(i),i))return o.unwrap(i),!0}}else if("remove"==e.type){const t=e.position.parent;if(t.is("element","blockQuote")&&t.isEmpty)return o.remove(t),!0}return!1}));const o=this.editor.editing.view.document,i=e.model.document.selection,n=e.commands.get("blockQuote");this.listenTo(o,"enter",((t,o)=>{if(!i.isCollapsed||!n.value)return;i.getLastPosition().parent.isEmpty&&(e.execute("blockQuote"),e.editing.view.scrollToTheSelection(),o.preventDefault(),t.stop())}),{context:"blockquote"}),this.listenTo(o,"delete",((t,o)=>{if("backward"!=o.direction||!i.isCollapsed||!n.value)return;const r=i.getLastPosition().parent;r.isEmpty&&!r.previousSibling&&(e.execute("blockQuote"),e.editing.view.scrollToTheSelection(),o.preventDefault(),t.stop())}),{context:"blockquote"})}}!function(e,t){void 0===t&&(t={});var o=t.insertAt;if("undefined"!=typeof document){var i=document.head||document.getElementsByTagName("head")[0],n=document.createElement("style");n.type="text/css","top"===o&&i.firstChild?i.insertBefore(n,i.firstChild):i.appendChild(n),n.styleSheet?n.styleSheet.cssText=e:n.appendChild(document.createTextNode(e))}}(".ck-content blockquote{border-left:5px solid #ccc;font-style:italic;margin-left:0;margin-right:0;overflow:hidden;padding-left:1.5em;padding-right:1.5em}.ck-content[dir=rtl] blockquote{border-left:0;border-right:5px solid #ccc}");
/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
class f extends t{static get pluginName(){return"BlockQuoteUI"}init(){const e=this.editor,t=e.commands.get("blockQuote");e.ui.componentFactory.add("blockQuote",(()=>{const e=this._createButton(c);return e.set({tooltip:!0}),e.bind("isOn").to(t,"value"),e})),e.ui.componentFactory.add("menuBar:blockQuote",(()=>this._createButton(s)))}_createButton(e){const t=this.editor,i=t.locale,n=t.commands.get("blockQuote"),r=new e(t.locale),c=i.t;return r.set({label:c("Block quote"),icon:o.quote,isToggleable:!0}),r.bind("isEnabled").to(n,"isEnabled"),this.listenTo(r,"execute",(()=>{t.execute("blockQuote"),t.editing.view.focus()})),r}}
/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */class p extends t{static get requires(){return[m,f]}static get pluginName(){return"BlockQuote"}}export{p as BlockQuote,m as BlockQuoteEditing,f as BlockQuoteUI};