import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

function Offers() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        // Get the last visible document
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastFetchedListing(lastVisible);
        let listings = [];
        querySnapshot.forEach((doc) => {
          return listings.push({ id: doc.id, data: doc.data() });
        });
        setListings(listings);
        console.log(listings);
        setLoading(false);
      } catch (error) {
        toast.info("Could not fetch data");
      }
    };

    fetchListings();
  }, []);
  const onLoadMoreListings = async () => {
    try {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing),
        limit(10)
      );
      const querySnapshot = await getDocs(q);
      // Get the last visible document
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastFetchedListing(lastVisible);
      let listings = [];
      querySnapshot.forEach((doc) => {
        return listings.push({ id: doc.id, data: doc.data() });
      });
      setListings((prevState) => [...prevState, ...listings]);
      console.log(listings);
      setLoading(false);
    } catch (error) {
      toast.info("Could not fetch data");
    }
  };
  return (
    <div className="category">
      <header>
        <p className="pageHeader">Offers</p>
      </header>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listings.map((list) => (
                <ListingItem listing={list.data} id={list.id} key={list.id} />
              ))}
            </ul>
          </main>
          <br />
          <br />
          {lastFetchedListing && listings.length >= 10 && (
            <p className="loadMore" onClick={onLoadMoreListings}>
              Load More
            </p>
          )}
        </>
      ) : (
        <p>There are no current offres</p>
      )}
    </div>
  );
}

export default Offers;
