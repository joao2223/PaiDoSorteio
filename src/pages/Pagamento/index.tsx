import React, { useEffect, useState } from 'react';
import styles from './Pagamento.module.scss';
import styl from '../Consulta/Consulta.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import IOrder from '../../interfaces/IOrders';
import IOrders from '../../interfaces/IOrders';
import Cabecalho from '../../components/Cabecalho';
import { useTema } from '../../temaContext';
import IPagamento from '../../interfaces/IPagamento';
import { useAuth } from '../../authContext';

export default function Pagamento() {

    const { clientId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<IOrder>();
    const [pagamento, setPagamento] = useState<IPagamento>()
    const [orders, setOrders] = useState<IOrders[]>();
    const [tokenBanco, setTokenBanco] = useState();
    const acc = 'APP_USR-475581657188028-071815-8408e2a91f964626a4b56ed758a65abf-180659991'
    const { token } = useAuth()
    const { cor, mudarTema } = useTema();

    useEffect(() => {
        axios.get('https://site-rifas-heroku-a67dfaec93a7.herokuapp.com/orders', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(resposta => {
                setOrders(resposta.data);

            })
            .catch(erro => {
                console.log(erro);
            });
    }, []);

    useEffect(() => {
        axios.get(`https://site-rifas-heroku-a67dfaec93a7.herokuapp.com/orders/${clientId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                setOrder(response.data);
                axios.get(`https://api.mercadopago.com/v1/payments/${response.data.client.file}`, {
                    headers: {
                        'Authorization': `Bearer ${response.data.items[0].raffle.token}`
                    }
                })
                    .then(response => {
                        setPagamento(response.data)
                        console.log(order?.items[0].raffle.token)
                    })
            })
            .catch((error) => {
                console.log(error);
            });
    }, [clientId])


    const [copied, setCopied] = useState(false);

    const handleCopyClick = () => {
        const textToCopy = pagamento?.point_of_interaction.transaction_data.qr_code;

        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    setCopied(true);
                    setTimeout(() => {
                        setCopied(false);
                    }, 2000);
                })
                .catch(err => {
                    console.error('Erro ao copiar: ', err);
                });
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const id = order?.client.id
        const name = order?.client.name
        const phone = order?.client.phone

        const formData = { "name": name, "phone": phone, "file": 'enviado, verificar', 'clientStatus': "FALSE" }

        axios.put(`https://site-rifas-heroku-a67dfaec93a7.herokuapp.com/clients/${id}`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                navigate('/', { replace: true })
            })
            .catch((error) => {
                console.log(error, formData);
            });
    };

    return (
        <div className={cor == 'escuro' ? styles.dark : styles.light}>
            <Cabecalho />

            <div className={styles.container}>
                <div className={cor == 'escuro' ? styles.pagamento_dark : styles.pagamento}>
                    <p className={styles.titulo_pagamento}>Pagamento via pix</p>
                    <div className={styles.container_pagamento}>
                        <img src={`data:image/png;base64,${pagamento?.point_of_interaction.transaction_data.qr_code_base64}`} alt="QR Code" className={styles.imagem_qr_code} />

                        <div className={styles.texto_copia}>
                            <input
                                type="text"
                                id="copiar"
                                value={pagamento?.point_of_interaction.transaction_data.qr_code}
                                readOnly
                            />
                            <button onClick={handleCopyClick}>
                                {copied ? 'Copiado!' : 'Copiar'}
                            </button>
                        </div>
                        <p className={styles.titulo_pagamento}>Faça o pagamento e confirme a compra!</p>
                    </div>

                </div>
                <div className={cor == 'escuro' ? styles.detalhes_dark : styles.detalhes}>
                    <p className={styles.detalhes_titulo}>Detalhes do pedido</p>
                    <p className={styles.sorteio}>Sorteio</p>
                    <p className={styles.nome_rifa}>{order?.items[0].raffle.name}</p>
                    <div className={styles.container_preco}>
                        <p className={styles.total_preco}>Total: </p>
                        <p className={styles.preco}>{order?.items[0].subTotal}</p>
                    </div>
                    <div className={styles.centraliza}>
                        <button className={styles.numeros_reservados}>Numeros reservados</button>
                    </div>
                    <div className={styl.centraliza}>
                        <div className={styles.container}></div>
                        <div className={styl.container_numeros}>
                            {order?.items[0].generatedNumbers.map((numero, numeroIndex) => (
                                <p key={numeroIndex} className={styl.numeros}>{numero}</p>
                            ))}
                        </div>

                    </div>

                </div>
            </div>

        </div>
    );
}




