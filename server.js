require("dotenv").config();
const { SHA3 } = require("sha3");
const express = require("express");
const app = express();
require("./public/blocks.json");
const fs = require("fs");

let difficulty = "00000";
const hash = new SHA3(256);

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/block/:path", (req, res) => {
  fs.readFile("./public/blocks.json", "utf8", (err, blocks) => {
    if (err) {
      console.log(err);
    } else {
      /* Verify previous Block. If Hash of all values starts with the difficulty, block is going to be validated */
      data = JSON.parse(blocks.toString());

      const previousIndex = data.length - 1;
      const currentIndex = data.length;

      const unquotedHash = data[previousIndex].Hash.replace(/['"]+/g, "");
      const unquotedPreviousHash = data[previousIndex].PreviousHash.replace(
        /['"]+/g,
        "",
      );

      let POW;
      if (data.length === 1) {
        POW =
          unquotedHash +
          unquotedPreviousHash +
          data[previousIndex].Timestamp +
          data[previousIndex].Index +
          req.params.path;
      } else {
        POW =
          unquotedHash +
          unquotedPreviousHash +
          data[previousIndex].Timestamp +
          data[previousIndex].Index +
          req.params.path;
      }

      hash.reset();

      hash.update(POW);
      let dig = hash.digest("hex");

      console.log(POW);
      console.log(dig);

      if (dig.startsWith(difficulty)) {
        hash.reset();

        var json = JSON.parse(blocks);
        json.push({
          Index: data[previousIndex].Index + 1,
          Nonce: parseInt(req.params.path),
          PreviousHash: data[previousIndex].Hash,
          Hash: dig.toString(),
          Timestamp: Date.now(),
          Difficulty: difficulty,
        });

        try {
          const data = fs.writeFileSync(
            "./public/blocks.json",
            JSON.stringify(json),
          );
        } catch (err) {
          console.error(err);
        }

        res.send("approved");
      } else {
        hash.reset();

        res.send("denied");
      }
    }
  });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
