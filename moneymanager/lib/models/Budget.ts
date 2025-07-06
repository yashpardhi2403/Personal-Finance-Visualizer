import mongoose, { Schema, Document } from 'mongoose';

export interface IBudget extends Document {
  category: string;
  amount: number;
  spent: number;
  month: string;        // Format: "YYYY-MM"
  createdAt: Date;
  updatedAt: Date;
}

const BudgetSchema: Schema = new Schema({
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    enum: [
      'Food',
      'Transport',
      'Shopping',
      'Health',
      'Utilities',
      'Entertainment',
      'Rent',
      'Salary',
      'Other'
    ]
  },
  amount: {
    type: Number,
    required: [true, 'Budget amount is required'],
    min: [0, 'Budget amount must be non-negative']
  },
  spent: {
    type: Number,
    default: 0,
    min: [0, 'Spent amount must be non-negative']
  },
  month: {
    type: String,
    required: [true, 'Month is required'],
    match: [/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format']
  }
}, {
  timestamps: true
});

// Ensure unique budget per category per month (no userId needed)
BudgetSchema.index({ category: 1, month: 1 }, { unique: true });

export default mongoose.models.Budget ||
  mongoose.model<IBudget>('Budget', BudgetSchema);
