import fs from "node:fs";
import path from "node:path";
import {
  buildSeedSql,
  generateCardLibrary,
  validateCardLibrary,
} from "./card-library-core.mjs";

const rootDir = process.cwd();
const outputDir = path.join(rootDir, "supabase", "seeds");
const jsonPath = path.join(outputDir, "cards.seed.json");
const sqlPath = path.join(outputDir, "cards.seed.sql");

const cards = generateCardLibrary();
const validation = validateCardLibrary(cards);

if (!validation.ok) {
  console.error("Card library validation failed:");
  validation.errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(jsonPath, `${JSON.stringify(cards, null, 2)}\n`, "utf8");
fs.writeFileSync(sqlPath, buildSeedSql(cards), "utf8");

console.log(`Generated ${cards.length} cards.`);
console.log(`JSON: ${path.relative(rootDir, jsonPath)}`);
console.log(`SQL: ${path.relative(rootDir, sqlPath)}`);
console.log("Category distribution:");
Object.entries(validation.categoryCounts).forEach(([category, count]) => {
  console.log(`- ${category}: ${count}`);
});
