const express = require("express");
const axios = require("axios");
const FormData = require("form-data");
const cors = require("cors");

const app = express();

app.use(express.json({ limit: "20mb" }));
app.use(cors());

/* =========================================
   HEALTHCHECK
========================================= */

app.get("/", (req, res) => {

    res.send("API OK");

});

/* =========================================
   UPLOAD PDF
========================================= */

app.post("/upload", async (req, res) => {

    try {

        const {
            url,
            token,
            fileName,
            fileContent
        } = req.body;

        /* =========================================
           VALIDACIONES
        ========================================= */

        if (!url || !token || !fileName || !fileContent) {

            return res.status(400).json({
                success: false,
                error: "Missing parameters"
            });
        }

        /* =========================================
           BASE64 → BUFFER
        ========================================= */

        const buffer = Buffer.from(
            fileContent,
            "base64"
        );

        /* =========================================
           FORM DATA
        ========================================= */

        const form = new FormData();

        form.append(
            "file",
            buffer,
            fileName
        );

        /* =========================================
           REQUEST ESIGN
        ========================================= */

        const response = await axios.post(
            url,
            form,
            {
                headers: {
                    ...form.getHeaders(),
                    apiToken: token
                },
                maxBodyLength: Infinity,
                maxContentLength: Infinity
            }
        );

        /* =========================================
           RESPUESTA OK
        ========================================= */

        res.json({
            success: true,
            data: response.data
        });

    } catch (error) {

        console.error("ERROR:");

        console.error(error.message);

        console.error(error.response?.status);

        console.error(
            JSON.stringify(
                error.response?.data,
                null,
                2
            )
        );

        /* =========================================
           RESPUESTA ERROR
        ========================================= */

        res.status(500).json({

            success: false,

            message: error.message,

            status: error.response?.status,

            response: error.response?.data ||

            {
                error: "Upload failed"
            }
        });
    }
});

/* =========================================
   PORT
========================================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});
