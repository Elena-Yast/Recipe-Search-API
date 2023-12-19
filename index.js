import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
// const myAPI_Key = "7bb2ccaf51mshb8de0cfa817ff70p14f5dejsn3e3021d7bcaa";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "Waiting for your choice" });
});

// Handle GET request for ingredient search
app.post("/get-recipe", async (req, res) => {
  const userInput = req.body.ingredient;
  if (!userInput) {
    return res.status(400).send("Ingredient input is required.");
  }

  try {
    const result = await axios.get("https://www.themealdb.com/api/json/v1/1/filter.php", {
      params: {
        i: userInput,
      },
    });

    res.render("index.ejs", { content: result.data });
  } catch (error) {
    res.status(404).send(error.message);
  }
});

// Handle GET request for name search
app.get("/search-by-name", async (req, res) => {
  const name = req.query.name;

  try {
    const result = await axios.get("https://www.themealdb.com/api/json/v1/1/search.php", {
      params: {
        s: name,
      },
    });

    res.render("index.ejs", { content: result.data });
  } catch (error) {
    res.status(404).send(error.message);
  }
});

// Handle GET request for category filter
app.get("/filter-by-category", async (req, res) => {
  const category = req.query.category;

  try {
    const result = await axios.get("https://www.themealdb.com/api/json/v1/1/filter.php", {
      params: {
        c: category,
      },
    });

    res.render("index.ejs", { content: result.data });
  } catch (error) {
    res.status(404).send(error.message);
  }
});



app.get("/recipe-details/:id", async (req, res) => {
  const mealId = req.params.id;

  try {
    const result = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php`, {
      params: {
        i: mealId,
      },
    });

    const mealDetails = result.data.meals[0];
    res.render("recipe-details.ejs", { mealDetails });
  } catch (error) {
    res.status(404).send(error.message);
  }
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
