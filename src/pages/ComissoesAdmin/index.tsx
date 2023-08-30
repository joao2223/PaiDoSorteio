import axios from 'axios';
import { useEffect, useState } from 'react';
import { addHours, format } from 'date-fns';
import styles from './ComissoesAdmin.module.scss';
import style from '../RifasAdmin/RifasAdmin.module.scss'
import { useAuth } from '../../authContext';
import Modal from 'react-modal';
import IComissao from '../../interfaces/IComissao';

export default function ContasBancariasAdmin() {
    const [comissoes, setComissoes] = useState<IComissao[]>();
    const [selectedSeller, setSelectedSeller] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { token } = useAuth();


    const generateRandomId = () => {
        const randomId = Math.floor(Math.random() * 1000000) + 100000; // Gera um número aleatório entre 0 e 999999
        return randomId;
    };

    const [newComissao, setNewComissao] = useState({
        id: generateRandomId(),
        raffleCommission: '',
        userCommissionStatus: 'WAITING_PAYMENT',
        seller: '',
        price: 0,
        priceCommission: 0,
        account: '',
        actionCommissionStatus: 'WAITING_PAYMENT',
        link: ''
    });

    useEffect(() => {
        axios.get('https://site-rifas-heroku-a67dfaec93a7.herokuapp.com/usercommissions', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                setComissoes(response.data);
                const commissions = response.data;

                const promiseArray = commissions.map((commission: { price: string; id: any; raffleCommission: any; userCommissionStatus: any; seller: any; priceCommission: string; account: any; }) => {
                    const price = parseFloat(commission.price.replace("R$", "").trim());

                    if (price > 0) {
                        return axios.get(`https://site-rifas-heroku-a67dfaec93a7.herokuapp.com/clients/${commission.id}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        })
                            .then((resposta) => {
                                if (resposta.data.clientStatus === 'TRUE') {
                                    return axios.put(`https://site-rifas-heroku-a67dfaec93a7.herokuapp.com/usercommissions/${commission.id}`, {
                                        "raffleCommission": commission.raffleCommission,
                                        "userCommissionStatus": commission.userCommissionStatus,
                                        "seller": commission.seller,
                                        "price": parseFloat(commission.price.replace("R$", "").trim()),
                                        "priceCommission": parseFloat(commission.priceCommission.replace("R$", "").trim()),
                                        "account": commission.account,
                                        "actionCommissionStatus": "PAID"
                                    }, {
                                        headers: {
                                            'Authorization': `Bearer ${token}`
                                        }
                                    });
                                } else {
                                    return null; // Não é necessário atualizar esta comissão
                                }
                            });
                    } else {
                        return null; // Não é necessário atualizar esta comissão
                    }
                });

                return Promise.all(promiseArray);
            })
            .then((responses) => {
                // Aqui você pode lidar com as respostas das atualizações, se desejar
                console.log('Todas as atualizações foram processadas:', responses);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const openModal = () => {
        console.log('oi')

        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleCreateConta = () => {
        const linkPersonalizado = `http://localhost:3000/?vendedorId=${newComissao.id}`;

        alert(`o link do vendedor é : ${linkPersonalizado}`)
        axios.post('https://site-rifas-heroku-a67dfaec93a7.herokuapp.com/usercommissions', newComissao, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setNewComissao({
                    id: generateRandomId(),
                    raffleCommission: '',
                    userCommissionStatus: 'WAITING_PAYMENT',
                    seller: '',
                    price: 0,
                    priceCommission: 0,
                    account: '',
                    actionCommissionStatus: 'WAITING_PAYMENT',
                    link: ''
                });
                closeModal();
            })
            .catch(error => {
                console.error('Erro ao criar a rifa:', error);
            });
    };

    const marcarComoPago = (
        account: string,
        actionCommissionStatus: string,
        id: number,
        price: string,
        priceCommission: string,
        raffleCommission: string,
        seller: string,
        userCommissionStatus: string) => {
        const preco = parseFloat(price.replace("R$", "").trim())
        const precoComissao = parseFloat(priceCommission.replace("R$", "").trim())

        axios.put(`https://site-rifas-heroku-a67dfaec93a7.herokuapp.com/usercommissions/${id}`, {
            "raffleCommission": raffleCommission,
            "userCommissionStatus": "PAID",
            "seller": seller,
            "price": preco,
            "priceCommission": precoComissao,
            "account": account,
            "actionCommissionStatus": actionCommissionStatus
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

    }

    return (
        <div className={styles.cor}>
            <div className={styles.container_titulo}>
                <h2>Comissões</h2>
                <button onClick={openModal} className={styles.botao_criar}>Adicionar vendedor</button>
            </div>

            <div className={styles.centraliza}>
                <select
                    className={styles.dropdown}
                    value={selectedSeller}
                    onChange={(e) => setSelectedSeller(e.target.value)}
                >
                    <option value="">Selecione um vendedor</option>
                    {comissoes?.filter(comissao => parseFloat(comissao.price.replace("R$", "").trim()) === 0)
                        .map((comissao) => (
                            <option key={comissao.id} value={comissao.seller}>
                                {comissao.id} - {comissao.seller}
                            </option>
                        ))}
                </select>
            </div>

            <div className={styles.centraliza}>
                <table className={styles.container}>
                    <thead>
                        <tr className={styles.container_infos_pedidos}>
                            <th>Id do pedido</th>
                            <th>Rifa</th>
                            <th>Status</th>
                            <th>Vendedor</th>
                            <th>Valor</th>
                            <th>Comissão</th>
                            <th>Dados Bancários</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comissoes?.filter(comissao =>
                            parseFloat(comissao.price.replace("R$", "").trim()) > 0 &&
                            comissao.actionCommissionStatus === "PAID" &&
                            (selectedSeller === '' || comissao.seller === selectedSeller)
                        ).map((comissao) => (
                            <tr key={comissao.id} className={styles.container_infos_pedidos}>
                                <td>
                                    {comissao.id}
                                </td>
                                <td>
                                    {comissao.raffleCommission}
                                </td>
                                <td>
                                    {comissao.userCommissionStatus}
                                </td>
                                <td>
                                    {comissao.seller}
                                </td>

                                <td>
                                    {comissao.price}
                                </td>
                                <td>
                                    {comissao.priceCommission}
                                </td>
                                <td>{comissao.account}</td>
                                <td>
                                    <button className={styles.botao_marcar} onClick={() => marcarComoPago(
                                        comissao.account,
                                        comissao.actionCommissionStatus,
                                        comissao.id,
                                        comissao.price,
                                        comissao.priceCommission,
                                        comissao.raffleCommission,
                                        comissao.seller,
                                        comissao.userCommissionStatus)}>
                                        {comissao.userCommissionStatus !== "PAID" ? 'Marcar como pago' : 'Pago'}
                                    </button>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>

            {<Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Adicionar comissao nova"
                className={style.modalContent}
                overlayClassName={style.modalOverlay}
            >
                <h2>Adicionar vendedor novo</h2>
                <div className={style.input_rifas}>
                    <input
                        type="text"
                        placeholder="Nome do vendedor"
                        className={style.input_rifa}
                        value={newComissao.seller}
                        onChange={(e) => setNewComissao({ ...newComissao, seller: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Chave pix"
                        className={style.input_rifa}
                        value={newComissao.account}
                        onChange={(e) => setNewComissao({ ...newComissao, account: e.target.value })}
                    />

                </div>
                <div className={style.centraliza}>
                    <button onClick={handleCreateConta} className={style.criar_rifa}>Criar Vendedor</button>
                </div>
            </Modal>}
        </div>
    )
}