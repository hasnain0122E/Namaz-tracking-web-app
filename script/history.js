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
// Toggle prayer buttons
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

// Menu button navigation
document.querySelectorAll(".menu").forEach((menu) => {
  const buttons = menu.querySelectorAll(".dashboard, .history, .settings");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      if (btn.classList.contains("dashboard")) {
        window.location.replace("./Dashboard.html");
      } else if (btn.classList.contains("history")) {
        window.location.replace("./history.html");
      }
    });
  });
});

// Logout
const logout = () => {
  alert("Logout clicked!");
  localStorage.removeItem("uid");
  window.location.href = "./login.html";
};
window.logout = logout;

// Calendar controls
const monthYearEl = document.getElementById("monthYear");
const calendarGrid = document.getElementById("calendarGrid");
const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");

let currentDate = new Date();

// Navigation
prevBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});
nextBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});
document.addEventListener("DOMContentLoaded", () => {
  renderCalendar();
});

// Fetch prayer status from Firestore
const fetchPrayerStatusForDate = async (dateStr) => {
  const UserUid = localStorage.getItem("uid");
  if (!UserUid) {
    return alert("User not logged in");
  }

  const docRef = doc(db, "users", UserUid, "prayerTracking", dateStr);
  console.log("docref", docRef);

  try {
    const docSnap = await getDoc(docRef);
    const allPrayers = document.querySelectorAll(".prayer-block");

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("Fetched prayer data for", dateStr, ":", data);

      allPrayers.forEach((prayer) => {
        const prayerName = prayer.getAttribute("data-prayer");
        const doneBtn = prayer.querySelector(".done");
        const missedBtn = prayer.querySelector(".missed");

        doneBtn.classList.remove("active");
        missedBtn.classList.remove("active");

        if (data[prayerName] === "done") {
          doneBtn.classList.add("active");
        } else if (data[prayerName] === "missed") {
          missedBtn.classList.add("active");
        }
      });
    } else {
      alert("No Prayers Found For This Date");
      document.querySelectorAll(".prayer-block").forEach((prayer) => {
        prayer.querySelector(".done").classList.remove("active");
        prayer.querySelector(".missed").classList.remove("active");
      });
    }
  } catch (error) {
    console.error("error", error.message);
  }
};
window.fetchPrayerStatusForDate = fetchPrayerStatusForDate;

// Render calendar
function renderCalendar() {
  calendarGrid.innerHTML = `
    <div class="day-label">Mo</div>
    <div class="day-label">Tu</div>
    <div class="day-label">We</div>
    <div class="day-label">Th</div>
    <div class="day-label">Fr</div>
    <div class="day-label">Sa</div>
    <div class="day-label">Su</div>
  `;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startDay = (firstDayOfMonth.getDay() + 6) % 7;
  const totalDays = lastDayOfMonth.getDate();

  monthYearEl.innerText = `${firstDayOfMonth.toLocaleString("default", {
    month: "long",
  })} ${year}`;

  // Empty boxes before the 1st
  for (let i = 0; i < startDay; i++) {
    const emptyDiv = document.createElement("div");
    emptyDiv.classList.add("day", "empty");
    calendarGrid.appendChild(emptyDiv);
  }

  // Days of the month
  for (let day = 1; day <= totalDays; day++) {
    const dayBox = document.createElement("div");
    dayBox.classList.add("day");
    dayBox.textContent = day;

    dayBox.addEventListener("click", () => {
      const selectedDate = new Date(year, month, day);
      const dateStr = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${selectedDate.getDate().toString().padStart(2, "0")}`;

      fetchPrayerStatusForDate(dateStr);

      document.querySelectorAll(".calendar-grid .day").forEach(d => d.classList.remove("selected"));
      dayBox.classList.add("selected");
    });

    calendarGrid.appendChild(dayBox);
  }
}

renderCalendar();


window.logout = logout;

window.fetchPrayerStatusForDate = fetchPrayerStatusForDate;
