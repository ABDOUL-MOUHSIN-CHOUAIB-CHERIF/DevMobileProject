import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import initSqlJs, { Database } from 'sql.js';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private readonly dbName = 'etracker_db';
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db?: SQLiteDBConnection;
  private webDb: Database | null = null; // For web platform
  private isDbReady: boolean = false;

  private get isWebPlatform() {
    return Capacitor.getPlatform() === 'web';
  }

  async initializeApp() {
    const platform = Capacitor.getPlatform();
    console.log('[DB] Platform detected:', platform);

    if (this.isWebPlatform) {
      try {
        console.log('[DB] Using sql.js for web platform...');
        const SQL = await initSqlJs({
          locateFile: (file: string) => `/assets/${file}`
        });
        console.log('[DB] sql.js initialized ');

        this.webDb = await this.loadWebDb(SQL);
        this.isDbReady = true;
        console.log('[DB] Web database loaded! ');

        await this.createSchema();
      } catch (err) {
        console.error('[DB] Web platform initialization failed:', err);
        throw err;
      }
    } else {
      try {
        await customElements.whenDefined('jeep-sqlite');
        this.db = await this.sqlite.createConnection(this.dbName, false, 'no-encryption', 1, false);
        await this.db.open();
        this.isDbReady = true;
        console.log('[DB] Native database connection open! ');

        await this.createSchema();
      } catch (err) {
        console.error('[DB] Native platform initialization failed:', err);
        throw err;
      }
    }
  }

  // ✅ FIX: Added safety guard check to prevent 'object is possibly null'
  async executeQuery(sql: string, params: any[] = []): Promise<any> {
    await this.ensureDbReady();

    if (this.isWebPlatform) {
      if (!this.webDb) throw new Error('[DB] Web database engine not ready.');
      // Add this just above line 63 in database.ts
      console.log("DEBUG SQL:", sql);
      console.log("DEBUG PARAMS LENGTH:", params.length);
      console.log("DEBUG PARAMS DATA:", params);
      const result = this.webDb.run(sql, params);
      await this.persistWebDb(); // Ensure change is saved to local storage
      return result;
    } else {
      if (!this.db) throw new Error('[DB] Native database connection not ready.');
      return await this.db.run(sql, params);
    }
  }

  //  FIX: Added safety guard check to clean table rows translation formats
  async selectQuery(sql: string, params: any[] = []): Promise<any[]> {
    await this.ensureDbReady();

    if (this.isWebPlatform) {
      if (!this.webDb) throw new Error('[DB] Web database engine not ready.');
      const res = this.webDb.exec(sql, params);
      if (res.length === 0) return [];
      
      const columns = res[0].columns;
      const values = res[0].values;
      
      return values.map((row: any) => {
        const obj: any = {};
        columns.forEach((col: string, i: number) => {
          obj[col] = row[i];
        });
        return obj;
      });
    } else {
      if (!this.db) throw new Error('[DB] Native database connection not ready.');
      const res = await this.db.query(sql, params);
      return res.values || [];
    }
  }

  private async createSchema() {
    // ✅ SYNC FIX: Renamed table to match 'goals' so it doesn't break goals.page.ts queries!
    const schema = `
      CREATE TABLE IF NOT EXISTS users (
        userId    TEXT PRIMARY KEY,
        email     TEXT UNIQUE NOT NULL,
        password  TEXT NOT NULL,
        name      TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS transactions (
        txId        TEXT PRIMARY KEY,
        userId      TEXT NOT NULL,
        type        TEXT NOT NULL,
        amount      REAL NOT NULL,
        category    TEXT NOT NULL,
        description TEXT,
        date        TEXT NOT NULL,
        createdAt   TEXT NOT NULL,
        updatedAt   TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS saving_goals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT,
        title TEXT,
        category TEXT,
        currentAmount REAL,
        targetAmount REAL,
        icon TEXT,
        colorClass TEXT,
        dueDate TEXT
      );

      CREATE TABLE IF NOT EXISTS contributions (
        contributionId TEXT PRIMARY KEY,
        goalId         TEXT NOT NULL,
        amount         REAL NOT NULL,
        date           TEXT NOT NULL,
        FOREIGN KEY (goalId) REFERENCES goals(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS loans (
        loanId           TEXT PRIMARY KEY,
        userId           TEXT NOT NULL,
        creditor         TEXT NOT NULL,
        creditorPhone    TEXT,
        principal        REAL NOT NULL,
        interestRate     REAL DEFAULT 0,
        remainingBalance REAL NOT NULL,
        dueDate          TEXT,
        type             TEXT NOT NULL,
        status           TEXT NOT NULL,
        createdAt        TEXT NOT NULL,
        updatedAt        TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS repayments (
        repaymentId TEXT PRIMARY KEY,
        loanId      TEXT NOT NULL,
        amount      REAL NOT NULL,
        date        TEXT NOT NULL,
        notes       TEXT,
        FOREIGN KEY (loanId) REFERENCES loans(loanId) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS ai_advice (
        id               TEXT PRIMARY KEY,
        userId           TEXT NOT NULL,
        message          TEXT NOT NULL,
        recommendation   TEXT,
        potentialSavings REAL,
        isApplied        INTEGER DEFAULT 0,
        createdAt        TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS notifications (
        notifId   TEXT PRIMARY KEY,
        userId    TEXT NOT NULL,
        message   TEXT NOT NULL,
        type      TEXT NOT NULL,
        read      INTEGER DEFAULT 0,
        data      TEXT,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
      );
    `;
    
    if (this.isWebPlatform) {
      if (this.webDb) {
        try {
          this.webDb.run(schema);
          console.log('[DB] Schema created ✅ (web)');
        } catch (err) {
          console.error('[DB] Schema creation failed (web):', err);
        }
      }
    } else {
      if (!this.db) {
        throw new Error('[DB] Native database is not initialized before schema creation');
      }
      await this.db.execute(schema);
      console.log('[DB] Schema created ✅ (native)');
    }
  }

  private async ensureDbReady() {
    if (this.isDbReady) {
      return;
    }

    if (this.isWebPlatform && this.webDb) {
      this.isDbReady = true;
      return;
    }

    if (!this.isWebPlatform && this.db) {
      this.isDbReady = true;
      return;
    }

    await this.initializeApp();
  }

  private base64ToUint8Array(base64: string): Uint8Array {
    const raw = atob(base64);
    const buffer = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
      buffer[i] = raw.charCodeAt(i);
    }
    return buffer;
  }

  private uint8ArrayToBase64(bytes: Uint8Array): string {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private async loadWebDb(SQL: any): Promise<Database> {
    const saved = localStorage.getItem(this.dbName);
    if (saved) {
      try {
        const bytes = this.base64ToUint8Array(saved);
        return new SQL.Database(bytes);
      } catch (err) {
        console.warn('[DB] Stored web DB could not be loaded, creating a fresh database.', err);
      }
    }
    return new SQL.Database();
  }

  private async persistWebDb() {
    if (!this.isWebPlatform || !this.webDb) {
      return;
    }
    const data = this.webDb.export();
    localStorage.setItem(this.dbName, this.uint8ArrayToBase64(data));
    console.log('[DB] Web database persisted to localStorage ✅');
  }

  // ✅ FIX: Wired these internal methods to route safely through executeQuery/selectQuery wrappers
  private async webRun(sql: string, values?: any[]) {
    return this.executeQuery(sql, values || []);
  }

  private async webQuery(sql: string, values?: any[]) {
    return this.selectQuery(sql, values || []);
  }

  private async runSql(sql: string, values?: any[]) {
    return this.executeQuery(sql, values || []);
  }

  private async querySql(sql: string, values?: any[]) {
    return this.selectQuery(sql, values || []);
  }

  private async saveWeb() {
    await this.persistWebDb();
  }

  // ── Users ────────────────────────────────────────────────────────

  async addUser(user: any) {
    const sql = `
      INSERT INTO users (userId, email, password, name, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?);
    `;
    try {
      const result = await this.runSql(sql, [
        user.userId,
        user.email.toLowerCase(),
        user.password,
        user.name,
        user.createdAt,
        user.updatedAt
      ]);
      return result;
    } catch (e: any) {
      if (e?.message?.includes('UNIQUE')) {
        throw new Error('This email is already registered.');
      }
      throw e;
    }
  }

  async getUserByEmail(email: string) {
    try {
      const rows = await this.querySql(
        `SELECT * FROM users WHERE email = ? LIMIT 1;`,
        [email.toLowerCase()]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (e) {
      console.error('Error fetching user:', e);
      return null;
    }
  }

  // ── Transactions ─────────────────────────────────────────────────

  async addTransaction(tx: any) {
    const sql = `
      INSERT INTO transactions (txId, userId, type, amount, category, description, date, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    try {
      const result = await this.runSql(sql, [
        tx.txId, tx.userId, tx.type, tx.amount,
        tx.category, tx.description, tx.date,
        new Date().toISOString(), new Date().toISOString()
      ]);
      return result;
    } catch (e) {
      console.error('Error saving transaction:', e);
      throw e;
    }
  }

  async getTransactions(userId: string) {
    try {
      return await this.querySql(
        `SELECT * FROM transactions WHERE userId = ? ORDER BY date DESC;`,
        [userId]
      );
    } catch (e) {
      console.error('Error fetching transactions:', e);
      return [];
    }
  }

  async deleteTransaction(txId: string) {
    try {
      await this.runSql(`DELETE FROM transactions WHERE txId = ?;`, [txId]);
    } catch (e) {
      console.error('Error deleting transaction:', e);
      throw e;
    }
  }

  // ── Savings Goals ─────────────────────────────────────────────────

  async addGoal(goal: any) {
    const sql = `
      INSERT INTO goals (userId, title, category, currentAmount, targetAmount, icon, colorClass, dueDate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
    try {
      const result = await this.runSql(sql, [
        goal.userId, goal.title, goal.category,
        goal.currentAmount ?? 0, goal.targetAmount,
        goal.icon, goal.colorClass, goal.dueDate ?? null
      ]);
      return result;
    } catch (e) {
      console.error('Error adding goal:', e);
      throw e;
    }
  }

  async getGoals(userId: string) {
    try {
      return await this.querySql(
        `SELECT * FROM goals WHERE userId = ? ORDER BY id DESC;`,
        [userId]
      );
    } catch (e) {
      console.error('Error fetching goals:', e);
      return [];
    }
  }

  // ── Loans ─────────────────────────────────────────────────────────

  async addLoan(loan: any) {
    const sql = `
      INSERT INTO loans (loanId, userId, creditor, creditorPhone, principal, interestRate,
                         remainingBalance, dueDate, type, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    try {
      const result = await this.runSql(sql, [
        loan.loanId, loan.userId, loan.creditor, loan.creditorPhone ?? null,
        loan.principal, loan.interestRate ?? 0, loan.remainingBalance,
        loan.dueDate ?? null, loan.type, loan.status,
        new Date().toISOString(), new Date().toISOString()
      ]);
      return result;
    } catch (e) {
      console.error('Error adding loan:', e);
      throw e;
    }
  }

  async getLoans(userId: string) {
    try {
      return await this.querySql(
        `SELECT * FROM loans WHERE userId = ? ORDER BY createdAt DESC;`,
        [userId]
      );
    } catch (e) {
      console.error('Error fetching loans:', e);
      return [];
    }
  }

  // ── Cleanup ───────────────────────────────────────────────────────

  async closeConnection() {
    if (this.db) {
      await this.sqlite.closeConnection('etracker_db', false);
    }
  }
}