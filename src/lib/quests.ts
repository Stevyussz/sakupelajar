export interface Quest {
    id: string;
    type: 'add_transaction' | 'spend_below_100k' | 'save_money';
    target: number;
    progress: number;
    reward: number;
    claimed: boolean;
    description: string;
}

export const DAILY_QUESTS_POOL: Omit<Quest, 'id' | 'progress' | 'claimed'>[] = [
    {
        type: 'add_transaction',
        target: 1,
        reward: 50,
        description: 'Mulai Langkah Awal: Catat 1 Transaksi'
    },
    {
        type: 'add_transaction',
        target: 5,
        reward: 200,
        description: 'Super Pencatat: Input 5 Transaksi hari ini'
    },
    {
        type: 'save_money',
        target: 20000,
        reward: 150,
        description: 'Tabungan Masa Depan: Simpan Rp 20.000'
    },
    {
        type: 'save_money',
        target: 50000,
        reward: 300,
        description: 'Sultan Mode: Tabung Rp 50.000 sehari!'
    },
    {
        type: 'spend_below_100k',
        target: 100000,
        reward: 250,
        description: 'Low Budget Challenge: Pengeluaran < 100rb'
    }
];

export function generateDailyQuests(): Quest[] {
    // Shuffle and pick 3 random quests
    const shuffled = [...DAILY_QUESTS_POOL].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

    return selected.map(q => ({
        ...q,
        id: crypto.randomUUID(),
        progress: 0,
        claimed: false
    }));
}
