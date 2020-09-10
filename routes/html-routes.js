// Requiring path to so we can use relative routes to our HTML files
const path = require("path");
const db = require("../models");

// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
  app.get("/", (req, res) => {
    // If the user already has an account send them to the members page
    // if (req.user) {
    //   res.redirect("/members");
    // }
    res.sendFile(path.join(__dirname, "../public/index.html"));
    // res.render("index");
  });

  app.get("/category", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/categories.html"));
  });

  app.get("/quiz/15", (req, res) => {
    db.Question.findAll({
      include: [db.Answer]
    }).then(dbQuestion => {
      const resultsJSON = dbQuestion.map(result => {
        return result.toJSON();
      });

      // console.log("\x1b[33m%s\x1b[0m", resultsJSON); //yellow
      res.render("quiz", { trivia: resultsJSON });
      // res.render("quiz", { trivia: cleanResults });
      // const quizURL = `https://opentdb.com/api.php?amount=10&category=${req.params.id}&difficulty=easy&type=multiple`;

      // axios.get(quizURL).then(results => {
      //   const dataSet = results.data;

      //   const cleanResults = dataSet.results.map(result => {
      //     const cleanResult = result;
      //     cleanResult.question = unescapeHtml(result.question);
      //     cleanResult.correct_answer = unescapeHtml(result.correct_answer);
      //     cleanResult.incorrect_answers = result.incorrect_answers.map(
      //       tempAnswer => {
      //         return unescapeHtml(tempAnswer);
      //       }
      //     );
      //     return result;
      //   });
      //   console.log(JSON.stringify(cleanResults[0], null, 2));

      //   function unescapeHtml(text) {
      //     return text
      //       .replace(/&amp;/g, "&")
      //       .replace(/&lt;/g, "<")
      //       .replace(/&gt;/g, ">")
      //       .replace(/&quot;/g, '"')
      //       .replace(/&#039;/g, "'");
      //   }
    });
  });

  /*  //added 3:10pm 9/5 MS
   app.get("/quiz", (req, res) => 
   {
    // let variable = //axios to get all the questions
       res.render("quiz");
   }); */

  app.get("/score", (req, res) => {
    db.Score.findAll({
      include: [db.Category, db.User],
      order: [['score', 'DESC']]
    }).then(dbScore => {
      const resultsJSON = dbScore.map(result => {
        return result.toJSON();
      });

      // console.log("\x1b[33m%s\x1b[0m", JSON.stringify(resultsJSON)); //yellow
      res.render("scores", { userScore: resultsJSON });
    });
    // res.sendFile(path.join(__dirname, "../public/highscores.html"));
    // // res.render("score");
  });

  //todo: update "sendFile" to res.render("handlebar page") equivelent to the html page
  app.get("/login", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/members", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/members.html"));
  });
};
