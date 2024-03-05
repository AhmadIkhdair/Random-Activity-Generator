import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Get request to load the home page, making sure a random activity is shown everytime the page is loaded by sending the data to the index.ejs file.

app.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://bored-api.appbrewery.com/random");
    const result = response.data;
    res.render("index.ejs", { data: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});

//Using axios to make the api request for every time the form button is clicked, sending the random activity to the index.ejs file

app.post("/", async (req, res) => {
  try {
    console.log(req.body); //request structure
    const type = req.body.type;
    const participants = req.body.participants;
    const response = await axios.get(`https://bored-api.appbrewery.com/filter?type=${type}&participants=${participants}`);
    const result = response.data;
    console.log(result);
    res.render("index.ejs", { data : result[Math.floor(Math.random() * result.length)]});
  } catch (error) { //error when no activity for type/participants chosen
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: "No activities that match your criteria.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
