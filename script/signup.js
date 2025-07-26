import { db , auth, createUserWithEmailAndPassword, addDoc, collection, setDoc, doc } from "./firebase.js";

const signuphandler = async () => {
  try {
    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    console.log(firstName.value);
    console.log(lastName.value);
    console.log(email.value);
    console.log(password.value);

    //auth service
    const response = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    console.log("user", response);
    const userUid = response.user.uid;

    //user data sotres to firestore db

    const userobj = {
        firstName : firstName.value,
        lastName : lastName.value,
        email: email.value,
        uid: userUid
    }



    // const userRes = await addDoc(collection(db, "user"), userobj)
    const userRes = await setDoc(doc(db, "users", userUid), userobj)
    console.log("userRes", userRes);
    window.location.replace("./login.html");


  } catch (error) {
    console.log("error", error.message);
  }
};

window.signuphandler = signuphandler;
