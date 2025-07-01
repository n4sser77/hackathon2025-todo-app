import {
   CblReactNativeEngine,
   Database,
   DatabaseConfiguration,
   FileSystem,
} from "cbl-reactnative";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
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

  // Use refs to persist replicator and tokens across renders/effects
  const replicatorRef = useRef<any>(null);
  const tokenRef = useRef<any>(null);
  const docTokenRef = useRef<any>(null);

  useEffect(() => {
    dbService
      .initializeDatabase()
      .then(() => setReady(true))
      .catch((e) => console.error(e));
  }, [dbService]);

  useEffect(() => {
    if (ready && dbService.database) {
      replicatorService
        .startReplication(dbService.database)
        .then((result) => {
          replicatorRef.current = result.replicator;
          tokenRef.current = result.token;
          docTokenRef.current = result.docToken;
        })
        .catch((err) => {
          console.error("Failed to start replication:", err);
        });
    }
    return () => {
      if (replicatorRef.current && tokenRef.current) {
        replicatorService
          .stopReplication(replicatorRef.current, tokenRef.current, docTokenRef.current)
          .catch(() => {});
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
