import { Role } from "@prisma/client";

/**
 * Role constants to avoid hardcoded strings throughout the codebase
 */
export const ROLES = {
  ADMIN: "ADMIN" as Role,
  BUYER: "BUYER" as Role,
  PROBLEM_SOLVER: "PROBLEM_SOLVER" as Role,
} as const;

/**
 * Array of all valid roles
 */
export const ALL_ROLES = Object.values(ROLES);

/**
 * Type guard to check if a string is a valid role
 */
export const isValidRole = (role: string): role is Role => {
  return ALL_ROLES.includes(role as Role);
};
