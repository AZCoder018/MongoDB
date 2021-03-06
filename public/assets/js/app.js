$(document).ready(function() {
  var winwidth = $(window).width();
  $("img.main-img").attr({
      width: winwidth
  });
  $(window).bind("resize", function() {
      var winwidth = $(window).width();
      $("img.main-img").attr({
          width: winwidth
      });
  });
  $(".scrape").click(function(event) {
      event.preventDefault();
      $.get("/api/fetch").then(function(data) {
          $(".articles").remove();
          $.get("/").then(function(){
              bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>", function(result) {
                location.reload()
              });
          });
      });
  });
  $(".save-article").click(function() {
      var articleToSave = {};
      articleToSave.id = $(this).data("id");
      articleToSave.saved = true;
      $.ajax({
          method: "PATCH",
          url: "/api/articles",
          data: articleToSave
      }).then(function(data) {
          location.reload();
      });
  });
  $(".removeSaved").click(function() {
      var articleToremoveSaved = {};
      articleToremoveSaved.id = $(this).data("id");
      articleToremoveSaved.saved = false;
      $.ajax({
          method: "PATCH",
          url: "/api/articles",
          data: articleToremoveSaved
      }).then(function(data) {
          location.reload();
      }); 
  });
}); 
