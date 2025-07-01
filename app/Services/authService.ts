// app/Services/authService.ts
import { Database } from "cbl-reactnative";

// Checks if a user document exists in the local database
export async function isUserLoggedIn(database: Database): Promise<boolean> {
  try {
    const query = database.createQuery(
      'SELECT meta().id FROM _default._default WHERE type = "user" LIMIT 1'
    );
    const results = await query.execute();
    return results.length > 0;
  } catch (err) {
    console.error("isUserLoggedIn error:", err);
    return false;
  }
}