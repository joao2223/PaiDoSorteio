import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { AuthProvider } from './authContext';
import { TemaProvider } from './temaContext'; // Importe o TemaProvider
import AppRouter from './routes';
import styles from './App.module.scss';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <TemaProvider> 
        <div className={styles.container}>
          <div className={styles.cor}>
            <AppRouter />
          </div>
        </div>
      </TemaProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);