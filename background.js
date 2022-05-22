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

let id_menu =["tools-OSINT","tools-OSINT-crt","tools-OSINT-dig-any","tools-OSINT-openssl-cert","tools-OSINT-curl-sonar-all","tools-OSINT-curl-sonar-subdomain","tools-OSINT-curl-sonar-tlds","tools-OSINT-sublist3r","tools-OSINT-theHarvester","tools-OSINT-waybackurls","tools-OSINT-WHOIS","tools-Recon","tools-cURLheader","tools-copy-ffuf","tools-copy-nmap","tools-copy-sqlmap","tools-copy-wafw00f","tools-copy-wfuzz","tools-copy-whatweb","tools-copy-xsstrike","tools-copy-wpscan","tools-bruteforcing","tools-copy-cewl","tools-copy-hydra","tools-copy-timeverter"]
let parent_id_menu =["tools-copy","tools-OSINT","tools-OSINT","tools-OSINT","tools-OSINT","tools-OSINT","tools-OSINT","tools-OSINT","tools-OSINT","tools-OSINT","tools-OSINT","tools-copy","tools-Recon","tools-Recon","tools-Recon","tools-Recon","tools-Recon","tools-Recon","tools-Recon","tools-Recon","tools-Recon","tools-copy","tools-bruteforcing","tools-bruteforcing","tools-bruteforcing"]
let title_menu=["menuItemOSINTCopy","menuItemOSINTcrt","menuItemOSINTDiG","menuItemOSINTOpenSSL","menuItemOSINTSonarAllCopy","menuItemOSINTSonarSubdomainCopy","menuItemOSINTSonarTLDsCopy","menuItemOSINTsublist3r","menuItemOSINTtheHarvester","menuItemOSINTwaybackurls","menuItemOSINTWHOIS","menuItemRecon","menuItemcURLheader","menuItemFFUF","menuItemNmap","menuItemSQLMap","menuItemWafW00f","menuItemWfuzz","menuItemWhatWeb","menuItemXSStrike","menuItemWPScan","menuItemBruteforcing","menuItemCEWL","menuItemHydra","menuItemTimeVerter"]

for (let i = 0; i < id_menu.length; i++) {
  browser.contextMenus.create({
    id: id_menu[i],
    parentId: parent_id_menu[i],
    title: browser.i18n.getMessage(title_menu[i]),
    contexts: ["all"],
  }, onCreated);
}

const FILTER = {
  types: ['main_frame', 'sub_frame'],
  urls: ['<all_urls>'],
};

const TOOLS = {
  OSINT: id_menu[0],
  CRT: id_menu[1],
  DIG_ANY: id_menu[2],
  OPENSSL_CERT: id_menu[3],
  SONAR_ALL: id_menu[4],
  SONAR_SUBDOM: id_menu[5],
  SONAR_TLD: id_menu[6],
  SUBLIST3R: id_menu[7],
  THEHARVESTER: id_menu[8],
  WAYBACKURLS: id_menu[9],
  WHOIS: id_menu[10],
  RECON: id_menu[11],
  CURLHEADER: id_menu[12],
  FFUF: id_menu[13],
  NMAP: id_menu[14],
  SQLMAP: id_menu[15],
  WAFW00F: id_menu[16],
  WFUZZ: id_menu[17],
  WHATWEB: id_menu[18],
  XSSTRIKE: id_menu[19],
  WPSCAN: id_menu[20],
  BRUTEFORCING: id_menu[21],
  CEWL: id_menu[22],
  HYDRA: id_menu[23],
  TIMEVERTER: id_menu[24],
};

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

browser.webRequest.onBeforeRequest.addListener(e => {
  getProp(getProp(tabData, e.tabId), e.frameId).body = e.requestBody;
}, FILTER, ['requestBody']);

browser.webRequest.onSendHeaders.addListener(e => {
  getProp(getProp(tabData, e.tabId), e.frameId).headers = e.requestHeaders;
}, FILTER, ['requestHeaders']);

browser.tabs.onRemoved.addListener(tabId => delete tabData[tabId]);

browser.tabs.onReplaced.addListener((addId, delId) => delete tabData[delId]);

