export const exportToCSV = (data, filename, columns) => {
  if (!data || !data.length) return;

  // Extract headers
  const headers = columns.map(col => col.header);
  const keys = columns.map(col => col.key);

  // Generate CSV rows
  const csvRows = [];
  csvRows.push(headers.join(","));

  for (const row of data) {
    const values = keys.map(key => {
      let val = row;
      // Handle nested keys like "author.firstName"
      const keyParts = key.split(".");
      for (const part of keyParts) {
        if (val) val = val[part];
        else val = "";
      }
      
      // Escape commas and quotes
      const escaped = (val || "").toString().replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }

  // Create Blob and trigger download
  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
