import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ConfigAdmin.module.scss';
import rifados from '../../assets/Inicio/rifados.jpg';
import logoSrc from '../../assets/logo.svg';
import IImagens from '../../interfaces/IImagens';
import { useAuth } from '../../authContext';

export default function ConfigAdmin() {
    const [imgHomePage, setImgHomePage] = useState<string>("");
    const [imgLogo, setImgLogo] = useState<string>("");
    const [imagens, setImagens] = useState<IImagens>();
    const { token } = useAuth()

    useEffect(() => {
        axios.get('https://rifas-heroku-3f8d803a7c71.herokuapp.com/home-pages/1', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
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

        axios.put('https://rifas-heroku-3f8d803a7c71.herokuapp.com/home-pages/1', requestData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((resposta) => {
                setImgHomePage(imgHomePage);
                setImgLogo(imgLogo);
            })
            .catch((erro) => {
                console.log(erro);
            });
    };

    return (
        <div className={styles.cor}>

            <div className={styles.container_titulo}><h2 className={styles.titulo}>Configurações</h2></div>

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
        </div>
    );
}