import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResetPasswordUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { reset } from '../../services/slices/userSlice';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.user);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(reset({ password, token }))
      .unwrap()
      .then(() => {
        localStorage.removeItem('resetPassword');
        navigate('/login', { replace: true });
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={error || ''}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
