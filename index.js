const express = require("express");
const axios = require("axios");
const FormData = require("form-data");
const cors = require("cors");

const app = express();
app.use(express.json({ limit: "20mb" }));
app.use(cors());

app.post("/upload", async (req, res) => {
  try {
    const { fileName, fileContent } = req.body;

    const buffer = Buffer.from(fileContent, "base64");

    const form = new FormData();
    form.append("file", buffer, fileName);

    const response = await axios.post(
      "https://latam-demo.esignanywhere.net/Api/v6/file/upload",
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
    console.error(error.response?.data || error.message);
    res.status(500).json(error.response?.data || { error: "Upload failed" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});