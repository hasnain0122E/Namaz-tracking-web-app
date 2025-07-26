import { auth, signInWithEmailAndPassword } from "./firebase.js";

const loginhandler = async () => {
  try {
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    console.log("email", email.value);
    console.log("password", password.value);
    if (!email.value || !password.value) {
      alert("Required fields are empty");
    }

    const response = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    console.log("login response ", response.user.uid);
    localStorage.setItem("uid", response.user.uid);
    window.location.replace("./dashboard.html");
  } catch (error) {
    console.log("error", error.message);
  }
};

window.loginhandler = loginhandler;