browser.contextMenus.onClicked.addListener((info, tab) => {
  const url = `${info.frameUrl || tab.url}`;

  let domain = (new URL(url));
  const base_url = domain.hostname;
  const path_url = domain.pathname;
  const protocol_url = domain.protocol.replace(':','');
  let fqdn = base_url.replace('www.','');
  const data = tabData[tab.id]?.[info.frameId || 0] || {};

  /*OSINT Tools */
  if (info.menuItemId === TOOLS.CRT) {
    copyToClipboard(`curl -s "https://crt.sh/?q=${fqdn}&output=json" | jq -r '.[] | "\\(.name_value)\\n\\(.common_name)"' | sort -u`);
  }

  if (info.menuItemId === TOOLS.DIG_ANY) {
    copyToClipboard(`dig any ${fqdn} @8.8.8.8`);
  }

  if (info.menuItemId === TOOLS.OPENSSL_CERT) {
    copyToClipboard(`openssl s_client -ign_eof 2>/dev/null <<<$'HEAD / HTTP/1.0\\r\\n\\r' -connect "${fqdn}:443" | openssl x509 -noout -text -in - | grep 'DNS' | sed -e 's|DNS:|\\n|g' -e 's|^\\*.*||g' | tr -d ',' | sort -u`);
  }

  if (info.menuItemId === TOOLS.SONAR_ALL) {
    copyToClipboard(`curl -s https://sonar.omnisint.io/all/${fqdn}` + ` | jq -r '.[]' | sort -u`);
  }

  if (info.menuItemId === TOOLS.SONAR_SUBDOM) {
    copyToClipboard(`curl -s https://sonar.omnisint.io/subdomains/${fqdn}` + ` | jq -r '.[]' | sort -u`);
  }

  if (info.menuItemId === TOOLS.SONAR_TLD) {
    copyToClipboard(`curl -s https://sonar.omnisint.io/tlds/${fqdn}` + ` | jq -r '.[]' | sort -u`);
  }

  if (info.menuItemId === TOOLS.SUBLIST3R) {
    copyToClipboard(`python sublist3r.py -d ${fqdn}`);
  }

  if (info.menuItemId === TOOLS.THEHARVESTER) {
    copyToClipboard(`theHarvester -d "${fqdn}" -b all`);
  }

  if (info.menuItemId === TOOLS.WAYBACKURLS) {
    copyToClipboard(`waybackurls -dates ${fqdn}`);
  }

  if (info.menuItemId === TOOLS.WHOIS) {
    copyToClipboard(`whois ${fqdn}`);
  }

  if (info.menuItemId === TOOLS.CURLHEADER) {
    copyToClipboard(`curl -I ${url}`);
  }

  if (info.menuItemId === TOOLS.FFUF) {
    copyToClipboard(`ffuf -u ${url}` +
      (data.headers?.map(h => ` -H '${h.name}: ${h.value}'`).join('') || '') +
      (data.body ? ' -d ' + encodeBody(data.body) : ''));
  }

  if (info.menuItemId === TOOLS.NMAP) {
    copyToClipboard(`nmap ${base_url}`);
  }

  if (info.menuItemId === TOOLS.SQLMAP) {
    copyToClipboard(`sqlmap -u ${url}` +
      (data.headers?.map(h => ` -H '${h.name}: ${h.value}'`).join('') || '') +
      (data.body ? ' --data ' + encodeBody(data.body) : ''));
  }

  if (info.menuItemId === TOOLS.WAFW00F) {
    copyToClipboard(`wafw00f -v ${url}`);
  }

  if (info.menuItemId === TOOLS.WFUZZ) {
    copyToClipboard(`wfuzz -u ${url}` +
      (data.headers?.map(h => ` -H '${h.name}: ${h.value}'`).join('') || '') +
      (data.body ? ' -d ' + encodeBody(data.body) : ''));
  }

  if (info.menuItemId === TOOLS.WHATWEB) {
    copyToClipboard(`whatweb ${url} -v`);
  }

  if (info.menuItemId === TOOLS.XSSTRIKE) {
    copyToClipboard(`python xsstrike.py -u ${url}` + (data.headers? ` --headers "` : '') +
    (data.headers?.map(h => `${h.name}: ${h.value}\n`).join('').replace(/\n$/,'') || '') + (data.headers?`"` : '') +
    (data.body ? ' --data ' + encodeBody(data.body) : ''));
  }

  if (info.menuItemId === TOOLS.WPSCAN) {
    copyToClipboard(`wpscan --url ${url}` +
      (data.headers?.map(h => ` --headers '${h.name}: ${h.value}'`).join('') || ''));
  }

  if (info.menuItemId === TOOLS.CEWL) {
    copyToClipboard(`cewl ${url} -a -e --with-numbers`);
  }

  if (info.menuItemId === TOOLS.HYDRA) {
    copyToClipboard(`hydra ${base_url} ${protocol_url}-[complete-here] ${path_url}`);
  }

  if (info.menuItemId === TOOLS.TIMEVERTER) {
    copyToClipboard(`python timeverter.py -u ${url}` +
      (data.headers?.map(h => ` -H '${h.name}: ${h.value}'`).join('') || '') +
      (data.body ? ' -d ' + encodeBody(data.body) : ''));
  }
});