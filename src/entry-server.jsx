import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import { LanguageProvider } from "./i18n/LanguageContext.jsx";

export function render(url, cms) {
  const html = renderToString(
    <AuthProvider>
      <LanguageProvider>
        <App RouterComponent={StaticRouter} routerProps={{ location: url }} initialCms={cms} />
      </LanguageProvider>
    </AuthProvider>,
  );

  return { html };
}
