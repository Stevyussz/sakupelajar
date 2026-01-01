import mongoose, { Schema } from 'mongoose';

const TransactionSchema = new Schema({
    judul: { type: String, required: true },
    deskripsi: { type: String }, // Optional description
    jumlah: { type: Number, required: true }, // Positif = Pemasukan, Negatif = Pengeluaran
    kategori: { type: String, required: true },
    type: { type: String, enum: ['need', 'want', 'income'], default: 'need' }, // Legacy Innovation: Need vs Want Analysis
    kakeiboPillar: { type: String, enum: ['survival', 'optional', 'culture', 'extra'], default: 'survival' }, // Kakeibo Methodology
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tanggal: { type: Date, default: Date.now },
}, { timestamps: true });

const Model = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);

if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.Transaction;
}

export default Model;