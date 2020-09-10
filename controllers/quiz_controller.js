const express = require("express");
const db = require("../models");
const passport = require("../config/passport");
const axios = require("axios");

const router = express.Router();

router.get("/quiz/15", (req, res) => {
  db.Question.findAll({
    include: [db.Answer]
  }).then(dbQuestion => {
    const resultsJSON = dbQuestion.map(result => {
      return result.toJSON();
    });

    // console.log("\x1b[33m%s\x1b[0m", resultsJSON); //yellow
    res.render("quiz", { trivia: resultsJSON });
  });

  //   const quizURL = `https://opentdb.com/api.php?amount=10&category=${req.params.id}&difficulty=easy&type=multiple`;

  //   axios.get(quizURL).then(results => {
  //     console.log("results: ", results);
});

router.get("/api/categories", (req, res) => {
  db.Category.findAll({}).then(dbCategory => {
    res.json(dbCategory);
  });
});

router.post("/api/newScore", (req, res) => {
  db.Score.create(req.body).then(dbScore => {
    res.json(dbScore);
  });
});

router.get("/api/scores", (req, res) => {
  db.Score.findAll({
    include: [db.Category, db.User]
  }).then(dbScore => {
    res.json(dbScore);
  });
});
g;
router.post("/api/signup", (req, res) => {
  db.User.create({
    email: req.body.email,
    password: req.body.password
  })
    .then(() => {
      res.redirect(307, "/api/login");
    })
    .catch(err => {
      res.status(401).json(err);
    });
});

router.post("/api/login", passport.authenticate("local"), (req, res) => {
  res.json({
    email: req.user.email,
    id: req.user.id
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/api/user_data", (req, res) => {
  if (!req.user) {
    res.json({});
  } else {
    res.json({
      email: req.user.email,
      id: req.user.id
    });
  }
});
