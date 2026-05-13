export const ALL_PERMISSION = "*";

export const PERMISSIONS = [
  { key: "dashboard.view", label: "Dashboard bekijken" },
  { key: "content.homepage", label: "Homepage beheren" },
  { key: "content.about", label: "Over ons beheren" },
  { key: "content.pages", label: "Pagina's en SEO beheren" },
  { key: "collections.blog", label: "Blog beheren" },
  { key: "collections.services", label: "Diensten beheren" },
  { key: "collections.sectors", label: "Sectoren beheren" },
  { key: "leads.view", label: "Leads bekijken" },
  { key: "leads.reply", label: "Leads beantwoorden" },
  { key: "settings.manage", label: "Instellingen beheren" },
  { key: "staff.manage", label: "Staff en rollen beheren" },
];

export const ROLE_PRESETS = [
  {
    key: "owner",
    label: "Owner",
    description: "Volledige toegang inclusief staff- en platformbeheer.",
    permissions: [ALL_PERMISSION],
  },
  {
    key: "admin",
    label: "Admin",
    description: "Bijna volledige toegang voor dagelijkse operatie en contentbeheer.",
    permissions: PERMISSIONS.filter((item) => item.key !== "staff.manage").map((item) => item.key),
  },
  {
    key: "editor",
    label: "Editor",
    description: "Content- en collectiebeheer zonder leads, settings of staff.",
    permissions: [
      "dashboard.view",
      "content.homepage",
      "content.about",
      "content.pages",
      "collections.blog",
      "collections.services",
      "collections.sectors",
    ],
  },
  {
    key: "marketing",
    label: "Marketing",
    description: "SEO, pagina's en blog/content gericht beheer.",
    permissions: [
      "dashboard.view",
      "content.homepage",
      "content.pages",
      "collections.blog",
      "settings.manage",
    ],
  },
  {
    key: "sales",
    label: "Sales",
    description: "Leadopvolging en dashboardinzichten.",
    permissions: [
      "dashboard.view",
      "leads.view",
      "leads.reply",
    ],
  },
];

export function getRolePreset(roleKey) {
  return ROLE_PRESETS.find((role) => role.key === roleKey) || ROLE_PRESETS[1];
}

export function normalizePermissions(roleKey, customPermissions = []) {
  const rolePermissions = getRolePreset(roleKey).permissions;
  if (rolePermissions.includes(ALL_PERMISSION)) {
    return [ALL_PERMISSION];
  }

  const validKeys = new Set(PERMISSIONS.map((item) => item.key));
  const extras = Array.isArray(customPermissions) ? customPermissions.filter((item) => validKeys.has(item)) : [];
  return Array.from(new Set([...rolePermissions, ...extras]));
}

export function hasPermission(userLike, permission) {
  const permissions = userLike?.permissions || [];
  return permissions.includes(ALL_PERMISSION) || permissions.includes(permission);
}

export function serializeAdminUser(user) {
  const role = user?.role || "admin";
  const permissions = normalizePermissions(role, user?.permissions);

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role,
    permissions,
    isActive: Boolean(user.isActive),
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

