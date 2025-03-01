const { JSDOM } = require('jsdom')

async function crawlURL (currentUrl){
    console.log(`crawling ${currentUrl}...`)

    const resp = await fetch(currentUrl)

    console.log(resp.text())
}

function normalURL(urlString) {
  const urlObj = new URL(urlString);
  const hostPath =  `${urlObj.hostname}${urlObj.pathname}`
  if(hostPath.length > 0 && hostPath.slice(-1) === '/'){
    return hostPath.slice(0, -1)
  }
  return hostPath
}

function getURL(htmlBody, baseURL){
    const urls = [];
    const dom = new JSDOM(htmlBody)
    const linkEls = dom.window.document.querySelectorAll('a')
    for(const linkEl of linkEls){  
        if(linkEl.href.slice(0, 1) === '/'){
            try {
                const urlObj = new URL(`${baseURL}${linkEl.href}`);
                urls.push(`${urlObj.href}`);
            } catch (error) {
                console.log(`invalid url: ${error.message}`)
            }
        }else{
            try {
                const urlObj = new URL(linkEl.href);
                urls.push(`${urlObj.href}`);
            } catch (error) {
                console.log(`invalid url: ${error.message}`)
            }
        }
    }
    return urls
}

module.exports = {
    normalURL,
    getURL,
    crawlURL
}