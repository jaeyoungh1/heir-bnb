import { useEffect, useState } from "react"
import { NavLink, Redirect } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { getOwnerBookings, deleteOneBooking } from "../../store/bookings"
// import EditBookingModal from "../EditBookingForm"
// import { getAllSpots } from "../../store/spots"
// import { deleteOneBooking } from "../../store/bookings"
import './OwnerBookings.css'

export const OwnerBookings = () => {
    const dispatch = useDispatch()
    // const [spotsLoaded, setSpotsLoaded] = useState(false)
    const currentUser = useSelector(state => state.session.user)

    let bookingSpotData
    const bookingUserData = useSelector(state => state.bookings.user)
    const [selectedTab, setSelectedTab] = useState("Upcoming");

    useEffect(() => {
        dispatch(getOwnerBookings())
    }, [dispatch])


    const deleteBooking = async (bookingId) => {
        await dispatch(deleteOneBooking(bookingId))

    }

    if (!currentUser) {
        return <Redirect to='/' />
    }

    let ownerBookingsUpcoming;
    let ownerBookingsPast;
    let bookingArr
    if (bookingUserData) {
        bookingArr = Object.values(bookingUserData)
    }
    // console.log(new Date())
    let upcomingBookingArr = bookingArr.filter(booking => new Date(new Date(booking.startDate.replace(/-/g, '\/'))) > new Date())
    let pastBookingArr = bookingArr.filter(booking => new Date(new Date(booking.startDate.replace(/-/g, '\/'))) < new Date())
    console.log('upcomingbookingarr', upcomingBookingArr)
    // console.log('pastbookingarr', pastBookingArr)

    if (upcomingBookingArr.length > 0) {
        ownerBookingsUpcoming = upcomingBookingArr.map(booking => {
            let nights = (new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24)
            return (
                <div className='single-booking-div' key={booking.id}>
                    <h4 className='single-booking-title'>
                        {nights} {nights > 1 ? "nights" : "night"} in {bookingUserData[booking.id].Spot.state}
                    </h4>
                    <div className='single-booking-dates'>
                        {new Date(new Date(booking.startDate.replace(/-/g, '\/'))).toString().slice(0, -42)} to {new Date(new Date(booking.endDate.replace(/-/g, '\/'))).toString().slice(0, -42)} at <NavLink style={{ textDecoration: 'none' }} to={`/spots/${bookingUserData[booking.id].spotId}`}><span className='booking-spotname'> {bookingUserData[booking.id].Spot.name}</span></NavLink>
                    </div>
                    <div className='booking-buttons'>
                        <div className='edit-booking https://i.insider.com/5e4c65927b1ede028c006075?width=1000&format=jpeg&auto=webp'>
                            {/* <div><EditBookingModal bookingId={booking.id}/></div> */}
                            <NavLink to={`/${booking.id}/edit-booking`}><div className='review-button-wrapper'><button className='manage-reviews-button'>Edit Booking</button></div></NavLink>
                        </div>
                        <div className='review-button-wrapper'><button className='manage-reviews-button' onClick={() => deleteBooking(booking.id)}> Delete Booking</button></div>
                    </div>


                </div>
            )
        })
    } else ownerBookingsUpcoming = <h3 className='no-bookings'>You don't have any upcoming bookings</h3>

    if (pastBookingArr.length > 0) {
        ownerBookingsPast = pastBookingArr.map(booking => {
            let nights = (new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24)
            return (
                <div className='single-booking-div' key={booking.id}>
                    <h4 className='single-booking-title'>
                        {nights} {nights > 1 ? "nights" : "night"} in {bookingUserData[booking.id].Spot.state}
                    </h4>
                    <div className='single-booking-dates'>
                        {new Date(new Date(booking.startDate.replace(/-/g, '\/'))).toString().slice(0, -42)} to {new Date(new Date(booking.endDate.replace(/-/g, '\/'))).toString().slice(0, -42)} at <NavLink style={{ textDecoration: 'none' }} to={`/spots/${bookingUserData[booking.id].id}`}><span className='booking-spotname'> {bookingUserData[booking.id].Spot.name}</span></NavLink>
                    </div>
                </div>
            )
        })
    } else ownerBookingsPast = <h3>You don't have any previous bookings</h3>

    return (
        <>
            <h3 className='bookings-header'>
                My Reservations
            </h3>
            <div className='bookings-wrapper'>
                <div className='bookings-tabs'>
                    <div className={selectedTab === 'Upcoming' ? 'selected-tab' : 'booking-tab'} onClick={() => setSelectedTab("Upcoming")}>Upcoming</div>
                    <div className={selectedTab === 'Past' ? 'selected-tab' : 'booking-tab'} onClick={() => setSelectedTab("Past")}>Past</div>
                </div>
                <div>
                    {selectedTab === 'Upcoming' ? ownerBookingsUpcoming : ownerBookingsPast}
                </div>
            </div>
        </>
    )
}