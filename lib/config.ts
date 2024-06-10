import * as AuthZ from "@/src/middlewares/authz-middleware";

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

export const Routes = {
  auth: {
    signin: { path: '/signin' },
    signout: { path: '/signout' },
    refreshToken: { path: 'refresh-token' },
  },
  user: {
    getUsers: { path: '/' },
    getUserById: { path: '/:id' },
    createUser: { path: '/' },
    editUserById: { path: '/:id' },
    deleteUserById: { path: ':id' },
  },
  loan: {
    getLoans: { path: '/' },
    getLoanById: { path: '/:id' },
    createLoan: { path: '/' },
    editLoanById: { path: '/:id' },
    payLoanById: { path: '/:id/pay' },
    deleteLoanById: { path: ':id' },
  },
  request: {
    getRequests: { path: '/' },
    getRequestById: { path: '/:id' },
    createRequest: { path: '/' },
    editRequestById: { path: '/:id' },
    approveRequestById: { path: '/:id/approve' },
    declineRequestById: { path: '/:id/decline' },
    deleteRequestById: { path: ':id' },
  },
};

export const routeAuthzMap = new Map();
const routeAuthzVector = [
  // loans
  [Routes.loan.createLoan, AuthZ.verifyCreateLoanAuthz],
  [Routes.loan.deleteLoanById, AuthZ.verifyDeleteLoanAuthz],
  [Routes.loan.editLoanById, AuthZ.verifyEditLoanAuthz],
  [Routes.loan.payLoanById, AuthZ.verifyPayLoanAuthz],
  [Routes.loan.getLoanById, AuthZ.verifyReadLoanAuthz],
  [Routes.loan.getLoans, AuthZ.verifyReadLoansAuthz],
  // requests
  [Routes.request.createRequest, AuthZ.verifyCreateRequestAuthz],
  [Routes.request.deleteRequestById, AuthZ.verifyDeleteRequestAuthz],
  [Routes.request.editRequestById, AuthZ.verifyEditRequestAuthz],
  [Routes.request.approveRequestById, AuthZ.verifyApproveRequestAuthz],
  [Routes.request.declineRequestById, AuthZ.verifyDeclineRequestAuthz],
  [Routes.request.getRequestById, AuthZ.verifyReadRequestAuthz],
  [Routes.request.getRequests, AuthZ.verifyReadRequestsAuthz],
  // users
  [Routes.user.createUser, AuthZ.verifyCreateUserAuthz],
  [Routes.user.deleteUserById, AuthZ.verifyDeleteUserAuthz],
  [Routes.user.editUserById, AuthZ.verifyEditUserAuthz],
  [Routes.user.getUserById, AuthZ.verifyReadUserAuthz],
  [Routes.user.getUsers, AuthZ.verifyReadUsersAuthz],
];

routeAuthzVector.forEach(([route, authz]) => routeAuthzMap.set(route, authz));

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
    readAnyRequests: [UserRoles.ADMIN],
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
    readAnyLoans: [UserRoles.ADMIN],
    readAnyLoan: [UserRoles.ADMIN],
    editOwnLoan: [UserRoles.USER, UserRoles.ADMIN],
    editAnyLoan: [UserRoles.ADMIN],
    payAnyLoan: [UserRoles.ADMIN],
    payOwnLoan: [UserRoles.USER, UserRoles.ADMIN],
    deleteOwnLoan: [''],
    deleteAnyLoan: [UserRoles.ADMIN],
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
