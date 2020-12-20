$(document).ready(function () {
	$('body').show();
	pageCount = 1;
	const key = '25141123a6896a890d381900b61e2af6';
	let content = [];


	//SEARCH FUNCTION

	let runSearch = (url, y, search) => {

		fetch(url)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				for (let i = 0; i < data.results.length; i++) {

					let imagePath = "https://image.tmdb.org/t/p/w185";

					if (data.results[i].poster_path != null) {
						imagePath += data.results[i].poster_path;
					} else {
						imagePath = "default.png";
					}
					content[i] = {
						genre: data.results[i].genre_ids,
						title: data.results[i].original_title,
						release: data.results[i].release_date,
						vote: data.results[i].vote_average,
						id: data.results[i].id,
						image: imagePath
					}

					$('.display').append(`
				<div class='movie-container col-6 col-sm-4 col-md-3 fade-in' data-id=${content[i].id}>
					<img height='277' class='mx-auto d-block img-fluid' src='${content[i].image}' onerror="this.onerror=null; this.src='default.png'">
					<h4>${content[i].title}</h4>
					<p>${content[i].release}</p>
				</div>
				`);

					imagePath = '';
				}
				if (search) {
					$('.display').append(`<button class="show-more p-2" type="button" data-search='${search}'><span>Show more</span></button>`);
				} else if (y === null) {
					$('.display').append(`<button class="show-more p-2" type="button" data-genre='popular'><span>Show more</span></button>`);


				} else {
					$('.display').append(`<button class="show-more" type="button" data-genre=${y}><span>Show more</span></button>`);

				}
			})
			.catch(err => {
				console.error(err);
			});
	}

	//Discover function - display random/popular movies

	let discoverMovies = () => {

		let url = `https://api.themoviedb.org/3/discover/movie?api_key=${key}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`;
		runSearch(url, null);
	}

	let clear = () => {
		$('.display').empty();
	}

	//Fill start page 
	discoverMovies();


	//Display movies depends on the genre (data-id)
	$('a[data-id]').click(function () {
		$('a').removeClass('active');
		$(this).addClass('active');
		if ($(this).attr('data-id') === "popular") {
			$('.display').show();
			$('.display2').hide();
			clear();
			discoverMovies();
		} else {
			$('.display').show();
			$('.display-2').hide();
			let genre = $(this).attr('data-id');
			let url = `https://api.themoviedb.org/3/discover/movie?api_key=${key}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageCount}&with_genres=${genre}`;
			clear();
			runSearch(url, genre);
		}
	})

	//Show-more button => append movies
	$(document).on('click', '.show-more', function () {

		pageCount++;
		let genre = $(this).attr("data-genre");
		let search = $(this).attr("data-search");

		if (search) {

			url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query='${search}'&page=${pageCount}`;
			$(this).remove();
			runSearch(url, 0, s);
		} else if (genre === 'popular') {
			url = `https://api.themoviedb.org/3/discover/movie?api_key=${key}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageCount}`;


			$(this).remove();
			runSearch(url, null);
		} else if (genre) {
			url = `https://api.themoviedb.org/3/discover/movie?api_key=${key}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageCount}&with_genres=${genre}`;
			$(this).remove();
			runSearch(url, genre);
		}

	});

	//Search input 
	$("form").submit(function (e) {
		e.preventDefault();
		$('.display').show();
		$('.display-2').hide();
		let search = $('.search-input').val();
		console.log(search);
		url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query='${search}'&page=1`;
		clear();
		runSearch(url, 0, search);
	});


	$(document).on('click', '.back', function () {
		$('.display').show();
		$('.display-2').hide();
	})

	$(document).on('click', '.movie-container', function () {
		let filmId = $(this).attr('data-id');
		console.log(filmId);
		url = `https://api.themoviedb.org/3/movie/${filmId}?api_key=${key}&language=en-US`;
		fetch(url)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				imagePath = `https://image.tmdb.org/t/p/w500`;
				console.log(data);
				$('.display').hide();
				$('.display-2').show();

				$('html,body').animate({
					scrollTop: $("#ds-2").offset().top
				}, );

				$('.display-2').html(
					`<div class='col-12 content-size'>
					<button class="back">Back</button>
						<img class='img-fluid' src='${imagePath}${data.poster_path}'>
						<h3>${data.original_title}</h3>
						<p class="center">${data.tagline}</p>
						<p class="center"><strong>${data.vote_average}/10</strong></p><br>
						<p>${data.overview}</p>
					</div>`
				);
			})
	});

	////////////////////////////////////////////








});