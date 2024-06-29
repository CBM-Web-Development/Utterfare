import { createReducer, on } from "@ngrx/store";
import { IAuthUser } from "../../interfaces/iauth-user"
import { resetUserAuth, setUserAuth, updateUserAuth, updateUserAuthProfile } from "./userauth.actions";

export const initialState: IAuthUser = {
    auth: {
        id: 0,
        username: "",
        token: "",
        type: "",
        accountsId: []
    },
    profile: {
        id: 0,
        userId: 0,
        emailAddress: ""
    }
};

export const userAuthKey = 'userAuth';

export const userAuthReducer = createReducer(
    initialState, 
    on(setUserAuth, (state, {payload}) => state = payload), 
    on(updateUserAuth, (state, {payload}) => state = payload),
    on(updateUserAuthProfile, (state, {profile}) => state = {auth: state.auth, profile}),
    on(resetUserAuth, (state) => state = initialState)
)