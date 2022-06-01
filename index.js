const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const newspapers = [
    {
        name: 'anadoluajans',
        address: 'https://www.aa.com.tr/',
        base: 'https://www.aa.com.tr/'
    },
    {
        name: 'trt',
        address: 'https://www.trthaber.com/',
        base: 'https://www.trthaber.com'
    },
    {
        name: 'mynet',
        address: 'https://www.bundle.app/gundem',
        base: 'https://www.bundle.app',
    },
    {
        name: 'bbctr',
        address: 'https://www.bbc.com/turkce/',
        base: 'https://www.bbc.com/turkce',
    },
    {
        name: 'iskenderunhaber',
        address: 'https://www.iskenderun.org/',
        base: 'https://www.iskenderun.org',
    },

    {
        name: 'haberaktuel',
        address: 'https://www.haberaktuel.com/',
        base: 'https://www.haberaktuel.com',
    },
    {
        name: 'sondakikahaber',
        address: 'https://www.sondakika.com/',
        base: 'https://www.sondakika.com',
    },
    {
        name: 'haberler.com',
        address: 'https://www.haberler.com/',
        base: 'https://www.haberler.com',
    },

    {
        name: 'sozcu',
        address: 'https://www.sozcu.com.tr/',
        base: 'https://www.sozcu.com.tr'
    },
    {
        name: 'haberturk',
        address: 'https://www.haberturk.com/',
        base: 'https://www.haberturk.com'
    }
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("!")', html).each(function () {
                const title = $(this).text().replace(/\n/g, '').replace(/\t/g, '').trim()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })

        })
})



app.get('/', (req, res) => {
    res.json(articles)
})

app.get('/:newspaperId', (req, res) =>  {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base


    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("!")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT 8000`))

