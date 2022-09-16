import { NavLink } from "react-router-dom"
import { useSelector } from "react-redux"
import { ProfileButton } from "./ProfileButton"

import './Navigation.css'

export const Navigation = () => {

    const currentUser = useSelector(state => state.session.user)

    let sessionLinks;
    if (currentUser) {
        sessionLinks = (
            <ProfileButton user={currentUser} />
        );
    } else {
        sessionLinks = (
            <>
                <span><NavLink style={{'text-decoration':'none', 'color': '#45454599'}}to="/login">Log In</NavLink></span>
                <span><NavLink style={{'text-decoration':'none', 'color': '#45454599'}}to="/signup">Sign Up</NavLink></span>
            </>
        );
    }

    return (
        <ul>
            <li className='session'>
                <NavLink style={{'text-decoration':'none', 'color': '#45454599'}}exact to="/">Home</NavLink>
                <div className='sessionlinks'>
                {sessionLinks}
                </div>
            </li>
        </ul>
    );
}
