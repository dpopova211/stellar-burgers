import { useEffect } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  wsConnectFeed,
  wsDisconnectFeed
} from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector((state) => state.feed.orders);

  const connectFeed = () => {
    dispatch(wsConnectFeed('wss://norma.education-services.ru/orders/all'));
  };

  useEffect(() => {
    connectFeed();
    return () => {
      dispatch(wsDisconnectFeed());
    };
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(wsDisconnectFeed());
    setTimeout(() => {
      connectFeed();
    }, 100);
  };

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
