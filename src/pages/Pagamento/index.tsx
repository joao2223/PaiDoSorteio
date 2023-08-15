import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import styles from './Pagamento.module.scss';
import styl from '../Consulta/Consulta.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import IOrder from '../../interfaces/IOrders';
import { Modal } from 'react-bootstrap';
import IOrders from '../../interfaces/IOrders';
import Cabecalho from '../../components/Cabecalho';
import { useTema } from '../../temaContext';

export default function Pagamento() {

    const { clientId } = useParams();
    const valorPix = 'chavePIX@exemplo.com.br';
    const navigate = useNavigate();
    const [order, setOrder] = useState<IOrder>();
    const [orders, setOrders] = useState<IOrders[]>();
    const { cor, mudarTema } = useTema();

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

    useEffect(() => {
        axios.get(`https://site-rifa-70b9f8e109e5.herokuapp.com/orders/${clientId}`)
            .then((response) => {
                setOrder(response.data);
                console.log(order)
            })
            .catch((error) => {
                console.log(error);
            });
    }, [clientId])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const id = order?.client.id
        const name = order?.client.name
        const phone = order?.client.phone

        const formData = { "name": name, "phone": phone, "file": 'enviado, verificar', 'userStatus': "FALSE" }

        axios.put(`https://site-rifa-70b9f8e109e5.herokuapp.com/users/${id}`, formData)
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
                <div className={styles.pagamento}>
                    <p className={styles.titulo_pagamento}>Pagamento via pix</p>
                    <QRCode value={valorPix} />
                    <p className={styles.titulo_pagamento}>Faça o pix de acordo com o valor total</p>
                </div>
                <div className={styles.detalhes}>
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


                    <form action="/upload" onSubmit={handleSubmit}>
                        <label htmlFor="">Selecione o comprovante: </label>
                        <input type="file" id="file" name="file" accept=".txt, .pdf, .doc, .docx" required></input>
                        <button type="submit" className={styles.botao_enviar}>Enviar</button>
                    </form>

                </div>
            </div>

        </div>
    );
}




