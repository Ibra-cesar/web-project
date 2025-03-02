const { crawlURL } = require("./crawl.js");
const { printReport } = require("./list.js");

async function main() {
  if (process.argv.length < 3) {
    console.log("no website provided");
  }
  if (process.argv.length > 3) {
    console.log("cannot crawl 2 website");
  }
  const baseUrl = process.argv[2];

  console.log(`crawiling... ${baseUrl}`);
  const pages = await crawlURL(baseUrl, baseUrl, {});

  printReport(pages)
}
main();
