// Requiring necessary npm packages
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const axios = require("axios");

const app = express();

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Requiring passport as we've configured it
const passport = require("./config/passport");

// Setting up port and requiring models for syncing
const PORT = process.env.PORT || 8080;
const db = require("./models");

// Creating express app and configuring middleware needed for authentication

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
// We need to use sessions to keep track of our user's login status
app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

// Requiring our routes

//const routes = require("./contollers/quiz_controller.js")

require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);
require("./routes/quiz-api-routes.js")(app);

// Syncing our database and logging a message to the user upon success
async function tableUpdate() {
  await db.sequelize.sync({ force: true });

  await db.User.create({
    email: "testy@mctesterson.net",
    password: "test123"
  });

  await db.Category.bulkCreate([
    { categoryName: "Books", apiCategoryId: 10 },
    { categoryName: "Film", apiCategoryId: 11 },
    { categoryName: "Music", apiCategoryId: 12 },
    { categoryName: "Television", apiCategoryId: 14 },
    { categoryName: "Video Games", apiCategoryId: 15 },
    { categoryName: "Anime and Manga", apiCategoryId: 31 },
    { categoryName: "Cartoons", apiCategoryId: 32 }
  ]);

  const quizURL =
    "https://opentdb.com/api.php?amount=10&category=15&difficulty=easy&type=multiple";

  axios.get(quizURL).then(async results => {
    const dataSet = results.data;

    const cleanResults = dataSet.results.map(result => {
      const cleanResult = result;
      cleanResult.question = unescapeHtml(result.question);
      cleanResult.correct_answer = unescapeHtml(result.correct_answer);
      cleanResult.incorrect_answers = result.incorrect_answers.map(
        tempAnswer => {
          return unescapeHtml(tempAnswer);
        }
      );
      return result;
    });

    for (i = 0; i < cleanResults.length; i++) {
      await db.Question.create({ questionText: cleanResults[i].question }); //it gets mad at this

      // async function createQuestions() {
      //   await db.Question.create({ questionText: cleanResults[i].question });
      // }
      // // db.Question.create({ questionText: cleanResults[i].question });
      // await createQuestions();

      function qcid() {
        const id = i + 1;
        return id;
      }

      async function createCorrect() {
        await db.Answer.create({
          answerText: cleanResults[i].correct_answer,
          isCorrect: true,
          QuestionId: await qcid()
        });
      }

      console.log("\x1b[35m%s\x1b[0m", cleanResults[i].question); //purple
      console.log("\x1b[36m%s\x1b[0m", cleanResults[i].correct_answer); //cyan

      for (z = 0; z < cleanResults[i].incorrect_answers.length; z++) {
        console.log("\x1b[31m%s\x1b[0m", cleanResults[i].incorrect_answers[z]); //red

        async function createWrong() {
          await db.Answer.create({
            answerText: cleanResults[i].incorrect_answers[z],
            isCorrect: false,
            QuestionId: await qcid()
          });
        }

        createWrong();
      }
      await createCorrect();
    }

    function unescapeHtml(text) {
      return text
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&eacute;/g, "é")
        .replace(/&Uuml;/g, "Ü")
        .replace(/&rsquo;/g, "’");
    }
  });
}

async function earsAreHearing() {
  await tableUpdate();

  app.listen(PORT, () => {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
}

earsAreHearing();
