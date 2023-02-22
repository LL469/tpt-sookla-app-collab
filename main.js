const puppeteer = require('puppeteer');
const fs = require('fs');

const express = require('express')
const app = express()
const port = 5000

app.get('/', (req, res) => {
    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
      
        await page.goto('https://www.tptlive.ee/sookla');
      
        await page.setViewport({width: 1080, height: 1024});
      
        let date = await page.evaluate(() => document.querySelector('body > div.wrapper > div.inline > div > div > div > div.row > div > article > div.row > div.col-7.sm-12 > div.sm-hide > h3:nth-child(4) > strong').textContent)
        let value = await page.evaluate(() => document.querySelector('body > div.wrapper > div.inline > div > div > div > div.row > div > article > div.row > div.col-7.sm-12 > div.sm-hide > p:nth-child(5)').textContent)
    
        // fs.writeFileSync('foodList.txt', foodListElement, 'utf8')
    
        var weekDays = [
            'Esmaspäev',
            'Teisipäev',
            'Kolmapäev',
            'Neljapäev',
            'Reede',
            'Laupäev',
            'Pühapäev'
        ]
    
        // value = value.slice(0, 231)
    
    
        for(var i = weekDays.length - 1; i >= 0; i--) {
            if(value.indexOf(weekDays[i]).toString() == -1){
                weekDays.splice(i, 1)
            }
        }
    
        var data = {
            "date": date,
            "food": []
        }
        for(var i = 0; i < weekDays.length; i++) {
            var endPoint
            if(i == weekDays.length - 1){
                endPoint = value.length
            } else {
                endPoint = value.indexOf(weekDays[i+1])
            }
    
            var day = value.substring(value.indexOf(weekDays[i]), endPoint)
            data.food.push({
                "displayName": weekDays[i],
                "foodArray": day.substring(weekDays[i].length, day.length).trim().replaceAll("\t", "").split("\n"),
                "raw": day.substring(weekDays[i].length, day.length).trim().replaceAll("\t", "")
            })
        }
    
        await browser.close();
        
        if(data.food.length == 0){
            res.json({
                "status": "no food",
            })
        } else {
            res.json(data)
        }

    })();
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
