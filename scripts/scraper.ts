import axios from "axios";
import * as cheerio from "cheerio";
import admin from "firebase-admin";
import fs from "fs";

// 🔥 Load Firebase service account
const serviceAccount = JSON.parse(
  fs.readFileSync("./serviceAccountKey.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export async function scrapeSchoolScholarships() {
  try {
    console.log("Scraping started...");

    const { data } = await axios.get(
      "https://example-site.com/school-scholarships"
    );

    const $ = cheerio.load(data);

    const scholarships: any[] = [];

    $(".scholarship-card").each((_, el) => {
      const name = $(el).find(".title").text().trim();
      const deadline = $(el).find(".deadline").text().trim();
      const eligibility = $(el).find(".eligibility").text().trim();

      if (
        eligibility.toLowerCase().includes("class") ||
        eligibility.toLowerCase().includes("school")
      ) {
        scholarships.push({
          name,
          deadline,
          eligibility,
          category: "School",
          createdAt: new Date(),
        });
      }
    });

    for (const scholarship of scholarships) {
      const id = slugify(scholarship.name);

      await db
        .collection("scholarships")
        .doc(id)
        .set(scholarship, { merge: true });
    }

    console.log("Upload complete ✅");
  } catch (error) {
    console.error(error);
  }
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

scrapeSchoolScholarships();
