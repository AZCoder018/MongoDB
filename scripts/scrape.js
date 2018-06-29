var request = require("request");
var cheerio = require("cheerio");

//Scrape articles from the Daily Wire
var scrape = function(callback) {

var articlesArr = [];
 
    request("https://www.dailywire.com/", function(error, response, html) {

var $ = cheerio.load(html);

      $("h3.f-5").each(function(i, element) {

          var result = {};

          result.title = $(this).children("a").text();
          result.link = $(this).children("a").attr("href");

          if (result.title !== "" && result.link !== "") {
              articlesArr.push(result);
          }
      });
      callback(articlesArr);
  });
};

module.exports = scrape;
