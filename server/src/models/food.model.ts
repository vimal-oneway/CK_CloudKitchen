import mongoose, { HydratedDocument, Schema, Types } from 'mongoose'
import { IUser } from './user.model'
import { IRestaurant } from './Restaurant.model'

export interface IFood {
  user: Types.ObjectId | IUser
  restaurant: Types.ObjectId | IRestaurant
  title: string
  price: number
  rating?: number
  averageRating?: number
  totalRating?: number
  time: {
    open: Date
    close: Date
  }
  image: string[]
  category: string
  createdAt?: Date
  updatedAt?: Date
}

const foodSchema: Schema = new Schema<IFood>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, required: true, default: 0 },
  image: [{ type: String, required: true }],
  category: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now() },
  updatedAt: { type: Date, required: true, default: Date.now() },
  time: {
    open: { type: Date, required: true },
    close: { type: Date, required: true },
  },
  totalRating: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
})

foodSchema.pre('save', function (next) {
  const food = this as HydratedDocument<IFood>
  if (food.rating && food.totalRating) {
    food.averageRating = food.rating / food.totalRating
  }
  next()
})

const Food = mongoose.model<IFood>('Food', foodSchema)

export default Food