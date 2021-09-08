"use strict";

const apikey = "7a7abcbbf9e44e459f199a259afc161f";
const city = "Pune";
const api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;
const port = 5000;

const express = require('express');
const requests = require('requests');
const fs = require('fs');

const htmlFile = fs.readFileSync("./index.html", "utf-8");

const replaceData = (html, data) => {
    let replacedFile = html.replace("{% tempval %}", (parseFloat(data.main.temp) - 273.15).toPrecision(4));
    replacedFile = replacedFile.replace("{% tempmin %}", (parseFloat(data.main.temp_min) - 273.15).toPrecision(4));
    replacedFile = replacedFile.replace("{% tempmax %}", (parseFloat(data.main.temp_max) - 273.15).toPrecision(4));
    replacedFile = replacedFile.replace("{% tempStatus %}", data.weather[0].main);
    replacedFile = replacedFile.replace("{% location %}", data.name);
    replacedFile = replacedFile.replace("{% country %}", data.sys.country);
    return replacedFile;
}

const app = express();

app.get('/', (req, res) => {
    requests(api).on('data', (chunk) => {
        const data = JSON.parse(chunk);
        const realData = replaceData(htmlFile, data);
        res.send(`${realData}`);
    })
})

app.listen(port, () => {
    console.log(`Listening at port number ${port}`);
})
