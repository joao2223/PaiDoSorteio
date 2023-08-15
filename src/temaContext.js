import React, { createContext, useContext, useEffect, useState } from 'react';

const TemaContext = createContext();

export const useTema = () => useContext(TemaContext);

export const TemaProvider = ({ children }) => {
    const [cor, setCor] = useState(localStorage.getItem('temaCor') || 'claro'); // Pega do localStorage ou define como 'claro' se não existir

    const mudarTema = () => {
        const novaCor = cor === 'claro' ? 'escuro' : 'claro';
        setCor(novaCor);
        localStorage.setItem('temaCor', novaCor); // Salva no localStorage
    };

    useEffect(() => {
        document.body.classList.remove('claro', 'escuro'); // Remove as classes de tema anteriores
        document.body.classList.add(cor); // Adiciona a classe de tema atual
    }, [cor]);

    return (
        <TemaContext.Provider value={{ cor, mudarTema }}>
            {children}
        </TemaContext.Provider>
    );
};