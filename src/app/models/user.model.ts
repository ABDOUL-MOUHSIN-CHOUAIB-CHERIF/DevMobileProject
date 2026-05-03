// models/user.model.ts
export interface User {
  userId: string;
  email: string;
  password: string;  // hashed
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
 
export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserProfile {
  name: string;
  email: string;
  preferredLanguage: string;
}