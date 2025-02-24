export async function getAllPrescriptions(db: D1Database) {
  const { results } = await db.prepare("SELECT * FROM prescriptions").all();
  return results;
}

export async function getPrescriptions(db: D1Database) {
  const { results } = await db
    .prepare(`
      SELECT * FROM prescriptions
      WHERE prescription_checked = 0 
        OR guidance_executed = 0 
        OR delivery_executed = 0
    `)
    .all();
  return results;
}

export async function completeDelivery(db: D1Database, prescriptionId: number) {
  await db
    .prepare(
      `UPDATE prescriptions
       SET prescription_checked = 1, guidance_executed = 1, delivery_executed = 1, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    )
    .bind(prescriptionId)
    .run();
}

export async function getFinishedPrescriptions(db: D1Database) {
  const { results } = await db
    .prepare(`
      SELECT * FROM prescriptions
      WHERE prescription_checked = 1
        AND guidance_executed = 1
        AND delivery_executed = 1
    `)
    .all();
  return results;
}
