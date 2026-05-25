import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './app/query-client';
import { App } from './app/router';
import './index.css';
const root = document.getElementById('app');
if (root === null)
    throw new Error('Root element #app not found');
createRoot(root).render(_jsx(StrictMode, { children: _jsx(QueryClientProvider, { client: queryClient, children: _jsx(App, {}) }) }));
