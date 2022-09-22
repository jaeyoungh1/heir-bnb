import { Route, Switch } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
// import { LoginFormPage } from './components/LoginFormPage'
import { SignUpPage } from './components/SignupFormPage';
import { Navigation } from './components/Navigation';
import { SpotsList } from './components/SpotsList';
import { CreateASpot } from './components/CreateSpotForm';
import { EditASpot } from './components/EditSpotForm';
import { SpotShowcase } from './components/SpotShowcase';
import { OwnerSpots } from './components/OwnerSpots';
import { OwnerReviews } from './components/OwnerReviews';
import { EditAReview } from './components/EditReview';
import { CreateAReview } from './components/CreateReviewForm';
import { ManageReviewPhotos } from './components/ManageReviewPhotos';

import * as sessionActions from './store/session'


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  console.log("isLoaded is: ", isLoaded)
//work on 404/error pages
  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path='/'>
            <SpotsList />
          </Route>
          <Route path='/spots/:spotId'>
            <SpotShowcase />
          </Route>
          <Route path="/signup">
            <SignUpPage />
          </Route>
          <Route path='/new-spot'>
            <CreateASpot />
          </Route>
          <Route path="/:spotId/edit-spot">
            <EditASpot />
          </Route>
          <Route path='/my-spots'>
            <OwnerSpots />
          </Route>
          <Route path='/my-reviews'>
            <OwnerReviews />
          </Route>
          <Route path="/:reviewId/edit-review">
            <EditAReview />
          </Route>
          <Route path="/:spotId/create-review">
            <CreateAReview />
          </Route>
          {/* <Route path="/:reviewId/review-photos">
            <ManageReviewPhotos />
          </Route> */}
          <Route>
            404! Not all that wander are lost, but you seem to be...
          </Route>
        </Switch>
      )}
    </>
  );
}
// return (
//     <>
//       <Navigation isLoaded={isLoaded} />

//       <Switch>
//         <Route exact path='/'>
//           <SpotsList />
//         </Route>
//         <Route path="/signup">
//           <SignUpPage />
//         </Route>
//         <Route path='/new-spot'>
//           <CreateASpot />
//         </Route>
//       </Switch>

//     </>
//   );
// }
export default App;
