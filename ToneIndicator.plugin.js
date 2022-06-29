/**
 * @name ToneIndicators
 * @author NomadNaomie, Zuri
 * @description Displays the messages tone indicators or by highlighting a tone tag will give you the defintion
 * @version 1.4.1
 * @source https://github.com/NomadNaomie/BD-Tone-Indicators
 * @updateUrl https://raw.githubusercontent.com/NomadNaomie/BD-Tone-Indicators/main/ToneIndicator.plugin.js
 * @authorId 188323207793606656, 746871249791221880
 * @authorLink https://twitter.com/NomadNaomie
 * @invite hUfUtaRbXa
 */

 module.exports = (_ => {
    var toneMap = []
    !require("fs").existsSync(require("path").join(BdApi.Plugins.folder, "ToneIndicators.json")) ? require("request").get("https://raw.githubusercontent.com/NomadNaomie/BD-Tone-Indicators/main/ToneIndicators.json", (err, res, body) => {!err && res.statusCode === 200 && body ? require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "ToneIndicators.json"), body, ()=>{toneMap = JSON.parse(body).toneMap.map(v => { let desc = v.tag.pop(); return [v.tag, desc, v.colors]})}):console.log("Problem Retrieving Tone Map")}): toneMap = JSON.parse(require("fs").readFileSync(require("path").join(BdApi.Plugins.folder, "ToneIndicators.json"))).toneMap.map(v => { let desc = v.tag.pop(); return [v.tag, desc, v.colors]})
    const findResults = (s, furtherSearch, directMatch) => {
        if (directMatch) return toneMap.filter(v => v[0].find(x => x === s))[0];
        let firstSearch = toneMap.filter(v => v[0].find(x => x.startsWith(s)));
        if (firstSearch.length > 0) return firstSearch;
        if (furtherSearch) {
            let secondSearch = toneMap.filter(v => v[1].includes(s.slice(1)));
            if (secondSearch) return secondSearch;
        }
        return null;
    }

    const config = {
        info: {
            name: 'ToneIndicators',
            authors: [
                { name: 'NomadNaomie', discord_id: '188323207793606656', github_username: 'NomadNaomie', twitter_username: 'NomadNaomie' },
                { name: 'Zuri', discord_id: '746871249791221880', github_username: 'Zuriix', website: "https://zuriix.github.io/" }
            ],
            version: '1.4.1',
            description: 'Displays the messages tone indicators or by highlighting a tone tag will give you the defintion',
            github_raw: 'https://raw.githubusercontent.com/NomadNaomie/BD-Tone-Indicators/main/ToneIndicator.plugin.js',
            github: 'https://github.com/NomadNaomie/BD-Tone-Indicators'
        },
        changelog: [
            {   title: '1.4.1', 
                type: "added", 
                items: ['Tone tags are no longer hard coded, find ToneIndicators.json in your plugin folder to change them.'] 
            },
        ],
        defaultConfig: [

            /* Corner settings */
            {
                type: 'category',
                id: 'corners',
                name: 'Corner settings',
                collapsible: true,
                shown: false,
                settings: [
                    { type: "switch", id: "disabled", name: "Remove Corners", default: false },
                    { type: "slider", id: "radius", name: "Radius", note: "Changes the corner radius", value: 6 }
                ]
            },


            /* Background settings */
            {
                type: 'category',
                id: 'background',
                name: 'Background settings',
                collapsible: true,
                shown: false,
                settings: [
                    { type: "switch", id: "disabled", name: "Remove Background Color", note: "Removes the background color from indicators in messages.", value: false },
                    { type: "slider", id: "transparency", name: "Background Transparency", note: "Changes the transparency of the indicators background color.", value: 10 }
                ]
            },


            /* Tooltip settings */
            {
                type: 'category',
                id: 'tooltip',
                name: 'Tooltip settings',
                collapsible: true,
                shown: false,
                settings: [
                    { type: "switch", id: "bottom", name: "Display tooltip under message", note: "Displays tooltip under the message instead of above it.", value: true }
                ]
            },


            /* Indicator settings */
            {
                type: 'category',
                id: 'tonecolor',
                name: 'Tone colour settings',
                collapsible: true,
                shown: false,
                settings: [
                    { type: "switch", id: "lightmode", name: "Light Mode", note: "Changes the tone indicators to use a light color scheme.", value: false },
                    { type: "switch", id: "autochange", name: "Automatic Mode", note: "Changes the tone indicators depending on the current color scheme.", value: true }
                ]
            },

            /* Auto Complete Settings */
            {
                type: 'category',
                id: 'autocomplete',
                name: 'Auto complete settings',
                collapsible: true,
                shown: false,
                settings: [
                    { type: "switch", id: "toneautocomplete", name: "Autocomplete Tones", note: "Suggests tones to use when typing a slash", value: true },
                    { type: "slider", id: "tonelistlimit", name: "Suggestion Limit", note: "How many tone suggestions should be given", min: 1, max: 36, value: 6, units: " tones" }
                ]
            },
        ]
    };

    if (!global.ZeresPluginLibrary) {
        return class { load() { BdApi.showConfirmationModal("Zere's Library Missing", "Either Click Download Now to install it or manually install it. ", { confirmText: "Automatically Install", cancelText: "Cancel", onConfirm: () => { require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, result, body) => { !error && result.statusCode == 200 && body ? require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, _ => BdApi.showToast("Finished downloading Zere's Plugin Library", { type: "success" })) : BdApi.showToast("Failed to download Zere's Plugin Library", { type: "error" }) }) } }) } };
    } else {
        return (([Plugin, Zlib]) => {
            const { WebpackModules, ContextMenu, Patcher, showToast, React, clearCSS, injectCSS } = { ...Zlib, ...BdApi };
            return class ToneIndicators extends Plugin {
                generateBackgroundColor(r, e) { let n = "0x" + r.substring(1); return "rgba(" + [n >> 16 & 255, n >> 8 & 255, 255 & n].join(",") + `,${e})` }
                getSettingsPanel() { const panel = this.buildSettingsPanel(); return panel.getElement(); }
                onStop() {
                    Patcher.unpatchAll("ToneIndicator");
                    clearCSS("ToneIndicator");
                }
                onStart() {
                    this.onStop(); // Unpatch all and clearCSS, just in case -3-
                    injectCSS("ToneIndicator", `
                    .tone-tag {
                        display: inline-block;
                        color: var(--tone-color);
                        background: var(--tone-background);
                        border-radius: var(--tone-corners);
                    }`); // Inject CSS
                    this.injectAutocomplete(); // Inject autocomplete
                    this.patchContextMenu(); // Patch context menu
                    this.patchMessageContent(); // Patch message content
                }

                injectAutocomplete() {
                    if (!this.settings.autocomplete.toneautocomplete) return;
                    const Autocomplete = WebpackModules.getByDisplayName('Autocomplete');
                    WebpackModules.getByProps('AUTOCOMPLETE_OPTIONS').AUTOCOMPLETE_PRIORITY = ["TONES", ...WebpackModules.getByProps('AUTOCOMPLETE_OPTIONS').AUTOCOMPLETE_PRIORITY.filter(v => v != "TONES")];
                    WebpackModules.getByProps('AUTOCOMPLETE_OPTIONS').AUTOCOMPLETE_OPTIONS.TONES = {
                        autoSelect: true,
                        matches: (channel, guild, content) => {
                            if (!this.settings.autocomplete.toneautocomplete) return false;
                            if (document.getElementsByClassName(ZLibrary.DiscordClasses.Textarea.textArea)[0].innerText.split(' ').length < 2) return false
                            if (content.startsWith('/')) return true;
                            return false;
                        },
                        queryResults: (channel, guild, content) => {
                            if (!content) return;
                            let res = findResults(content, true).slice(0, Math.floor(this.settings.autocomplete.tonelistlimit));
                            if (!res) return;
                            return { results: { ret: res.map(x => { return { name: x[1], desc: x[0], color: x[2][false ? 1 : 0],content:content } }) } };
                        },
                        renderResults: data => {
                            return [React.createElement(Autocomplete.Title, { title: ["Tone Indicator"] }),
                            data.results.ret.map((tag, i) => React.createElement(Autocomplete.Generic, {
                                index: i,
                                text: React.createElement('span', { style: { color: tag.color }, children: tag.name }),
                                description: React.createElement('span', { style: { color: tag.color }, children: tag.desc.join(' ') }),
                                tag: tag,
                                onClick: data.onClick,
                                onHover: data.onHover,
                                selected: data.selectedIndex === i,
                            }))
                            ]
                        },
                        onSelect: data => {let index = data.results.ret[data.index].desc.findIndex(t => t.startsWith(data.results.ret[data.index].content));return data.options.insertText(data.results.ret[data.index].desc[index == -1 ? 0 : index]) }
                    };
                }

                patchContextMenu() {
                    ContextMenu.getDiscordMenu("MessageContextMenu").then(menu => {
                        Patcher.after("ToneIndicator", menu, "default", (_, [props], ret) => {
                            let textSelection = document.getSelection().toString().replaceAll("/ ","/").trim();
                            if (textSelection) {
                                textSelection = textSelection.match("/") ? textSelection : "/" + textSelection;
                                let textTag = findResults(textSelection.toLowerCase())[0];
                                "object" === typeof textTag && ret.props.children.push(ContextMenu.buildMenuItem({
                                    type: "separator"
                                }), ContextMenu.buildMenuItem({
                                    label: "Tone Indicator",
                                    action: () => showToast(`${textTag[0]} - ${textTag[1]}`)
                                }))
                            }
                        })
                    })
                }
                patchMessageContent() {
                    const MessageContent = WebpackModules.find(e => e.type && "MessageContent" === e.type.displayName);
                    Patcher.after("ToneIndicator", MessageContent, "type", (_, [props], ret) => {
                        if (props.message.content && props.message.content.includes("/")) {
                            let finishedProps = [],
                                modifiedTags = 0;
                            ret.props.children[0].forEach(x => typeof x === "string" ? x.split(/(\n)/g).map(y => y.split(/( )/g)).forEach((z) => {z.forEach((e,i) => {e === "/" && z.length > i+2 && findResults("/"+z[i+2],false,true) && (z.splice(i,3,`/${z[i+2]}`))}); z.forEach(a => findResults(a,false,true) ? (finishedProps.push(this.createTone(a) || a) && modifiedTags++) : finishedProps.push(a))}) : finishedProps.push(x));
                            if (!finishedProps || !modifiedTags) return;
                            ret.props.children[0] = finishedProps;
                        }
                    })
                }

                createTone(content) {
                    let result = findResults(content, false, true);
                    this.settings.tonecolor.autochange && (this.settings.tonecolor.lightmode = !document.getElementsByClassName("theme-dark").length > 0)
                    if (result) return React.createElement("span", {
                        class: "tone-tag",
                        style: {
                            padding: this.settings.background.disabled ? '1px 1px' : '0px 4px,',
                            "--tone-color": this.settings.tonecolor.lightmode ? result[2][1] : result[2][0],
                            "--tone-background": this.settings.background.disabled ? '' : this.generateBackgroundColor(result[2][0], this.settings.background.transparency / 100 || .1),
                            "--tone-corners": this.settings.corners.disabled ? '' : this.settings.corners.radius + "px",
                        },
                        children: React.createElement(WebpackModules.getByProps("TooltipContainer").TooltipContainer, {
                            position: this.settings.tooltip.bottom ? "bottom" : "top",
                            class: "tone-tooltip",
                            text: `${result[1]} (${result[0].join(" or ")})`,
                        }, content)
                    })
                }
            }
        })(global.ZeresPluginLibrary.buildPlugin(config));
    }
})();

/*
      ":"
    ___:____     |"\/"|
  ,'        `.    \  /
  |  O        \___/  |
~^~^~^~^~^~^~^~^~^~^~^~^~
*/
