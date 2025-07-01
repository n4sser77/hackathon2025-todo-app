import {
  CblReactNativeEngine,
  Collection,
  Database,
  DatabaseConfiguration,
  FileSystem,
  MutableDocument,
} from 'cbl-reactnative';

export class TodoRepository {
  private static instance: TodoRepository;
  private engine: CblReactNativeEngine | undefined;
  private database: Database | undefined;
  private collection: Collection | undefined;

  private constructor() {}

  static getInstance() {
    if (!TodoRepository.instance) {
      TodoRepository.instance = new TodoRepository();
      TodoRepository.instance.init();
    }
    return TodoRepository.instance;
  }

  async init() {
    if (this.engine) return; // Already initialized
    this.engine = new CblReactNativeEngine();
    const fileSystem = new FileSystem();
    const directoryPath = await fileSystem.getDefaultPath();
    const config = new DatabaseConfiguration();
    config.setDirectory(directoryPath);
    this.database = new Database('todos', config);
    await this.database.open();
    this.collection = await this.database.defaultCollection();
  }

  async addTodo(todo: { id: string; text: string; completed: boolean }) {
    if (!this.collection) throw new Error('Collection not initialized');
    const doc = new MutableDocument(todo.id);
    doc.setString('text', todo.text);
    doc.setBoolean('completed', todo.completed);
    await this.collection.save(doc);
  }

  async getTodos() {
    if (!this.collection) throw new Error('Collection not initialized');
    const query = this.database!.createQuery(
      'SELECT * FROM _default WHERE completed = false'
    );
    const results = await query.execute();
    return results.map((item: any) => item._default);
  }

  async getCompleted() {
    if (!this.collection) throw new Error('Collection not initialized');
    const query = this.database!.createQuery(
      'SELECT * FROM _default WHERE completed = true'
    );
    const results = await query.execute();
    return results.map((item: any) => item._default);
  }

  async updateTodo(id: string, updates: Partial<{ text: string; completed: boolean }>) {
    if (!this.collection) throw new Error('Collection not initialized');
    const doc = await this.collection.document(id);
    if (!doc) throw new Error('Todo not found');
    // Create a new MutableDocument and copy over the fields
    const mutableDoc = new MutableDocument(id);
    mutableDoc.setString('text', updates.text !== undefined ? updates.text : doc.getString('text'));
    // getBoolean may return null, so fallback to false if both are undefined/null
    const completedValue = updates.completed !== undefined ? updates.completed : (doc.getBoolean('completed') ?? false);
    mutableDoc.setBoolean('completed', completedValue);
    await this.collection.save(mutableDoc);
  }

  async deleteTodo(id: string) {
    if (!this.collection) throw new Error('Collection not initialized');
    const doc = await this.collection.document(id);
    if (doc) await this.collection.deleteDocument(doc);
  }
}
