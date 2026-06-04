import {
  constructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  closeOrderModal,
  TIngredientWithId,
} from '../slices/constructorSlice';
import { TIngredient } from '@utils-types';

const bun: TIngredient = {
  _id: 'bun1', name: 'Bun', type: 'bun', price: 100,
  proteins: 1, fat: 2, carbohydrates: 3, calories: 4,
  image: '', image_mobile: '', image_large: '',
};

const sauce: TIngredient = {
  _id: 'sauce1', name: 'Sauce', type: 'sauce', price: 50,
  proteins: 1, fat: 2, carbohydrates: 3, calories: 4,
  image: '', image_mobile: '', image_large: '',
};

const main: TIngredient = {
  _id: 'main1', name: 'Main', type: 'main', price: 200,
  proteins: 1, fat: 2, carbohydrates: 3, calories: 4,
  image: '', image_mobile: '', image_large: '',
};

describe('constructorSlice', () => {
  it('возвращает начальное состояние', () => {
    const state = constructorReducer(undefined, { type: '' });
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toBeNull();
  });

  describe('addIngredient', () => {
    it('добавляет булку', () => {
      const action = addIngredient(bun);
      const state = constructorReducer(undefined, action);
      expect(state.bun).toMatchObject({ ...bun, id: expect.any(String) });
      expect(state.ingredients).toHaveLength(0);
    });

    it('добавляет начинку', () => {
      const action = addIngredient(sauce);
      const state = constructorReducer(undefined, action);
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toMatchObject({ ...sauce, id: expect.any(String) });
    });
  });

  describe('removeIngredient', () => {
    it('удаляет ингредиент по индексу', () => {
      const initialState = {
        bun: null,
        ingredients: [{ ...sauce, id: '1' }, { ...main, id: '2' }] as TIngredientWithId[],
        orderRequest: false,
        orderModalData: null,
      };
      const action = removeIngredient(0);
      const state = constructorReducer(initialState, action);
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].id).toBe('2');
    });
  });

  describe('moveIngredient', () => {
    it('перемещает ингредиент', () => {
      const initialState = {
        bun: null,
        ingredients: [{ ...sauce, id: '1' }, { ...main, id: '2' }] as TIngredientWithId[],
        orderRequest: false,
        orderModalData: null,
      };
      const action = moveIngredient({ from: 1, to: 0 });
      const state = constructorReducer(initialState, action);
      expect(state.ingredients[0].id).toBe('2');
      expect(state.ingredients[1].id).toBe('1');
    });
  });
});
