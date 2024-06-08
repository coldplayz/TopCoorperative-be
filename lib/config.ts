export const DATABASE_URI = process.env.DATABASE_URI || 'mongodb://localhost:3456/';
export const DATABASE_NAME = 'top-coorperative';

// In production, generate with `openssl rand -{hex|base64} 32`
export const TEST_SECRET = '+/sNCZWWbEheSMykpsQPXkv8TWUJ7xcxBvhqhIFWTnw=';

export const RequestStatuses = {
  PENDING: 'pending',
  APPROVED: 'approved',
  DECLINED: 'declined',
};

export const UserRoles = {
  ADMIN: 'admin',
  USER: 'user',
};
