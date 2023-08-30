import axios from 'axios';
import { useEffect, useState } from 'react';
import { addHours, format } from 'date-fns';
import IOrder from '../../interfaces/IOrders';
import IRifa from '../../interfaces/IRifa';
import styles from './PedidosAdmin.module.scss';
import StatusComponent from '../../components/Status';
import { useAuth } from '../../authContext';

export default function PedidosAdmin() {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [rifas, setRifas] = useState<IRifa[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [totalReceber, setTotalReceber] = useState<number>(0);
    const [totalPago, setTotalPago] = useState<number>(0);
    const [numerosDisponiveis, setNumerosDisponiveis] = useState<number>(0);
    const [numerosReservados, setNumerosReservados] = useState<number>(0);
    const [numerosPagos, setNumerosPagos] = useState<number>(0);
    const [selectedRifa, setSelectedRifa] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [searchNumber, setSearchNumber] = useState<number | null>(null);
    const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);
    const { token } = useAuth();


    useEffect(() => {
        axios.get('https://rifas-heroku-3f8d803a7c71.herokuapp.com/orders', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                setOrders(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

        axios.get('https://rifas-heroku-3f8d803a7c71.herokuapp.com/raffles', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                setRifas(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        if (selectedRifa) {
            const rifa = rifas.find((r) => r.name === selectedRifa);

            if (rifa) {
                const totalRifas = parseFloat(rifa.price.replace('R$', '').replace(',', '.').trim()) * rifa.quantity;

                const totalReceberRifa = orders.reduce((total, order) => {
                    if (order.client.userStatus === "FALSE" && order.items[0].raffle.name === selectedRifa) {
                        const price = parseFloat(order.items[0].price.replace('R$', '').replace(',', '.').trim());
                        return total + (order.items[0].quantity * price);
                    }
                    return total;
                }, 0);

                const totalPagoRifa = orders.reduce((total, order) => {
                    if (order.client.userStatus !== "FALSE" && order.items[0].raffle.name === selectedRifa) {
                        const price = parseFloat(order.items[0].price.replace('R$', '').replace(',', '.').trim());
                        return total + (order.items[0].quantity * price);
                    }
                    return total;
                }, 0);

                setTotal(totalRifas);
                setTotalReceber(totalReceberRifa);
                setTotalPago(totalPagoRifa);
            }
        }
    }, [selectedRifa, orders, rifas]);

    useEffect(() => {
        axios.get('https://rifas-heroku-3f8d803a7c71.herokuapp.com/raffles', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                const fetchedRifas = response.data;
                console.log(fetchedRifas)
                setRifas(fetchedRifas);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        if (rifas) {
            const totalNumeros = rifas.reduce((total, rifa) => {
                return total + rifa.quantity;
            }, 0)
            const totalRifas = rifas.reduce((total, rifa) => {
                const price = parseFloat(rifa.price.replace('R$', '').replace(',', '.').trim());
                return total + (rifa.quantity * price);
            }, 0)
            setTotal(totalRifas)
            setNumerosDisponiveis(totalNumeros)
        }
    }, [rifas]);

    useEffect(() => {
        if (orders) {
            const totalReceber = orders.reduce((total, order) => {
                if (order.client.userStatus == "FALSE") {
                    const price = parseFloat(order.items[0].price.replace('R$', '').replace(',', '.').trim());
                    console.log("entrou")
                    return total + (order.items[0].quantity * price);
                }
                return total
            }, 0)

            const todosNumerosReservados = orders.reduce((total, order) => {
                if (order.client.userStatus == "FALSE") {
                    return total + order.items[0].quantity;
                }
                return total
            }, 0)

            setTotalReceber(totalReceber)
            setNumerosReservados(todosNumerosReservados)
        }


    }, [orders]);

    useEffect(() => {
        if (orders) {
            const totalPago = orders.reduce((total, order) => {
                if (order.client.userStatus != "FALSE") {
                    const price = parseFloat(order.items[0].price.replace('R$', '').replace(',', '.').trim());
                    console.log("entrou")
                    return total + (order.items[0].quantity * price);
                }
                return total
            }, 0)

            const todosNumerosPagos = orders.reduce((total, order) => {
                if (order.client.userStatus != "FALSE") {
                    return total + order.items[0].quantity;
                }
                return total
            }, 0)

            setTotalPago(totalPago)
            setNumerosPagos(todosNumerosPagos)
        }


    }, [orders]);

    const handleFilterAndSearch = () => {
        let filteredOrders = orders;

        if (selectedRifa) {
            filteredOrders = filteredOrders.filter(order =>
                order.items.some(item => item.raffle.name === selectedRifa)
            );
        }

        if (selectedStatus) {
            filteredOrders = filteredOrders.filter(order =>
                order.items.some(item => item.raffle.raffleStatus === selectedStatus)
            );
        }

        if (searchNumber !== null) {
            filteredOrders = filteredOrders.filter(order =>
                order.items.some(item => item.generatedNumbers.includes(searchNumber))
            );
        }

        setFilteredOrders(filteredOrders);
    };

    const deletarPedido = (id: number) => {
        axios.delete(`https://rifas-heroku-3f8d803a7c71.herokuapp.com/orders/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })
    }

    const alteraStatus = (id: number, name: string, phone: string, file: string) => {
        const formData = {
            "name": name,
            "phone": phone,
            "file": file,
            "userStatus": "TRUE"
        };

        axios.put(`https://rifas-heroku-3f8d803a7c71.herokuapp.com/users/${id}`, formData)
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });
    }


    return (
        <div className={styles.cor}>
            <div className={styles.container_titulo}>
                <h2 >Pedidos</h2>
            </div>

            <div className={styles.filtros}>
                <select
                    value={selectedRifa || ''}
                    onChange={(e) => setSelectedRifa(e.target.value || null)}
                >
                    <option value="">Todas</option>
                    {rifas?.map((rifa) => (
                        <option key={rifa.id} value={rifa.name}>
                            {rifa.name}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedStatus || ''}
                    onChange={(e) => setSelectedStatus(e.target.value || null)}
                >
                    <option value="">Selecione um status</option>
                    <option value="TRUE">Pago</option>
                    <option value="FALSE">Pendente</option>
                </select>

                <div className={styles.busca_numero}>
                    <input
                        type="number"
                        placeholder="Número da rifa"
                        value={searchNumber !== null ? searchNumber : ''}
                        onChange={(e) => setSearchNumber(e.target.value !== '' ? parseInt(e.target.value) : null)}
                    />
                </div>


            </div>

            <div className={styles.centraliza}>
                <div className={styles.total_rifas}>
                    <p className={styles.valor_card}>R$ {total.toLocaleString('pt-BR')}</p>
                    <p className={styles.texto_card}>Total das Rifas</p>
                </div>
                <div className={styles.total_receber}>
                    <p className={styles.valor_card}>R$ {totalReceber.toLocaleString('pt-BR')}</p>
                    <p className={styles.texto_card}>Total a receber</p>
                </div>
                <div className={styles.total_pago}>
                    <p className={styles.valor_card}>R$ {totalPago.toLocaleString('pt-BR')}</p>
                    <p className={styles.texto_card}>Total pagos</p>
                </div>
            </div>
            <div className={styles.centraliza}>
                <div className={styles.container_numeros_disponiveis}>
                    <p className={styles.texto_numeros}>Números disponíveis: {numerosDisponiveis}</p>
                </div>
                <div className={styles.container_numeros_reservados}>
                    <p className={styles.texto_numeros}>Números Reservados: {numerosReservados}</p>
                </div>
                <div className={styles.container_numeros_pagos}>
                    <p className={styles.texto_numeros}>Números pagos: {numerosPagos}</p>
                </div>
            </div>

            <div className={styles.centraliza}>
                <table className={styles.container}>
                    <thead>
                        <tr className={styles.container_infos_pedidos}>
                            <th>Pedido</th>
                            <th>Telefone</th>
                            <th>Números</th>
                            <th>Status</th>
                            <th>Total</th>
                            <th>Deletar pedido</th>
                            <th >Data</th>

                        </tr>
                    </thead>
                    <tbody>
                        {orders
                            ?.filter((order) =>
                                (!selectedRifa || order.items[0].raffle.name === selectedRifa) &&
                                (!selectedStatus || order.client.userStatus === selectedStatus) &&
                                (!searchNumber || order.items[0].generatedNumbers.includes(searchNumber))
                            )
                            .map((order) => (
                                <tr key={order.id} className={styles.container_infos_pedidos}>
                                    <td>{order.items[0].raffle.name}</td>
                                    <td>{order.client.phone}</td>
                                    <td>
                                        {order.items[0].generatedNumbers.slice(0, 5).map((number, index) => (
                                            <span key={index}>{number},</span>
                                        ))}
                                        {order.items[0].generatedNumbers.length > 5 && <span>...</span>}
                                    </td>
                                    <StatusComponent file={order.client.file} id={order.client.id} name={order.client.name} phone={order.client.phone} />
                                    <td>{order.items[0].subTotal.toLocaleString()}</td>
                                    <td>
                                        <div className={styles.botoes}>
                                            <button className={styles.botao_marcar} onClick={() => deletarPedido(order.client.id)}>Deletar pedido</button>
                                        </div>

                                    </td>
                                    <td>
                                        <p>Efetuado</p>
                                        <p className={styles.data}>
                                            {order.client.momentCreated &&
                                                format(addHours(new Date(order.client.momentCreated), 3), 'dd/MM/yyyy HH:mm')}
                                        </p>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}