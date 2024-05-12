import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ILocation } from "../../interfaces/ilocation";
import { userAuthKey } from "./userauth.reducer";

export const userAuthSelect = createFeatureSelector<ILocation>(userAuthKey);

export const selectUser = createSelector(
    userAuthSelect,
    (state: ILocation) => {
        return state;
    }
)
