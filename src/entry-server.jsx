import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";

export function render(url, cms) {
  const html = renderToString(
    <AuthProvider>
      <App RouterComponent={StaticRouter} routerProps={{ location: url }} initialCms={cms} />
    </AuthProvider>,
  );

  return { html };
}
