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
export declare function stripHtml(html?: string): string;
export declare function unescapeHtml(str?: string): string;
export declare function digestEmoji(html?: string): string;
/**
 * unifyEmoji: the same emoji will be encoded as different xml code in browser. unify them.
 *
 *  from: <img class="emoji emoji1f602" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif" />
 *  to:   <span class=\"emoji emoji1f602\"></span>
 *
 */
export declare function unifyEmoji(html?: string): string;
export declare function stripEmoji(html?: string): string;
export declare function plainText(html?: string): string;
//# sourceMappingURL=xml.d.ts.map