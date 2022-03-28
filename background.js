"use strict";

/*Detection Firefox of Chromium-based browser*/
if (typeof browser === "undefined") {
  var browser = chrome;
}

/*
Called when the item has been created, or when creation failed due to an error.
We'll just log success/failure here.
*/
function onCreated() {
  if (browser.runtime.lastError) {
    console.log(`Error: ${browser.runtime.lastError}`);
  } else {
    console.log("Item created successfully");
  }
}

/*
Called when the item has been removed.
We'll just log success here.
*/
function onRemoved() {
  console.log("Item removed successfully");
}

/*
Called when there was an error.
We'll just log the error here.
*/
function onError(error) {
  console.log(`Error: ${error}`);
}

/*
Create all the context menu items.
*/

browser.contextMenus.create({
  id: "tools-copy",
  title: browser.i18n.getMessage("menuItemToolsCopy"),
  contexts: ["all"],
}, onCreated);

browser.contextMenus.create({
  id: "tools-copy-ffuf",
  parentId: "tools-copy",
  title: browser.i18n.getMessage("menuItemToolsCopyAsFFUF"),
  contexts: ["all"],
}, onCreated);

browser.contextMenus.create({
  id: "tools-copy-sqlmap",
  parentId: "tools-copy",
  title: browser.i18n.getMessage("menuItemToolsCopyAsSQLMAP"),
  contexts: ["all"],
}, onCreated);

browser.contextMenus.create({
  id: "tools-copy-timeverter",
  parentId: "tools-copy",
  title: browser.i18n.getMessage("menuItemToolsCopyAsTIMEVERTER"),
  contexts: ["all"],
}, onCreated);

browser.contextMenus.create({
  id: "tools-copy-wfuzz",
  parentId: "tools-copy",
  title: browser.i18n.getMessage("menuItemToolsCopyAsWFUZZ"),
  contexts: ["all"],
}, onCreated);

/*function showCookiesForTab(tabs) {
  //get the first tab object in the array
  let tab = tabs.pop();

  //get all cookies in the domain
  var gettingAllCookies = browser.cookies.getAll({url: tab.url});
  var str_cookies = "";

  gettingAllCookies.then((cookies) => {
    if (cookies.length > 0) {
      str_cookies = "-H 'Cookie: ";
      for (let cookie of cookies) {
        str_cookies = str_cookies.concat(cookie.name + "="+ cookie.value+"; ");
      }
      str_cookies = str_cookies.replace(/.{0,2}$/,"'");
      updateClipboard(str_cookies) //JUST FOR TEST. The clipboard copy must be done at the end of everything
      console.log(str_cookies);
    }
  });
}*/

/*
Use this function for copying to clipboard because navigation.clipboard.writeText() not working properly with chromium-based browsers.

*/
function copyToClipboard(text) {
  if (window.clipboardData && window.clipboardData.setData) {
      // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
      return window.clipboardData.setData("Text", text);

  }
  else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
      var textarea = document.createElement("textarea");
      textarea.textContent = text;
      textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge.
      document.body.appendChild(textarea);
      textarea.select();
      try {
          return document.execCommand("copy");  // Security exception may be thrown by some browsers.
      }
      catch (ex) {
          console.warn("Copy to clipboard failed.", ex);
          return prompt("Copy to clipboard: Ctrl+C, Enter", text);
      }
      finally {
          document.body.removeChild(textarea);
      }
  }
}

const tabData = {};
const getProp = (obj, key) => (obj[key] || (obj[key] = {}));
const encodeBody = body => {
  var data = '';
  // Read key
  for (var key in body.formData) { //body is a JSON object
    data += `${key}=${body.formData[key]}&`;
  }
  data = data.replace(/.$/,"");
  var body_data = `'${data}'`; //console.log(JSON.stringify(body.formData));
  return body_data;
}

const FILTER = {
  types: ['main_frame', 'sub_frame'],
  urls: ['<all_urls>'],
};

const TOOLS = {
  FFUF: 'tools-copy-ffuf',
  SQLMAP: 'tools-copy-sqlmap',
  TIMEVERTER: 'tools-copy-timeverter',
  WFUZZ: 'tools-copy-wfuzz',
};

browser.webRequest.onBeforeRequest.addListener(e => {
  getProp(getProp(tabData, e.tabId), e.frameId).body = e.requestBody;
}, FILTER, ['requestBody']);

browser.webRequest.onSendHeaders.addListener(e => {
  getProp(getProp(tabData, e.tabId), e.frameId).headers = e.requestHeaders;
}, FILTER, ['requestHeaders']);

browser.tabs.onRemoved.addListener(tabId => delete tabData[tabId]);

browser.tabs.onReplaced.addListener((addId, delId) => delete tabData[delId]);

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === TOOLS.FFUF) {
    const data = tabData[tab.id]?.[info.frameId || 0] || {};
    copyToClipboard(`ffuf -u '${info.frameUrl || tab.url}'` +
      (data.headers?.map(h => ` -H '${h.name}: ${h.value}'`).join('') || '') +
      (data.body ? ' -d ' + encodeBody(data.body) : ''));
  }

  if (info.menuItemId === TOOLS.SQLMAP) {
    const data = tabData[tab.id]?.[info.frameId || 0] || {};
    copyToClipboard(`sqlmap -u '${info.frameUrl || tab.url}'` +
      (data.headers?.map(h => ` -H '${h.name}: ${h.value}'`).join('') || '') +
      (data.body ? ' --data ' + encodeBody(data.body) : ''));
  }

  if (info.menuItemId === TOOLS.TIMEVERTER) {
    const data = tabData[tab.id]?.[info.frameId || 0] || {};
    copyToClipboard(`python timeverter.py -u '${info.frameUrl || tab.url}'` +
      (data.headers?.map(h => ` -H '${h.name}: ${h.value}'`).join('') || '') +
      (data.body ? ' -d ' + encodeBody(data.body) : ''));
  }

  if (info.menuItemId === TOOLS.WFUZZ) {
    const data = tabData[tab.id]?.[info.frameId || 0] || {};
    copyToClipboard(`wfuzz -u '${info.frameUrl || tab.url}'` +
      (data.headers?.map(h => ` -H '${h.name}: ${h.value}'`).join('') || '') +
      (data.body ? ' -d ' + encodeBody(data.body) : ''));
  }
});