import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './Compra.module.scss';
import IRifa from '../../interfaces/IRifa';
import { CiWarning } from 'react-icons/ci';
import selecionar from '../../assets/Compra/selecionar.svg';
import Modal from 'react-modal';
import IOrders from '../../interfaces/IOrders';
import Cabecalho from '../../components/Cabecalho';
import { useTema } from '../../temaContext';
import { useAuth } from '../../authContext';
import IComissao from '../../interfaces/IComissao';

export default function Compra() {
    const { id } = useParams();
    const [rifa, setRifa] = useState<IRifa>();
    const [quantidade, setQuantidade] = useState(0);
    const [resultadosBusca, setResultadosBusca] = useState<IOrders[]>([]);
    const [termoDeBusca, setTermoDeBusca] = useState<string>("");
    const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
    const [orders, setOrders] = useState<IOrders[]>();
    const [quantidadeRifas, setQuantidadeRifas] = useState(Number)
    const navigate = useNavigate()
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const vendedorIdParam = searchParams.get('vendedorId');
    const vendedorId = vendedorIdParam ? Number(vendedorIdParam) : null;
    const acc = 'APP_USR-475581657188028-071815-8408e2a91f964626a4b56ed758a65abf-180659991'
    const [idCompra, setIdCompra] = useState();
    const { cor, mudarTema } = useTema();
    const { token } = useAuth()
    const [vendedor, setVendedor] = useState<IComissao>()

    function redirecionarParaPaginaComprarAgora(id: number) {
        navigate('/paginaComprarAgora', { replace: true })
    }
    const [showModal, setShowModal] = useState(false);

    const incrementar = (valorIncremento: number) => {
        setQuantidade((prevQuantidade) => prevQuantidade + valorIncremento);
    };


    const decrementar = (valorIncremento: number) => {
        setQuantidade((prevQuantidade) => Math.max(prevQuantidade - valorIncremento, 0));
    };
    function handleOpenModal() {
        setShowModal(true);
    }

    function handleCloseModal() {
        setShowModal(false);
    }


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

    useEffect(() => {
        axios.get(`https://rifas-heroku-3f8d803a7c71.herokuapp.com/raffles/${id}`)
            .then((resposta) => {
                setRifa(resposta.data);
                // setAcc(rifa?.token)
            })
            .catch((erro) => {
                console.log(erro);
            });
    }, [id]);

    useEffect(() => {
        axios.get(`https://rifas-heroku-3f8d803a7c71.herokuapp.com/raffles/${id}/remaining`)
            .then((resposta) => {
                setQuantidadeRifas(resposta.data);
            })
            .catch((erro) => {
                console.log(erro);
            });
    }, [id]);

    if (!rifa) {
        return <p>Carregando...</p>;
    }

    const formatarPreco = (preco: string) => {
        return parseFloat(preco.replace("R$", "").replace(",", "."));
    };

    const totalCompra = rifa ? quantidade * formatarPreco(rifa.price) : 0;

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const name = event.currentTarget.nome.value;
        const phone = event.currentTarget.telefone.value;

        const formData = { "name": name, "phone": phone, "file": "", "userStatus": "FALSE" }

        axios.post("https://rifas-heroku-3f8d803a7c71.herokuapp.com/users", formData)
            .then((response) => {
                const idGeradoPeloPrimeiroPost = response.data.id;
                realizarSegundoPost(idGeradoPeloPrimeiroPost, name, phone);
            })
            .catch((error) => {
                console.log(error, formData);
            });
    };

    const realizarSegundoPost = (dados: number, nome: string, telefone: string) => {
        const clientId = dados;
        const name = nome
        const phone = telefone
        const formData = { "clientId": clientId }


        axios.post("https://rifas-heroku-3f8d803a7c71.herokuapp.com/orders", formData)
            .then((response) => {
                realizarTerceiroPost(clientId, name, phone);
                closeModal();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const realizarTerceiroPost = (clientId: number, nome: string, telefone: string) => {
        const name = nome
        const phone = telefone
        const formData = { "orderId": clientId, "raffleId": id, "quantity": quantidade }
        console.log(formData);
        axios.post("https://rifas-heroku-3f8d803a7c71.herokuapp.com/order-items", formData)
            .then((response) => {
                realizarQuartoPost(clientId, name, phone)

                closeModal()
            })
            .catch((error) => {
                console.log(error, formData);
            });
    };

    const realizarQuartoPost = (clientId: number, name: string, phone: string) => {

        const formData = {
            transaction_amount: totalCompra,
            description: 'rifa',
            payment_method_id: 'pix',
            payer: {
                email: 'email@email.com',
                first_name: 'Test',
                last_name: 'User',
                identification: {
                    type: 'CPF',
                    number: '19119119100'
                },
                address: {
                    zip_code: '06233200',
                    street_name: 'Av. das Nações Unidas',
                    street_number: '3003',
                    neighborhood: 'Bonfim',
                    city: 'Osasco',
                    federal_unit: 'SP'
                }
            }
        };

        axios.post('https://api.mercadopago.com/v1/payments', formData, {
            headers: {
                'Authorization': `Bearer ${acc}`
            }
        })
            .then((response) => {
                setIdCompra(response.data.id)
                axios.put(`https://rifas-heroku-3f8d803a7c71.herokuapp.com/users/${clientId}`, { "name": name, "phone": phone, "file": response.data.id, "userStatus": "FALSE" }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                    .then(response => navigate(`/paginaPagamento/${clientId}`))
                console.log(response.data.id)
            })
            .catch(error => console.log(error))

        if (vendedorId) {
            axios.get(`https://rifas-heroku-3f8d803a7c71.herokuapp.com/usercommissions/${vendedorId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    setVendedor(response.data)
                    const formData = {
                        "id": clientId,
                        "raffleCommission": rifa.name,
                        "userCommissionStatus": "WAITING_PAYMENT",
                        "seller": response.data.seller,
                        "price": totalCompra,
                        "priceCommission": totalCompra / 2,
                        "account": response.data.account,
                        "actionCommissionStatus": "WAITING_PAYMENT"
                    }
                    console.log(formData)
                    axios.post('https://rifas-heroku-3f8d803a7c71.herokuapp.com/usercommissions', formData, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                })
        }
    }

    const finalizarCompra = () => {
        setCheckoutModalOpen(true);
    };

    const closeModal = () => {
        setCheckoutModalOpen(false);
    };

    return (
        <div className={cor == 'escuro' ? styles.dark : styles.light}>
            <Cabecalho />

            <section className={styles.container_compra}>
                <div className={styles.centraliza_mobile}>
                    <img src={rifa.imgUrl} alt={rifa.description} className={styles.imagem_rifa} />
                </div>
                <div>
                    <div>
                        <p className={styles.descricao_rifa} style={cor == 'escuro' ? { color: '#CBCBCB' } : { color: '' }}>{rifa.description}</p>
                        <p className={styles.descricao_rifa} style={cor == 'escuro' ? { color: '#CBCBCB' } : { color: '' }}>Quantidade de rifas disponíveis: {quantidadeRifas}</p>
                    </div>
                    <div className={styles.centraliza_mobile}>
                        <button className={cor == 'escuro' ? styles.botao_preco_dark : styles.botao_preco}>
                            <p className={styles.nome_botao_preco}>Por apenas</p>
                            <p className={styles.preco_botao_preco}>{rifa.price}</p>
                        </button>
                    </div>
                    <div className={styles.centraliza}>
                        <div className={cor == 'escuro' ? styles.automaticos_dark : styles.automaticos}>
                            <CiWarning />
                            <div >
                                <p>Número automáticos</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.centraliza}>
                        <div className={cor == 'escuro' ? styles.secao_quantidade_dark : styles.secao_quantidade}>
                            <p className={styles.titulo_modal} style={cor == 'escuro' ? { color: '#CBCBCB' } : { color: '#CBCBCB' }}>Compre a sua cota</p>
                            <div className={styles.quantidade_escolha}>
                                <div className={styles.container}>
                                    <div className={styles.incremento}>
                                        <div className={styles.dois_incrementos}>
                                            <div className={cor == 'escuro' ? styles.incremento_unico_dark : styles.incremento_unico}>
                                                <p className={styles.valor_incremento_mais_de_um}> + 5</p>
                                                <button className={cor == 'escuro' ? styles.botao_incremento_dark : styles.botao_incremento} onClick={() => incrementar(5)}>
                                                    <img src={selecionar} alt="" className={styles.selecionar} />
                                                </button>
                                            </div>
                                            <div className={cor == 'escuro' ? styles.incremento_unico_dark : styles.incremento_unico}>
                                                <p className={styles.valor_incremento_mais_de_um}> + 10</p>
                                                <button className={cor == 'escuro' ? styles.botao_incremento_dark : styles.botao_incremento} onClick={() => incrementar(10)}>
                                                    <img src={selecionar} alt="" className={styles.selecionar} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className={styles.dois_incrementos}>
                                            <div className={cor == 'escuro' ? styles.incremento_unico_dark : styles.incremento_unico}>
                                                <p className={styles.valor_incremento_mais_de_um}> + 50</p>
                                                <button className={cor == 'escuro' ? styles.botao_incremento_dark : styles.botao_incremento} onClick={() => incrementar(50)}>
                                                    <img src={selecionar} alt="" className={styles.selecionar} />
                                                </button>
                                            </div>
                                            <div className={cor == 'escuro' ? styles.incremento_unico_dark : styles.incremento_unico}>
                                                <p className={styles.valor_incremento_mais_de_um}> + 100</p>
                                                <button className={cor == 'escuro' ? styles.botao_incremento_dark : styles.botao_incremento} onClick={() => incrementar(100)}>
                                                    <img src={selecionar} alt="" className={styles.selecionar} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.centraliza}>
                                        <div className={cor == 'escuro' ? styles.incremento_um_em_um_dark : styles.incremento_um_em_um}>
                                            <button className={cor == 'escuro' ? styles.botao_operacao_dark : styles.botao_operacao} onClick={() => decrementar(1)}>-</button>
                                            <p className={styles.valor_incremento}>{quantidade}</p>
                                            <button className={cor == 'escuro' ? styles.botao_operacao_dark : styles.botao_operacao} onClick={() => incrementar(1)}>+</button>
                                        </div>
                                    </div>
                                    <div className={styles.centraliza}>
                                        <div className={cor == 'escuro' ? styles.total_compra_dark : styles.total_compra}>

                                            <p className={styles.valor_total}>Total: R$ {totalCompra.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className={styles.centraliza_mobile}>
                                        <button className={styles.botao_finalizar} onClick={finalizarCompra}>
                                            Finalizar compra
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className={styles.centraliza_mobile}></div>
            <Modal
                isOpen={checkoutModalOpen}
                onRequestClose={closeModal}
                contentLabel="Finalizar Compra"
                className={styles.modalContent}
                overlayClassName={styles.modalOverlay}
            >
                <div className={styles.modalHeader}>
                    <h2>Checkout</h2>
                    <button className={styles.modalCloseButton} onClick={closeModal}>
                        <span>&times;</span>
                    </button>
                </div>
                <hr className={styles.modalLine} />
                <div className={styles.modalBody}>
                    <div>
                        <p>Você está comprando números para: {rifa?.description}</p>
                        <p>Finalize a compra preenchendo os campos abaixo:</p>
                        <form onSubmit={handleSubmit}>
                            <input type="text" name="nome" placeholder="Nome Completo" className={styles.modalInput} required />
                            <input type="text" name="telefone" placeholder="Seu Whatsapp" className={styles.modalInput} required />
                            <input type="text" name="confirmarWhatsapp" placeholder="Confirme seu Whatsapp" className={styles.modalInput} required />
                            <button className={styles.modalButton} type="submit">Comprar Agora</button>
                        </form>
                    </div>
                </div>
            </Modal>
        </div>
    );
}