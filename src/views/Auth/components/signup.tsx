import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { auth , db } from "../../../firebase";
import { AuthContext } from "../../../AuthProvider";
import { createUserWithEmailAndPassword, UserCredential } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";

interface FormItems {
    username: string;
    phone: string;
    email: string;
    password: string;
}

const SignUp = () => {
    const authContext = useContext(AuthContext);
    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        phone: ""
    } as FormItems);

    const history = useHistory();

    const handleClick = () => {
       history.push("/auth/login") 
    }

    const handleChange = (event: any) => {
        event.persist();
        setValues(values => ({
            ...values,
            [event.target.name]: event.target.value
        }));

    }

    const handleSubmit = (event: any) => {
        event?.preventDefault();
        console.log(values, 'values');
        createUserWithEmailAndPassword(auth, values.email, values.password)
        .then((userCredential : UserCredential) => {
            authContext.setUser(userCredential);
        
            const docRef = doc(collection(db, "Users") );
    
            setDoc(docRef,{
                email: values.email,
                username: values.username,
                phone: values.phone
            }).then(() => {
                console.log('Saved');
                return;
            }).catch(error => {
                console.log("createUserWithEmailAndPassword error:", error.message);
                alert(error.message);
            });
            
            // db.collection("Users")
            // .doc(userCredential.user!.uid)
            // .set({
            //     email: values.email,
            //     username: values.username,
            //     phone: values.phone
            // })
            // .then(() => {
            //     console.log('ok');
            //     history.push("/dashboard");
            // })
            // .catch(error => {
            //     console.log("createUserWithEmailAndPassword error:", error.message);
            //     alert(error.message);
            // });
        })

    }
    return (
        <div style={{textAlign: 'center'}}>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username" onChange={handleChange} /><br /><br />
                <input type="text" name="phone" placeholder="Phone" onChange={handleChange}/><br /><br />
                <input type="text" name="email" placeholder="Enter your Email" onChange={handleChange}/><br /><br />
                <input type="password" name="password" placeholder="Enter your Password" onChange={handleChange}/><br /><br />
                <button type="submit">Sign Up</button>
                <p>Already have account?</p>
                <button onClick={handleClick}>Login</button>
            </form>
        </div>
    );
}

export default SignUp;