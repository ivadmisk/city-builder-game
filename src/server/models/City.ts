import mongoose from 'mongoose';

export interface ICity extends mongoose.Document {
  name: string;
  owner: mongoose.Types.ObjectId;
  population: number;
  resources: {
    gold: number;
    wood: number;
    stone: number;
    food: number;
  };
  buildings: {
    type: string;
    level: number;
    position: { x: number; y: number };
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  population: {
    type: Number,
    default: 100,
    min: 0
  },
  resources: {
    gold: { type: Number, default: 1000, min: 0 },
    wood: { type: Number, default: 500, min: 0 },
    stone: { type: Number, default: 300, min: 0 },
    food: { type: Number, default: 1000, min: 0 }
  },
  buildings: [{
    type: { type: String, required: true },
    level: { type: Number, default: 1, min: 1 },
    position: {
      x: { type: Number, required: true },
      y: { type: Number, required: true }
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Обновляем updatedAt при изменении города
citySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const City = mongoose.model<ICity>('City', citySchema); 