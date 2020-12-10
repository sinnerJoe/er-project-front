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
        },
    },
    extraReducers: {
        [fetchCurrentUser.fulfilled as unknown as string]: (state, action) => {
            if(!action.payload) return;
            const {payload: {data}} = action;
            if(!data){
                return;
            }
            console.log(data);
            state.userId = Number(data.userId);
            state.role = Number(data.role);
            state.email = data.email;
        }
    }
})

export const { clearData } = userSlice.actions;

export { fetchCurrentUser };

export default userSlice.reducer;