import React, { useEffect, useState } from 'react';
import styles from './Consulta.module.scss';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import IOrder from '../../interfaces/IOrders';
import Cabecalho from '../../components/Cabecalho';
import { useTema } from '../../temaContext';
import QRCodeComponent from '../../components/Qrcode';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function Consulta() {
    const location = useLocation();
    const telefone = location.state?.telefone || '';
    const [rifasEncontradas, setRifasEncontradas] = useState<IOrder[]>([]);
    const { cor, mudarTema } = useTema();
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

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

    return (
        <div className={cor == 'escuro' ? styles.dark : styles.light}>
            <Cabecalho />

            <div className={styles.centraliza}>
                <div className={styles.container_consulta}>
                    <p className={styles.meus_numeros}>Meus números</p>
                    
                    <Slider {...settings}>
                        {rifasEncontradas.map((rifa, index) => (
                            <div key={index} className={styles.info_rifa_comprada}>
                                <div className={styles.titulo_status}>
                                    <p className={styles.titulo_rifa}>{rifa.items[0].raffle.name}</p>
                                    <QRCodeComponent file={rifa.client.file} />
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
                    </Slider>

                </div>
            </div>
        </div>
    );
}