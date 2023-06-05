import { NextFunction, Request, Response } from 'express'
import { get, controller, use, post, del, patch } from './decorators'
import { IFood } from '../models/food.model'
import { bodyValidator } from './decorators/bodyValidator'
import { AppError } from '../utils/AppError'
import Food from '../models/food.model'
import { HydratedDocument } from 'mongoose'
import Cart, { ICart } from '../models/cart.model'
import User, { IUser } from '../models/user.model'
import { isAuth } from '../middleware/isAuth'

// TODO  Search for a food

@controller('/cart')
class OrderController {
  @post('/add')
  @bodyValidator('foodId', 'quantity', 'restaurantId')
  @use(isAuth)
  async addCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { foodId, quantity, restaurantId } = req.body
      if (!req.user?._id) {
        next(new AppError(`Login to access this resource`, 404))
        return
      }

      let [user, cart, food]: [
        HydratedDocument<IUser> | null,
        HydratedDocument<ICart> | null,
        HydratedDocument<IFood> | null
      ] = await Promise.all([
        User.findById(req.user._id),
        Cart.findOne({ user: req.user._id }),
        Food.findById(foodId),
      ])

      if (!user) {
        next(new AppError(`User not found`, 404))
        return
      }
      if (!food) {
        next(new AppError(`Food not found`, 404))
        return
      }

      if (!cart) {
        cart = await Cart.create({
          user: req.user._id,
          restaurantId: restaurantId,
          foods: [{ food: foodId, quantity }],
          totalPrice: food?.price * quantity,
        })
        user.cart = cart._id
        await user.save()
      } else {
        cart.foods.push({ food: foodId, quantity })
        cart.totalPrice += food?.price * quantity
        await cart.save()
      }

      res.status(200).json({
        success: true,
        cart,
      })
    } catch (error) {
      console.log(error)
      next(new AppError(`Something went wrong, try again later`, 500))
    }
  }

  @get('/get')
  @use(isAuth)
  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user?._id) {
        next(new AppError(`Login to access this resource`, 404))
        return
      }

      let cart: HydratedDocument<ICart> | null = await Cart.findOne({
        user: req.user._id,
      }).populate('foods.food')

      if (!cart) {
        return next(new AppError(`Cart not found`, 400))
      }

      res.status(200).json({
        success: true,
        cart: cart,
      })
    } catch (error) {
      console.log(error)
      next(new AppError(`Something went wrong, try again later`, 500))
    }
  }

  @patch('/setquantity')
  @bodyValidator('foodId', 'quantity')
  @use(isAuth)
  async setQuantity(req: Request, res: Response, next: NextFunction) {
    try {
      const { foodId, quantity }: { foodId: string; quantity: number } =
        req.body
      if (!req.user?._id) {
        next(new AppError(`Login to access this resource`, 404))
        return
      }

      if (quantity <= 0) {
        return next(new AppError(`invalid quantity`, 401))
      }

      let cart: HydratedDocument<ICart> | null = await Cart.findOne({
        user: req.user._id,
      }).populate('foods.food')

      if (!cart) {
        return next(new AppError(`Cart not found`, 400))
      }

      const index = cart.foods.findIndex(
        (val: any) => val._id.toString() === foodId
      )

      if (index == -1) return next(new AppError(`Food not found`, 404))

      cart.foods[index].quantity = quantity

      await cart.save()

      res.status(200).json({
        success: true,
        cart: cart,
      })
    } catch (error) {
      console.log(error)
      next(new AppError(`Something went wrong, try again later`, 500))
    }
  }

  @del('/delfood/:id')
  @use(isAuth)
  async delFood(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      if (!req.user?._id) {
        next(new AppError(`Login to access this resource`, 404))
        return
      }

      let cart: HydratedDocument<ICart> | null = await Cart.findOne({
        user: req.user._id,
      }).populate('foods.food')

      if (!cart) {
        return next(new AppError(`Cart not found`, 400))
      }

      const foods = cart.foods.filter((val: any) => val._id.toString() !== id)

      cart.foods = foods
      await cart.save()

      res.status(200).json({
        success: true,
        cart: cart,
      })
    } catch (error) {
      console.log(error)
      next(new AppError(`Something went wrong, try again later`, 500))
    }
  }
}

//? ==========================================================
//*                 Routes of Cart Controllers
//? ==========================================================

/**
 * * get - cart/get - null - returns the user cart
 * * post - cart/add - foodId , quantity, restaurantId - Create a new or update a cart
 * * patch - cart/setquantity - foodId , quantity  - set quantity to foods
 * * delete - cart/delfood/:id - null  -  delete the cart food if exist
 */