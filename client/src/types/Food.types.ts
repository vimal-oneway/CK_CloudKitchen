import { IRestaurant } from './Restaurant.types'
import { IUser } from './user.types'

export interface IFood {
  user: IUser | string
  restaurant: IRestaurant | string
  title: string
  price: number
  description: string
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
  _id: string
}