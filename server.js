const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

let latestTemp = null;
let latestSensor = null;

app.post("/webhook", (req, res) => {
  console.log("FULL BODY:", JSON.stringify(req.body, null, 2));

  const sensors = req.body.sensorMessages;

  if (!sensors || !Array.isArray(sensors)) {
    console.log("NO sensorMessages");
    return res.sendStatus(200);
  }

  const target = sensors.find(s =>
    s.sensorName && s.sensorName.includes("BioBank 1 ULT")
  );

  if (target) {
    latestTemp = target.dataValue;
    latestSensor = target.sensorName;

    console.log("TEMP:", latestSensor, latestTemp);
  } else {
    console.log("NO MATCH - received sensors:");
    sensors.forEach(s => console.log(" -", s.sensorName));
  }

  res.sendStatus(200);
});

app.get("/webhook", (req, res) => {
  console.log("GET WEBHOOK HIT");
  res.sendStatus(200);
});

app.get("/temperature", (req, res) => {
  res.json({
    sensor: latestSensor,
    temperature: latestTemp
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port", PORT);
});
