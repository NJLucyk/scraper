// This was written to help me grab data for my excel games spreadsheet.
// It's alright.

var urlFormat = {
  N64: "nintendo-64",
  Steam: "pc",
  GOG: "pc",
  PS3: "playstation-3",
  WiiU: "wii-u",
  Wii: "wii",
  '3DS': "3ds",
  PS2: "playstation-2"
}
var Xray = require('x-ray');
var x = Xray().delay(500); // be nice and not scrape a million times at once

// Setup title and their corresponding formats based on some text files i made
var fs = require('fs');
// These files need to correspond and associate with eachother.
var titles = fs.readFileSync('titles.txt').toString().toLowerCase().split("\n");
var formats = fs.readFileSync('formats.txt').toString().trim().split("\n");

// Scrape for description and rating
scrapeMetaCritic(0);


function urlifyTitle(title) {
  var urlTitle = title.trim().replace(/\s+/g, '-');
  urlTitle = urlTitle.replace(/[:'.&]+/g, '');
  return urlTitle;
}

function urilifyFormat(format) {
  return urlFormat[format.trim()];
}

function getURL(title, format) {
  return "http://www.metacritic.com/game/" + urilifyFormat(format) + "/" + urlifyTitle(title);
}

// A lazy way of doing synchronous scraping to ensure the files at the end correspond to eachother and the excel sheet
// Assumes titles and formats are associated arrays
function scrapeMetaCritic(i) {
  if (titles[i] === undefined) return;

  var url = getURL(titles[i], formats[i]);
  
  console.log("Going to: " + url);
  
  x(url, {
    rating: "span[itemprop='ratingValue']",
  })(function(err, obj) {
    var rating = "?";
    if (err) {
      console.error("error: " + err);
    } else {
      if (obj.rating !== undefined) rating = obj.rating;
    }
    fs.appendFileSync('ratings.txt', rating + "\n");

    // Increment loop
    scrapeMetaCritic(i+1);
  });
}