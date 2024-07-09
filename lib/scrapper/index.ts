import axios from 'axios';
import * as cherrio from 'cheerio';
import { extractPrice,extractCurrency, extractDescription, getLowestPrice } from '../utils';

export async function scrapeAmazonProduct(url: string){
    if(!URL) return;
    // curl --proxy brd.superproxy.io:22225 --proxy-user brd-customer-hl_ce156c46-zone-web_unlocker1:rj0pqash5drj -k \"http://geo.brdtest.com/mygeo.json\
    const username = String(process.env.BRIGHT_DATA_USERNAME);
    const password = String(process.env.BRIGHT_DATA_PASSWORD);
    const port = 22225;
    const session_id=(1000000 * Math.random()) | 0;
    const options = {
        auth: {
            username: `${username}-session-${session_id}`,
            password,
        },
        host : 'brd.superproxy.io',
        port,
        rejectUnauthorized: false,
    }

    try{
        const response = await axios.get(url, options);
        const $ = cherrio.load(response.data);

        const title = $('#productTitle').text().trim();
        const currentPrice = extractPrice(
            $('.priceToPay span.a-price-whole'),
            $('a.size.base.a-color-price'),
            $('.a-button-selected .a-color-base'),
            $('.a-price.a-text-price'),
            $('span.a-price-whole')
        );

        const originalPrice = extractPrice(

            $('.a-price.a-text-price span.a-offscreen')
        )

        const outOfStock = $('#availability span').text().trim().toLocaleLowerCase().substring(0, 21)
        ==='currently unavailable';

        const images = 
            $('#imgBlkFont').attr('data-a-dynamic-image') ||
            $('#landingImage').attr('data-a-dynamic-image') ||
            '{}';

        const imageURLs = Object.keys(JSON.parse(images));

        const currency = extractCurrency($('span.a-price-symbol'));

        const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, '');

        const description = extractDescription($)
        const data = {
            url,
            currency: currency || '$',
            image: imageURLs[0],
            title,
            currentPrice: Number(currentPrice) || Number(originalPrice),
            originalPrice: Number(originalPrice) || Number(currentPrice),
            priceHistory: [],
            discountRate: Number(discountRate),
            category: 'category',
            reviewsCount: 100,
            stars: 4.5,
            isOutOfStock: outOfStock,
            description,
            lowestPrice: Number(currentPrice) || Number(originalPrice),
            highestPrice: Number(originalPrice) || Number(currentPrice),
            averagePrice: Number(currentPrice) || Number(originalPrice),
        }

        return data;
    }catch(error: any){
        throw new Error(`Failed to scrape product: ${error}.message`)
    }

}