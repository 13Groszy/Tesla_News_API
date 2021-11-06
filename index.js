const PORT = process.env.PORT || 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const source = [
    {
        name: 'thetimes',
        address:'https://www.thetimes.co.uk/business',
        base: ''
    },
    {
        name: 'guardian',
        address:'https://www.theguardian.com/business/stock-markets',
        base: ''
    },{
        name: 'telegraph',
        address:'https://www.telegraph.co.uk/investing',
        base:'https://www.telegraph.co.uk'
    },
    {
        name: 'nytimes',
        address: 'https://www.nytimes.com/search?query=tesla',
        base: 'https://www.nytimes.com'
    },
    {
        name: 'bbc',
        address: 'https://www.bbc.co.uk/news',
        base: 'https://www.bbc.co.uk'
    },
    {
        name: 'nypost',
        address: 'https://nypost.com/search/tesla/',
        base: ''
    },
    {
        name: 'dailymail',
        address: 'https://www.dailymail.co.uk/money/index.html',
        
        base: 'https://dailymail.co.uk'
    },
    {
        name: 'cityam',
        address: 'https://www.cityam.com/latest-news/',
        base: ''
    },
    {
        name: 'sydneymh',
        address: 'https://www.smh.com.au/business/banking-and-finance',
        base: 'https://www.smh.com.au'
    },
    {
        name: 'standard',
        address: 'https://www.standard.co.uk/business',
        base: 'https://www.standard.co.uk'
    },
    {
        name: 'thesun',
        address: 'https://www.thesun.co.uk/money/',
        base: ''
    },
    {
        name:'yahoo',
        address:'https://uk.finance.yahoo.com',
        base: 'https://uk.finance.yahoo.com'
    },
    {
        name:'google',
        address:'https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx1YlY4U0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US%3Aen',
        base: 'https://news.google.com'
    },
    {
        name:'huffpost',
        address:'https://www.huffpost.com/life/money',
        base:''
    },
    {
        name:'cnn',
        address:'https://edition.cnn.com/business/investing',
        base:'https://edition.cnn.com'
    },
    {
        name:'foxbusiness',
        address:'https://www.foxbusiness.com',
        base:'https:'
    },
    {
        name:'foxnews',
        address:'https://www.foxnews.com/#',
        base:''
    },
    {
        name:'nbcnews',
        address:'https://www.nbcnews.com',
        base:''
    },
    {
        name:'washingtonpost',
        address:'https://www.washingtonpost.com/business/',
        base:''
    }
]
const articles = [];
source.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data.toLowerCase();
            const $ = cheerio.load(html);
            $('a:contains("tesla")', html).each(function () {
                const title = $(this).text();
                const url = $(this).attr('href');

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })
        })
})
app.get('/', (req, res) =>{
    res.json('Welcome to Tesla News API')
})
app.get('/news', (req, res) =>{
    res.json(articles)
})
app.get('/news/:newspaperId',(req, res) =>{
    const newspaperId = req.params.newspaperId;

    const newspaperAddress = source.filter(newspaper => newspaper.name == newspaperId)[0].address;
    const newspaperBase = source.filter(newspaper => newspaper.name == newspaperId)[0].base;

    
    axios.get(newspaperAddress)
        .then(response =>{
            const html = response.data.toLowerCase();
            const $ = cheerio.load(html);
            const specificArticles = [];

            $('a:contains("tesla")', html).each(function(){
                const title = $(this).text();
                let url = $(this).attr('href');
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles.filter((v,i,a)=>a.findIndex(t=>(JSON.stringify(t) === JSON.stringify(v)))===i)
                )
        }).catch(err => console.log(err))
})
app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));