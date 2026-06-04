import { ingredientsReducer, fetchIngredients } from '../slices/ingredientsSlice';
import { TIngredient } from '@utils-types';

const mock: TIngredient = {
  _id: '1',
  name: 'Test',
  type: 'main',
  price: 100,
  proteins: 1,
  fat: 2,
  carbohydrates: 3,
  calories: 4,
  image: '',
  image_mobile: '',
  image_large: '',
};

describe('ingredientsSlice', () => {
  const init = { items: [], loading: false, error: null };

  it('pending устанавливает loading=true', () => {
    const state = ingredientsReducer(init, { type: fetchIngredients.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fulfilled сохраняет данные и убирает loading', () => {
    const items = [mock];
    const state = ingredientsReducer(init, { type: fetchIngredients.fulfilled.type, payload: items });
    expect(state.loading).toBe(false);
    expect(state.items).toEqual(items);
    expect(state.error).toBeNull();
  });

  it('rejected записывает ошибку и убирает loading', () => {
    const state = ingredientsReducer(init, {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка' },
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка');
  });
});
