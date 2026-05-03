import { Injectable } from '@angular/core';
import * as bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root',
})
export class hasher { // Renamed to Service for clarity

  // hash function for the signup or registration 
  async hashPassword(password: string): Promise<string> {
    // 10 is the standard cost factor - secure but fast enough for mobile
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  // compare function for the login logic
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}