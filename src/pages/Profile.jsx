import React, { useEffect, useState } from "react";
import { getAuth, updateProfile } from "@firebase/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  collection,
  doc,
  where,
  getDocs,
  orderBy,
  query,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import homeIcon from "../assets/svg/homeIcon.svg";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import ListingItem from "../components/ListingItem";
import Spinner from "../components/Spinner";
function Profile() {
  const auth = getAuth();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const [changeDetails, setChangeDetails] = useState(false);
  const { name, email } = formData;
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, "listings");
      const q = query(
        listingsRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(listings);

      setLoader(false);
    };
    fetchUserListings();
  }, []);
  const onLogout = () => {
    auth.signOut();
    navigate("/");
  };
  const onDelete = async (listingId) => {
    if (window.confirm("Are You Sure You Want To Delete This")) {
      await deleteDoc(doc(db, "listings", listingId));
      const updateListings = listings.filter(
        (listing) => listing.id !== listingId
      );
      setListings(updateListings);
      toast.success(
        "Successfully deleted listing but make an update for delete inside the store"
      );
    }
  };
  const onEdit = (listingId) => {
    navigate(`/edit-listing/${listingId}`)
  };
  const onSubmit = async () => {
    try {
      const displayName = name;
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, { displayName });
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, { name });
      }
    } catch (error) {
      toast.error("Could not update profile details!");
    }
  };
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  if (loader) {
    <Spinner />;
  }

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type="button" className="logOut" onClick={onLogout}>
          Logout
        </button>
      </header>
      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prevState) => !prevState);
            }}
          >
            {changeDetails ? "done" : "change"}
          </p>
        </div>
        <div className="profileCard">
          <form>
            <input
              style={{ borderRadius: "4px" }}
              type="text"
              id="name"
              className={!changeDetails ? "profileName" : "profileNameActive"}
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
            <input
              style={{ borderRadius: "4px" }}
              type="text"
              id="email"
              className={!changeDetails ? "profileEmail" : "profileEmailActive"}
              disabled={true}
              value={email}
              onChange={onChange}
            />
          </form>
        </div>
        <Link to="/create-listing" className="createListing">
          <img src={homeIcon} alt="home" />
          <p>Sell or rent your house</p>
          <img src={arrowRight} alt="ArrowRight" />
        </Link>
        {!loader && listings?.length > 0 && (
          <>
            <p className="listingText">Your Listings</p>
            <ul className="listingsList">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  onDelete={onDelete}
                  onEdit={onEdit}
                ></ListingItem>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}

export default Profile;
