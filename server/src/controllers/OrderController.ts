import { NextFunction, Request, Response } from 'express'
import { get, controller, use, post } from './decorators'
import { bodyValidator } from './decorators/bodyValidator'
import { isAdmin, isAuth } from '../middleware/isAuth'
import { AppError } from '../utils/AppError'
import { HydratedDocument } from 'mongoose'
import Cart, { ICart } from '../models/cart.model'
import Order, { IOrder } from '../models/order.model'
import User, { IUser } from '../models/user.model'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { log } from 'winston'

// TODO  Search for a food

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_SECERT_KEY,
})

@controller('/order')
class OrderController {
  @post('/request')
  @use(isAuth)
  async order(req: Request, res: Response, next: NextFunction) {
    console.log(req.user, 'user ')
    console.log('order ')

    if (!req.user) {
      next(new AppError('Login to checkout', 400))
      return
    }

    try {
      const cart = await Cart.findById(req.user.cart)
        .populate('foods.food')
        .lean()

      if (!cart || cart.totalPrice == 0) {
        next(new AppError('Please add some foods to cart', 404))
        return
      }

      let options = {
        amount: Number(cart.totalPrice * 100),
        currency: 'INR',
        receipt: 'order_rcptid_11',
      }

      const order = await razorpay.orders.create(options)
      res.status(200).json({
        success: true,
        order,
      })
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Something went wrong',
      })
    }
  }

  @post('/checkout')
  @bodyValidator('addressId')
  @use(isAuth)
  async checkout(req: Request, res: Response, next: NextFunction) {
    try {
      const { addressId } = req.body
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
        req.body.id.response
      const amount = req.body.id.amount

      console.log(
        addressId,
        'addressId',
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_order_id,
        amount
      )

      const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECERT_KEY!)
      hmac.update(razorpay_order_id + '|' + razorpay_payment_id)
      const generatedSignature = hmac.digest('hex')

      if (generatedSignature !== razorpay_signature) {
        next(new AppError(`Something went wrong, try again later`, 500))
        return
      }

      if (!addressId) {
        next(new AppError(`Please provide an address`, 400))
        return
      }

      if (!req.user?.cart) {
        console.log('no cart', req.user?.cart)

        next(new AppError(`Login to access this resource`, 400))
        return
      }

      const cartquery = Cart.findById(req.user.cart)
        .populate('foods.food')
        .lean()

      const userquery = User.findById(req.user._id).select('+orders +cart')

      let [cart, user]: [ICart | null, HydratedDocument<IUser> | null] =
        await Promise.all([cartquery, userquery])

      if (!cart || !user) {
        next(new AppError(`Please login to checkout`, 404))
        return
      }

      if (cart.totalPrice != amount) {
        next(new AppError('Price mismatch', 501))
      }

      const { foods } = cart

      const order: HydratedDocument<IOrder> = await Order.create({
        user: req.user?._id,
        foods,
        totalPrice: cart.totalPrice,
        address: addressId,
      })

      user.orders?.push(order.id)

      const userQueryPushOrder = user.save({
        validateBeforeSave: false,
      })

      await Promise.all([userQueryPushOrder])

      res.status(200).json({
        success: true,
        orders: order,
      })
    } catch (error) {
      next(new AppError(`Something went wrong, try again later`, 500))
    }
  }

  @get('/myorders')
  @use(isAuth)
  async getMyOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await Order.find({ user: req.user?._id })
        .populate('foods.food')
        .lean()

      res.status(200).json({
        success: true,
        orders,
      })
    } catch (error) {
      next(new AppError(`Something went wrong, try again later`, 500))
    }
  }

  @get('/restaurantorders')
  @use(isAuth)
  @use(isAdmin)
  async getRestaurantOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await Order.find({ restaurant: req.user?.restaurant })
        .populate('foods.food')
        .lean()

      res.status(200).json({
        success: true,
        orders,
      })
    } catch (error) {
      next(new AppError(`Something went wrong, try again later`, 500))
    }
  }
}

//? ==========================================================
//*                 Routes of Order Controllers
//? ==========================================================

/**
 * * post - order/checkout - Create a new order and set paid to it
 */
