import { csrfFetch } from './csrf';

const CREATE_BOOKING = 'bookings/create_booking'
const ADD_BOOKING_IMG = 'bookings/add_booking_photo'
const LOAD_SPOT_BOOKINGS = 'bookings/load_spot_bookings'
const LOAD_USER_BOOKINGS = 'bookings/load_user_bookings'
const UPDATE_BOOKING = 'bookings/update_booking'
const REMOVE_BOOKING = 'bookings/remove_booking'

export function loadAllBookings(bookings) {
    return {
        type: LOAD_SPOT_BOOKINGS,
        bookings
    }
}

export function addBookingImage(img) {
    return {
        type: ADD_BOOKING_IMG,
        img
    }
}

export function loadUserBookings(bookings) {
    return {
        type: LOAD_USER_BOOKINGS,
        bookings
    }
}

export function createABooking(booking) {
    return {
        type: CREATE_BOOKING,
        booking
    }
}

export function updateABooking(booking) {
    return {
        type: UPDATE_BOOKING,
        booking
    }
}

export function deleteABooking(bookingId) {
    return {
        type: REMOVE_BOOKING,
        bookingId
    }
}


export const getAllSpotBookings = (spotId) => async dispatch => {
    let res = await csrfFetch(`/api/spots/${spotId}/bookings`)
    if (res.ok) {
        let data = await res.json()
        dispatch(loadAllBookings(data.Bookings))
        return data
    }
}


export const getOwnerBookings = () => async dispatch => {
    let res = await csrfFetch(`/api/bookings/current`)
    if (res.ok) {
        let data = await res.json()
        dispatch(loadUserBookings(data.Bookings))
        return data
    }
}

export const createOneBooking = (spotId, bookingData) => async dispatch => {
    // console.log(spotId, bookingData)
    try {
        const response = await csrfFetch(`/api/spots/${spotId}/bookings`, {
            method: 'POST',
            body: JSON.stringify(
                bookingData
            )
        });

        if (!response.ok) {
            let error
            let errorJSON;
            error = await response.text();
            try {
                errorJSON = JSON.parse(error);
            }
            catch {
                throw new Error(error);
            }
            throw new Error(`${errorJSON.error}`);
        }

        const data = await response.json();

        dispatch(createABooking(data));
        data.Spot = {}
        data.User = {}
        console.log('create booking data', data)

        return data;
    }
    catch (error) {
        let errorJSON = await error.json()
        throw errorJSON
    }

}

export const updateOneBooking = (bookingId, booking) => async dispatch => {
    try {
        const response = await csrfFetch(`/api/bookings/${bookingId}`, {
            method: 'PUT',
            body: JSON.stringify(
                booking
            )
        });

        if (!response.ok) {
            let error
            error = await response.text();
        }


        const data = await response.json();
        dispatch(updateABooking(data));
        return data;
    }
    catch (error) {
        let errorJSON = await error.json()
        throw errorJSON
    }
};

export const deleteOneBooking = (bookingId) => async dispatch => {
    let res = await csrfFetch(`api/bookings/${bookingId}`, {
        method: 'DELETE'
    })
    if (res.ok) {
        let data = await res.json()
        dispatch(deleteABooking(bookingId))
        return data
    }
}

const initialState = { user: {}, spot: {} }

export default function bookingsReducer(state = initialState, action) {
    let newState
    let bookingData = {}
    let userData = {}
    let spotData = {}
    let bookingImg = []
    switch (action.type) {
        case LOAD_SPOT_BOOKINGS:
            // console.log("spot bookings", action.bookings)
            action.bookings.forEach((booking, i) => {
                spotData[i] = booking
            })
            newState = { ...state, user: { ...userData }, spot: { ...spotData } }
            return newState
        case LOAD_USER_BOOKINGS:
            action.bookings.forEach(booking => {
                userData[booking.id] = booking
                spotData[booking.id] = booking.Spot
            })
            newState = { user: { ...userData }, spot: {...spotData} }
            return newState
        case CREATE_BOOKING:
            spotData[action.booking.id] = action.booking
            newState = { ...state, spot: { ...spotData } }
            return newState;
        case UPDATE_BOOKING:
            userData[action.booking.id] = action.booking
            newState = { ...state, user: { ...state.user, ...userData } }
            return newState;

        case REMOVE_BOOKING:
            userData = state.user
            newState = { ...state, user: { ...userData } }
            delete newState.user[action.bookingId]
            return newState
        default:
            return state
    }

}
