const { JSDOM } = require("jsdom");

async function crawlURL(baseUrl, currentUrl, pages) {
  const baseUrlObj = new URL(baseUrl);
  const currentUrlObj = new URL(currentUrl);
  if (baseUrlObj.hostname !== currentUrlObj.hostname) {
    return pages;
  }

  const normalCurrentUrl = normalURL(currentUrl)
  if(pages[normalCurrentUrl] > 0) {
    pages[normalCurrentUrl]++
    return pages
  }

  pages[normalCurrentUrl] = 1
  console.log(`crawling ${currentUrl}...`);

  try {
    const resp = await fetch(currentUrl);
    if (resp.status > 399) {
      console.log(
        `error in fetch with status cod : ${resp.status} on page : ${currentUrl}`
      );
      return pages;
    }

    const contentType = resp.headers.get("content-type");

    if (!contentType.includes("text/html")) {
      console.log(
        `non html content type : ${contentType} on page : ${currentUrl}`
      );
      return pages;
    }
    const htmlBody = await resp.text()
    const nextUrls = getURL(htmlBody, baseUrl)

    for(const nextUrl of nextUrls){
        pages = crawlURL(baseUrl, nextUrl, pages)
    }
  } catch (error) {
    console.log(
      `error while fetching: ${error.message} on page: ${currentUrl}`
    );
  }
  return pages
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
