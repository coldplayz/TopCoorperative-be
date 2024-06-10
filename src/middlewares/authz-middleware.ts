import { Request, Response, NextFunction } from "express";

import {
  LoanResourceRBAC,
  RequestResourceRBAC,
  UserResourceRBAC,
} from "@/lib/config";
import { AuthenticatedRequest } from "@/types";

const log = console.log // SCAFF

// ======= Requests =======

/**
 * Ensures that for this resource (own or not),
 * ...the user has adequate permissions to access.
 *
 * Algorithm:
 * 1. check if accessing own resources, or not
 * 2. check if permitted to access resource
 */
export async function verifyReadRequestsAuthz(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const role = req.user.role;
  const tknUserId = req.user.id;
  // query-specified ID takes precedence
  const reqUserId = req.query?.userId as string || '';
  
  if (tknUserId !== reqUserId) {
    // check if allowed to  access any or all resources
    if (reqUserId) {
      if (RequestResourceRBAC.permissions.readAnyRequests.includes(role)) {
        // permitted; likely admin. Read any user specified
        req.user.reqUserId = reqUserId;
        req.user.permissions.canReadAny = true;
        return next();
      }
    }

    if (reqUserId === '') {
      if (RequestResourceRBAC.permissions.readAllRequests.includes(role)) {
        // Likely admin; read all users
        req.user.permissions.canReadAll = true;
        return next();
      }
    }
  }

  // Wants to access own resource
  if (RequestResourceRBAC.permissions.readOwnRequests.includes(role)) {
    req.user.reqUserId = tknUserId;
    req.user.permissions.canReadOwn = true;
    return next();
  }

  return res.status(403).json({
    success: false,
    error: 'Unauthorized',
  });
}

/**
 * Ensures that for this resource (own or not),
 * ...the user has adequate permissions to access.
 *
 * Algorithm:
 * 1. check if accessing own resources, or not
 * 2. check if permitted to access resource
 */
export async function verifyReadRequestAuthz(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const role = req.user.role;
  const tknUserId = req.user.id;
  const reqUserId = req.query?.id as string || '';

  if (tknUserId !== reqUserId) {
    if (reqUserId) {
      // check if allowed to access any or all resources
      if (RequestResourceRBAC.permissions.readAnyRequest.includes(role)) {
        // permitted for any; likely admin.
        req.user.reqUserId = reqUserId;
        req.user.permissions.canReadAny = true;
        return next();
      } else {
        // Trying to access other user's resource
        return unauthorize(res);
      }
    }
  }

  if (RequestResourceRBAC.permissions.readAnyRequest.includes(role)) {
    // likely admin; permitted for any
    req.user.reqUserId = tknUserId;
    req.user.permissions.canReadAny = true;
    return next();
  }

  // Wants to access own resource
  if (RequestResourceRBAC.permissions.readOwnRequest.includes(role)) {
    req.user.reqUserId = tknUserId;
    req.user.permissions.canReadOwn = true;
    return next();
  }

  return res.status(403).json({
    success: false,
    error: 'Unauthorized',
  });
}

/**
 * Ensures that for this resource (own or not),
 * ...the user has adequate permissions to access.
 *
 * Algorithm:
 * 1. check if accessing own resources, or not
 * 2. check if permitted to access resource
 */
export async function verifyCreateRequestAuthz(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const role = req.user.role;
  const tknUserId = req.user.id;
  const reqUserId = req.query?.userId as string || '';

  if (tknUserId !== reqUserId) {
    if (reqUserId) {
      // check if allowed to access any or all resources
      if (RequestResourceRBAC.permissions.createAnyRequest.includes(role)) {
        // permitted for any; likely admin.
        req.user.reqUserId = reqUserId;
        req.user.permissions.canCreateAny = true;
        return next();
      } else {
        // Trying to access other user's resource
        return unauthorize(res);
      }
    }
  }

  // Wants to access own resource
  if (RequestResourceRBAC.permissions.createOwnRequest.includes(role)) {
    req.user.reqUserId = tknUserId;
    req.user.permissions.canCreateOwn = true;
    return next();
  }

  return res.status(403).json({
    success: false,
    error: 'Unauthorized',
  });
}

