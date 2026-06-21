import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import AdminApp from './admin/AdminApp.tsx';
import { getBrowserPathname, isAdminPath } from './admin/adminRoutes.ts';
import './index.css';

const RootApp = isAdminPath(getBrowserPathname()) ? AdminApp : App;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootApp />
  </StrictMode>,
);
