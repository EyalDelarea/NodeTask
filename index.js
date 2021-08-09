const express = require("express");
require("dotenv").config();
const data = require("./Data/data");
const populateArray = require("./Data/networkFunction");
const PORT = 5000;
const fetch = require("node-fetch");
const app = express();

const allActorsQuery = [];
const map = new Map();
const peopleMap = new Map();
const actorsRolesMap = new Map();

app.get("/actors", async (req, res) => {
    res.send(allActorsQuery);
});

app.get("/morethanone", async (req, res) => {
    const moreThanOneMovie = [];
    actorsRolesMap.forEach((item, key) => {
        if (!!item[1]) {
            moreThanOneMovie.push(key);
        }
    });
    res.send(moreThanOneMovie);
});

app.get("/actors/:name", async (req, res) => {
    const filterdArray = allActorsQuery.filter((item) =>
        item.actorsName.toLowerCase().includes(req.params.name.toLowerCase())
    );
    res.send(filterdArray);
});

app.get("/actingcollision", async (req, res) => {
    const rolesMap = new Map();
    let ansArray = [];

    actorsRolesMap.forEach((value, key) => {
        value.forEach((n) => {
            if (!rolesMap.get(n)) {
                rolesMap.set(n, key);
            } else {
                ansArray.push(key);
            }
        });
    });
    if (!ansArray[0]) {
        ansArray.push("No values found");
    }
    res.send(ansArray);
});

app.listen(PORT, () => {
    console.log("Server is runing on port ", PORT);
    initHashMap();
    populateArray(data.people, allActorsQuery, map);
    array(data.movies, peopleMap, actorsRolesMap);
});

const initHashMap = () => {
    data.movies.forEach((item) => {
        map.set(item.movieID, item.movieName);
    });
    data.people.forEach((person) => {
        peopleMap.set(person.actorsName.toLowerCase(), true);
    });
};
