import mongoose, { Schema } from 'mongoose';

const WishlistSchema = new Schema({
    itemName: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    savedAmount: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false }
});

const DebtSchema = new Schema({
    personName: { type: String, required: true },
    amount: { type: Number, required: true }, // Positive = They owe me, Negative = I owe them
    description: { type: String },
    dueDate: { type: Date },
    isPaid: { type: Boolean, default: false }
});

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    level: { type: String, default: 'Novice Saver' },
    experience: { type: Number, default: 0 },
    wishlist: [WishlistSchema],
    debts: [DebtSchema],
    budgets: [{
        category: { type: String, required: true },
        limit: { type: Number, required: true },
        period: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'monthly' },
        spent: { type: Number, default: 0 } // Tracks spending based on period
    }],
    streak: {
        current: { type: Number, default: 0 },
        lastLogin: { type: Date, default: null },
        best: { type: Number, default: 0 }
    },
    quests: [{
        id: { type: String, required: true },
        type: { type: String, required: true }, // 'transaction_count', 'spending_limit', 'save_money'
        target: { type: Number, required: true },
        progress: { type: Number, default: 0 },
        reward: { type: Number, required: true }, // XP amount
        claimed: { type: Boolean, default: false },
        description: { type: String, required: true }
    }],
    lastQuestReset: { type: Date, default: null },
    avatarId: { type: String, default: 'lion' },
    unlockedAvatars: { type: [String], default: ['lion'] },
    hasSeenOnboarding: { type: Boolean, default: false },
    customCategories: { type: [String], default: [] },
    reflections: [{
        period: { type: String, required: true }, // e.g., "2024-01" or "2025-W01"
        content: { type: String, default: '' },
        createdAt: { type: Date, default: Date.now }
    }],
}, { timestamps: true });

// Force re-compilation in development to ensure new schema fields (like debts) are picked up
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.User;
}

export default mongoose.models.User || mongoose.model('User', UserSchema);
