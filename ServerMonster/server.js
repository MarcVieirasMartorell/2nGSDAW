const ftp = require("basic-ftp");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const xml2js = require("xml2js");

const app = express();
app.use(cors());
app.use(express.json());

const FTP_CONFIG = {
    host: "127.0.0.1",
    user: "test1",
    password: "1234",
    secure: true,
    secureOptions: { rejectUnauthorized: false },
    port: 21,
};

const XML_FILE_PATH = "monsters.xml";

app.get("/monsters", async (req, res) => {
    const client = new ftp.Client();
    try {
        await client.access(FTP_CONFIG);

        await client.downloadTo(XML_FILE_PATH, XML_FILE_PATH);

        const xmlData = fs.readFileSync(XML_FILE_PATH, "utf8");
        xml2js.parseString(xmlData, (err, result) => {
            if (err) {
                console.error("Error parsing XML:", err);
                return res.status(500).send("Failed to parse XML file.");
            }

            res.json(result.monsters.monster);
        });
    } catch (err) {
        console.error("Error accessing FTP server:", err);
        res.status(500).send("Failed to fetch data from FTP server.");
    } finally {
        client.close();
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});