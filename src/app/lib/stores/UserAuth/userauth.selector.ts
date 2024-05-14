import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ILocation } from "../../interfaces/ilocation";
import { userAuthKey } from "./userauth.reducer";
import { IAuthUser } from "../../interfaces/iauth-user";

export const userAuthSelect = createFeatureSelector<IAuthUser>(userAuthKey);

export const selectUser = createSelector(
    userAuthSelect,
    (state: IAuthUser) => {
        return state;
    }
)
