import React, {useState, useEffect} from "react";
import { useHistory } from "react-router-dom";
import  { auth, db } from "../../../firebase";
import { signOut } from "firebase/auth";
import {  doc, getDoc, } from "firebase/firestore";

const Dashboard = () => {
    const [userName, setUserName] = useState();
    const history = useHistory();

    const handleClick = (event: any) => {
        event.preventDefault();


        signOut(auth)
        .then(res => {
            history.push("/auth/login");
        })
    }

    useEffect(() => { 
        const docRef = doc(db, "Users", auth.currentUser!.uid);
          getDoc(docRef)
            // db
            // .collection("Users")
            // .doc(auth.currentUser!.uid)
            // .get()
            .then(res => {
                console.log({ res })
                const user = res.data();
                if (user) {
                    setUserName(user['username'])
                }
            })
    }, []);

    return (
        <div style={{textAlign: 'center'}}>
            <h1>Dashboard</h1>
            <h2>Welcome to Dashboard!</h2>
            <h3>{userName}</h3>
            <button onClick={handleClick}>Logout</button>
        </div>
    );
}

export default Dashboard;