/**
 * Ensures that for this resource (own or not),
 * ...the user has adequate permissions to access.
 *
 * Algorithm:
 * 1. check if accessing own resources, or not
 * 2. check if permitted to access resource
 */
export async function verifyEditRequestAuthz(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const role = req.user.role;
  const tknUserId = req.user.id;
  // query-specified ID takes precedence
  const reqUserId = req.query?.userId as string || '';

  if (tknUserId !== reqUserId) {
    if (reqUserId) {
      // check if allowed to access any or all resources
      if (RequestResourceRBAC.permissions.editAnyRequest.includes(role)) {
        // permitted for any; likely admin.
        req.user.reqUserId = reqUserId;
        req.user.permissions.canEditAny = true;
        return next();
      } else {
        // Trying to access other user's resource
        return unauthorize(res);
      }
    }
  }

  if (RequestResourceRBAC.permissions.editAnyRequest.includes(role)) {
    // likely admin; permitted for any
    req.user.reqUserId = tknUserId;
    req.user.permissions.canEditAny = true;
    return next();
  }

  // Wants to access own resource
  if (RequestResourceRBAC.permissions.editOwnRequest.includes(role)) {
    req.user.reqUserId = tknUserId;
    req.user.permissions.canEditOwn = true;
    return next();
  }

  return res.status(403).json({
    success: false,
    error: 'Unauthorized',
  });
}

/**
 * Ensures that for this resource (own or not),
 * ...the user has adequate permissions to access.
 *
 * Algorithm:
 * 1. check if accessing own resources, or not
 * 2. check if permitted to access resource
 */
export async function verifyDeleteRequestAuthz(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const role = req.user.role;
  const tknUserId = req.user.id;
  // query-specified ID takes precedence
  const reqUserId = req.query?.userId as string || '';

  if (tknUserId !== reqUserId) {
    if (reqUserId) {
      // check if allowed to access any or all resources
      if (RequestResourceRBAC.permissions.deleteAnyRequest.includes(role)) {
        // permitted for any; likely admin.
        req.user.reqUserId = reqUserId;
        req.user.permissions.canDeleteAny = true;
        return next();
      } else {
        // Trying to access other user's resource
        return unauthorize(res);
      }
    }
  }

  if (RequestResourceRBAC.permissions.deleteAnyRequest.includes(role)) {
    // likely admin; permitted for any
    req.user.reqUserId = tknUserId;
    req.user.permissions.canDeleteAny = true;
    return next();
  }

  // Wants to access own resource
  if (RequestResourceRBAC.permissions.deleteOwnRequest.includes(role)) {
    req.user.reqUserId = tknUserId;
    req.user.permissions.canDeleteOwn = true;
    return next();
  }

  return res.status(403).json({
    success: false,
    error: 'Unauthorized',
  });
}

export async function verifyApproveRequestAuthz(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const role = req.user.role;

  if (RequestResourceRBAC.permissions.approveAnyRequest.includes(role)) {
    req.user.permissions.canApproveAny = true;
    return next();
  } else {
    return unauthorize(res);
  }
}

export async function verifyDeclineRequestAuthz(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const role = req.user.role;

  if (RequestResourceRBAC.permissions.declineAnyRequest.includes(role)) {
    req.user.permissions.canDeclineAny = true;
    return next();
  } else {
    return unauthorize(res);
  }
}

// ======= Loans =======

/**
 * Ensures that for this resource (own or not),
 * ...the user has adequate permissions to access.
 *
 * Algorithm:
 * 1. check if accessing own resources, or not
 * 2. check if permitted to access resource
 */
export async function verifyReadLoansAuthz(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const role = req.user.role;
  const tknUserId = req.user.id;
  // query-specified ID takes precedence
  const reqUserId = req.query?.userId as string || '';

  if (tknUserId !== reqUserId) {
    if (reqUserId) {
      // check if allowed to access any or all resources
      if (LoanResourceRBAC.permissions.readAnyLoans.includes(role)) {
        // permitted for any; likely admin.
        req.user.reqUserId = reqUserId;
        req.user.permissions.canReadAny = true;
        return next();
      } else {
        // Trying to access other user's resource
        return unauthorize(res);
      }
    }

    // log('in get all users'); // SCAFF
    if (reqUserId === '') {
      if (LoanResourceRBAC.permissions.readAllLoans.includes(role)) {
        // permitted for all; likely admin
        req.user.permissions.canReadAll = true;
        return next();
      }
    }
  }

  // Wants to access own resource
  if (LoanResourceRBAC.permissions.readOwnLoans.includes(role)) {
    req.user.reqUserId = tknUserId;
    req.user.permissions.canReadOwn = true;
    return next();
  }

  return res.status(403).json({
    success: false,
    error: 'Unauthorized',
  });
}

