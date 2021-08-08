const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();
const data = require("./Data/data");
const PORT = 5000;
const app = express();

const map = new Map();
const allActorsQuery = [];
let moviesList = [];

app.get("/actors", async (req, res, next) => {
    res.send(allActorsQuery);
});

app.get("/actors/:name", async (req, res, next) => {
    const filterdArray = allActorsQuery.filter((item) =>
        item.actorsName.toLowerCase().includes(req.params.name.toLowerCase())
    );
    res.send(filterdArray);
});

app.listen(PORT, () => {
    console.log("Server is runing on port ", PORT);
    initHashMap();
    populateArray();
});

const populateArray = () => {
    data.people.forEach((person, index) => {
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
                        if (!!map.get(element.id)) {
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
                if (index === data.people.length - 1) {
                    // res.send(allActorsQuery);
                    return allActorsQuery;
                }
            });
    });
};
const initHashMap = () => {
    data.movies.forEach((item) => {
        map.set(item.movieID, item.movieName);
    });
};
