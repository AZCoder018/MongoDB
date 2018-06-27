var scrape = require("../scripts/scrape");
var Article = require("../models/Article");

module.exports = {
  fetch: function(callback) {
    scrape(function(data) {

 //Check the date and whether or not to save
      var articlesArr = data;
      for (var i = 0; i < articlesArr.length; i++) {
        articlesArr[i].date = new Date();
        articlesArr[i].saved = false;
        articlesArr[i].note = [];
      }

//Prevent duplicates
        Article.collection.insertMany(articlesArr, { ordered: false }, function(err, docs) {
          callback(err, docs);
        });
    });
  },
  get: function(query, cb) {
    Article.find(query)
      .sort({
        _id: -1
      })
      .exec(function(err, doc) {

  //Send saved articles back to routes for rendering
        cb(doc);
      });
  },
  update: function(query, cb) {

//Save or unsave articles
    Article.update({ _id: query.id }, {
      $set: {saved: query.saved}
    }, {}, cb);
  },
  addNote: function(query, cb) {
    Article.findOneAndUpdate({_id: query.id }, {
      $push: {note: query.note}
    }, {}, cb);
  }
};
