import { useState } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../authContext';
import styles from './Admin.module.scss';

function Admin() {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const correctUsername = 'admin';
    const correctPassword = '123';
    const navigate = useNavigate();
    const {  login } = useAuth();

    function handleModalClose() {
        if (username === correctUsername && password === correctPassword) {
            setIsModalOpen(false);
            login(username, password);
        } else {
            alert('Credenciais incorretas. Tente novamente.');
        }
    }

    return (
        <>
            <h1>Administração</h1>

            <div>
                <button className={styles.botao} onClick={() => navigate('/admin/rifas')}>Rifas</button>
                <button className={styles.botao} onClick={() => navigate('/admin/pedidos')}>Pedidos</button>
                <button className={styles.botao} onClick={() => navigate('/admin/configuracoes')}>Configuracoes</button>
            </div>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleModalClose}
                contentLabel="Login Modal"
            >
                <h2>Login</h2>
                <input
                    type="text"
                    placeholder="Nome de usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.input_modal}
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input_modal}
                />
                <button onClick={handleModalClose} className={styles.botao_entrar}>Entrar</button>
            </Modal> 
        </>
    );
}

export default Admin;