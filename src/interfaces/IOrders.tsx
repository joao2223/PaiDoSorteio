export default interface IOrder {
    id: number;
    client: {
        id: number;
        name: string;
        phone: string;
        file: string;
        clientStatus: string;
        momentCreated: string;
    };
    items: Array<{
        quantity: number;
        price: string;
        generatedNumbers: Array<number>;
        subTotal: string;
        raffle: {
            id: number;
            quantity: number;
            name: string;
            description: string;
            price: string;
            imgUrl: string;
            raffleStatus: string;
            token: string;
        },
    }>,
}