import { FC, SyntheticEvent, useState } from 'react';
import { ForgotPasswordUI } from '@ui-pages';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { forgot } from '../../services/slices/userSlice';

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.user);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(forgot({ email }))
      .unwrap()
      .then(() => {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true });
      })
      .catch(() => {});
  };

  return (
    <ForgotPasswordUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
