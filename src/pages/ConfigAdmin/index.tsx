import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ConfigAdmin.module.scss';
import rifados from '../../assets/Inicio/rifados.jpg';
import logoSrc from '../../assets/logo.svg';
import IImagens from '../../interfaces/IImagens';

export default function ConfigAdmin() {
    const [imgHomePage, setImgHomePage] = useState<string>("");
    const [imgLogo, setImgLogo] = useState<string>("");
    const[imagens, setImagens] = useState<IImagens>();

    useEffect(() => {
        axios.get('https://site-rifa-70b9f8e109e5.herokuapp.com/home-pages/1')
            .then(resposta => {
                setImagens(resposta.data);
            })
            .catch(erro => {
                console.log(erro);
            });
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const requestData = {
            imgHomePage: imgHomePage,
            imgLogo: imgLogo,
        };

        axios.put('https://site-rifa-70b9f8e109e5.herokuapp.com/home-pages/1', requestData)
            .then((resposta) => {
                setImgHomePage(imgHomePage);
                setImgLogo(imgLogo);
            })
            .catch((erro) => {
                console.log(erro);
            });
    };

    return (
        <>
            <h2 className={styles.titulo}>Configurações</h2>

            <div className={styles.container_imagens}>
                <div className={styles.titulo_mais_imagem}>
                    <p>Banner atual:</p>
                    <img src={imagens?.imgHomePage} alt="" className={styles.imagem} />
                </div>

                <div>
                    <p>Logo atual:</p>
                    <img src={imagens?.imgLogo} alt="" className={styles.imagem} />
                </div>
            </div>

            <div className={styles.centraliza}>
                <form onSubmit={handleSubmit} className={styles.container_formulario}>
                    <input
                        type="text"
                        placeholder="Digite o link do banner principal"
                        className={styles.input}
                        value={imgHomePage}
                        onChange={(e) => setImgHomePage(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Digite o link da logo"
                        className={styles.input}
                        value={imgLogo}
                        onChange={(e) => setImgLogo(e.target.value)}
                    />
                    <button type="submit" className={styles.botao_atualizar}>
                        Atualizar
                    </button>
                </form>
            </div>
        </>
    );
}