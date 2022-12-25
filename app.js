import axios from "axios";
import qs from "qs";
import * as dotenv from "dotenv";

import JSON_EN_US from "./en_us.json";

import * as fs from "fs";

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const ko_kr = {};

// const JSON_EN_US = {
//   "ars_nouveau.familiar_desc.familiar_bookwyrm":
//     "A Bookwyrm will reduce the cost of all spells cast, and increases any spell damage by 1. Obtained by performing the Ritual of Binding near a Bookwyrm.",
//   "ars_nouveau.familiar_desc.familiar_drygmy":
//     "A Drygmy familiar will increase the damage of Earth spells by 2, and has a chance to increase the amount of looting when slaying enemies. Obtained by performing the Ritual of Binding near a Drygmy.",
//   "ars_nouveau.familiar_desc.familiar_starbuncle":
//     "A Starbuncle familiar that will grant you Speed 2. Additionally, using a Golden Nugget on the starbuncle will consume it and grant the owner a short duration of Scrying for Gold Ore. Obtained by performing the Ritual of Binding near a Starbuncle.",
// };

const translate = async () => {
  for (const key of Object.keys(JSON_EN_US)) {
    const value = JSON_EN_US[key];
    const data = qs.stringify({
      source: "en",
      target: "ko",
      text: value,
    });

    const config = {
      method: "post",
      url: "https://naveropenapi.apigw.ntruss.com/nmt/v1/translation",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-NCP-APIGW-API-KEY-ID": CLIENT_ID,
        "X-NCP-APIGW-API-KEY": CLIENT_SECRET,
      },
      data: data,
    };

    await axios(config)
      .then((res) => {
        const translatedText = JSON.stringify(
          res?.data?.message?.result?.translatedText
        );
        console.log(translatedText);
        ko_kr[key] = translatedText;
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

const writeFile = () => {
  console.log("ko:", ko_kr);
  fs.writeFileSync("ko_kr.json", JSON.stringify(ko_kr), "utf-8", (err) => {
    if (err) {
      console.log(err);
    }
  });
};

const readFile = () => {
  fs.readFile("./ko_kr.json", "utf-8", (err, data) => {
    console.log(data);
    console.log(JSON.parse(data));
  });
};

async function main() {
  await translate();
  writeFile();
  // readFile();
}

main();
