import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Person {
  id: string;
  prefix: string;
  firstName: string;
  lastName: string;
  birthday: string;
  nationality: string;
  gender: string;
  citizenId: string;
  passport: string;
  countryCode: string;
  phone: string;
  expectedSalary: string;
}

interface PersonsState {
  persons: Person[];
}

const STORAGE_KEY = 'swd_persons';

function loadFromStorage(): Person[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(persons: Person[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(persons));
}

const initialState: PersonsState = {
  persons: [],
};

const personsSlice = createSlice({
  name: 'persons',
  initialState,
  reducers: {
    setPersons(state, action: PayloadAction<Person[]>) {
      state.persons = action.payload;
    },
    addPerson(state, action: PayloadAction<Person>) {
      state.persons.push(action.payload);
      saveToStorage(state.persons);
    },
    updatePerson(state, action: PayloadAction<Person>) {
      const idx = state.persons.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) {
        state.persons[idx] = action.payload;
        saveToStorage(state.persons);
      }
    },
    deletePerson(state, action: PayloadAction<string>) {
      state.persons = state.persons.filter((p) => p.id !== action.payload);
      saveToStorage(state.persons);
    },
    deletePersons(state, action: PayloadAction<string[]>) {
      state.persons = state.persons.filter((p) => !action.payload.includes(p.id));
      saveToStorage(state.persons);
    },
  },
});

export const { setPersons, addPerson, updatePerson, deletePerson, deletePersons } =
  personsSlice.actions;

export { loadFromStorage };
export default personsSlice.reducer;
