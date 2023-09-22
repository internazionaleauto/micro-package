import { Schema } from "mongoose";

export const ContactSchema = new Schema(
    {
        first_name: {
            type: String,
            trim: true,
        },
        last_name: {
            type: String,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        phone_home: {
            type: String,
            trim: true,
        },
        phone_work: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
        },
        email_home: {
            type: String,
            trim: true,
        },
        email_work: {
            type: String,
            trim: true,
        },
        company_name: {
            type: String,
            trim: true,
        },
        tag: {
            type: String,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            trim: true,
        },
        state: {
            type: String,
            trim: true,
        },
        zip: {
            type: String,
            trim: true,
        },
        modello: {
            type: String,
            trim: true,
        },
        modello_2: {
            type: String,
            trim: true,
        },
        modello_3: {
            type: String,
            trim: true,
        },
        versione: {
            type: String,
            trim: true,
        },
        versione_2: {
            type: String,
            trim: true,
        },
        versione_3: {
            type: String,
            trim: true,
        },
        alimentazione: {
            type: String,
            trim: true,
        },
        alimentazione_2: {
            type: String,
            trim: true,
        },
        alimentazione_3: {
            type: String,
            trim: true,
        },
        targa: {
            type: String,
            trim: true,
        },
        targa_2: {
            type: String,
            trim: true,
        },
        targa_3: {
            type: String,
            trim: true,
        },
        telaio: {
            type: String,
            trim: true,
        },
        telaio_2: {
            type: String,
            trim: true,
        },
        telaio_3: {
            type: String,
            trim: true,
        },
        data_immatricolazione: {
            type: Date,
            trim: true,
        },
        data_immatricolazione_2: {
            type: Date,
            trim: true,
        },
        data_immatricolazione_3: {
            type: Date,
            trim: true,
        },
        km: {
            type: String,
            trim: true,
        },
        km_2: {
            type: String,
            trim: true,
        },
        km_3: {
            type: String,
            trim: true,
        },
        prossima_revisione: {
            type: Date,
            trim: true,
        },
        prossima_revisione_2: {
            type: Date,
            trim: true,
        },
        prossima_revisione_3: {
            type: Date,
            trim: true,
        },
        // Cilindrata is a new field
        cilindrata: {
            type: Number,
            trim: true,
            default: 0,
        },
        cilindrata_2: {
            type: Number,
            trim: true,
            default: 0,
        },
        cilindrata_3: {
            type: Number,
            trim: true,
            default: 0,
        },
        // Kw is a new field
        kw: {
            type: Number,
            trim: true,
            default: 0,
        },
        kw_2: {
            type: Number,
            trim: true,
            default: 0,
        },
        kw_3: {
            type: Number,
            trim: true,
            default: 0,
        },
        // Cv is a new field
        cv: {
            type: Number,
            trim: true,
            default: 0,
        },
        cv_2: {
            type: Number,
            trim: true,
            default: 0,
        },
        cv_3: {
            type: Number,
            trim: true,
            default: 0,
        },
        scadenza_estensione_garanzia: {
            type: Date,
            trim: true,
        },
        scadenza_estensione_garanzia_2: {
            type: Date,
            trim: true,
        },
        scadenza_estensione_garanzia_3: {
            type: Date,
            trim: true,
        },
        km_estensione_garanzia: {
            type: String,
            trim: true,
        },
        km_estensione_garanzia_2: {
            type: String,
            trim: true,
        },
        km_estensione_garanzia_3: {
            type: String,
            trim: true,
        },
        gomme_estive: {
            type: String,
            trim: true,
        },
        gomme_estive_2: {
            type: String,
            trim: true,
        },
        gomme_estive_3: {
            type: String,
            trim: true,
        },
        gomme_invernali: {
            type: String,
            trim: true,
        },
        gomme_invernali_2: {
            type: String,
            trim: true,
        },
        gomme_invernali_3: {
            type: String,
            trim: true,
        },
        gomme_4_stagioni: {
            type: String,
            trim: true,
        },
        gomme_4_stagioni_2: {
            type: String,
            trim: true,
        },
        gomme_4_stagioni_3: {
            type: String,
            trim: true,
        },
        slug: {
            type: String,
            trim: true,
        },
        newClient: {
            type: Boolean,
            default: false
        },
        prossimo_tagliando: {
            type: Date,
            trim: true,
        },
        prossimo_tagliando_2: {
            type: Date,
            trim: true,
        },
        prossimo_tagliando_3: {
            type: Date,
            trim: true,
        },
        messages: [
            {
                status: {
                    type: Boolean,
                    default: false,
                },
                messageStatus: {
                    type: String,
                    trim: true,
                    default: "queued",
                },
                messageSid: {
                    type: String,
                    trim: true,
                },
                date: {
                    type: String,
                    trim: true,
                },
                time: {
                    type: String,
                    trim: true,
                },
                name: {
                    type: String,
                    trim: true,
                    default: "client",
                },
                body: {
                    type: String,
                    trim: true,
                },
                media: {
                    type: String,
                    trim: true,
                },
                typeOfSms: {
                    type: String,
                    trim: true,
                    default: null
                }
            },
        ],
        notes: [
            {
                type: String,
                trim: true
            }
        ],
        payments: [
            {
                type: Schema.Types.ObjectId,
                ref: "Payment"
            }
        ],
        customer_id: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// const Contact = model("Contact", ContactSchema);
// export default Contact;
