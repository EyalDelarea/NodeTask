const fetch = require("node-fetch");

module.exports = populateArray = (peopleArray, allActorsQuery, hashMap) => {
  let moviesList = [];
  peopleArray.forEach((person, index) => {
    const query = person.actorsName.replaceAll(" ", "+");
    fetch(
      "https://api.themoviedb.org/3/search/person?api_key=" +
        process.env.API_KEY +
        "&language=en-US&query=" +
        query +
        "&include_adult=false"
    )
      .then((ans) => ans.json())
      .then((json) => {
        moviesList = [];
        try {
          const knownFor = json.results[0].known_for;
          knownFor.forEach((element) => {
            //validate movie is on the list
            if (!!hashMap.get(element.id)) {
              moviesList.push(element.title);
            }
          });
        } catch (e) {
          console.log(e);
        }
      })
      .then(() => {
        allActorsQuery.push({
          actorsName: person.actorsName,
          movies: moviesList,
        });
      })
      .then(() => {
        if (index === peopleArray.length - 1) {
          // res.send(allActorsQuery);
          return allActorsQuery;
        }
      });
  });
};

module.exports = array = (moviesArray, peopleMap, actorsRolesMap) => {
  moviesArray.forEach((movie, index) => {
    fetch(
      "https://api.themoviedb.org/3/movie/" +
        movie.movieID +
        "/credits?api_key=" +
        process.env.API_KEY +
        "&language=en-US"
    )
      .then((res) => res.json())
      .then((json) => {
        try {
          json.cast.forEach((cast) => {
            const actor = cast.name.toLowerCase();
            const chacters = cast.character.toLowerCase().split("/");

            if (peopleMap.has(actor)) {
              if (actorsRolesMap.has(actor)) {
                const listedChars = actorsRolesMap.get(actor);

                listedChars.forEach((item) => {
                  const duplicateTest = !chacters.find((search) => {
                    search === item;
                  });

                  if (!duplicateTest) {
                    listedChars.push(chacters);
                  }
                });

                actorsRolesMap.set(actor, listedChars);
              } else {
                //singel value
                actorsRolesMap.set(actor, chacters);
              }
            }
          });
        } catch (e) {
          
        }
      })
      .then(() => {
        if (index === moviesArray.length - 1) {
          return;
        }
      });
  });
};
