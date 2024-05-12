import { createReducer, on } from "@ngrx/store";
import { IAuthUser } from "../../interfaces/iauth-user"
import { ILocation } from "../../interfaces/ilocation";
import { clearLocation, setLocation, updateLocation } from "./location.actions";

export const initialState: ILocation = {};

export const locationKey = 'location';

export const locationReducer = createReducer(
    initialState, 
    on(setLocation, (state, {payload}) => state = payload), 
    on(updateLocation, (state, {payload}) => state = payload),
    on(clearLocation, (state) => state = initialState)
)