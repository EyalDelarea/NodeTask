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
  try {
    networkTasks.fetchActorsData(data.people, allActorsQuery, map);
    networkTasks.fetchMoviesData(data.movies, peopleMap, actorsRolesMap);
  } catch (e) {
    console.log(e);
  }
  console.log("Server is runing on port ", PORT);
});

app.get("/", function (req, res) {
  var path = __dirname + "/README.md";
  var file = fs.readFileSync(path, "utf8");

  res.send(file.toString());
});
app.get("/actors", (req, res) => {
  res.send(allActorsQuery);
});

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

const initHashMap = () => {
  data.movies.forEach((item) => {
    map.set(item.movieID, item.movieName);
  });
  data.people.forEach((person) => {
    peopleMap.set(person.actorsName.toLowerCase(), true);
  });
};
