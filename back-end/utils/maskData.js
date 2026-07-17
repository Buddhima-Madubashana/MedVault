function maskData(data, user) {
  if (!data) return data;

  // If user is not provided (e.g. public route), assume strict masking? Or maybe error?
  // Let's assume strict masking (Doctor/Nurse logic applies based on role if passed, but here we expect user object)
  // If user is undefined, treat as minimal access.
  const role = user ? user.role : "Public";

  const isArray = Array.isArray(data);
  const items = isArray ? data : [data];

  const masked = items.map((p) => {
    // If it's a Mongoose doc, convert it. If plain object, use as is.
    const doc = p.toObject ? p.toObject({ getters: true }) : p;

    // --- ADMIN: Full Access ---
    // Check for permanent Admin or active Temporary Admin
    const hasAdminPrivilege =
      role === "Admin" ||
      (user && user.isTempAdmin && user.tempAdminExpiresAt > new Date());

    if (hasAdminPrivilege) return doc;

    // --- DOCTOR & NURSE: Mask Contact Info ---
    doc.email = "****";
    doc.phone = "****";
    doc.address = "****";
    doc.guardianName = "****";

    // --- NURSE Specific Masking (Option 3) ---
    // User requested "Nurse sees basic identity (Name, Ward) but sensitive medical redacted"
    if (role === "Nurse") {
      doc.disease = "****";
    }

    return doc;
  });

  return isArray ? masked : masked[0];
}

module.exports = maskData;
