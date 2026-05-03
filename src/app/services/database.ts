import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private isDbReady: boolean = false; // Track if we are ready

  async initializeApp() {
    const platform = Capacitor.getPlatform();

    // 1. WEB SPECIFIC SETUP
    if (platform === 'web') {
      const jeepEl = document.querySelector('jeep-sqlite');
      if (jeepEl) {
        await (jeepEl as any).initWebStore();
      }
    }

    try {
      // 2. Open Connection
      this.db = await this.sqlite.createConnection('etracker_db', false, 'no-encryption', 1, false);
      await this.db.open();

      // 3. Fixed Schema (Removed AUTOINCREMENT from TEXT)
       const schema = `
                  -- 1. Users Table
            CREATE TABLE IF NOT EXISTS users (
                userId TEXT PRIMARY KEY ,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                name TEXT NOT NULL,
                createdAt TEXT NOT NULL,
                updatedAt TEXT NOT NULL
            );

            -- 2. Transactions Table (The heart of your app)
            CREATE TABLE IF NOT EXISTS transactions (
                txId TEXT PRIMARY KEY,
                userId TEXT NOT NULL,
                type TEXT NOT NULL, -- 'income' | 'expense'
                amount REAL NOT NULL,
                category TEXT NOT NULL, -- 'food', 'transport', etc.
                description TEXT,
                date TEXT NOT NULL,
                createdAt TEXT NOT NULL,
                updatedAt TEXT NOT NULL,
                FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
            );

            -- 3. Savings Goals Table
            CREATE TABLE IF NOT EXISTS savings_goals (
                goalId TEXT PRIMARY KEY,
                userId TEXT NOT NULL,
                name TEXT NOT NULL,
                targetAmount REAL NOT NULL,
                currentAmount REAL DEFAULT 0,
                deadline TEXT,
                createdAt TEXT NOT NULL,
                updatedAt TEXT NOT NULL,
                FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
            );

            -- 4. Contributions (Linked to Savings Goals)
            CREATE TABLE IF NOT EXISTS contributions (
                contributionId TEXT PRIMARY KEY,
                goalId TEXT NOT NULL,
                amount REAL NOT NULL,
                date TEXT NOT NULL,
                FOREIGN KEY (goalId) REFERENCES savings_goals(goalId) ON DELETE CASCADE
            );

            -- 5. Loans Table
            CREATE TABLE IF NOT EXISTS loans (
                loanId TEXT PRIMARY KEY,
                userId TEXT NOT NULL,
                creditor TEXT NOT NULL,
                creditorPhone TEXT,
                principal REAL NOT NULL,
                interestRate REAL DEFAULT 0,
                remainingBalance REAL NOT NULL,
                dueDate TEXT,
                type TEXT NOT NULL, -- 'given' | 'taken'
                status TEXT NOT NULL, -- 'pending', 'active', etc.
                createdAt TEXT NOT NULL,
                updatedAt TEXT NOT NULL,
                FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
            );

            -- 6. Repayments (Linked to Loans)
            CREATE TABLE IF NOT EXISTS repayments (
                repaymentId TEXT PRIMARY KEY,
                loanId TEXT NOT NULL,
                amount REAL NOT NULL,
                date TEXT NOT NULL,
                notes TEXT,
                FOREIGN KEY (loanId) REFERENCES loans(loanId) ON DELETE CASCADE
            );

            -- 7. AI Advice Table (For history/logging)
            CREATE TABLE IF NOT EXISTS ai_advice (
                id TEXT PRIMARY KEY,
                userId TEXT NOT NULL,
                message TEXT NOT NULL,
                recommendation TEXT,
                potentialSavings REAL,
                isApplied INTEGER DEFAULT 0, -- 0 for false, 1 for true
                createdAt TEXT NOT NULL,
                FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
            );

            -- 8. Notifications Table
            CREATE TABLE IF NOT EXISTS notifications (
                notifId TEXT PRIMARY KEY,
                userId TEXT NOT NULL,
                message TEXT NOT NULL,
                type TEXT NOT NULL,
                read INTEGER DEFAULT 0, -- 0 for false, 1 for true
                data TEXT, -- Store stringified JSON here
                createdAt TEXT NOT NULL,
                FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
            );
    `;
      
      await this.db.execute(schema);
      this.isDbReady = true; // Mark as ready!
      console.log('Database Ready! 🚀');

    } catch (err) {
      console.error('Initialisation failed:', err);
    }
  }

  // Helper to ensure we don't call run() on undefined
  private async ensureDbReady() {
    if (!this.isDbReady || !this.db) {
      // Wait for initialization if called too early
      await this.initializeApp();
    }
  }

  async addUser(user: any) {
    await this.ensureDbReady(); // Safety check!

    const sql = `
      INSERT INTO users (userId, email, password, name, createdAt, updatedAt) 
      VALUES (?, ?, ?, ?, ?, ?);
    `;
    const params = [
      user.userId,
      user.email,
      user.password,
      user.name,
      user.createdAt,
      user.updatedAt
    ];

    try {
      const result = await this.db.run(sql, params);
      
      // CRITICAL FOR WEB: Save after every write!
      if (Capacitor.getPlatform() === 'web') {
        await this.sqlite.saveToStore('etracker_db');
      }
      
      return result;
    } catch (e) {
      console.error('Database Error:', e);
      throw e;
    }

  }
  // database.service.ts
async getUserByEmail(email: string) {
  await this.ensureDbReady();
  const sql = `SELECT * FROM users WHERE email = ? LIMIT 1;`;
  try {
    const result = await this.db.query(sql, [email.toLowerCase()]);
    return result.values && result.values.length > 0 ? result.values[0] : null;
  } catch (e) {
    console.error('Error fetching user:', e);
    return null;
  }
}
// database.service.ts

async getTransactions(userId: string) {
  await this.ensureDbReady();
  // Get latest transactions first
  const sql = `SELECT * FROM transactions WHERE userId = ? ORDER BY date DESC`;
  try {
    const result = await this.db.query(sql, [userId]);
    return result.values || [];
  } catch (e) {
    console.error('Error fetching transactions', e);
    return [];
  }
}
}