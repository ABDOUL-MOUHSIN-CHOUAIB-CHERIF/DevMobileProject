import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;

  async initializeApp() {
    // If on Web, you'd need the jeep-sqlite element, 
    // but we are focusing on your Android/APK build.
    
    this.db = await this.sqlite.createConnection(
      'etracker_db', 
      false, 
      'no-encryption', 
      1, 
      false
    );

    await this.db.open();
    
    // Create your tables immediately
    const schema = `
                  -- 1. Users Table
            CREATE TABLE IF NOT EXISTS users (
                userId TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                name TEXT NOT NULL,
                preferredLanguage TEXT  'en' | 'fr',
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
    console.log('Database Ready! 🚀');
  }

 
}