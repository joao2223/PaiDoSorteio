import axios from 'axios';
import { useEffect, useState } from 'react';
import { addHours, format } from 'date-fns';
import IOrder from '../../interfaces/IOrders';
import IRifa from '../../interfaces/IRifa';
import styles from './ContasBancariasAdmin.module.scss';
import style from '../RifasAdmin/RifasAdmin.module.scss';
import { useAuth } from '../../authContext';
import IConta from '../../interfaces/IConta';
import Modal from 'react-modal';

export default function ContasBancariasAdmin() {
    const [contas, setContas] = useState<IConta[]>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { token } = useAuth();
    const [newConta, setNewConta] = useState({
        name: '',
        document: '',
        bankName: '',
        accountType: '',
        agency: '',
        operation: '',
        accountNumber: '',
        token: ''
    });

    useEffect(() => {
        axios.get('https://rifas-heroku-3f8d803a7c71.herokuapp.com/bank-account', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                setContas(response.data);
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
        axios.post('https://rifas-heroku-3f8d803a7c71.herokuapp.com/bank-account', newConta, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setNewConta({
                    name: '',
                    document: '',
                    bankName: '',
                    accountType: '',
                    agency: '',
                    operation: '',
                    accountNumber: '',
                    token: ''
                });
                closeModal();
            })
            .catch(error => {
                console.error('Erro ao criar a rifa:', error);
            });
    };

    return (
        <div className={styles.cor}>
            <div className={styles.container_titulo}>
                <h2 >Contas Bancárias</h2>
                <button onClick={openModal} className={styles.botao_criar}>Adicionar conta</button>
            </div>

            <div className={styles.centraliza}>
                <table className={styles.container}>
                    <thead>
                        <tr className={styles.container_infos_pedidos}>
                            <th>Nome</th>
                            <th>CPF</th>
                            <th>Nome do Banco</th>
                            <th>Tipo de conta</th>
                            <th>Agência</th>
                            <th>Número da conta</th>
                            <th>Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contas?.map((conta) => (
                            <tr key={conta.id} className={styles.container_infos_pedidos}>
                                <td>
                                    {conta.name}
                                </td>
                                <td>
                                    {conta.document}
                                </td>
                                <td>
                                    {conta.bankName}
                                </td>
                                <td>
                                    {conta.accountType}
                                </td>

                                <td>
                                    {conta.agency}
                                </td>
                                <td>
                                    {conta.accountNumber}
                                </td>
                                <td>data</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Adicionar conta nova"
                className={style.modalContent}
                overlayClassName={style.modalOverlay}
            >
                <h2>Adicionar conta nova</h2>
                <div className={style.input_rifas}>
                    <input
                        type="text"
                        placeholder="Nome da conta"
                        className={style.input_rifa}
                        value={newConta.name}
                        onChange={(e) => setNewConta({ ...newConta, name: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Cpf/Cnpj"
                        className={style.input_rifa}
                        value={newConta.document}
                        onChange={(e) => setNewConta({ ...newConta, document: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Nome do banco"
                        className={style.input_rifa}
                        value={newConta.bankName}
                        onChange={(e) => setNewConta({ ...newConta, bankName: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Tipo de conta"
                        className={style.input_rifa}
                        value={newConta.accountType}
                        onChange={(e) => setNewConta({ ...newConta, accountType: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Agência"
                        className={style.input_rifa}
                        value={newConta.agency}
                        onChange={(e) => setNewConta({ ...newConta, agency: e.target.value })}
                    />

                    <input
                        type="text"
                        placeholder="Operação"
                        className={style.input_rifa}
                        value={newConta.operation}
                        onChange={(e) => setNewConta({ ...newConta, operation: e.target.value })}
                    />

                    <input
                        type="text"
                        placeholder="Número da conta"
                        className={style.input_rifa}
                        value={newConta.accountNumber}
                        onChange={(e) => setNewConta({ ...newConta, accountNumber: e.target.value })}
                    />

                    <input
                        type="text"
                        placeholder="Token mercado pago"
                        className={style.input_rifa}
                        value={newConta.token}
                        onChange={(e) => setNewConta({ ...newConta, token: e.target.value })}
                    />

                </div>
                <div className={style.centraliza}>
                    <button onClick={handleCreateConta} className={style.criar_rifa}>Adicionar conta</button>
                </div>
            </Modal>
        </div>
    )
}