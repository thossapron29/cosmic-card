import fs from "node:fs";
import path from "node:path";
import {
  generateCardLibrary,
  validateCardLibrary,
} from "./card-library-core.mjs";

const rootDir = process.cwd();
const jsonPath = path.join(rootDir, "supabase", "seeds", "cards.seed.json");

const cards = fs.existsSync(jsonPath)
  ? JSON.parse(fs.readFileSync(jsonPath, "utf8"))
  : generateCardLibrary();

const validation = validateCardLibrary(cards);

if (!validation.ok) {
  console.error("Card library validation failed:");
  validation.errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Validated ${cards.length} cards successfully.`);
console.log("Category distribution:");
Object.entries(validation.categoryCounts).forEach(([category, count]) => {
  console.log(`- ${category}: ${count}`);
});
