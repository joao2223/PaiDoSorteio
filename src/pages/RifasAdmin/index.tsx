import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { addHours, format } from 'date-fns';
import Modal from 'react-modal';
import IRifa from '../../interfaces/IRifa';
import styles from './RifasAdmin.module.scss';
import style from '../PedidosAdmin/PedidosAdmin.module.scss'
import { useAuth } from '../../authContext';
import IConta from '../../interfaces/IConta';

export default function RifasAdmin() {
    const [rifas, setRifas] = useState<IRifa[]>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [closingRifaId, setClosingRifaId] = useState<number | null>(null);
    const [contas, setContas] = useState<IConta[]>()
    const [newRifa, setNewRifa] = useState({
        name: '',
        description: '',
        price: '',
        imgUrl: '',
        quantity: '',
        raffleStatus: 'OPEN',
        token: ''
    });
    const { token } = useAuth()

    useEffect(() => {
        axios.get('https://site-rifas-heroku-a67dfaec93a7.herokuapp.com/bank-account', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(resposta => {
                setContas(resposta.data);
                console.log(resposta.data)
            })
            .catch(erro => {
                console.log(erro);
            });
    }, []);

    useEffect(() => {
        axios.get('https://site-rifas-heroku-a67dfaec93a7.herokuapp.com/raffles', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(resposta => {
                setRifas(resposta.data);
                console.log(token)
            })
            .catch(erro => {
                console.log(erro);
            });
    }, []);

    const handleCloseRifa = (name: string, description: string, img: string, price: string, quantity: number, id: number, raffleStatus: string, tokenConta: string) => {

        const priceNumber = parseFloat(price.replace("R$", "").replace(",", "."));

        if (raffleStatus == "OPEN") {
            axios.put(`https://site-rifas-heroku-a67dfaec93a7.herokuapp.com/raffles/${id}`, {
                "quantity": quantity,
                "name": name,
                "description": description,
                "price": priceNumber,
                "imgUrl": img,
                "raffleStatus": "CLOSE",
                "token": tokenConta

            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    console.log('Rifa fechada:', response.data);
                    setClosingRifaId(null);
                })
                .catch(error => {
                    console.error('Erro ao fechar a rifa:', error);
                });
        }
        else {
            axios.put(`https://site-rifas-heroku-a67dfaec93a7.herokuapp.com/raffles/${id}`, {
                "quantity": quantity,
                "name": name,
                "description": description,
                "price": priceNumber,
                "imgUrl": img,
                "raffleStatus": "OPEN",
                "token": tokenConta
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    console.log('Rifa fechada:', response.data);
                    setClosingRifaId(null);
                })
                .catch(error => {
                    console.error('Erro ao fechar a rifa:', error);
                });
        }

    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleCreateRifa = () => {
        axios.post('https://site-rifas-heroku-a67dfaec93a7.herokuapp.com/raffles', newRifa, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                console.log('Rifa criada:', response.data);
                setNewRifa({
                    name: '',
                    description: '',
                    price: '',
                    imgUrl: '',
                    quantity: '',
                    raffleStatus: 'OPEN',
                    token: ''
                });
                closeModal();
            })
            .catch(error => {
                console.error('Erro ao criar a rifa:', error);
            });
    };

    return (
        <>
            <div className={styles.container_titulo}>
                <h2>Rifas</h2>
                <button onClick={openModal} className={styles.botao_criar}>Criar uma rifa</button>
            </div>
            <div className={style.centraliza}>
                <table className={style.container}>
                    <thead>
                        <tr className={style.container_infos_pedidos}>
                            <th>Nome</th>
                            <th>Imagem</th>
                            <th>Conta</th>
                            <th>Status</th>
                            <th>Quantidade</th>
                            <th>Data</th>
                            <th>Fechar rifa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rifas?.map((rifa) => (
                            <tr key={rifa.id} className={style.container_infos_pedidos}>
                                <td>{rifa.name}</td>
                                <td>
                                    <img src={rifa.imgUrl} alt="" className={styles.imagem_rifa} />
                                </td>
                                <td>nome da conta</td>
                                <td>
                                    <p className={styles.status_rifa}>
                                        {rifa.raffleStatus === "OPEN" ? "Rifa aberta" : "Rifa Fechada"}
                                    </p>
                                </td>
                                <td>
                                    <p className={styles.quantidade_rifa}>Quantidade de números: {rifa.quantity}</p>
                                </td>
                                <td>
                                    {rifa.momentCreated &&
                                        format(addHours(new Date(rifa.momentCreated), 3), 'dd/MM/yyyy HH:mm')}
                                </td>

                                <td>
                                    <div className={styles.deletar_modificar}>
                                        <button
                                            className={
                                                rifa.raffleStatus === "OPEN" ? styles.botao_fechar : styles.botao_abrir
                                            }
                                            onClick={() =>
                                                handleCloseRifa(
                                                    rifa.name,
                                                    rifa.description,
                                                    rifa.imgUrl,
                                                    rifa.price,
                                                    rifa.quantity,
                                                    rifa.id,
                                                    rifa.raffleStatus,
                                                    rifa.token
                                                )
                                            }
                                        >
                                            {rifa.raffleStatus === "OPEN" ? "Fechar rifa" : "Abrir rifa"}
                                        </button>
                                    </div>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Criar Rifa Modal"
                className={styles.modalContent}
                overlayClassName={styles.modalOverlay}
            >
                <h2>Criar Nova Rifa</h2>
                <div className={styles.input_rifas}>
                    <input
                        type="text"
                        placeholder="Nome da rifa"
                        className={styles.input_rifa}
                        value={newRifa.name}
                        onChange={(e) => setNewRifa({ ...newRifa, name: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Descrição da rifa"
                        className={styles.input_rifa}
                        value={newRifa.description}
                        onChange={(e) => setNewRifa({ ...newRifa, description: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Preço da rifa"
                        className={styles.input_rifa}
                        value={newRifa.price}
                        onChange={(e) => setNewRifa({ ...newRifa, price: e.target.value })}
                    />
                    <input
                        type="url"
                        placeholder="URL da imagem da rifa (GitHub)"
                        className={styles.input_rifa}
                        value={newRifa.imgUrl}
                        onChange={(e) => setNewRifa({ ...newRifa, imgUrl: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Quantidade total de números"
                        className={styles.input_rifa}
                        value={newRifa.quantity}
                        onChange={(e) => setNewRifa({ ...newRifa, quantity: e.target.value })}
                    />

                </div>
                <div className={styles.centraliza}>
                    <button onClick={handleCreateRifa} className={styles.criar_rifa}>Criar Rifa</button>
                </div>
            </Modal>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Modificar Rifa Modal"
                className={styles.modalContent}
                overlayClassName={styles.modalOverlay}
            >
                <h2>Modificar rifa</h2>
                <div className={styles.input_rifas}>
                    <input
                        type="text"
                        placeholder="Nome da rifa"
                        className={styles.input_rifa}
                        value={newRifa.name}
                        onChange={(e) => setNewRifa({ ...newRifa, name: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Descrição da rifa"
                        className={styles.input_rifa}
                        value={newRifa.description}
                        onChange={(e) => setNewRifa({ ...newRifa, description: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Preço da rifa"
                        className={styles.input_rifa}
                        value={newRifa.price}
                        onChange={(e) => setNewRifa({ ...newRifa, price: e.target.value })}
                    />
                    <input
                        type="url"
                        placeholder="URL da imagem da rifa (GitHub)"
                        className={styles.input_rifa}
                        value={newRifa.imgUrl}
                        onChange={(e) => setNewRifa({ ...newRifa, imgUrl: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Quantidade total de números"
                        className={styles.input_rifa}
                        value={newRifa.quantity}
                        onChange={(e) => setNewRifa({ ...newRifa, quantity: e.target.value })}
                    />
                    <select
                        className={styles.input_rifa}
                        value={newRifa.token}
                        onChange={(e) => setNewRifa({ ...newRifa, token: e.target.value })}
                    >
                        <option value="">Selecione uma conta</option>
                        {contas?.map((conta) => (
                            <option key={conta.id} value={conta.token}>
                                {conta.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.centraliza}>
                    <button onClick={handleCreateRifa} className={styles.criar_rifa}>Criar Rifa</button>
                </div>
            </Modal>

        </>
    );
}