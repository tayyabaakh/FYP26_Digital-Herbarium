const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

// List all your Word documents here (ensure filenames match what's in your scripts/ folder)
const documentFiles = [
  "document1.docx",
  "document2.docx" // Update this if your second filename differs
];

async function parseDocument() {
  try {
    let allLines = [];

    // Loop through each document and extract text using __dirname
    for (const file of documentFiles) {
      const filePath = path.join(__dirname, file); 
      console.log(`Reading ${file} from ${filePath}…`);
      const result = await mammoth.extractRawText({ path: filePath });
      const lines = result.value.split('\n').map(l => l.trim()).filter(Boolean);
      allLines = allLines.concat(lines);
    }

    let families = [];
    let currentFamily = null;
    let currentGenus = null;

    for (let line of allLines) {
      // 1. Skip document metadata headers like "(NO. 2)" or page numbers
      if (/^\(NO\..*?\)$/i.test(line) || /^page\s*\d+/i.test(line)) {
        continue;
      }

      // 2. Check if line is a Family (uppercase block without periods or parentheses)
      if (/^[A-Z\s]{4,}$/.test(line) && !line.includes('(') && !line.includes('.')) {
        if (currentFamily) {
          if (currentGenus) currentFamily.genera.push(currentGenus);
          families.push(currentFamily);
        }
        currentFamily = {
          id: families.length + 1,
          family: line.trim(),
          featured: ['ERICACEAE', 'MONOTROPACEAE', 'FRANKENIACEAE'].includes(line.trim()),
          genera: []
        };
        currentGenus = null;
        continue;
      } 

      // 3. Check if line is a Genus (Single capitalized word + author citation)
      const isGenusLine = currentFamily && (
        /^([A-Z][a-z]+)\s+([A-Z\(].*)$/.test(line) && !line.includes('var.') && !line.includes('ssp.')
      );

      if (isGenusLine && currentFamily) {
        if (currentGenus) currentFamily.genera.push(currentGenus);
        
        const match = line.match(/^([A-Z][a-z]+)\s+(.*)$/);
        currentGenus = {
          name: match ? match[1] : line.split(' ')[0],
          author: match ? match[2] : '',
          species: []
        };
      } 
      // 4. Otherwise, it's treated as a Species entry under the active genus
      else if (currentGenus && currentFamily) {
        const match = line.match(/^([A-Z][a-z]+\s+[a-z-]+(?:\s+(?:var\.|ssp\.|subsp\.|[a-z-]+))?)\s+(.*)$/);
        if (match) {
          currentGenus.species.push({
            name: match[1].trim(),
            author: match[2].trim()
          });
        } else {
          currentGenus.species.push({
            name: line,
            author: ""
          });
        }
      }
    }

    // Push the final record
    if (currentGenus && currentFamily) currentFamily.genera.push(currentGenus);
    if (currentFamily) families.push(currentFamily);

    // Compute counts dynamically
    const processedFamilies = families.map((fam, index) => ({
      id: index + 1,
      family: fam.family,
      featured: fam.featured || false,
      generaCount: fam.genera.length,
      speciesCount: fam.genera.reduce((acc, g) => acc + g.species.length, 0),
      genera: fam.genera
    }));

    // Save botanicalData.json one level up in the main Backend folder
    const outputPath = path.join(__dirname, '../botanicalData.json');
    fs.writeFileSync(outputPath, JSON.stringify(processedFamilies, null, 2));
    console.log(`Successfully parsed a total of ${processedFamilies.length} families into botanicalData.json!`);

  } catch (error) {
    console.error("Error parsing documents:", error);
  }
}

parseDocument();