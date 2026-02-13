const xlsx = require("xlsx");
const fs = require("fs");

const FILE_NAME = "DatalabsSignals.xlsx";
const SHEET_NAME = "Seniority";

const USE_CASE_HEADER = "Use Case Selection";
const ICP_HEADER = "Assigned User Profile Variable";

// ---------------- READ FILE ----------------
const wb = xlsx.readFile(FILE_NAME);
const sheet = wb.Sheets[SHEET_NAME];

if (!sheet) {
  throw new Error(`❌ Sheet not found: ${SHEET_NAME}`);
}

// Read sheet as raw array-of-arrays
const rows = xlsx.utils.sheet_to_json(sheet, {
  header: 1,
  defval: "",
});

// ---------------- FIND HEADER ROW ----------------
let headerRowIndex = -1;

for (let i = 0; i < rows.length; i++) {
  const row = rows[i].map(c => c.toString().trim());
  if (
    row.some(c => c.toLowerCase() === USE_CASE_HEADER.toLowerCase()) &&
    row.some(c => c.toLowerCase() === ICP_HEADER.toLowerCase())
  ) {
    headerRowIndex = i;
    break;
  }
}

if (headerRowIndex === -1) {
  throw new Error("❌ Could not find header row with required columns");
}

console.log("✅ Header row found at index:", headerRowIndex);

// ---------------- MAP HEADER INDEXES ----------------
const headerRow = rows[headerRowIndex];

const useCaseColIndex = headerRow.findIndex(
  c => c.toString().trim().toLowerCase() === USE_CASE_HEADER.toLowerCase()
);

const icpColIndex = headerRow.findIndex(
  c => c.toString().trim().toLowerCase() === ICP_HEADER.toLowerCase()
);

if (useCaseColIndex === -1 || icpColIndex === -1) {
  throw new Error("❌ Required columns not found in header row");
}

// ---------------- PARSE DATA ----------------
const COMBINATION_RULES = [];

for (let i = headerRowIndex + 1; i < rows.length; i++) {
  const row = rows[i];

  const rawUseCases = row[useCaseColIndex]?.toString().trim();
  const icp = row[icpColIndex]?.toString().trim();

  if (!rawUseCases || !icp) continue;

  const useCases = rawUseCases
    .split("|")
    .map(u => u.trim())
    .filter(Boolean);

  // Only allow 1–3 combinations
  if (useCases.length < 1 || useCases.length > 3) continue;

  COMBINATION_RULES.push({
    useCases,
    icp,
  });
}

// ---------------- WRITE OUTPUT ----------------
fs.writeFileSync(
  "combinationRules.json",
  JSON.stringify(COMBINATION_RULES, null, 2)
);

console.log(
  `✅ combinationRules.json created (${COMBINATION_RULES.length} rules)`
);
