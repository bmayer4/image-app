import { SORT_BY_CATEGORY, SET_LIMIT, CLEAR_FILTERS } from './types';

export const sortByCategory = (category) => ({
    type: SORT_BY_CATEGORY,
    payload: category
});

export const setLimit = (limit) => ({
    type: SET_LIMIT,
    payload: limit
});

export const clearFilters = () => ({
    type: CLEAR_FILTERS
})


