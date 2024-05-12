import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ILocation } from "../../interfaces/ilocation";
import { locationKey } from "./location.reducer";

export const locationSelect = createFeatureSelector<ILocation>(locationKey);

export const selectLocation = createSelector(
    locationSelect,
    (state: ILocation) => {
        return state;
    }
)
