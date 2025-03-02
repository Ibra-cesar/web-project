const { JSDOM } = require("jsdom");

async function crawlURL(baseURL, currentURL, pages) {
  const currentUrlObj = new URL(currentURL);
  const baseUrlObj = new URL(baseURL);
  if (currentUrlObj.hostname !== baseUrlObj.hostname) {
    return pages;
  }

  const normalizeURL = normalURL(currentURL);
  if (pages[normalizeURL] > 0) {
    pages[normalizeURL]++;
    return pages;
  }

  pages[normalizeURL] = 1;
  console.log(`crawling on: ${currentURL}`);

  let htmlBody = "";
  try {
    const response = await fetch(currentURL);
    if (response.status > 399) {
      console.log(`HTTP error, status code: ${response.status}`);
      return pages;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.log(`no HTML response: ${contentType}`);
      return pages;
    }
    htmlBody = await response.text();
  } catch (err) {
    console.log(err.message);
  }

  const nextURLs = getURL(htmlBody, baseURL);
  for (const nextURL of nextURLs) {
    pages = await crawlURL(baseURL, nextURL, pages);
  }
  return pages;
}

function normalURL(urlString) {
  const urlObj = new URL(urlString);
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
  if (hostPath.length > 0 && hostPath.slice(-1) === "/") {
    return hostPath.slice(0, -1);
  }
  return hostPath;
}

function getURL(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkEls = dom.window.document.querySelectorAll("a");
  for (const linkEl of linkEls) {
    if (linkEl.href.slice(0, 1) === "/") {
      try {
        const urlObj = new URL(`${baseURL}${linkEl.href}`);
        urls.push(`${urlObj.href}`);
      } catch (error) {
        console.log(`invalid url: ${error.message}`);
      }
    } else {
      try {
        const urlObj = new URL(linkEl.href);
        urls.push(`${urlObj.href}`);
      } catch (error) {
        console.log(`invalid url: ${error.message}`);
      }
    }
  }
  return urls;
}

module.exports = {
  normalURL,
  getURL,
  crawlURL,
};