/**
 * Ensures that for this resource (own or not),
 * ...the user has adequate permissions to access.
 *
 * Algorithm:
 * 1. check if accessing own resources, or not
 * 2. check if permitted to access resource
 */
export async function verifyReadLoanAuthz(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const role = req.user.role;
  const tknUserId = req.user.id;
  const reqUserId = req.query?.id as string || '';

  if (tknUserId !== reqUserId) {
    if (reqUserId) {
      // check if allowed to access any or all resources
      if (LoanResourceRBAC.permissions.readAnyLoan.includes(role)) {
        // permitted for any; likely admin.
        req.user.reqUserId = reqUserId;
        req.user.permissions.canReadAny = true;
        return next();
      } else {
        // Trying to access other user's resource
        return unauthorize(res);
      }
    }
  }

  if (LoanResourceRBAC.permissions.readAnyLoan.includes(role)) {
    // likely admin; permitted for any
    req.user.reqUserId = tknUserId;
    req.user.permissions.canReadAny = true;
    return next();
  }

  // Wants to access own resource
  if (LoanResourceRBAC.permissions.readOwnLoan.includes(role)) {
    req.user.reqUserId = tknUserId;
    req.user.permissions.canReadOwn = true;
    return next();
  }

  return res.status(403).json({
    success: false,
    error: 'Unauthorized',
  });
}

/**
 * Ensures that for this resource (own or not),
 * ...the user has adequate permissions to access.
 *
 * Algorithm:
 * 1. check if accessing own resources, or not
 * 2. check if permitted to access resource
 */
export async function verifyCreateLoanAuthz(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const role = req.user.role;
  const tknUserId = req.user.id;
  const reqUserId = req.query?.userId as string || '';

  if (tknUserId !== reqUserId) {
    if (reqUserId) {
      // check if allowed to access any or all resources
      if (LoanResourceRBAC.permissions.createAnyLoan.includes(role)) {
        // permitted for any; likely admin.
        req.user.reqUserId = reqUserId;
        req.user.permissions.canCreateAny = true;
        return next();
      } else {
        // Trying to access other user's resource
        return unauthorize(res);
      }
    }
  }

  // Wants to access own resource
  if (LoanResourceRBAC.permissions.createOwnLoan.includes(role)) {
    req.user.reqUserId = tknUserId;
    req.user.permissions.canCreateOwn = true;
    return next();
  }

  return res.status(403).json({
    success: false,
    error: 'Unauthorized',
  });
}

/**
 * Ensures that for this resource (own or not),
 * ...the user has adequate permissions to access.
 *
 * Algorithm:
 * 1. check if accessing own resources, or not
 * 2. check if permitted to access resource
 */
export async function verifyEditLoanAuthz(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const role = req.user.role;
  const tknUserId = req.user.id;
  // query-specified ID takes precedence
  const reqUserId = req.query?.userId as string || '';

  if (tknUserId !== reqUserId) {
    if (reqUserId) {
      // check if allowed to access any or all resources
      if (LoanResourceRBAC.permissions.editAnyLoan.includes(role)) {
        // permitted for any; likely admin.
        req.user.reqUserId = reqUserId;
        req.user.permissions.canEditAny = true;
        return next();
      } else {
        // Trying to access other user's resource
        return unauthorize(res);
      }
    }
  }

  if (LoanResourceRBAC.permissions.editAnyLoan.includes(role)) {
    // likely admin; permitted for any
    req.user.reqUserId = tknUserId;
    req.user.permissions.canEditAny = true;
    return next();
  }

  // Wants to access own resource
  if (LoanResourceRBAC.permissions.editOwnLoan.includes(role)) {
    req.user.reqUserId = tknUserId;
    req.user.permissions.canEditOwn = true;
    return next();
  }

  return res.status(403).json({
    success: false,
    error: 'Unauthorized',
  });
}

