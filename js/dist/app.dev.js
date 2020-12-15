"use strict";

$(document).ready(function () {
  $('body').show();
  pageCount = 1;
  var configData = null;
  var key = '25141123a6896a890d381900b61e2af6';
  var content = []; //SEARCH FUNCTION

  var runSearch = function runSearch(url, y, search) {
    fetch(url).then(function (response) {
      return response.json();
    }).then(function (data) {
      console.log(data.results.length);
      console.log(data);

      for (var i = 0; i < data.results.length; i++) {
        var _imagePath = "http://image.tmdb.org/t/p/w185";

        if (data.results[i].poster_path != null) {
          _imagePath += data.results[i].poster_path;
        } else {
          _imagePath = "default.png";
        }

        content[i] = {
          genre: data.results[i].genre_ids,
          title: data.results[i].original_title,
          release: data.results[i].release_date,
          vote: data.results[i].vote_average,
          id: data.results[i].id,
          image: _imagePath
        };
        $('.display').append("\n\t\t\t\t<div class='movie-container col-6 col-sm-4 col-md-3 fade-in' data-id=".concat(content[i].id, ">\n\t\t\t\t\t<img height='277' class='mx-auto d-block img-fluid' src='").concat(content[i].image, "' onerror=\"this.onerror=null; this.src='default.png'\">\n\t\t\t\t\t<h4>").concat(content[i].title, "</h4>\n\t\t\t\t\t<p>").concat(content[i].release, "</p>\n\t\t\t\t</div>\n\t\t\t\t"));
        _imagePath = '';
      }

      if (search) {
        $('.display').append("<button class=\"show-more p-2\" type=\"button\" data-search='".concat(search, "'><span>Show more</span></button>"));
      } else if (y === null) {
        $('.display').append("<button class=\"show-more p-2\" type=\"button\" data-genre='popular'><span>Show more</span></button>");
      } else {
        $('.display').append("<button class=\"show-more\" type=\"button\" data-genre=".concat(y, "><span>Show more</span></button>"));
      }
    })["catch"](function (err) {
      console.error(err);
    });
  }; //Discover function - display random/popular movies


  var discoverMovies = function discoverMovies() {
    var url = "https://api.themoviedb.org/3/discover/movie?api_key=".concat(key, "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1");
    runSearch(url, null);
  };

  var clear = function clear() {
    $('.display').empty();
  };

  discoverMovies(); //fill start page 
  //Display movies depends on the genre (data-id)

  $('a[data-id]').click(function () {
    $('a').removeClass('active');
    $(this).addClass('active');

    if ($(this).attr('data-id') === "popular") {
      $('.display').show();
      $('.display2').hide();
      pageCount = 1;
      clear();
      discoverMovies();
    } else {
      $('.display').show();
      $('.display-2').hide();
      pageCount = 1;
      var x = $(this).attr('data-id');
      var y = "https://api.themoviedb.org/3/discover/movie?api_key=".concat(key, "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=").concat(pageCount, "&with_genres=").concat(x);
      clear();
      runSearch(y, x);
    }
  }); //Show-more button => append movies

  $(document).on('click', '.show-more', function () {
    pageCount++;
    var g = $(this).attr("data-genre");
    var s = $(this).attr("data-search");
    console.log(s);

    if (s) {
      console.log("dzialam");
      url = "https://api.themoviedb.org/3/search/movie?api_key=".concat(key, "&query='").concat(s, "'&page=").concat(pageCount);
      $(this).remove();
      runSearch(url, 0, s);
    } else if (g === 'popular') {
      url = "https://api.themoviedb.org/3/discover/movie?api_key=".concat(key, "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=").concat(pageCount);
      $(this).remove();
      runSearch(url, null);
    } else if (g) {
      url = "https://api.themoviedb.org/3/discover/movie?api_key=".concat(key, "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=").concat(pageCount, "&with_genres=").concat(g);
      $(this).remove();
      runSearch(url, g);
    }
  }); //Search input 

  $("form").submit(function (e) {
    e.preventDefault();
    $('.display').show();
    $('.display-2').hide();
    var search = $('.search-input').val();
    console.log(search);
    url = "https://api.themoviedb.org/3/search/movie?api_key=".concat(key, "&query='").concat(search, "'&page=1");
    clear();
    runSearch(url, 0, search);
  });
  $(document).on('click', '.back', function () {
    $('.display').show();
    $('.display-2').hide();
  });
  $(document).on('click', '.movie-container', function () {
    var o = $(this).attr('data-id');
    console.log(o);
    url = "https://api.themoviedb.org/3/movie/".concat(o, "?api_key=").concat(key, "&language=en-US");
    fetch(url).then(function (response) {
      return response.json();
    }).then(function (data) {
      imagePath = "http://image.tmdb.org/t/p/w500";
      console.log(data);
      $('.display').hide();
      $('.display-2').show();
      $('html,body').animate({
        scrollTop: $("#ds-2").offset().top
      });
      $('.display-2').html("<div class='col-12 content-size'>\n\t\t\t\t\t<button class=\"back\">Back</button>\n\t\t\t\t\t\t<img class='img-fluid' src='".concat(imagePath).concat(data.poster_path, "'>\n\t\t\t\t\t\t<h3>").concat(data.original_title, "</h3>\n\t\t\t\t\t\t<p class=\"center\">").concat(data.tagline, "</p>\n\t\t\t\t\t\t<p class=\"center\"><strong>").concat(data.vote_average, "/10</strong></p><br>\n\t\t\t\t\t\t<p>").concat(data.overview, "</p>\n\t\t\t\t\t</div>"));
    });
  }); ////////////////////////////////////////////
});