import { useEffect, useState } from 'react';
import styles from './Consulta.module.scss'
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import IOrder from '../../interfaces/IOrders';
import Cabecalho from '../../components/Cabecalho';
import { useTema } from '../../temaContext';

export default function Consulta() {
    const location = useLocation();
    const telefone = location.state?.telefone || '';
    const [rifasEncontradas, setRifasEncontradas] = useState<IOrder[]>([]);
    const [comprovantesUploaded, setComprovantesUploaded] = useState<{ [key: number]: boolean }>({});
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { cor, mudarTema } = useTema();

    useEffect(() => {
        axios.get('https://site-rifa-70b9f8e109e5.herokuapp.com/orders')
            .then((resposta) => {
                const rifas = resposta.data;
                const rifasComTelefone = rifas.filter((rifa: { client: { phone: any; } }) => rifa.client.phone === telefone);
                setRifasEncontradas(rifasComTelefone);
                console.log(rifasEncontradas)
            })
            .catch((erro) => {
                console.log(erro, 'erro get');
            });
    }, [telefone]);

    const handleUploadComprovante = async (index: number, file: File | null, orderId: number) => {
        if (file) {
            try {
                const formData = new FormData();
                formData.append('file', file);

                await axios.put(`https://site-rifa-70b9f8e109e5.herokuapp.com/users/${rifasEncontradas[index].client.id}`, {
                    name: rifasEncontradas[index].client.name,
                    phone: rifasEncontradas[index].client.phone,
                    file: 'enviado',
                });

                setComprovantesUploaded(prevState => ({
                    ...prevState,
                    [index]: true,
                }));
            } catch (error) {
                console.error('Erro ao enviar comprovante:', error);
            }
        }
    };

    return (
        <div className={cor == 'escuro' ? styles.dark : styles.light}>
            <Cabecalho/>

            <div className={styles.centraliza}>
                <div className={styles.container_consulta}>
                    <p className={styles.meus_numeros}>Meus números</p>
                    <div className={styles.centraliza}>
                        {rifasEncontradas.map((rifa, index) => (
                            <div key={index} className={styles.info_rifa_comprada}>
                                <div className={styles.titulo_status}>
                                    <p className={styles.titulo_rifa}>{rifa.items[0].raffle.name}</p>
                                    <div>
                                        <p className={styles.status_compra}>
                                            Status da compra: { rifa.client.userStatus == "TRUE" ? "Confirmado" : "Pagamento não confirmado"}
                                        </p>

                                        {!rifa.client.file && !comprovantesUploaded[index] && rifa.client.userStatus == "FALSE" &&(
                                            <div className={styles.comprovante}>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(event) => setSelectedFile(event.target.files && event.target.files[0])}
                                                />
                                                <div className={styles.centraliza_cel}>
                                                    <button className={styles.botao_enviar} onClick={() => handleUploadComprovante(index, selectedFile, rifa.client.id)}>Enviar Comprovante</button>

                                                </div>
                                            </div>
                                        )}

                                        {comprovantesUploaded[index] && <p>Comprovante enviado com sucesso!</p>}
                                    </div>
                                </div>
                                <p className={styles.preco_pago}>Total: {rifa.items[0].subTotal}</p>
                                <button className={styles.numeros_reservados}>
                                    Números reservados
                                </button>
                                <div className={styles.centraliza}>
                                    <div className={styles.container_numeros}>
                                        {rifa.items[0].generatedNumbers.map((number, index) => (
                                            <p key={index} className={styles.numeros}>
                                                {number}
                                            </p>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}