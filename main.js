const axios = require('axios')
const cheerio = require('cheerio')
const util = require('util')

async function getMenu() {
    const response = await axios.get('https://app.qrpro.io/q/900f6a', { headers: { 'accept-language': 'en-US,en;q=0.8' } })
    const html = response.data
    const $ = cheerio.load(html)

    const categories = $('section.categoria').map((index, element) => {
        const category = {}
        category.name = $(element).find('h5').text()
        category.description = $(element).find('p').text()
        // console.log($(element).find('div.categoria:has(section.categoria ~)').html())
        return category
    }).get()

    const subCategories = $('div.categoria').map((index, element) => {
        const subCategory = {}
        subCategory.name = $(element).find('h4').text()
        subCategory.description = $(element).find('p.text-start').text().trim()
        subCategory.products = getProducts($, $(element).find('.col-md-6'))
        subCategory.category = $(element).find('section.categoria:has(~ div.categoria)').find('h5').text()
        return subCategory
    }).get()
    // console.log($('.list_menu').find('div.categoria:has(.categoria ~)').html())
    // console.log(util.inspect(subCategories[36], { depth: null }))
    // return menu

    const groups = []
    console.log($($($('.list_menu')[0]).children()[0]).nextUntil('section.categoria').html())
    $($('.list_menu')[0]).children().each((index, element) => {
        const x = $(element).nextUntil('section').html()
        // console.log(x)
    })

}

const getProducts = ($, productsSelector) => {
    return productsSelector.map((index, element) => {
        const product = {}
        product.name = $(element).find('h3').text()
        product.description = $(element).find('p:first').text().trim()
        product.price = $(element).find('strong').text()
        return product
    }).get()
}

getMenu()