"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plainText = exports.stripEmoji = exports.unifyEmoji = exports.digestEmoji = exports.unescapeHtml = exports.stripHtml = void 0;
/**
 *   Wechaty Chatbot SDK - https://github.com/wechaty/wechaty
 *
 *   @copyright 2016 Huan LI (李卓桓) <https://github.com/huan>, and
 *                   Wechaty Contributors <https://github.com/wechaty>.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
function stripHtml(html) {
    if (!html) {
        return '';
    }
    return html.replace(/(<([^>]+)>)/ig, '');
}
exports.stripHtml = stripHtml;
function unescapeHtml(str) {
    if (!str) {
        return '';
    }
    return str
        .replace(/&apos;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&gt;/g, '>')
        .replace(/&lt;/g, '<')
        .replace(/&amp;/g, '&');
}
exports.unescapeHtml = unescapeHtml;
function digestEmoji(html) {
    if (!html) {
        return '';
    }
    return html
        .replace(/<img class="(\w*?emoji) (\w*?emoji[^"]+?)" text="(.*?)_web" src=[^>]+>/g, '$3') // <img class="emoji emoji1f4a4" text="[流汗]_web" src="/zh_CN/htmledition/v2/images/spacer.gif" />
        .replace(/<span class="(\w*?emoji) (\w*?emoji[^"]+?)"><\/span>/g, '[$2]'); // '<span class="emoji emoji1f334"></span>'
}
exports.digestEmoji = digestEmoji;
/**
 * unifyEmoji: the same emoji will be encoded as different xml code in browser. unify them.
 *
 *  from: <img class="emoji emoji1f602" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif" />
 *  to:   <span class=\"emoji emoji1f602\"></span>
 *
 */
function unifyEmoji(html) {
    if (!html) {
        return '';
    }
    return html
        .replace(/<img class="(\w*?emoji) (\w*?emoji[^"]+?)" text="(.*?)_web" src=[^>]+>/g, '<emoji code="$2"/>') // <img class="emoji emoji1f4a4" text="[流汗]_web" src="/zh_CN/htmledition/v2/images/spacer.gif" />
        .replace(/<span class="(\w*?emoji) (\w*?emoji[^"]+?)"><\/span>/g, '<emoji code="$2"/>'); // '<span class="emoji emoji1f334"></span>'
}
exports.unifyEmoji = unifyEmoji;
function stripEmoji(html) {
    if (!html) {
        return '';
    }
    return html
        .replace(/<img class="(\w*?emoji) (\w*?emoji[^"]+?)" text="(.*?)_web" src=[^>]+>/g, '') // <img class="emoji emoji1f4a4" text="[流汗]_web" src="/zh_CN/htmledition/v2/images/spacer.gif" />
        .replace(/<span class="(\w*?emoji) (\w*?emoji[^"]+?)"><\/span>/g, ''); // '<span class="emoji emoji1f334"></span>'
}
exports.stripEmoji = stripEmoji;
function plainText(html) {
    if (!html) {
        return '';
    }
    return stripHtml(unescapeHtml(stripHtml(digestEmoji(html))));
}
exports.plainText = plainText;
//# sourceMappingURL=xml.js.map