const { crawlURL } = require('./crawl.js')

function main(){
    if(process.argv.length < 3){
        console.log('no website provided')
        process.exit(1)
    }
    if(process.argv.length > 3){
        console.log("cannot crawl 2 website");
        process.exit(1);
    }
    const baseUrl = process.argv[2]
    console.log(`crawiling... ${baseUrl}`)
    crawlURL(baseUrl)
}
main()