import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// التحقق من أن عنصر "root" موجود قبل محاولة الوصول إليه
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root element not found");
}

// إنشاء الجذر باستخدام عنصر "root" وتأكيد وجوده
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
