import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import IRifa from '../../interfaces/IRifa';
import styles from './Inicio.module.scss';
import sorte from '../../assets/Inicio/sorte.svg';
import Modal from 'react-modal';
import IOrders from '../../interfaces/IOrders';
import IImagens from '../../interfaces/IImagens';
import Cabecalho from '../../components/Cabecalho';
import { useTema } from '../../temaContext';
import { useAuth } from '../../authContext';

export default function Inicio() {
    const [rifas, setRifas] = useState<IRifa[]>();
    const [orders, setOrders] = useState<IOrders[]>();
    const [termoDeBusca, setTermoDeBusca] = useState<string>("");
    const [resultadosBusca, setResultadosBusca] = useState<IOrders[]>([]);;
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const [imagens, setImagens] = useState<IImagens>();
    const { cor, mudarTema } = useTema();
    const { token } = useAuth()
    const [vendedorId, setVendedorId] = useState<number | null>(null);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    useEffect(() => {
        const vendedorIdParam = searchParams.get('vendedorId');
        if (vendedorIdParam) {
            setVendedorId(Number(vendedorIdParam));
        }
    }, [searchParams]);


    useEffect(() => {
        axios.get('https://rifas-heroku-3f8d803a7c71.herokuapp.com/raffles')
            .then(resposta => {
                setRifas(resposta.data);
            })
            .catch(erro => {
                console.log(erro);
            });
    }, []);



    useEffect(() => {
        axios.get('https://rifas-heroku-3f8d803a7c71.herokuapp.com/home-pages/1')
            .then(resposta => {
                setImagens(resposta.data);
            })
            .catch(erro => {
                console.log(erro);
            });
    }, []);

    useEffect(() => {
        axios.get('https://rifas-heroku-3f8d803a7c71.herokuapp.com/orders')
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
        navigate(`/compra/${id}?vendedorId=${vendedorId}`, { replace: true });
    }

    function handleOpenModal() {
        setShowModal(true);
    }

    function handleCloseModal() {
        setShowModal(false);
    }

    return (
        <div className={cor == 'escuro' ? styles.dark : styles.white}>
            <Cabecalho />
            <img src={imagens?.imgHomePage} alt="" className={styles.imagem_inicio} />

            <div className={styles.centraliza}>
                <section className={cor == 'escuro' ? styles.container_rifas_dark : styles.container_rifas}>
                    <div className={styles.titulo_secao}>
                        <img src={sorte} alt="" className={styles.sorte} />
                        <div className={styles.texto_mais_titulo_rifas}>
                            <p className={styles.texto_titulo_rifas}>NOSSAS PREMIAÇÕES</p>
                        </div>
                    </div>
                    <div className={styles.centraliza}>
                        {rifas?.map((rifa) => (
                            rifa.raffleStatus === 'OPEN' && (
                                <button key={rifa.id} className={cor == 'escuro' ? styles.card_dark : styles.card} onClick={() => redirecionarParaCompra(rifa.id)}>
                                    <img src={rifa.imgUrl} alt={rifa.description} className={styles.imagem_rifa} />
                                    <div className={styles.container_rifas_info}>
                                        <p className={styles.descricao}>{rifa.description}</p>
                                        <p className={styles.preco}>{rifa.price}</p>
                                        <button className={styles.disponivel}>Disponível</button>
                                    </div>
                                </button>
                            )
                        ))}
                    </div>
                </section>
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
        </div>
    );
}