export const ROLES = {
  Admin: 'Admin',
  Chairman: 'Chairman',
  Officer: 'Officer',
  SeniorOfficer: 'Senior Officer',
}

export function hasRole(userRole: string, allowedRoles: string[]) {
  return allowedRoles.includes(userRole)
}
