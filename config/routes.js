var scrape = require("../scripts/scrape");
var Article = require("../models/Article");
var Note = require("../models/Note");
var articlesController = require("../controllers/articles");

module.exports = function(router) {

router.get("/", function(req, res) {
    Article.find({saved: false}, function(error, found) {
        if (error) {
         console.log(error);
        } else if (found.length === 0) {
         res.render("empty")
        } else {
            var hbsObject = {
            articles: found
        };
            res.render("index", hbsObject);
        }
    });
  });

router.get("/api/fetch", function(req, res) {
    
//Scrapes articles and saves to database; lets user know if there are new articles or not
    articlesController.fetch(function(err, docs) {
        if (!docs || docs.insertedCount === 0) {
            res.json({message: "No new articles today. Check back tomorrow!"});
        }
        else {
            res.json({message: "Added " + docs.insertedCount + " new articles!"});
          }
      });
  });

  router.get("/saved", function(req, res) {
      articlesController.get({saved: true}, function(data) {
          var hbsObject = {
            articles: data
          };
          res.render("saved", hbsObject);
      });
  });

//Save or unsave articles
  router.patch("/api/articles", function(req, res) {
      articlesController.update(req.body, function(err, data) {
          res.json(data);
      });
  });

//Query to find matching id; populate notes associated with id; execute query
  router.get('/notes/:id', function (req, res) {
      Article.findOne({_id: req.params.id})
          .populate("note") 
          .exec(function (error, doc) { 
              if (error) console.log(error);
              else {
                  res.json(doc);
            }
        });
  });

//Save new Note to db
  router.post('/notes/:id', function (req, res) {
      var newNote = new Note(req.body);
      newNote.save(function (err, doc) {
          if (err) console.log(err);
          Article.findOneAndUpdate(
//Find the _id by req.params.id; push to notes array
            {_id: req.params.id}, 
            {push: {note: doc._id}}, 
            {new: true},
              function(err, newdoc){
                  if (err) console.log(err);
                  res.send(newdoc);
          });
      });
  });

router.get('/deleteNote/:id', function(req, res){
    Note.remove({"_id": req.params.id}, function(err, newdoc){
        if(err) console.log(err);
          
//Need to redirect to reload page
          res.redirect('/saved'); 
      });
  });

};
