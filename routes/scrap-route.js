const express = require('express');
const router = express.Router();
const scrap = require('../utils/scrap-utils');


// @route GET api/posts
// @desc Test route
// @access Public

router.post('/', async (req, res) => {

    // URL of the page we want to scrape
    if (req && req.body && (req.body.url || req.body.urls)) {
        const { url, urls } = req.body;
        let data = [];
        if(url){
            const x = await scrap(url);
            data.push(x)
        }
        else if(urls){
            for(i=0; i<urls.length; i++){
                const x = await scrap(urls[i]);
                data.push(x)
            }
        }
        console.log(data)
        res.send(data)
        // res.send(createHtml(data))
    }
    else {
        res.send({ error: "no url provided", status: "failed" })
    }
});

function createHtml(data) {
    return `<!doctype html><html lang="en"><head><meta charset="utf-8" /><meta http-equiv="Pragma" content="no-cache" /><meta http-equiv="Expires" content="0" /><meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no" /><meta name="theme-color" content="#000000" /><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" /><script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" /><link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css"integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossorigin="anonymous" /><link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"  integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" crossorigin="" /><title>Data Scrapper</title></head><body><div id="root"><div class="container"><div class="row"><div class="col-md-12"><div class="col-md-2"><div class="form-group"><label>Retailer:</label></div></div><div class="col-md-4"><div class="form-group"><label>${data.retailer}</label></div></div></div></div><div class="row"><div class="col-md-12"><div class="col-md-2"><div class="form-group"><label>Title:</label></div></div><div class="col-md-4"><div class="form-group"><label>${data.title}</label></div></div></div></div><div class="row"><div class="col-md-12"><div class="col-md-2"><div class="form-group"><label>Description:</label></div></div><div class="col-md-4"><div class="form-group"><label>${data.description}</label></div></div></div></div><div class="row"><div class="col-md-12"><div class="col-md-2"><div class="form-group"><label>Image:</label></div></div><div class="col-md-4"><div class="form-group"><img src="${data.image}" style="width: 100%;"/></div>  </div></div></div></div></div></body></html>`
}

module.exports = router;