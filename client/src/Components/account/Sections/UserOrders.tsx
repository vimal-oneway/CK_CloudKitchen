import { useEffect } from 'react'
import { useOrders } from '../../../hooks/useOrders'
import { CardContianer } from '../Cards/CardContianer'
import { RestaurantCard } from '../Cards/RestaurantCard'
import { Divider, Skeleton } from '@mui/material'
import NativeSelectInput from '@mui/material/NativeSelect/NativeSelectInput'
import { NavLink } from 'react-router-dom'

const OrdersLoading = () => {
  return (
    <div className="flex flex-col gap-8 w-[100%]" key={"ordersLoadingLoading"} >
      {
        Array(3).fill(0).map((_, i) => (
          <div className="flex items-center justify-between mt-2 w-[100%]">
            <div className="flex flex-row justify-start items-center gap-4">
              <Skeleton variant="rectangular" width={'9rem'} height={'6rem'} animation='wave' />
              <div className='w-[100%]'>
                <Skeleton variant="text" sx={{ fontSize: '1rem', width: '10vw' }} animation='wave' />
                <Skeleton variant="text" sx={{ fontSize: '1rem', width: '10vw' }} animation='wave' />
              </div>
            </div>
          </div>
        ))
      }
    </div>

  )
}

const NoUserOrders = () => (
  <div className="flex flex-col gap-8 w-[100%]" >
    <div className='w-[100%] flex flex-col justify-center items-center gap-7 '>
      <div className=''>
        <img src="https://res.cloudinary.com/dd39ktpmz/image/upload/v1687157167/tgtzyuvl9iggah5xheg2.png" alt="No orders found" width={400} height={'100%'} />
      </div>
      <NavLink to={'/'}>
        <h3 className="text-xl font-head font-bold text-center text-primary underline">Order Today</h3>
      </NavLink>
    </div>
  </div>
)


export const UserOrders = () => {

  const { handleLoadOrders, orders, loading } = useOrders()

  useEffect(() => {
    handleLoadOrders()
  }, [])

  return (
    <div id={'userOrders'}>
      <CardContianer title="Orders">
        {
          !(orders.length > 0) && loading ? <OrdersLoading key={"OrderLoading"} /> : orders.length == 0 ? (<NoUserOrders key={"Order not found"} />) : (
            <div className="flex flex-col gap-8" >
              {orders.length > 0 && orders.map((order, i) => (
                <>
                  <RestaurantCard orders={order} key={order._id} />
                  {i !== orders.length - 1 && <Divider />}
                </>
              ))}
            </div>
          )
        }
      </CardContianer >
    </div >
  )
}

