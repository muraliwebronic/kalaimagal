const axios = require('axios');
const xml2js = require('xml2js');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Target directory for saving JSON files
const outputDir = path.join(__dirname, 'data');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function scrapeWordPressSitemap() {
    try {
        console.log(`Reading local sitemap.xml...`);
        
        // 1. Fetch the Sitemap
        const sitemapXml = fs.readFileSync('sitemap.xml', 'utf-8');
        const parser = new xml2js.Parser();
        const sitemapData = await parser.parseStringPromise(sitemapXml);

        let urls = [];

        if (sitemapData.sitemapindex) {
            console.log('Sitemap index detected. Please provide the specific page/post sitemap URL instead (e.g., /page-sitemap.xml).');
            return;
        } else if (sitemapData.urlset && sitemapData.urlset.url) {
            urls = sitemapData.urlset.url.map(entry => entry.loc[0]);
        }

        console.log(`Found ${urls.length} URLs in the sitemap.`);

        // 2. Loop through each URL in the sitemap
        for (let i = 0; i < urls.length; i++) {
            const pageUrl = urls[i];
            console.log(`[${i + 1}/${urls.length}] Scraping HTML for: ${pageUrl}`);

            // Generate a safe file name from the URL
            let fileName = pageUrl.replace(/^https?:\/\//, '').replace(/\/$/, '').replace(/[\/\\]/g, '_') || 'home';
            fileName = fileName + '.json';

            try {
                // Fetch the raw HTML of the page
                const pageResponse = await axios.get(pageUrl);
                const $ = cheerio.load(pageResponse.data);

                // SCRAPE THE HTML DIRECTLY
                // This grabs the main heading (usually the page title)
                const pageTitle = $('h1').first().text().trim();
                
                // This grabs all paragraph text on the page and joins it together
                const pageContent = $('p').map((i, el) => $(el).text().trim()).get().join('\n'); 

                // Create the data object
                const pageData = {
                    url: pageUrl,
                    title: pageTitle || 'No Title Found',
                    content: pageContent || 'No Content Found'
                };

                fs.writeFileSync(path.join(outputDir, fileName), JSON.stringify(pageData, null, 2));
                console.log(` -> Successfully scraped data for: ${pageTitle || pageUrl}`);

            } catch (pageError) {
                console.error(` -> Failed to process ${pageUrl}: ${pageError.message}`);
            }

            // Keep the delay so their firewall doesn't block your IP for making too many requests!
            await new Promise(resolve => setTimeout(resolve, 500)); 
        }

        console.log('\nSuccess! All HTML data has been saved.');

    } catch (error) {
        console.error('Error parsing the sitemap:', error.message);
    }
}

// Run the script
scrapeWordPressSitemap();
