import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  createOrder,
  closeOrderModal
} from '../../services/slices/constructorSlice';
import { getUser } from '../../services/slices/userSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bun, ingredients, orderRequest, orderModalData } = useSelector(
    (state) => state.burgerConstructor
  );
  const user = useSelector(getUser);

  const onOrderClick = () => {
    if (!bun || orderRequest) return;
    if (!user) {
      navigate('/login');
      return;
    }
    const ids = [bun._id, ...ingredients.map((i) => i._id), bun._id];
    dispatch(createOrder(ids));
  };

  const closeModal = () => {
    dispatch(closeOrderModal());
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) + ingredients.reduce((s, v) => s + v.price, 0),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeModal}
    />
  );
};
