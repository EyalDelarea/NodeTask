const express = require("express");
const data = require("./Data/data");
const networkTasks = require("./Data/networkFunction");
require("dotenv").config();
fs = require("fs");

const PORT = 8080;
const app = express();
const allActorsQuery = [];
const map = new Map();
const peopleMap = new Map();
const actorsRolesMap = new Map();

app.listen(PORT, () => {
  initHashMap();
  //Make network requests to the API
  try {
    networkTasks.fetchActorsData(data.people, allActorsQuery, map);
    networkTasks.fetchMoviesData(data.movies, peopleMap, actorsRolesMap);
  } catch (e) {
    console.log(console.log("There was an error during API calls " + e));
  }
  console.log("Server is runing on port ", PORT);
});

/**
 * Default path - show README file with instructions how to use the site
 */
app.get("/", function (req, res) {
  var path = __dirname + "/README.md";
  var file = fs.readFileSync(path, "utf8");

  res.send(file.toString());
});


app.get("/actors", (req, res) => {
  res.send(allActorsQuery);
});

/**
 * Returing listing which have more than one item from the actorsRoleMap
 * meaning they are acting in more than one movie
 */
app.get("/morethanone", (req, res) => {
  const moreThanOneMovie = [];
  actorsRolesMap.forEach((item, key) => {
    if (!!item[1]) {
      moreThanOneMovie.push(key);
    }
  });
  res.send(moreThanOneMovie);
});

app.get("/actors/:name", (req, res) => {
  const filterdArray = allActorsQuery.filter((item) =>
    item.actorsName.toLowerCase().includes(req.params.name.toLowerCase())
  );
  res.send(filterdArray);
});

/**
 * Searching for same actors who played the same role
 * building a hashmap with role -> actor key value pairs
 * if we have value with more than one actor,push it to ansArray.
 */

app.get("/actingcollision", (req, res) => {
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

/**
 * Initializing hashMaps for later use by the tasks
 */
const initHashMap = () => {
  data.movies.forEach((item) => {
    map.set(item.movieID, item.movieName);
  });
  data.people.forEach((person) => {
    peopleMap.set(person.actorsName.toLowerCase(), true);
  });
};
