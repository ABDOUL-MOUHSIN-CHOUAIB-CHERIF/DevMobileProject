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
  private async createSchema() {
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

      CREATE TABLE IF NOT EXISTS savings_goals (
        goalId        TEXT PRIMARY KEY,
        userId        TEXT NOT NULL,
        name          TEXT NOT NULL,
        targetAmount  REAL NOT NULL,
        currentAmount REAL DEFAULT 0,
        deadline      TEXT,
        createdAt     TEXT NOT NULL,
        updatedAt     TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS contributions (
        contributionId TEXT PRIMARY KEY,
        goalId         TEXT NOT NULL,
        amount         REAL NOT NULL,
        date           TEXT NOT NULL,
        FOREIGN KEY (goalId) REFERENCES savings_goals(goalId) ON DELETE CASCADE
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
    
    const platform = Capacitor.getPlatform();
    if (platform === 'web') {
      // For web, use sql.js
      if (this.webDb) {
        try {
          this.webDb.run(schema);
          console.log('[DB] Schema created ✅ (web)');
        } catch (err) {
          console.error('[DB] Schema creation failed (web):', err);
        }
      }
    } else {
      // For native, use Capacitor SQLite
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

  private async webRun(sql: string, values?: any[]) {
    if (!this.webDb) {
      throw new Error('[DB] Web database is not initialized');
    }
    return this.webDb.run(sql, values || []);
  }

  private async webQuery(sql: string, values?: any[]) {
    if (!this.webDb) {
      throw new Error('[DB] Web database is not initialized');
    }
    const stmt = this.webDb.prepare(sql);
    try {
      if (values && values.length > 0) {
        stmt.bind(values);
      }
      const rows: any[] = [];
      while (stmt.step()) {
        rows.push(stmt.getAsObject());
      }
      return rows;
    } finally {
      stmt.free();
    }
  }

  private async runSql(sql: string, values?: any[]) {
    if (this.isWebPlatform) {
      const result = await this.webRun(sql, values);
      await this.persistWebDb();
      return result;
    }

    if (!this.db) {
      throw new Error('[DB] Native database is not initialized');
    }
    return this.db.run(sql, values);
  }

  private async querySql(sql: string, values?: any[]) {
    if (this.isWebPlatform) {
      return this.webQuery(sql, values);
    }

    if (!this.db) {
      throw new Error('[DB] Native database is not initialized');
    }
    const result = await this.db.query(sql, values);
    return result.values || [];
  }

  private async saveWeb() {
    await this.persistWebDb();
  }

  // ── Users ────────────────────────────────────────────────────────

  async addUser(user: any) {
    await this.ensureDbReady();
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
      await this.saveWeb();
      return result;
    } catch (e: any) {
      if (e?.message?.includes('UNIQUE')) {
        throw new Error('This email is already registered.');
      }
      throw e;
    }
  }

  async getUserByEmail(email: string) {
    await this.ensureDbReady();
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
    await this.ensureDbReady();
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
      await this.saveWeb();
      return result;
    } catch (e) {
      console.error('Error saving transaction:', e);
      throw e;
    }
  }

  async getTransactions(userId: string) {
    await this.ensureDbReady();
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
    await this.ensureDbReady();
    try {
      await this.runSql(`DELETE FROM transactions WHERE txId = ?;`, [txId]);
      await this.saveWeb();
    } catch (e) {
      console.error('Error deleting transaction:', e);
      throw e;
    }
  }

  // ── Savings Goals ─────────────────────────────────────────────────

  async addGoal(goal: any) {
    await this.ensureDbReady();
    const sql = `
      INSERT INTO savings_goals (goalId, userId, name, targetAmount, currentAmount, deadline, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
    try {
      const result = await this.runSql(sql, [
        goal.goalId, goal.userId, goal.name,
        goal.targetAmount, goal.currentAmount ?? 0,
        goal.deadline ?? null,
        new Date().toISOString(), new Date().toISOString()
      ]);
      await this.saveWeb();
      return result;
    } catch (e) {
      console.error('Error adding goal:', e);
      throw e;
    }
  }

  async getGoals(userId: string) {
    await this.ensureDbReady();
    try {
      return await this.querySql(
        `SELECT * FROM savings_goals WHERE userId = ? ORDER BY createdAt DESC;`,
        [userId]
      );
    } catch (e) {
      console.error('Error fetching goals:', e);
      return [];
    }
  }

  // ── Loans ─────────────────────────────────────────────────────────

  async addLoan(loan: any) {
    await this.ensureDbReady();
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
      await this.saveWeb();
      return result;
    } catch (e) {
      console.error('Error adding loan:', e);
      throw e;
    }
  }

  async getLoans(userId: string) {
    await this.ensureDbReady();
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