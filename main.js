const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')

async function getMenu() {
    const response = await axios.get('https://app.qrpro.io/q/900f6a', { headers: { 'accept-language': 'en-US,en;q=0.8' } })
    const html = response.data
    const $ = cheerio.load(html)

    const categories = getCategories($, $('section.categoria'))

    const menu = { categories }

    fs.writeFileSync('menu.json', JSON.stringify(menu))
    return JSON.stringify(menu)
}

const getCategories = ($, categoriesSelector) => {
    return categoriesSelector.map((index, element) => {
        const category = {}
        category.name = $(element).find('h5').text()
        category.description = $(element).find('p').text()
        category.subCategories = getSubcategories($, $(element).nextUntil('section'))
        return category
    }).get()
}

const getSubcategories = ($, subCategoriesSelector) => {
    return subCategoriesSelector.map((index, element) => {
        const subCategory = {}
        subCategory.name = $(element).find('h4').text()
        subCategory.description = $(element).find('p.text-start').text().trim()
        subCategory.products = getProducts($, $(element).find('.col-md-6'))
        return subCategory
    }).get()
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