export async function verifyPayLoanAuthz(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const role = req.user.role;

  if (
    LoanResourceRBAC.permissions.payOwnLoan.includes(role)
    || LoanResourceRBAC.permissions.payAnyLoan.includes(role)
  ) {
    // req.user.permissions.canDeclineAny = true;
    return next();
  } else {
    return unauthorize(res);
  }
}

/**
 * Ensures that for this resource (own or not),
 * ...the user has adequate permissions to access.
 *
 * Algorithm:
 * 1. check if accessing own resources, or not
 * 2. check if permitted to access resource
 */
export async function verifyDeleteLoanAuthz(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const role = req.user.role;
  const tknUserId = req.user.id;
  // query-specified ID takes precedence
  const reqUserId = req.query?.userId as string || '';

  if (tknUserId !== reqUserId) {
    if (reqUserId) {
      // check if allowed to access any or all resources
      if (LoanResourceRBAC.permissions.deleteAnyLoan.includes(role)) {
        // permitted for any; likely admin.
        req.user.reqUserId = reqUserId;
        req.user.permissions.canDeleteAny = true;
        return next();
      } else {
        // Trying to access other user's resource
        return unauthorize(res);
      }
    }
  }

  if (LoanResourceRBAC.permissions.deleteAnyLoan.includes(role)) {
    // likely admin; permitted for any
    req.user.reqUserId = tknUserId;
    req.user.permissions.canDeleteAny = true;
    return next();
  }

  // Wants to access own resource
  if (LoanResourceRBAC.permissions.deleteOwnLoan.includes(role)) {
    req.user.reqUserId = tknUserId;
    req.user.permissions.canDeleteOwn = true;
    return next();
  }

  return res.status(403).json({
    success: false,
    error: 'Unauthorized',
  });
}

// ======= Users =======

/**
 * Ensures that for this resource (own or not),
 * ...the user has adequate permissions to access.
 *
 * Algorithm:
 * 1. check if accessing own resources, or not
 * 2. check if permitted to access resource
 */
export async function verifyReadUsersAuthz(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const role = req.user.role;
  const tknUserId = req.user.id;
  // query-specified ID takes precedence
  let reqUserId = req.query?.userId as string || '';

  if (tknUserId !== reqUserId) {
    if (reqUserId) {
      // check if allowed to access any or all resources
      if (UserResourceRBAC.permissions.readAnyUserAccount.includes(role)) {
        // permitted for any; likely admin.
        req.user.reqUserId = reqUserId;
        req.user.permissions.canReadAny = true;
        return next();
      } else {
        // Trying to access other user's resource
        return unauthorize(res);
      }
    }

    // log('in get all users'); // SCAFF
    if (reqUserId === '') {
      if (UserResourceRBAC.permissions.readAllUserAccounts.includes(role)) {
        // permitted for all; likely admin
        req.user.permissions.canReadAll = true;
        return next();
      }
    }
  }

  // Wants to access own resource
  if (UserResourceRBAC.permissions.readOwnUserAccount.includes(role)) {
    req.user.reqUserId = tknUserId;
    req.user.permissions.canReadOwn = true;
    return next();
  }

  return res.status(403).json({
    success: false,
    error: 'Unauthorized',
  });
}

/**
 * Ensures that for this resource (own or not),
 * ...the user has adequate permissions to access.
 *
 * Algorithm:
 * 1. check if accessing own resources, or not
 * 2. check if permitted to access resource
 */
export async function verifyReadUserAuthz(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const role = req.user.role;
  const tknUserId = req.user.id;
  const reqUserId = req.params?.id || '';

  if (tknUserId !== reqUserId) {
    if (reqUserId) {
      // check if allowed to access any or all resources
      if (UserResourceRBAC.permissions.readAnyUserAccount.includes(role)) {
        // permitted for any; likely admin.
        req.user.reqUserId = reqUserId;
        req.user.permissions.canReadAny = true;
        return next();
      } else {
        // Trying to access other user's resource
        return unauthorize(res);
      }
    }
  }

  // Wants to access own resource
  if (UserResourceRBAC.permissions.readOwnUserAccount.includes(role)) {
    req.user.reqUserId = tknUserId;
    req.user.permissions.canReadOwn = true;
    return next();
  }

  return res.status(403).json({
    success: false,
    error: 'Unauthorized',
  });
}

