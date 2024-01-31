const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require('puppeteer');
const userAgent = require('user-agents');
const httpsProxyAgent = require('https-proxy-agent');
const proxyChain = require('proxy-chain');
const Site = require("../models/site-models");

module.exports = async function (url) {
    // const proxy = { protocol: "http", host: 'proxy.soax.com', port: '9000', auth: { username: "Dt6FnAfCSHWz7cyT", password: "wifi;;" } }
    const proxy = { protocol: "http", host: 'proxy.crawlera.com', port: '8011', auth: { username: "6f17993462664224b3ee09d2624adfec", password: "" } }

    try {

        let siteData = await Site.findOne({ site_url: url });
        if (siteData) {
            console.log("got from db")
            return {
                data: {
                    url: url,
                    brand_name: siteData.brand_name,
                    product_name: siteData.product_name,
                    product_image: siteData.product_image,
                    product_price: siteData.product_price,
                    retailer_name: siteData.retailer_name
                },
                status: "success"
            };
        }

        // Fetch HTML of the page we want to scrape
        const httpsAgent = new httpsProxyAgent.HttpsProxyAgent(`${proxy.protocol}://${proxy.auth.username}:${proxy.auth.password}@${proxy.host}:${proxy.port}`);
        // const httpsAgent = new httpsProxyAgent.HttpsProxyAgent(`Dt6FnAfCSHWz7cyT:wifi;;@proxy.soax.com:9000`);
        const config = {
            headers: {
                "Accept": "application/json",
                'content-encoding': 'gzip, deflate, br'
            },
            // httpsAgent
            proxy
        };
        const { data } = await axios.get(url, config);
        console.log("axios")
        // Load HTML we fetched in the previous line
        let res = await scrapData(data, url);

        if (res.status == "error")
            res = await puppeteerRequest(url, proxy);

        return res;
    } catch (err) {
        // console.log(err)
        return await puppeteerRequest(url, proxy);
    }
}

async function puppeteerRequest(url, proxy) {
    try {
        const newProxyUrl = await proxyChain.anonymizeProxy(`${proxy.protocol}://${proxy.auth.username}:${proxy.auth.password}@${proxy.host}:${proxy.port}`);
        const browser = await puppeteer.launch(
            // {
            //     args: [
            //         `--proxy-server=${proxy.protocol}://${proxy.host}:${proxy.port}`,
            //         `--proxy-auth=${proxy.auth.username}:`
            //     ]
            // }
            // {
            //     args: [`--proxy-server=${proxy.protocol}://${proxy.auth.username}:${proxy.auth.password}@${proxy.host}:${proxy.port}`],
            // }
        );
        // Create a new page
        const page = await browser.newPage();
        // await page.authenticate({ username: proxy.auth.username, password: proxy.auth.password });
        await page.setUserAgent(userAgent.random().toString())
            +

            // Navigate to the URL
            await page.goto(url);

        let data = await page.content();
        console.log("puppeteer")
        browser.close();
        return scrapData(data, url);
    } catch (error) {
        console.error(error);
        return { error: error, status: "failed" };
    }
}

async function scrapData(data, url) {
    // Load HTML we fetched in the previous line
    const $ = cheerio.load(data);

    // Select all the list items in plainlist class
    const retailer = $("meta[name='application-name']").attr("content") || $("meta[name='og:site_name']").attr("content") || $("meta[name='site_name']").attr("content") || $("meta[property='og:site_name']").attr("content") || $("meta[property='site_name']").attr("content") || "";
    const title = $("meta[name='og:title']").attr("content") || $("meta[name='title']").attr("content") || $("meta[property='og:title']").attr("content") || $("meta[property='title']").attr("content") || $("meta[property='titles']").attr("content") || $("meta[property='og:titles']").attr("content") || "";
    const description = $("meta[name='og:description']").attr("content") || $("meta[name='description']").attr("content") || $("meta[property='og:description']").attr("content") || $("meta[property='description']").attr("content") || "";
    const image = $("meta[name='og:image']").attr("content") || $("meta[name='image']").attr("content") || $("meta[property='og:image']").attr("content") || $("meta[property='image']").attr("content") || "";
    let urlretailer = "";
    if (url && url.split("www.") && url.split("www.").length && url.split("www.")[1] && url.split("www.")[1].split(".com") && url.split("www.")[1].split(".com").length && url.split("www.")[1].split(".com")[0]) {
        urlretailer = url.split("www.")[1].split(".com")[0];
    }

    // if (title && retailer && image) {
    //     const siteData = new Site({
    //         product_image: [image], brand_name: "", product_name: title, product_price: "", retailer_name: (retailer || urlretailer), site_url: url
    //     })
    //     await siteData.save()
    // }
    return {
        data: {
            url: url,
            brand_name: "",
            product_name: title,
            product_image: [image],
            product_price: "",
            retailer_name: retailer || urlretailer
        },
        status: (title || image || retailer) ? "success" : "error"
    };
}