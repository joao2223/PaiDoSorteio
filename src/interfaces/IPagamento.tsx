export default interface Pagamento {
    accounts_info: null;
    acquirer_reconciliation: [];
    additional_info: {
        authentication_code: null;
        available_balance: null;
        nsu_processadora: null;
    };
    authorization_code: null;
    binary_mode: boolean;
    brand_id: null;
    build_version: string;
    call_for_authorize_id: null;
    callback_url: null;
    captured: boolean;
    card: {};
    charges_details: ChargeDetail[];
    collector_id: number;
    corporation_id: null;
    counter_currency: null;
    coupon_amount: number;
    currency_id: string;
    date_approved: null;
    date_created: string;
    date_last_updated: string;
    date_of_expiration: string;
    deduction_schema: null;
    description: string;
    differential_pricing_id: null;
    external_reference: null;
    fee_details: [];
    financing_group: null;
    id: number;
    installments: number;
    integrator_id: null;
    issuer_id: string;
    live_mode: boolean;
    marketplace_owner: null;
    merchant_account_id: null;
    merchant_number: null;
    metadata: {};
    money_release_date: null;
    money_release_schema: null;
    money_release_status: string;
    notification_url: null;
    operation_type: string;
    order: {};
    payer: Payer;
    payment_method: PaymentMethod;
    payment_method_id: string;
    payment_type_id: string;
    platform_id: null;
    point_of_interaction: PointOfInteraction;
    pos_id: null;
    processing_mode: string;
    refunds: [];
    shipping_amount: number;
    sponsor_id: null;
    statement_descriptor: null;
    status: string;
    status_detail: string;
    store_id: null;
    tags: null;
    taxes_amount: number;
    transaction_amount: number;
    transaction_amount_refunded: number;
    transaction_details: TransactionDetails;
}

interface ChargeDetail {
    accounts: {
        from: string;
        to: string;
    };
    amounts: {
        original: number;
        refunded: number;
    };
    client_id: number;
    date_created: string;
    id: string;
    last_updated: string;
    metadata: {};
    name: string;
    refund_charges: [];
    reserve_id: null;
    type: string;
}

interface Payer {
    email: null;
    entity_type: null;
    first_name: null;
    id: string;
    identification: {
        number: null;
        type: null;
    };
    last_name: null;
    operator_id: null;
    phone: {
        area_code: null;
        extension: null;
        number: null;
    };
    type: null;
}

interface PaymentMethod {
    id: string;
    issuer_id: string;
    type: string;
}

interface PointOfInteraction {
    application_data: {
        name: null;
        version: null;
    };
    business_info: {
        sub_unit: string;
        unit: string;
    };
    location: {
        source: null;
        state_id: null;
    };
    transaction_data: {
        bank_info: {
            collector: {
                account_holder_name: string;
                account_id: null;
                long_name: null;
                transfer_account_id: null;
            };
            is_same_bank_account_owner: null;
            origin_bank_id: null;
            origin_wallet_id: null;
            payer: {
                account_id: null;
                external_account_id: null;
                id: null;
                identification: {};
                long_name: null;
            };
        };
        bank_transfer_id: null;
        e2e_id: null;
        financial_institution: null;
        infringement_notification: {
            status: null;
            type: null;
        };
        qr_code: string;
        qr_code_base64: string;
        transaction_id: null;
    };
    type: string;
}

interface TransactionDetails {
    acquirer_reference: null;
    bank_transfer_id: null;
    external_resource_url: null;
    financial_institution: null;
    installment_amount: number;
    net_received_amount: number;
    overpaid_amount: number;
    payable_deferral_period: null;
    payment_method_reference_id: null;
    total_paid_amount: number;
    transaction_id: null;
}