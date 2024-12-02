import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Debug log environment variables (redact sensitive info)
console.log('Auth0 Config:', {
  domain: process.env.REACT_APP_AUTH0_DOMAIN ? 'Set' : 'Missing',
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID ? 'Set' : 'Missing',
  audience: process.env.REACT_APP_AUTH0_AUDIENCE ? 'Set' : 'Missing'
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Verify environment variables are set
if (!process.env.REACT_APP_AUTH0_DOMAIN) {
  throw new Error('Missing AUTH0_DOMAIN environment variable');
}
if (!process.env.REACT_APP_AUTH0_CLIENT_ID) {
  throw new Error('Missing AUTH0_CLIENT_ID environment variable');
}
if (!process.env.REACT_APP_AUTH0_AUDIENCE) {
  throw new Error('Missing AUTH0_AUDIENCE environment variable');
}

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      useRefreshTokens={true}
      cacheLocation="localstorage"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope: "openid profile email offline_access"
      }}
      onRedirectCallback={(appState) => {
        console.log("Redirect callback", appState);
        // Ensure we're redirecting to the right place
        window.history.replaceState(
          {},
          document.title,
          appState?.returnTo || window.location.pathname
        );
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);

reportWebVitals();