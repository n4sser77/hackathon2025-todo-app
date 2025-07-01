import {
   CblReactNativeEngine,
   Database,
   DatabaseConfiguration,
   FileSystem,
} from "cbl-reactnative";
import React, { createContext, useContext, useEffect, useState } from "react";
import * as replicatorService from "./replicatorService";

// --- DatabaseService Singleton ---
export class DatabaseService {
  private static instance: DatabaseService;
  public database: Database | undefined;
  private engine: CblReactNativeEngine | undefined;

  private constructor() {
    // Register the engine ONCE for the app
    this.engine = new CblReactNativeEngine();
  }

  static getInstance() {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async initializeDatabase() {
    if (this.database) return;
    const fileSystem = new FileSystem();
    const directoryPath = await fileSystem.getDefaultPath();
    const config = new DatabaseConfiguration();
    config.setDirectory(directoryPath);
    this.database = new Database("todos", config);
    await this.database.open();
  }
}

// --- Context and Provider ---
const DatabaseContext = createContext<DatabaseService | undefined>(undefined);

export const useDatabaseService = () => {
  const ctx = useContext(DatabaseContext);
  if (!ctx)
    throw new Error(
      "useDatabaseService must be used within a DatabaseProvider"
    );
  return ctx;
};

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [dbService] = useState(() => DatabaseService.getInstance());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    dbService
      .initializeDatabase()
      .then(() => setReady(true))
      .catch((e) => console.error(e));
  }, [dbService]);

  // Start replication automatically when database is ready
  useEffect(() => {
    let replicator: any = null;
    let token: any = null;
    if (ready && dbService.database) {
      replicatorService
        .startReplication(dbService.database)
        .then((result) => {
          replicator = result.replicator;
          token = result.token;
        })
        .catch((err) => {
          console.error("Failed to start replication:", err);
        });
    }
    // Optionally clean up on unmount
    return () => {
      if (replicator && token) {
        replicatorService.stopReplication(replicator, token).catch(() => {});
      }
    };
  }, [ready, dbService.database]);

  if (!ready) return null; // or a loading spinner

  return (
    <DatabaseContext.Provider value={dbService}>
      {children}
    </DatabaseContext.Provider>
  );
};
