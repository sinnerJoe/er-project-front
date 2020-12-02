import {createSlice} from '@reduxjs/toolkit';
import { Role } from 'shared/interfaces/Role';
import { fetchCurrentUser } from './thunks';

export interface UserState {
    userId: number,
    email: string,
    role: Role
}

const initialState: UserState = {
    role: 10,
    userId: -1,
    email: ''
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearData(state) {
            state.role = initialState.role;
            state.email = initialState.email;
            state.userId = initialState.userId;
        }
    },
    extraReducers: {
        [fetchCurrentUser.fulfilled as unknown as string]: (state, action) => {
            const payload = action.payload;
            if(!payload){
                return;
            }
            state.userId = payload.userId;
            state.role = payload.role;
            state.email = payload.email;
        }
    }
})

export const { clearData } = userSlice.actions;

export { fetchCurrentUser };

export default userSlice.reducer;