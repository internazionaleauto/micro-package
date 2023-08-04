export interface CertificateInft {
    PATH: string;
    SERVER_URI: string;
    PASS_PHASES: string;
    WHERE_COMPANY: string;
    COMPANY_UNITE: string;
    COMPANY_EMAIL: string;
    COMPANY_STATE: string;
    COMPANY_LOCAL_NAME: string;
    COMPANY_ORGANIZATION: string;
}

export interface CertOptions {
    passphrase: string
    key: Buffer | string;
    cert: Buffer | string;
}