import { useEffect } from 'react';
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  wsConnectProfileOrders,
  wsDisconnectProfileOrders
} from '../../services/slices/profileOrdersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector((state) => state.profileOrders.orders);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      const token = accessToken.replace('Bearer ', '');
      dispatch(
        wsConnectProfileOrders(
          `wss://norma.education-services.ru/orders?token=...`
        )
      );
    }
    return () => {
      dispatch(wsDisconnectProfileOrders());
    };
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
