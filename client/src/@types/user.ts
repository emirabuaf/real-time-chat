export interface User {
  email: string;
  password: string | number;
  createdAt: Date;
  _id: string;
  isCurrent?: boolean;
}