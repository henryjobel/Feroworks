const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.ok) {
    throw new Error(payload?.error?.message || "Request failed.");
  }

  return payload.data;
}

export const api = {
  getCms: () => request("/api/public/cms"),
  getBootstrap: (path) => request(`/api/public/bootstrap?path=${encodeURIComponent(path)}`),
  getMe: () => request("/api/auth/me"),
  login: (email, password) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  logout: () =>
    request("/api/auth/logout", {
      method: "POST",
    }),
  updateSection: (key, value) =>
    request(`/api/admin/section/${key}`, {
      method: "PUT",
      body: JSON.stringify({ value }),
    }),
  getAdminLeads: () => request("/api/admin/leads"),
  getStaff: () => request("/api/admin/staff"),
  createStaff: (payload) =>
    request("/api/admin/staff", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateStaff: (id, payload) =>
    request(`/api/admin/staff/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  replyToLead: (id, payload) =>
    request(`/api/admin/leads/${id}/reply`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getEmailSettings: () => request("/api/admin/settings/email"),
  updateEmailSettings: (payload) =>
    request("/api/admin/settings/email", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  sendTestEmail: (to) =>
    request("/api/admin/settings/email/test", {
      method: "POST",
      body: JSON.stringify({ to }),
    }),
  uploadCmsMedia: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return request("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
  },
  submitContact: (formData) =>
    request("/api/contact-submissions", {
      method: "POST",
      body: formData,
    }),
  subscribeNewsletter: (email) =>
    request("/api/newsletter-subscriptions", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
};
