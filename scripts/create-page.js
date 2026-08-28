// scripts/create-page.js
import fs from "fs";
import path from "path";

// get the route name from command line arguments (e.g. "node scripts/create-page.js login")
const routeName = process.argv[2];

if (!routeName) {
	console.error("ATTENTION : Usage: node scripts/create-page.js <route-name>");
	process.exit(1);
}

const dirPath = path.join(import.meta.dirname, "..", "src", "app", "pages", routeName);
const pageName = routeName.split("/").pop();

// create the directory if it doesn't exist yet
fs.mkdirSync(dirPath, { recursive: true });

// minimal page.tsx boilerplate
const pageContent = `import styles from "./${pageName}.module.css";

export default function ${capitalize(pageName)}() {
  return <div className={styles.container}></div>;
}
`;

fs.writeFileSync(path.join(dirPath, "page.tsx"), pageContent);
fs.writeFileSync(path.join(dirPath, `${pageName}.module.css`), "");

console.log(`Created: src/app/${routeName}/page.tsx and ${pageName}.module.css`);

function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
