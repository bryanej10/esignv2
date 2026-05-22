const express = require("express");
const axios = require("axios");
const FormData = require("form-data");
const cors = require("cors");

const app = express();

app.use(express.json({ limit: "20mb" }));
app.use(cors());

// HEALTHCHECK
app.get("/", (req, res) => {
  res.send("API OK");
});

app.post("/upload", async (req, res) => {

  try {

    const {
      url,
      fileName,
      fileContent
    } = req.body;

    // VALIDACIONES
    if (!url || !fileName || !fileContent) {

      return res.status(400).json({
        error: "Missing parameters"
      });
    }

    const buffer = Buffer.from(fileContent, "base64");

    const form = new FormData();

    form.append("file", buffer, fileName);

    const response = await axios.post(
      url,
      form,
      {
        headers: {
          ...form.getHeaders(),
          apiToken: process.env.ESIGN_TOKEN
        }
      }
    );

    res.json(response.data);

  } catch (error) {

    console.error(
      error.response?.data || error.message
    );

    res.status(500).json(
      error.response?.data || {
        error: "Upload failed"
      }
    );
  }
});

// PORT RAILWAY
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});
