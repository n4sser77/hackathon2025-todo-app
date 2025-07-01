// Direct Couchbase Lite usage for todos, following https://cbl-reactnative.dev/StartHere/install
import { Database, MutableDocument } from "cbl-reactnative";
import { v4 as uuidv4 } from "uuid";

// Get all incomplete todos
export async function getTodos(database: Database) {
  if (!database) throw new Error("Database is not initialized");
  let query;
  try {
    query = database.createQuery(
      "SELECT meta().id, * FROM _default._default WHERE completed = false"
    );
    if (!query) throw new Error("Failed to create query");
    const results = await query.execute();
    return results.map((item: any) => ({
      id: item.id, // meta().id
      ...item._default,
    }));
  } catch (err) {
    console.error("getTodos error:", err);
    return [];
  }
}

// Get all completed todos
export async function getCompleted(database: Database) {
  if (!database) throw new Error("Database is not initialized");
  let query;
  try {
    query = database.createQuery(
      "SELECT meta().id, * FROM _default._default WHERE completed = true"
    );
    if (!query) throw new Error("Failed to create query");
    const results = await query.execute();
    return results.map((item: any) => ({
      id: item.id,
      ...item._default,
    }));
  } catch (err) {
    console.error("getCompleted error:", err);
    return [];
  }
}

// Add a new todo
export async function addTodo(database: Database, text: string) {
  try {
    const collection = await database.defaultCollection();
    const id = uuidv4();
    const doc = new MutableDocument(id);
    doc.setString("text", text);
    doc.setString("type", "todo"); // Optional: set a type for the document
    doc.setBoolean("completed", false);
    
    await collection.save(doc);
  } catch (err) {
    console.error("addTodo error:", err);
    throw err;
  }
}

// Update a todo (text and/or completed)
export async function updateTodo(
  database: Database,
  id: string,
  updates: Partial<{ text: string; completed: boolean }>
) {
  try {
    const collection = await database.defaultCollection();
    const doc = await collection.document(id);
    if (!doc) throw new Error("Todo not found");
    const mutableDoc = MutableDocument.fromDocument(doc);
    if (updates.text !== undefined) {
      mutableDoc.setString("text", updates.text);
    }
    if (updates.completed !== undefined) {
      mutableDoc.setBoolean("completed", updates.completed);
    }
    await collection.save(mutableDoc);
  } catch (err) {
    console.error("updateTodo error:", err);
    throw err;
  }
}

// Delete a todo by id (throws if not found)
export async function deleteTodo(database: Database, id: string) {
  try {
    const collection = await database.defaultCollection();
    const doc = await collection.document(id);
    if (!doc) throw new Error("Todo not found");
    await collection.deleteDocument(doc);
  } catch (err) {
    console.error("deleteTodo error:", err);
    throw err;
  }
}

// Mark a completed todo as incomplete (move back to todos)
export async function moveBackToTodos(database: Database, id: string) {
  try {
    await updateTodo(database, id, { completed: false });
  } catch (err) {
    console.error("moveBackToTodos error:", err);
    throw err;
  }
}

// Update the text of a completed todo
export async function updateCompleted(
  database: Database,
  id: string,
  newValue: string
) {
  try {
    await updateTodo(database, id, { text: newValue });
  } catch (err) {
    console.error("updateCompleted error:", err);
    throw err;
  }
}

// Delete a completed todo (throws if not found)
export async function deleteCompleted(database: Database, id: string) {
  try {
    await deleteTodo(database, id);
  } catch (err) {
    console.error("deleteCompleted error:", err);
    throw err;
  }
}
