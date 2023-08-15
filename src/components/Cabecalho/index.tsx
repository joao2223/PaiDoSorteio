import React, { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import IRifa from '../../interfaces/IRifa';
import styles from './Cabecalho.module.scss';
import Modal from 'react-modal';
import IOrders from '../../interfaces/IOrders';
import IImagens from '../../interfaces/IImagens';
import { BsMoon, BsSun } from 'react-icons/bs';
import { useTema } from '../../temaContext'; // Importe o hook useTema

export default function Inicio() {
    const [rifas, setRifas] = useState<IRifa[]>();
    const [orders, setOrders] = useState<IOrders[]>();
    const [termoDeBusca, setTermoDeBusca] = useState<string>("");
    const [resultadosBusca, setResultadosBusca] = useState<IOrders[]>([]);;
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const [imagens, setImagens] = useState<IImagens>()
    const { cor, mudarTema } = useTema();

    useEffect(() => {
        axios.get('https://site-rifa-70b9f8e109e5.herokuapp.com/raffles')
            .then(resposta => {
                setRifas(resposta.data);
            })
            .catch(erro => {
                console.log(erro);
            });
    }, []);

    useEffect(() => {
        axios.get('https://site-rifa-70b9f8e109e5.herokuapp.com/home-pages/1')
            .then(resposta => {
                setImagens(resposta.data);
            })
            .catch(erro => {
                console.log(erro);
            });
    }, []);

    useEffect(() => {
        axios.get('https://site-rifa-70b9f8e109e5.herokuapp.com/orders')
            .then(resposta => {
                setOrders(resposta.data);
                console.log(resposta)
            })
            .catch(erro => {
                console.log(erro);
            });
    }, []);

    function procurarCliente() {
        const resultados = orders?.filter(order => order.client.phone === termoDeBusca);
        setResultadosBusca(resultados || []);
    }

    function redirecionarParaCompra(id: number) {
        navigate(`/compra/${id}`, { replace: true });
    }

    function handleOpenModal() {
        setShowModal(true);
    }

    function handleCloseModal() {
        setShowModal(false);
    }

    return (
        <>
            <div className={styles.cabecalho}>
                <img src={imagens?.imgLogo} alt="logo paido sorteio" className={styles.logo} />
                <button className={styles.botao_busca}>
                    <AiOutlineSearch />
                    <p className={styles.nome_botao_busca} onClick={handleOpenModal}>MEUS NÚMEROS</p>
                </button>

                <button onClick={() => mudarTema()} className={styles.botao_muda_tema} >{cor == 'escuro' ? <BsMoon size={20} /> : <BsSun size={20} />}</button>

            </div>



            <Modal
                isOpen={showModal}
                onRequestClose={handleCloseModal}
                contentLabel="Login"
                className={styles.modalContent}
                overlayClassName={styles.modalOverlay}
            >
                <div className={styles.modalHeader}>
                    <h2>Login</h2>
                    <button className={styles.modalCloseButton} onClick={handleCloseModal}>
                        <span>&times;</span>
                    </button>
                </div>
                <hr className={styles.modalLine} />
                <p>Para consultar seus pedidos, digite o número de WhatsApp usado na hora da compra:</p>
                <input
                    type="text"
                    name="Telefone"
                    className={styles.modalInput}
                    value={termoDeBusca}
                    onChange={(e) => setTermoDeBusca(e.target.value)}
                />
                <button className={styles.modalButton} onClick={() => {
                    procurarCliente();
                    navigate(`/consulta`, { state: { telefone: termoDeBusca } });
                }}>Consultar</button>
            </Modal>
        </>
    );
}