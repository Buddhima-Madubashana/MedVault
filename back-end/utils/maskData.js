function maskData(data, role) {
  if (!data) return data;

  const isArray = Array.isArray(data);
  const items = isArray ? data : [data];

  const masked = items.map((p) => {
    // Ensure we work with clean JSON object (which triggers getters for decryption)
    // If it's a Mongoose doc, convert it. If plain object, use as is.
    const doc = p.toObject ? p.toObject({ getters: true }) : p;

    // --- ADMIN: Full Access ---
    if (role === "Admin") return doc;

    // --- DOCTOR & NURSE: Mask Contact Info ---
    doc.email = "****";
    doc.phone = "****";
    doc.address = "****";
    doc.guardianName = "****";

    // --- NURSE Specific Masking (Option 3) ---
    // User requested "Nurse sees basic identity (Name, Ward) but sensitive medical redacted"
    if (role === "Nurse") {
      doc.disease = "****";
      // We keep 'ward' and 'age' visible as basic info
    }

    return doc;
  });

  return isArray ? masked : masked[0];
}

module.exports = maskData;
