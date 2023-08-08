export interface SSLData {
    PATH: string;
    SSL_DOMAIN: string;
    UNITE_NAME: string;
    PASS_PHASES: string;
    COMPANY_STATE: string;
    COMPANY_EMAIL: string;
    privateKeyPath?: string;
    certificatePath?: string;
    COMPANY_LOCALITY: string;
    ORGANIZATION_NAME: string;
    COUNTRY_TWO_LATTER: string;
}

export interface CertOptions {
    passphrase: string
    key: Buffer | string;
    cert: Buffer | string;
}