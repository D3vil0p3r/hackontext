# HacKontext - Kontext your Hack Menu! 

![screen_small](https://user-images.githubusercontent.com/83867734/160778726-b5c51c97-531d-4de2-84f7-0a5be2eee3f7.png)

HacKontext allows to inject website information, HTTP headers and body parameters of the active browser tab on specific InfoSec command-line tools in order to improve and speed up their correct usage.

It helps the user to copy and paste headers and any parameters automatically to the tools.

Current tools and services implemented:
* OSINT
  * crt.sh
  * DiG
  * OpenSSL
  * Sonar
  * Sublist3r
  * theHarvester
  * waybackurls
  * WHOIS
* Recon
  * cURL
  * FFUF
  * Nmap
  * SQLMap
  * WafW00f
  * Wfuzz
  * WhatWeb
  * WPScan
  * XSStrike
* Bruteforcing
  * CEWL
  * Hydra
  * TimeVerter

Note that these buttons only work on normal web pages, not special pages like `about:debugging`.

Compatible with Mozilla Firefox, Google Chrome, Microsoft Edge, and Opera browsers.

## Installation

For Mozilla Firefox: https://addons.mozilla.org/it/firefox/addon/hackontext/

For Microsoft Edge: https://microsoftedge.microsoft.com/addons/detail/hackontext/cjhiiflgkijbafcjdppinomiljblhcfb

For Google Chrome: https://chrome.google.com/webstore/detail/hackontext/emkdmncnikokjokffjhnoheobomcmifo

For Opera: https://addons.opera.com/it/extensions/details/hackontext

Please, rate my work on the Extension Web Store.

## Usage

As example, by visiting Arch Linux forum authentication page and selecting “Copy as FFUF”, the clipboard stores the following string:
```
ffuf -u https://bbs/.archlinux.org/login.php?action=in -H ‘Host: bbs.archlinux.org’ -H ‘User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0’ -H ‘Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8’ -H ‘Accept-Language: en-US,en;q=0.5’ -H ‘Accept-Encoding: gzip, deflate, br’ -H ‘Content-Type: application/x-www-form-urlencoded’ -H ‘Content-Length: 176’ -H ‘Origin: https://bbs/.archlinux.org’ -H ‘Connection: keep-alive’ -H ‘Referer: https://bbs/.archlinux.org/login.php’ -H ‘Upgrade-Insecure-Requests: 1’ -H ‘Sec-Fetch-Dest: document’ -H ‘Sec-Fetch-Mode: navigate’ -H ‘Sec-Fetch-Site: same-origin’ -H ‘Sec-Fetch-User: ?1’ -H ‘DNT: 1’ -H ‘Sec-GPC: 1’ -d ‘form_sent=1&redirect_url=https://bbs.archlinux.org/index.php&csrf_token=7b2829f6ea8fbbc02cb3035a025fed10a9d166fb&req_username=usertest&req_password=passtest&login=Login’
```
and the user can edit this string for adding the preferred wordlist and fuzzing parameters for attacking the target.

## Notes

With Manifest V3 I'm having some issues.

The current code works (after moving clipboard functions outside of the service worker (background.js)). The problem is that I noticed that whether I use navigator.clipboard or custom copyToClipboard functions, they both work — but if I go to google.com or another site, refresh the page (by going to the address bar and pressing ENTER), and then click "Copy as FFUF", then refresh again and click "Copy as FFUF" again, etc... for the first few times it copies everything. But at some point, it only copies the tool name and the URL, and no longer the headers and body parameters.

If I’m not mistaken, even if I don’t refresh and just click "Copy as FFUF" many times, at the beginning it gives me the headers and parameters, but at some point it stops including them.

To fix it, you just have to click the browser’s Refresh button with the mouse.

This means it's not really a clipboard issue — which still works — but maybe a problem with SendHeaders and BeforeRequest, which in some cases may not be working.

With Manifest V2, instead, I don’t have any problems.

## Contribution

If you would like to add a new command-line tool for this purpose, please propose your ideas!

Thank you
