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

// Permissions for different categories of actors (users).
// Extra logic could be applied before op action is taken. E.g.,
// ...a req can only be deleted if it's not been approved yet;
// ...or a loan can be read by a user/actor only if it's theirs.
export const RequestResourceRBAC = {
  permissions: {
    createOwnRequest: [UserRoles.USER, UserRoles.ADMIN],
    createAnyRequest: [''],
    readOwnRequests: [UserRoles.USER, UserRoles.ADMIN],
    readOwnRequest: [UserRoles.USER, UserRoles.ADMIN],
    readAllRequests: [UserRoles.ADMIN],
    readAnyRequest: [UserRoles.ADMIN],
    editOwnRequest: [UserRoles.USER, UserRoles.ADMIN],
    editAnyRequest: [UserRoles.ADMIN],
    deleteOwnRequest: [UserRoles.USER, UserRoles.ADMIN],
    deleteAnyRequest: [UserRoles.ADMIN],
    approveAnyRequest: [UserRoles.ADMIN],
    declineAnyRequest: [UserRoles.ADMIN],
  },
};

export const LoanResourceRBAC = {
  permissions: {
    createOwnLoan: [''],
    createAnyLoan: [''],
    readOwnLoans: [UserRoles.USER, UserRoles.ADMIN],
    readOwnLoan: [UserRoles.USER, UserRoles.ADMIN],
    readAllLoans: [UserRoles.ADMIN],
    readAnyLoan: [UserRoles.ADMIN],
    editOwnLoan: [UserRoles.USER, UserRoles.ADMIN],
    editAnyLoan: [UserRoles.ADMIN],
    deleteOwnLoan: [''],
    deleteAnyLoan: [''],
  },
};

export const UserResourceRBAC = {
  permissions: {
    createOwnUserAccount: [UserRoles.USER, UserRoles.ADMIN],
    createAnyUserAccount: [''],
    readOwnUserAccount: [UserRoles.USER, UserRoles.ADMIN],
    readAllUserAccounts: [UserRoles.ADMIN],
    readAnyUserAccount: [UserRoles.ADMIN],
    editOwnUserAccount: [UserRoles.USER, UserRoles.ADMIN],
    editAnyUserAccount: [UserRoles.ADMIN],
    deleteOwnUserAccount: [UserRoles.USER, UserRoles.ADMIN],
    deleteAnyUserAccount: [UserRoles.ADMIN],
  },
};
