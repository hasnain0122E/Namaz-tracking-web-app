import { app, db, auth, doc, getDoc, setDoc } from "./firebase.js";

let username = document.querySelector("#nameOfUser");


const privateRouteCheck = () => {
  const uid = localStorage.getItem("uid");
  console.log("privateRouteCheck", uid);
  if(!uid){
    window.location.replace("./login.html")
  }

};


window.addEventListener("load" , privateRouteCheck)
// button toggle
document.querySelectorAll(".prayer-1").forEach((prayer) => {
  const doneBtn = prayer.querySelector(".done");
  const missedBtn = prayer.querySelector(".missed");

  doneBtn.addEventListener("click", () => {
    doneBtn.classList.toggle("active");
    if (doneBtn.classList.contains("active")) {
      missedBtn.classList.remove("active");
    }
  });

  missedBtn.addEventListener("click", () => {
    missedBtn.classList.toggle("active");
    if (missedBtn.classList.contains("active")) {
      doneBtn.classList.remove("active");
    }
  });
});

document.querySelectorAll(".menu").forEach((menu) => {
  const buttons = menu.querySelectorAll(".dashboard, .history, .settings");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all
      buttons.forEach((b) => b.classList.remove("active"));
      // Add active class to the clicked one
      btn.classList.add("active");

      // Navigate to respective pages
      if (btn.classList.contains("dashboard")) {
        window.location.replace("./index.html");
      } else if (btn.classList.contains("history")) {
        window.location.replace("./history.html");
      }
    });
  });
});

// current date
document.addEventListener("DOMContentLoaded", () => {
  const userUid = localStorage.getItem("uid");
  if (userUid) {
    fetchTodaysPrayerStatus();
  }
  let dateTime = document.querySelector(".date-time");
  const currentDate = new Date();
  let formatDate = `${currentDate.toLocaleDateString()}
                    ${currentDate.toLocaleTimeString()}`;
  dateTime.innerHTML = `<img src="./assets/Back in time.png" alt="Clock Icon" />
                    <p id="dateTime">${formatDate}</p>`;
});

//username update
document.addEventListener("DOMContentLoaded", async () => {
  const UserUid = localStorage.getItem("uid");
  const userData = await getDoc(doc(db, "users", UserUid));
  const data = userData.data();

  username.innerHTML = `${data.firstName} ${data.lastName}`;
});

//LOGOUT
const logout = () => {
  alert("Logout clicked!");
  localStorage.removeItem("uid");
  window.location.href = "./login.html";
};

//UPDATE PRAYER ON FIREBASE
const allPrayers = document.querySelectorAll(".prayer-block");
allPrayers.forEach((prayer) => {
  const prayerName = prayer.getAttribute("data-prayer");

  const doneBtn = prayer.querySelector(".done");
  const missedBtn = prayer.querySelector(".missed");

  doneBtn.addEventListener("click", () => {
    updatePrayerStatus(prayerName, "done");
  });

  missedBtn.addEventListener("click", () => {
    updatePrayerStatus(prayerName, "missed");
  });
});

const updatePrayerStatus = async (prayerName, status) => {
  const UserUid = localStorage.getItem("uid");
  if (!UserUid) {
    return alert("User not logged in");
  }

  const today = new Date().toISOString().split("T")[0];

  const docRef = doc(db, "users", UserUid, "prayerTracking", today);

  try {
    await setDoc(docRef, { [prayerName]: status }, { merge: true });
    console.log(`${prayerName} marked as ${status}`);
  } catch (error) {
    console.log("error", error.message);
  }
};

const fetchTodaysPrayerStatus = async () => {
  const UserUid = localStorage.getItem("uid");
  if (!UserUid) {
    return alert("User not logged in");
  }

  const today = new Date().toISOString().split("T")[0];

  const docRef = doc(db, "users", UserUid, "prayerTracking", today);

  try {
    const docSnap = await getDoc(docRef);

    if (docSnap) {
      const data = docSnap.data();
      console.log(data);

      for (const [prayerName, status] of Object.entries(data)) {
        updateUiPrayers(prayerName, status);
      }
    }
  } catch (error) {
    console.log("error", error.message);
  }
};

const updateUiPrayers = (prayerName, status) => {
  const prayer = document.querySelector(`[data-prayer="${prayerName}"]`);

  if (!prayer) {
    return;
  }

  const doneBtn = prayer.querySelector(".done");
  const missedBtn = prayer.querySelector(".missed");

  doneBtn.classList.remove("active");
  missedBtn.classList.remove("active");

  if (status === "done") {
    doneBtn.classList.add("active");
  } else if (status == "missed") {
    missedBtn.classList.add("active");
  }
};


window.logout = logout;

window.fetchTodaysPrayerStatus = fetchTodaysPrayerStatus;
window.updatePrayerStatus = updatePrayerStatus;
