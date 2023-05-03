import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase.config";

function Contact() {
  const [message, setMessage] = useState("");
  const [landlord, setLandlord] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const isRendred = useRef(false);
  const params = useParams();
  useEffect(() => {
    const landLordId = params.landLordId.trim();
    const getLandlord = async () => {
      const docRef = doc(db, "users", landLordId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLandlord(docSnap.data());
        //console.log(docSnap.data());
       // console.log(searchParams.get('listingName'))
      } else {
        toast.error("Could not get landlord data");
      }
    };
    if (isRendred.current === true) {
      getLandlord();
    }
    return () => {
      isRendred.current = true;
    };
  }, []);
  const onChange = (e) => {
    setMessage(e.target.value);
  };
  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Contact Landlord</p>
      </header>
      {landlord !== null && (
        <main>
          <div className="contactLandlord">
            <p className="landlordName">Contact {landlord?.name}</p>
          </div>
          <form className="messageForm">
            <div className="messageDiv">
              <label htmlFor="message" className="messageLabel">
                Message
              </label>
              <textarea
                className="textarea"
                name="message"
                id="message"
                value={message}
                onChange={onChange}
              ></textarea>
            </div>
            <a
              href={`mailto:${landlord.email}?Subject=${searchParams.get(
                "listingName"
              )}&body=${message}`}
            >
              <button type="button" className="primaryButton">
                Send Message
              </button>
            </a>
          </form>
        </main>
      )}
    </div>
  );
}

export default Contact;
