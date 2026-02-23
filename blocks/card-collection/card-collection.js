function parseRows(block) {
  return [...block.children].map((row) => (
    [...row.children].map((cell) => cell.textContent.trim())
  ));
}

function buildConfig(rows) {
  const config = {};
  rows.forEach((cells) => {
    if (cells.length >= 2) {
      const key = cells[0].trim();
      const value = cells[1].trim();
      if (key) config[key] = value;
    }
  });
  return config;
}

export default function decorate(block) {
  const rows = parseRows(block);
  const config = buildConfig(rows);

  Object.entries(config).forEach(([key, value]) => {
    block.dataset[key] = value;
  });

  block.textContent = '';
}
