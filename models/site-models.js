const mongoose = require("mongoose");

const SiteSchema = new mongoose.Schema({
    site_url: {
        type: String
    },
    brand_name: {
        type: String
    },
    product_name: {
        type: String
    },
    product_price: {
        type: String
    },
    retailer_name: {
        type: String
    },
    product_image: [{
        type: String
    }]
})

module.exports = Site = mongoose.model("SiteData", SiteSchema);