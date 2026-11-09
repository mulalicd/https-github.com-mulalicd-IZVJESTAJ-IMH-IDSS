import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { FinancialProvider } from './lib/bilans/store';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <FinancialProvider>
    <App />
  </FinancialProvider>
);
