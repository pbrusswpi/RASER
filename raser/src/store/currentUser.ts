//Manages the prototype application's current user identity.

import type { UserRole } from "../model";

const USER_KEY = "raser.current-users.v1";
type RoleIds = Partial<Record<UserRole, string>>;

function createId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `raser-user-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getCurrentUserId(role: UserRole): string {
  if (typeof window === "undefined") {
    return `server-${role.toLowerCase()}`;
  }
    
  let ids: RoleIds = {};
  const raw = window.localStorage.getItem(USER_KEY);
  if (raw) {
    try { 
      ids = JSON.parse(raw) as RoleIds; 
    } 
    catch { 
      ids = {}; 
    }
  }
  if (!ids[role]) {
    ids[role] = createId();
    window.localStorage.setItem(USER_KEY, JSON.stringify(ids));
  }
  return ids[role]!;
}