/**
 * Ensures that for this resource (own or not),
 * ...the user has adequate permissions to access.
 *
 * Algorithm:
 * 1. check if accessing own resources, or not
 * 2. check if permitted to access resource
 */
export async function verifyCreateUserAuthz(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const role = req.user.role;
  const tknUserId = req.user.id;
  const reqUserId = req.query?.userId as string || '';

  if (tknUserId !== reqUserId) {
    if (reqUserId) {
      // check if allowed to access any or all resources
      if (UserResourceRBAC.permissions.createAnyUserAccount.includes(role)) {
        // permitted for any; likely admin.
        req.user.reqUserId = reqUserId;
        req.user.permissions.canCreateAny = true;
        return next();
      } else {
        // Trying to access other user's resource
        return unauthorize(res);
      }
    }
  }

  // Wants to access own resource
  if (UserResourceRBAC.permissions.createOwnUserAccount.includes(role)) {
    req.user.reqUserId = tknUserId;
    req.user.permissions.canCreateOwn = true;
    return next();
  }

  return res.status(403).json({
    success: false,
    error: 'Unauthorized',
  });
}

/**
 * Ensures that for this resource (own or not),
 * ...the user has adequate permissions to access.
 *
 * Algorithm:
 * 1. check if accessing own resources, or not
 * 2. check if permitted to access resource
 */
export async function verifyEditUserAuthz(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const role = req.user.role;
  const tknUserId = req.user.id;
  const reqUserId = req.params?.id || '';

  if (tknUserId !== reqUserId) {
    if (reqUserId) {
      // check if allowed to access any or all resources
      if (UserResourceRBAC.permissions.editAnyUserAccount.includes(role)) {
        // permitted for any; likely admin.
        req.user.reqUserId = reqUserId;
        req.user.permissions.canEditAny = true;
        return next();
      } else {
        // Trying to access other user's resource
        return unauthorize(res);
      }
    }
  }

  if (UserResourceRBAC.permissions.editAnyUserAccount.includes(role)) {
    // likely admin; permitted for any
    req.user.reqUserId = tknUserId;
    req.user.permissions.canEditAny = true;
    return next();
  }

  // Wants to access own resource
  if (UserResourceRBAC.permissions.editOwnUserAccount.includes(role)) {
    req.user.reqUserId = tknUserId;
    req.user.permissions.canEditOwn = true;
    return next();
  }

  return res.status(403).json({
    success: false,
    error: 'Unauthorized',
  });
}

/**
 * Ensures that for this resource (own or not),
 * ...the user has adequate permissions to access.
 *
 * Algorithm:
 * 1. check if accessing own resources, or not
 * 2. check if permitted to access resource
 */
export async function verifyDeleteUserAuthz(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const role = req.user.role;
  const tknUserId = req.user.id;
  const reqUserId = req.params?.id || '';

  if (tknUserId !== reqUserId) {
    if (reqUserId) {
      // check if allowed to access any or all resources
      if (UserResourceRBAC.permissions.deleteAnyUserAccount.includes(role)) {
        // permitted for any; likely admin.
        req.user.reqUserId = reqUserId;
        req.user.permissions.canDeleteAny = true;
        return next();
      } else {
        // Trying to access other user's resource
        return unauthorize(res);
      }
    }
  }

  if (UserResourceRBAC.permissions.deleteAnyUserAccount.includes(role)) {
    // likely admin; permitted for any
    req.user.reqUserId = tknUserId;
    req.user.permissions.canDeleteAny = true;
    return next();
  }

  // Wants to access own resource
  if (UserResourceRBAC.permissions.deleteOwnUserAccount.includes(role)) {
    req.user.reqUserId = tknUserId;
    req.user.permissions.canDeleteOwn = true;
    return next();
  }

  return res.status(403).json({
    success: false,
    error: 'Unauthorized',
  });
}

const unauthorize = (res: Response) => {
  return res.status(403).json({
    success: false,
    error: 'Unauthorized',
  });
};
