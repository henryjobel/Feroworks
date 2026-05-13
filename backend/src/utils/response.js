export function ok(res, data, meta) {
  return res.json({ ok: true, data, meta: meta ?? null });
}

export function fail(res, status, message, details) {
  return res.status(status).json({
    ok: false,
    error: {
      message,
      details: details ?? null,
    },
  });
}
