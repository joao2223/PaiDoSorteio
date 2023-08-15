import axios from 'axios';
import { useEffect, useState } from 'react';
import { addHours, format } from 'date-fns';
import IOrder from '../../interfaces/IOrders';
import IRifa from '../../interfaces/IRifa';
import styles from './PedidosAdmin.module.scss';

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
    const [searchNumber, setSearchNumber] = useState<number | null>(null); // Novo estado para o campo de busca
    const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]); // Estado para os pedidos filtrados


    useEffect(() => {
        axios.get('https://site-rifa-70b9f8e109e5.herokuapp.com/orders')
            .then((response) => {
                setOrders(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

        axios.get('https://site-rifa-70b9f8e109e5.herokuapp.com/raffles')
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
        axios.get('https://site-rifa-70b9f8e109e5.herokuapp.com/raffles')
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

    const deletarPedido = (id:number) => {
        axios.delete(`https://site-rifa-70b9f8e109e5.herokuapp.com/orders/${id}`)
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

        axios.put(`https://site-rifa-70b9f8e109e5.herokuapp.com/users/${id}`, formData)
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });
    }


    return (
        <>
            <h2 className={styles.titulo_pedidos}>Pedidos</h2>

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
                            <th>Telefone Cliente</th>
                            <th>Números sorteados</th>
                            <th>Status rifa</th>
                            <th>Total</th>
                            <th>Marcar como pago</th>
                            <th >Data</th>
                            <th>Comprovante</th>
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
                                    <td className={order.client.userStatus === "TRUE" ? styles.confirmado : styles.pendente}>
                                        {order.client.userStatus === "TRUE" ? 'Confirmado' : 'Pendente'}
                                    </td>
                                    <td>{order.items[0].subTotal.toLocaleString()}</td>
                                    <td>
                                        <div className={styles.botoes}>
                                            <button className={styles.botao_marcar} onClick={() => alteraStatus(order.client.id, order.client.name, order.client.phone, order.client.file)}>Marcar como pago</button>
                                            <button className={styles.botao_marcar} onClick = {() => deletarPedido(order.client.id)}>Deletar pedido</button>
                                        </div>

                                    </td>
                                    <td>
                                        <p>Efetuado</p>
                                        <p className={styles.data}>
                                            {order.client.momentCreated &&
                                                format(addHours(new Date(order.client.momentCreated), 3), 'dd/MM/yyyy HH:mm')}
                                        </p>
                                    </td>
                                    <td>{order.client.file || order.client.userStatus == "TRUE" ? "Enviado" : "Não enviado"}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

        </>
    )
}