import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { fetchOrderByNumber } from '../../services/slices/orderSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const ordersAll = useSelector((state) => state.feed.orders);
  const ordersProfile = useSelector((state) => state.profileOrders.orders);
  const ingredients = useSelector((state) => state.ingredients.items);
  const { orderData: fetchedOrder } = useSelector((state) => state.order);

  const orders = location.pathname.startsWith('/profile')
    ? ordersProfile
    : ordersAll;
  const orderData = orders.find((o: TOrder) => o.number === Number(number));

  useEffect(() => {
    if (!orderData && number) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [orderData, number, dispatch]);

  const currentOrder = orderData || fetchedOrder;

  const orderInfo = useMemo(() => {
    if (!currentOrder || !ingredients.length) return null;

    const date = new Date(currentOrder.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = currentOrder.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = { ...ingredient, count: 1 };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...currentOrder,
      ingredientsInfo,
      date,
      total
    };
  }, [currentOrder, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
