import { Request, Response, NextFunction } from "express";

import {
  RequestResourceRBAC,
} from "@/lib/config";
import { AuthenticatedRequest } from "@/types";

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
  const reqUserId = req.query?.userId || tknUserId;

  if (tknUserId !== reqUserId) {
    // check if allowed to  access any resource
    if (RequestResourceRBAC.permissions.readAllRequests.includes(role)) {
      // permitted; likely admin.
      return next();
    }

    // Not own resource, and not permitted to access just any.
    return res.status(403).json({
      success: false,
      error: 'Unauthorized',
    });
  }

  // Wants to access own resource
  if (RequestResourceRBAC.permissions.readOwnRequests.includes(role)) return next();
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
  const reqUserId = req.params?.id || tknUserId;

  if (tknUserId !== reqUserId) {
    // check if allowed to  access any resource
    if (RequestResourceRBAC.permissions.readAnyRequest.includes(role)) {
      // permitted; likely admin.
      return next();
    }

    // Not own resource, and not permitted to access just any.
    return res.status(403).json({
      success: false,
      error: 'Unauthorized',
    });
  }

  // Wants to access own resource
  if (RequestResourceRBAC.permissions.readOwnRequest.includes(role)) return next();
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
  const reqUserId = req.query?.userId || tknUserId;

  if (tknUserId !== reqUserId) {
    // check if allowed to access any resource
    if (RequestResourceRBAC.permissions.createAnyRequest.includes(role)) {
      // permitted; likely admin.
      return next();
    }

    // Not own resource, and not permitted to access just any.
    return res.status(403).json({
      success: false,
      error: 'Unauthorized',
    });
  }

  // Wants to access own resource
  if (RequestResourceRBAC.permissions.createOwnRequest.includes(role)) return next();
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
  const reqUserId = req.query?.userId || tknUserId;

  if (tknUserId !== reqUserId) {
    // check if allowed to  access any resource
    if (RequestResourceRBAC.permissions.editAnyRequest.includes(role)) {
      // permitted; likely admin.
      return next();
    }

    // Not own resource, and not permitted to access just any.
    return res.status(403).json({
      success: false,
      error: 'Unauthorized',
    });
  }

  // Wants to access own resource
  if (RequestResourceRBAC.permissions.editOwnRequest.includes(role)) return next();
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
  const reqUserId = req.query?.userId || tknUserId;

  if (tknUserId !== reqUserId) {
    // check if allowed to  access any resource
    if (RequestResourceRBAC.permissions.deleteAnyRequest.includes(role)) {
      // permitted; likely admin.
      return next();
    }

    // Not own resource, and not permitted to access just any.
    return res.status(403).json({
      success: false,
      error: 'Unauthorized',
    });
  }

  // Wants to access own resource
  if (RequestResourceRBAC.permissions.deleteOwnRequest.includes(role)) return next();
}

// ======= Loans =======
