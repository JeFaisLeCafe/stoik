import { Injectable, OnModuleInit } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";

const Database = require("better-sqlite3") as new (
  path: string
) => import("better-sqlite3").Database;

@Injectable()
export class DatabaseService implements OnModuleInit {
  private db: import("better-sqlite3").Database;

  onModuleInit() {
    const dataDir = path.join(process.cwd(), "data");
    fs.mkdirSync(dataDir, { recursive: true });
    const dbPath = path.join(dataDir, "urls.db");
    this.db = new Database(dbPath);

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS urls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        short_code TEXT UNIQUE NOT NULL,
        original_url TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_short_code ON urls(short_code);
    `);
  }

  getDb(): import("better-sqlite3").Database {
    return this.db;
  }
}
