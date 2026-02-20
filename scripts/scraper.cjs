const axios = require("axios");
const cheerio = require("cheerio");
const admin = require("firebase-admin");
const fs = require("fs");

// Load Firebase service account
const serviceAccount = JSON.parse(
  fs.readFileSync("serviceAccountKey.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function scrapeSchoolScholarships() {
  try {
    console.log("Scraping started...");

    // 🔽 Replace this with real website later
    const { data } = await axios.get(
      "https://example.com"
    );

    const $ = cheerio.load(data);

    const scholarships = [
  {
    name: "Test School Scholarship 2025",
    category: "School",
    state: "All India",
    deadline: new Date(),
    createdAt: new Date(),
  }
];

    $("a").each((_, el) => {
      const name = $(el).text().trim();

      if (name.length > 20) {
        scholarships.push({
          name,
          category: "School",
          deadline: null,
          createdAt: new Date(),
        });
      }
    });

    console.log("Total scraped:", scholarships.length);
    for (const scholarship of scholarships) {
      const id = slugify(scholarship.name);

      await db
        .collection("scholarships")
        .doc(id)
        .set(scholarship, { merge: true });
    }

    console.log("Upload complete ✅");
  } catch (error) {
    console.error("Error:", error);
  }
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// scrapeSchoolScholarships();

// scrapeSchoolScholarships();

if (require.main === module) {
  scrapeSchoolScholarships();
}

