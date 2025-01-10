import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  child,
  onValue,
  query,
  orderByKey,
  limitToLast,
  push,
  set,
  remove,
  update,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCFqgbA_t3EBVO21nW70umJOHX3UdRr9MY",
  authDomain: "parseit-8021e.firebaseapp.com",
  databaseURL:
    "https://parseit-8021e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "parseit-8021e",
  storageBucket: "parseit-8021e.appspot.com",
  messagingSenderId: "15166597986",
  appId: "1:15166597986:web:04b0219b1733780ae61a3b",
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dbRef = ref(database);

//vars
let user_parser = localStorage.getItem("user-parser");
let parseclass_cont = document.getElementById("parseclass-default-div");
let backgroundImgInput = "";
let username = "";

let parser = [
  {
    activated: "",
    birthday: "",
    disabled: "",
    email: "",
    firstname: "",
    lastname: "",
    middlename: "",
    regular: "",
    section: "",
    suffix: "",
    temporarypass: "",
    type: "",
    yearlvl: "",
    profile: "",
  },
];
let status = [
  {
    current_sem: "",
    ongoing: "",
    academicref: "",
  },
];
let allsubjects = [];


setScreenSize(window.innerWidth, window.innerHeight);
window.addEventListener("load", async function () {
  document.getElementById("loading_animation_div").style.display = "none";
  username = await getparser_username(user_parser);
  await getUser(user_parser).then(async () => {

    if (parser[0].suffix === "none") {
      parser[0].suffix = "";
    }
    await getAcadStatus().then(() => {
      document.getElementById("homepage_div").style.display = "flex";
      viewLatestAnnouncement();

      if (status[0].ongoing === "true") {
        document.getElementById("search-parseclass-div").style.display =
          "flex";
        document.getElementById("notyetstarted_div").style.display = "none";
        document.getElementById("parseclass-default-div").style.display =
          "flex";
        loadTeacherSubjects();
      } else {
        document.getElementById("parseclass-default-div").style.display =
          "none";
        document.getElementById("search-parseclass-div").style.display =
          "none";
        document.getElementById("notyetstarted_div").style.display = "flex";
      }
      //show
      showBodyWrapper("home_all_sec");

    });

    let parseroom_name = localStorage.getItem("parseroom-name");
    if (parseroom_name !== '') {
      await getMessages();
    }
  });
});

// document.getElementById("homelobby_btn").addEventListener("click", function () {
// });
document.getElementById("homehonors_btn").addEventListener("click", function () {
});
document.getElementById("homeshare_btn").addEventListener("click", function () {
});
document.getElementById("homequiz_btn").addEventListener("click", function () {
});

// document.getElementById("announcement-div").addEventListener("click", (event) => {
//   document.getElementById("allannouncement-div").style.display = "flex";
//   document.getElementById("allannouncement-div").style.animation =
//     "fadeScaleUp 0.25s ease-in-out forwards";
// });
// document.getElementById("allannouncement-close").addEventListener("click", function () {
//   document.getElementById("allannouncement-div").style.animation =
//     "fadeScaleDown 0.25s ease-in-out forwards";
// });

// document.getElementById("community_btn").addEventListener("click", (event) => {
//   event.preventDefault();
//   window.location.href = "https://parseitlearninghub.github.io/community/";
// });
// document.getElementById("myProfile_btn").addEventListener("click", (event) => {
//   event.preventDefault();
//   localStorage.setItem("active-parser-type", parser[0].type);
//   window.location.href = "profile.html";
// });

// document.getElementById("myJourney_btn").addEventListener("click", (event) => {
//   window.location.href = "myjourney.html";
// });

// document.getElementById("settings_btn").addEventListener("click", (event) => {
//   event.preventDefault();
//   // document.getElementById("nofeature").style.display = "flex";
//   // setTimeout(() => {
//   //   document.getElementById("nofeature").style.display = "none";
//   // }, 1000);
//   window.location.href = "settings.html";
// });


function showBackground(element) {
  document.getElementById(element).style.display = "block";
}
function setScreenSize(width, height) {
  document.body.style.width = width + "px";
  document.body.style.height = height + "px";
}
function showBodyWrapper(id) {
  document.getElementById(id).style.display = "block";
}
function selectNavIcon(id) {
  document.getElementById(id).style.filter =
    "invert(30%) sepia(59%) saturate(7076%) hue-rotate(350deg) brightness(88%) contrast(120%)";
}
function selectNavLbl(id) {
  document.getElementById(id).style.color = "#f30505";
}
function hideBodyWrapper(id) {
  document.getElementById(id).style.display = "none";
}
function revertNavIcon(id) {
  document.getElementById(id).style.filter =
    "invert(54%) sepia(8%) saturate(27%) hue-rotate(319deg) brightness(91%) contrast(85%)";
}
function revertNavLbl(id) {
  document.getElementById(id).style.color = "#808080";
}
function changeHomeLbl(id, type) {
  document.getElementById(id).innerText = type;
}
function getCurrentDayName() {
  let today = new Date();
  let weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return weekdays[today.getDay()];
}
let ongoing_previousData = null;
async function changesInOngoing() {
  const statusRef = child(
    dbRef,
    "PARSEIT/administration/academicyear/status/ongoing"
  );
  onValue(
    statusRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const currentData = snapshot.val();
        if (ongoing_previousData === null) {
          //console.log('Ongoing:', currentData);
        } else {
          //console.log('Ongoing:', currentData);
          if (ongoing_previousData !== currentData) {
            if (currentData === "true") {
              status[0].ongoing = "true";
              document.getElementById("search-parseclass-div").style.display =
                "flex";
              document.getElementById("notyetstarted_div").style.display =
                "none";
              document.getElementById("parseclass-default-div").style.display =
                "flex";
            } else {
              status[0].ongoing = "false";
              document.getElementById("search-parseclass-div").style.display =
                "none";
              document.getElementById("notyetstarted_div").style.display =
                "flex";
              document.getElementById("parseclass-default-div").style.display =
                "none";
            }
            window.location.reload();
          }
        }
        ongoing_previousData = currentData;
      } else {
        console.log("No data available");
      }
    },
    (error) => {
      console.error("Error reading data:", error);
    }
  );
} changesInOngoing();

let sem_previousData = null;
async function changesInSem() {
  const statusRef = child(
    dbRef,
    "PARSEIT/administration/academicyear/status/current_sem"
  );
  onValue(
    statusRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const currentData = snapshot.val();
        if (sem_previousData === null) {
        } else {
          if (sem_previousData !== currentData) {
            status[0].current_sem = "1";
            if (currentData === "2") {
              status[0].current_sem = "2";
            }
            document.getElementById("search-parseclass-div").style.display =
              "flex";
            document.getElementById("notyetstarted_div").style.display = "none";
            document.getElementById("parseclass-default-div").style.display =
              "flex";
            window.location.reload();
          }
        }
        sem_previousData = currentData;
      } else {
        console.log("No data available");
      }
    },
    (error) => {
      console.error("Error reading data:", error);
    }
  );
}
changesInSem();
let academicref_previousData = null;
async function changesInAcademicRef() {
  const statusRef = child(
    dbRef,
    "PARSEIT/administration/academicyear/status/academic_ref"
  );
  onValue(
    statusRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const currentData = snapshot.val();
        if (academicref_previousData === null) {
          // console.log('Ongoing:', currentData);
        } else {
          // console.log('Ongoing:', currentData);
          if (academicref_previousData !== currentData) {
            document.getElementById("search-parseclass-div").style.display =
              "flex";
            document.getElementById("notyetstarted_div").style.display = "none";
            document.getElementById("parseclass-default-div").style.display =
              "flex";
            window.location.reload();
            //document.getElementById("class-sort").style.display = "flex";
          }
        }
        academicref_previousData = currentData;
      } else {
        console.log("No data available");
      }
    },
    (error) => {
      console.error("Error reading data:", error);
    }
  );
}
changesInAcademicRef();
async function getAcadStatus() {
  const ref = child(dbRef, "PARSEIT/administration/academicyear/status/");
  await get(ref).then((snapshot) => {
    status[0].current_sem = snapshot.val().current_sem;
    status[0].ongoing = snapshot.val().ongoing;
    status[0].academicref = snapshot.val().academic_ref;
  });
}
function getUser(id) {
  return new Promise((resolve, reject) => {
    const dbRef = ref(database);
    get(child(dbRef, "PARSEIT/administration/students/" + id))
      .then((snapshot) => {
        if (snapshot.exists()) {
          parser[0].activated = snapshot.val().activated;
          parser[0].birthday = snapshot.val().birthday;
          parser[0].disabled = snapshot.val().disabled;
          parser[0].email = snapshot.val().email;
          parser[0].firstname = snapshot.val().firstname;
          parser[0].lastname = snapshot.val().lastname;
          parser[0].middlename = snapshot.val().middlename;
          parser[0].regular = snapshot.val().regular;
          parser[0].section = snapshot.val().section;
          parser[0].suffix = snapshot.val().suffix;
          parser[0].temporarypass = snapshot.val().temporarypass;
          parser[0].type = snapshot.val().type;
          parser[0].yearlvl = snapshot.val().yearlvl;
          resolve();
        } else {
          get(child(dbRef, "PARSEIT/administration/teachers/" + id)).then(
            (snapshot) => {
              if (snapshot.exists()) {
                parser[0].activated = snapshot.val().activated;
                parser[0].birthday = snapshot.val().birthday;
                parser[0].disabled = snapshot.val().disabled;
                parser[0].email = snapshot.val().email;
                parser[0].firstname = snapshot.val().firstname;
                parser[0].lastname = snapshot.val().lastname;
                parser[0].middlename = snapshot.val().middlename;
                parser[0].suffix = snapshot.val().suffix;
                parser[0].temporarypass = snapshot.val().temporarypass;
                parser[0].type = snapshot.val().type;
                resolve();
              }
            }
          );
        }
      })
      .catch((error) => {
        alert("Error getting user info");
        reject(error);
      });
  });
}
function viewLatestAnnouncement() {
  const date_announcement_lbl = document.getElementById(
    "date_announcement_lbl"
  );
  const announcement_lbl = document.getElementById("announcement_lbl");
  const time_announcement_lbl = document.getElementById(
    "time_announcement_lbl"
  );
  const dbRef = ref(database, "PARSEIT/administration/announcement/");
  const latestAnnouncementQuery = query(dbRef, orderByKey(), limitToLast(1));

  onValue(
    latestAnnouncementQuery,
    (snapshot) => {
      if (snapshot.exists()) {
        let latestAnnouncement = null;

        snapshot.forEach((childSnapshot) => {
          latestAnnouncement = childSnapshot.val();
        });

        if (latestAnnouncement) {
          date_announcement_lbl.innerText =
            latestAnnouncement.date || "[Date not available]";
          announcement_lbl.innerText =
            latestAnnouncement.header || "[Message not available]";
          time_announcement_lbl.innerText =
            latestAnnouncement.time || "[Time not available]";
          document.getElementById(
            "announcement-div"
          ).style.backgroundImage = `url(assets/announcement/${latestAnnouncement.background_img || "4.png"
          })`;
          date_announcement_lbl.style.color = "#323232";
          announcement_lbl.style.color = "#323232";
          time_announcement_lbl.style.color = "#323232";

          if (latestAnnouncement.background_img === "4.png") {
            date_announcement_lbl.style.color = "#fefefe";
            announcement_lbl.style.color = "#fefefe";
            time_announcement_lbl.style.color = "#fefefe";
          }
        }
      } else {
        document.getElementById("announcement-div").style.backgroundImage =
          "url(assets/announcement/4.png)";
        date_announcement_lbl.innerText = "There is no announcement";
        date_announcement_lbl.style.color = "#fefefe";
        announcement_lbl.innerText = "Seems like you are all caught up!";
        announcement_lbl.style.color = "#fefefe";
        time_announcement_lbl.style.color = "#fefefe";
      }
    },
    (error) => {
      console.error("Error fetching announcement: ", error);
    }
  );
}
function viewAllAnnouncement() {
  const dbRef = ref(database, "PARSEIT/administration/announcement/");
  const latestAnnouncementQuery = query(dbRef, orderByKey());

  onValue(
    latestAnnouncementQuery,
    (snapshot) => {
      if (snapshot.exists()) {
        let announcementcont = document.getElementById("allannouncement-body");
        announcementcont.innerHTML = "";

        let appendAnnouncementHTML = "";
        const snapshotData = snapshot.val();
        const reversedsnapshot = Object.entries(snapshotData).reverse();

        reversedsnapshot.forEach(([key, value]) => {
          appendAnnouncementHTML += `
            <div class="allannouncement-wrapper">
            <div class="alldate">
            <span class="announcemonth">${value.month}</span>
            <span class="announceday">${value.date}</span>
            <span class="announcetime">${value.time}</span>
            </div>
            <div class="allheader">${value.header}</div>
            <div class="alldescription" >${value.description}</div>
            </div>`;
        });
        announcementcont.innerHTML = appendAnnouncementHTML;
      } else {
        document.getElementById("announcement-div").style.backgroundImage =
          "url(assets/announcement/4.png)";
        date_announcement_lbl.innerText = "There is no announcement";
        date_announcement_lbl.style.color = "#fefefe";
        announcement_lbl.innerText = "Seems like you are all caught up!";
        announcement_lbl.style.color = "#fefefe";
        time_announcement_lbl.style.color = "#fefefe";
      }
    },
    (error) => {
      console.error("Error fetching announcement: ", error);
    }
  );
} viewAllAnnouncement();

async function getparser_username(id) {
  const usernameRef = child(dbRef, `PARSEIT/username/`);
  const snapshot = await get(usernameRef);
  if (snapshot.exists()) {
    const currentData = snapshot.val();
    for (const username of Object.keys(currentData)) {
      if (currentData[username] === id) {
        return username;
      }
    }
    return null;
  } else {
    console.log("No data available");
    return null;
  }
}
function loadTeacherSubjects() {

  let semesterToCheck = status[0].current_sem;
  const acadref = status[0].academicref;
  if (semesterToCheck === "2") {
    semesterToCheck = "second-sem";
  } else {
    semesterToCheck = "first-sem";
  }
  const databaseRef = ref(
    database,
    "PARSEIT/administration/parseclass/" + acadref
  );
  get(databaseRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        parseclass_cont.innerHTML = "";
        let parseClassAppend = "";
        const data = snapshot.val();
        for (const yearLevel in data) {
          if (data[yearLevel][semesterToCheck]) {
            const semesterData = data[yearLevel][semesterToCheck];
            for (const subject in semesterData) {
              const subjectData = semesterData[subject];
              if (typeof subjectData === "object") {
                for (const key in subjectData) {
                  if (key === "name" || key === "unit") {
                  } else {
                    const parseclass_img = subject.replace(/\s+/g, "");
                    if (user_parser === subjectData[key].teacher_id) {
                      allsubjects.length = 0;
                      allsubjects.push(subject);
                      allsubjects.push(subjectData.name);
                      allsubjects.push(key);

                      parseClassAppend += `
                                        <div id="${parseclass_img}" data-id="${subject} ${subjectData.name
                        } ${key}" class="parseclass-default-wrapper parseclass" onclick="localStorage.setItem('parser-username', '${username.replace(
                          /\s+/g,
                          ""
                        )}');
                                        localStorage.setItem('parser-parseroom', '${subjectData[
                          key
                        ].parseclass_id.replace(/\s+/g, "")}');
                                        localStorage.setItem('parseroom-acadref', '${acadref}');
                                        localStorage.setItem('parseroom-sem', '${semesterToCheck}');
                                        localStorage.setItem('parseroom-section', '${key}');
                                        localStorage.setItem('parseroom-yearlvl', '${yearLevel}');
                                        localStorage.setItem('parseroom-code', '${subject}');
                                        localStorage.setItem('parseroom-name', '${subjectData.name
                        }');
                                        " 
                                        style="background-image: url('assets/parseclass/${parseclass_img.toUpperCase()}.jpg');"
                                        value ="">
                                        <div class="parseclass-default-gradient">
                                        <span class="parsesched-default-span">
                                        <div class='sched-all-container'>
                                        <section class="sched-all-wrapper">
                                        `;
                      for (const schedule in subjectData[key].schedule) {
                        if (
                          subjectData[key].schedule[schedule].day ===
                          returnCurrentDay()
                        ) {
                          parseClassAppend += `
                                                <div class="parseclass-sched-single">
                                                <label for="" class="parseclass-day-lbl">${subjectData[key].schedule[schedule].day} (${subjectData[key].schedule[schedule].room})</label>
                                                <label for="" class="parseclass-time-lbl">${subjectData[key].schedule[schedule].start}-${subjectData[key].schedule[schedule].end}</label>
                                                </div>
                                                `;
                        }
                      }
                      parseClassAppend += `
                                        </section>
                                        </div>
                                        </span>
                                        <span class="parseclass-default-span">
                                        <label for="" class="parseclass-header-lbl">${subject} (${key})</label><br/>
                                        <label for="" class="parseclass-header-sublbl">${subjectData.name}</label>
                                        </span>
                                        </div>
                                        </div>`;

                      parseclass_cont.innerHTML = parseClassAppend;
                    }
                  }
                }
              }
            }
          }
        }
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}
function reloadTeacherSubjects(year) {
  let semesterToCheck = status[0].current_sem;
  const acadref = status[0].academicref;
  if (semesterToCheck === "2") {
    semesterToCheck = "second-sem";
  } else {
    semesterToCheck = "first-sem";
  }
  const databaseRef = ref(
    database,
    "PARSEIT/administration/parseclass/" + acadref
  );
  get(databaseRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        parseclass_cont.innerHTML = "";
        let parseClassAppend = "";
        const data = snapshot.val();
        // Iterate only inside "year-lvl-1"
        if (data[year] && data[year][semesterToCheck]) {
          const semesterData = data[year][semesterToCheck];
          for (const subject in semesterData) {
            const subjectData = semesterData[subject];
            if (typeof subjectData === "object") {
              for (const key in subjectData) {
                if (key === "name" || key === "unit") {
                  // Skip "name" and "unit" keys
                } else {
                  const parseclass_img = subject.replace(/\s+/g, "");
                  if (user_parser === subjectData[key].teacher_id) {
                    allsubjects.length = 0;
                    allsubjects.push(subject);
                    allsubjects.push(subjectData.name);
                    allsubjects.push(key);
                    parseClassAppend += `
                        <div id="${parseclass_img}" data-id="${subject} ${subjectData.name
                      } ${key}" class="parseclass-default-wrapper parseclass" onclick="localStorage.setItem('parser-username', '${username.replace(
                        /\s+/g,
                        ""
                      )}');
                        localStorage.setItem('parser-parseroom', '${subjectData[
                        key
                      ].parseclass_id.replace(/\s+/g, "")}');
                        localStorage.setItem('parseroom-acadref', '${acadref}');
                        localStorage.setItem('parseroom-sem', '${semesterToCheck}');
                        localStorage.setItem('parseroom-section', '${key}');
                        localStorage.setItem('parseroom-yearlvl', '${year}');
                        localStorage.setItem('parseroom-code', '${subject}');
                        localStorage.setItem('parseroom-name', '${subjectData.name
                      }');
                        " 
                        style="background-image: url('assets/parseclass/${parseclass_img.toUpperCase()}.jpg');"
                        value ="">
                        <div class="parseclass-default-gradient">
                        <span class="parsesched-default-span">
                        <div class='sched-all-container'>
                        <section class="sched-all-wrapper">
                      `;
                    for (const schedule in subjectData[key].schedule) {
                      if (
                        subjectData[key].schedule[schedule].day ===
                        returnCurrentDay()
                      ) {
                        parseClassAppend += `
                            <div class="parseclass-sched-single">
                            <label for="" class="parseclass-day-lbl">${subjectData[key].schedule[schedule].day} (${subjectData[key].schedule[schedule].room})</label>
                            <label for="" class="parseclass-time-lbl">${subjectData[key].schedule[schedule].start}-${subjectData[key].schedule[schedule].end}</label>
                            </div>
                          `;
                      }
                    }
                    parseClassAppend += `
                        </section>
                        </div>
                        </span>
                        <span class="parseclass-default-span">
                        <label for="" class="parseclass-header-lbl">${subject} (${key})</label><br/>
                        <label for="" class="parseclass-header-sublbl">${subjectData.name}</label>
                        </span>
                        </div>
                        </div>`;
                    parseclass_cont.innerHTML = parseClassAppend;
                  }
                }
              }
            }
          }
        }
        if (parseclass_cont.innerHTML === "") {
          console.log("No data available");
        }
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}
function returnCurrentDay() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[dayOfWeek];
}
function displaySelectedYear() {
  const selectedYear = document.querySelector('input[name="year"]:checked');
  if (selectedYear) {
    //alert("You selected: " + selectedYear.value);
    if (selectedYear.value === "all") {
      loadTeacherSubjects();
    } else if (selectedYear.value === "year-lvl-1") {
      reloadTeacherSubjects("year-lvl-1");
    } else if (selectedYear.value === "year-lvl-2") {
      reloadTeacherSubjects("year-lvl-2");
    } else if (selectedYear.value === "year-lvl-3") {
      reloadTeacherSubjects("year-lvl-3");
    } else if (selectedYear.value === "year-lvl-4") {
      reloadTeacherSubjects("year-lvl-4");
    }
  }
}
document.getElementById("searchparseclass_txt").addEventListener("input", (event) => {
  updateResults();
});
function fuzzy_match(text, search) {
  search = search.replace(/\s/g, "").toLowerCase();
  let search_position = 0;

  for (let n = 0; n < text.length; n++) {
    let text_char = text[n];
    if (
      search_position < search.length &&
      text_char.toLowerCase() === search[search_position]
    ) {
      search_position += 1;
    }
  }
  return search_position === search.length;
}
function updateResults() {
  const searchInput = document.getElementById("searchparseclass_txt").value;

  const subjectElements = document.querySelectorAll(
    ".parseclass-default-wrapper"
  );

  subjectElements.forEach((subject) => {
    const subjectText = subject.dataset.id;
    const isMatch = fuzzy_match(subjectText, searchInput);

    if (isMatch) {
      subject.classList.remove("hidden");
      subject.classList.add("highlight");
    } else {
      // Hide the element if no match
      subject.classList.add("hidden");
      subject.classList.remove("highlight");
    }
  });
}

const dropdown = document.getElementById('class-sort-dropdown');
dropdown.addEventListener('change', function () {
  const selectedValue = dropdown.value;

  if (selectedValue === 'all') {
    loadTeacherSubjects();
  } else if (selectedValue === 'year-lvl-1') {
    reloadTeacherSubjects("year-lvl-1");
  } else if (selectedValue === 'year-lvl-2') {
    reloadTeacherSubjects("year-lvl-2");
  } else if (selectedValue === 'year-lvl-3') {
    reloadTeacherSubjects("year-lvl-3");
  } else if (selectedValue === 'year-lvl-4') {
    reloadTeacherSubjects("year-lvl-4");
  }
});


document.getElementById("parseclass-default-div").addEventListener("click", async (event) => {
  const bulletin_wrapper = document.getElementById("bulletin-wrapper");
  bulletin_wrapper.style.display = "none";
  await loadCensoredWords();
  await getMessages();
  removeWhisperTheme();
});

function scrollToBottom() {
  const element = document.getElementById("parseroom-body-wrapper");
  if (element) {
    element.scrollTop = element.scrollHeight; // Scroll to the bottom
  }
}
async function activeProfile(id) {
  const profileRef = child(
    dbRef,
    `PARSEIT/administration/students/${id}/profile`
  );
  const teacherProfileRef = child(
    dbRef,
    `PARSEIT/administration/teachers/${id}/profile`
  );

  const snapshot2 = await get(profileRef);
  const snapTeacher2 = await get(teacherProfileRef);

  if (snapshot2.exists()) {
    return `assets/profiles/${snapshot2.val()}`;
  } else {
    if (snapTeacher2.exists()) {
      return `assets/profiles/${snapTeacher2.val()}`;
    } else {
      return `assets/profiles/default_profile.png`;
    }
  }
}
function getMessageTime() {
  const date = new Date();

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  const weekday = days[date.getDay()];
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0"); // Add leading zero if needed
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${month} ${day}, ${year} ${weekday} ${hours}:${minutes} ${period}`;
}



let censoredWordsArray = [];
let active_profile = "";
async function getParseroomMessages() {
  let user_parser = localStorage.getItem("user-parser");
  let parseroom_id = localStorage.getItem("parser-parseroom");
  const dbRef = ref(
    database,
    `PARSEIT/administration/parseroom/${parseroom_id}/messages/`
  );
  const latestMessageQuery = query(dbRef, orderByKey());

  onValue(
    latestMessageQuery,
    (snapshot) => {
      if (snapshot.exists()) {
        let messagecont = document.getElementById("parseroom-body-wrapper");
        messagecont.innerHTML = "";
        let appendMessageHTML = "<div class='filler-message'></div>";
        const snapshotData = snapshot.val();
        const reversedsnapshot = Object.entries(snapshotData);
        reversedsnapshot.forEach(([key, message]) => {
          message.description = censorWords(
            message.description,
            censoredWordsArray
          );
          if (message.from === user_parser) {
            if (message.sender_profile !== `${active_profile}`) {
              updateSenderProfile(parseroom_id, user_parser, active_profile);
            }

            if (message.to === "everyone") {
              appendMessageHTML += `
                        <div class="parseroom-message">
                        <section class="p-message p-message-me">
                        <section class="p-username p-username-me">@${message.from_username}</section>
                        <section class="p-description p-description-me"> ${message.description}</section>
                        </section>
                        <section class="p-profile p-profile-me">
                        <img id="parser-profile" class="parser-profile" src='${active_profile}' alt="" />
                        </section>
                        </div>`;
            } else {
              appendMessageHTML += `
                        <div class="parseroom-message">
                        <section class="p-message p-message-me" style="display: flex; align-items: center; justify-content: center;">
                        <section class="p-username p-username-me" style="display: none;">@${message.from_username}</section>
                        <section class="p-description p-description-me ping-whisper-me">You whispered to @${message.to_username}</section>
                        </section>
                        <section class="p-profile p-profile-me" style="display: none;">
                        <img id="parser-profile" class="parser-profile" src='${active_profile}' alt="" />
                        </section>
                        </div>`;
            }
          } else {
            if (message.to === "everyone") {
              appendMessageHTML += `
                        <div class="parseroom-message parseroom-message-others">
                        <section class="p-profile">
                        <img id="parser-profile" class="parser-profile" src='${message.sender_profile}' alt="" />
                        </section>
                        <section class="p-message">
                        <section class="p-username">@${message.from_username}</section>
                        <section class="p-description" onclick="
                        document.getElementById('parsermessage-txt').value += ' @${message.from_username} ';
                        "
                        >${message.description}</section>
                        </section>
                        </div>`;
            } else {
              if (message.to === user_parser) {
                appendMessageHTML += `
                        <div class="parseroom-message parseroom-message-others" style="display: flex; align-items: center; justify-content: center;">
                        <section class="p-profile" style="display: none;">
                        <img id="parser-profile" class="parser-profile" src='${message.sender_profile}' alt="" />
                        </section>
                        <section class="p-message" style="display: flex; align-items: center; justify-content: center;">
                        <section class="p-username" style="display: none;">@${message.from_username}</section>
                        <section class="p-description ping-whisper" style="width: 100%;" onclick="
                        document.getElementById('parsermessage-txt').value += ' @${message.from_username} ';
                        "
                        >@${message.from_username} whispered to you</section>
                        </section>
                        </div>`;
              }
            }
          }
        });
        messagecont.innerHTML = appendMessageHTML;

        let startX = 0;
        let currentX = 0;
        let isSwiped = false;

        document.querySelectorAll('.parseroom-message-others').forEach(element => {
          let startX = 0;
          let currentX = 0;
          let isSwiped = false;

          // Mouse down event to initialize swipe
          // element.addEventListener('mousedown', (e) => {
          //   startX = e.clientX;
          //   isSwiped = false;
          //   element.style.transition = ''; // Remove transition for smooth dragging

          //   // Add a mousemove listener to handle dragging
          //   const onMouseMove = (moveEvent) => {
          //     currentX = moveEvent.clientX;
          //     const deltaX = currentX - startX;

          //     if (deltaX > 0) {
          //       element.style.transform = `translateX(${deltaX}px)`;
          //     }
          //   };

          //   // Add a mouseup listener to handle swipe completion
          //   const onMouseUp = () => {
          //     const deltaX = currentX - startX;
          //     if (deltaX > 100) {
          //       isSwiped = true;
          //       element.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
          //       element.style.transform = 'translateX(0%)';

          //       setTimeout(async () => {
          //         const usernameElement = element.querySelector('.p-username');
          //         if (usernameElement) {
          //           const username = usernameElement.textContent.trim();
          //           document.getElementById('parsermessage-txt').value += username + ' ';
          //           let username_trim = extractUsername(username);
          //           let id = await getparser_id(username_trim);
          //           if (id !== null) {
          //             localStorage.setItem("active-whisper-id", id);
          //             //showPrivateMessages();
          //             //showWhisperTheme();
          //           }
          //         }
          //       }, 300);
          //     } else {
          //       element.style.transform = `translateX(0)`; // Reset position
          //     }

          //     startX = 0;
          //     currentX = 0;

          //     // Remove listeners after interaction ends
          //     document.removeEventListener('mousemove', onMouseMove);
          //     document.removeEventListener('mouseup', onMouseUp);
          //   };

          //   // Attach mousemove and mouseup listeners to the document
          //   document.addEventListener('mousemove', onMouseMove);
          //   document.addEventListener('mouseup', onMouseUp);
          // });

          element.addEventListener('click', async (e) => {
            const usernameElement = element.querySelector('.p-username');
            if (usernameElement) {
              const username = usernameElement.textContent.trim();
              let username_trim = extractUsername(username);
              let id = await getparser_id(username_trim);
              if (id !== null) {
                localStorage.setItem("active-whisper-id", id);
                //showPrivateMessages();
                //showWhisperTheme();
              }
            }

          });
        });


        scrollToBottom();
      } else {
      }
    },
    (error) => {
      console.error("Error fetching announcement: ", error);
    }
  );
}
async function updateSenderProfile(parseroom_id, user_parser, active_profile) {
  const senderRef = child(
    dbRef,
    `PARSEIT/administration/parseroom/${parseroom_id}/messages/`
  );
  const data = await get(senderRef);
  if (data.exists()) {
    data.forEach((childSnapshot) => {
      const childValue = childSnapshot.val();
      if (childValue.from === user_parser) {
        const childKey = childSnapshot.key;
        update(
          ref(
            database,
            `PARSEIT/administration/parseroom/${parseroom_id}/messages/${childKey}`
          ),
          {
            sender_profile: active_profile,
          }
        );
      }
    });
  }
}
function censorWords(sentence, wordsToCensor) {
  const escapedWords = wordsToCensor.map((word) =>
    word.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&")
  );
  const regex = new RegExp(`\\b(${escapedWords.join("|")})\\b`, "gi");
  return sentence.replace(regex, (match) => "*".repeat(match.length));
}
async function loadCensoredWords() {
  const dbRef = ref(database, `PARSEIT/administration/forbiddenwords/`);
  onValue(dbRef, (snapshot) => {
    censoredWordsArray.length = 0;
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.key;
      censoredWordsArray.push(data);
    });
  });
}
document.addEventListener("DOMContentLoaded", () => {
  scrollToBottom();
});
function extractUsername(text) {
  const match = text.match(/@(\S+)/);
  const messageInput = document.getElementById("parsermessage-txt").value;
  const whisperInput = removeUsername(messageInput);
  if (match) {
    return match[1];
  }
  return getparser_id(whisperInput);
}
function removeUsername(text) {
  const match = text.match(/@\S+/);
  let newText = text;
  if (match) {
    newText = text.replace(match[0], "").trim();
    return newText;
  } else {
    return null;
  }
}

async function getparser_id(username) {
  const usernameRef = child(dbRef, `PARSEIT/username/${username}`);
  const snapshot = await get(usernameRef);
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    console.log("No data available");
    return null;
  }
}


async function getMessages() {
  document.getElementById("room-img").style.display = "none";
  document.getElementById("info-img").style.display = "none";
  const parseroom_div = document.getElementById("home-parseroom-div");
  parseroom_div.style.display = "flex";
  const info_div = document.getElementById("details-parseroom-wrapper");
  info_div.style.display = "block";

  const coverimg = localStorage.getItem("parseroom-code").replace(/\s+/g, "");
  document.getElementById("game-2").style.backgroundImage = `url(assets/parseclass/${coverimg}.jpg)`;

  const acadRef = localStorage.getItem("parseroom-acadref");
  const yrlvl = localStorage.getItem("parseroom-yearlvl");
  const sem = localStorage.getItem("parseroom-sem");
  const subject = localStorage.getItem("parseroom-code");
  const section = localStorage.getItem("parseroom-section");
  getTeacherFullname(acadRef, yrlvl, sem, subject, section);

  let user_parser = localStorage.getItem("user-parser");
  let parseroom_id = localStorage.getItem("parser-parseroom");
  let parseroom_name = localStorage.getItem("parseroom-name");
  let parseroom_code = localStorage.getItem("parseroom-code");
  document.getElementById('parsecode').innerText = parseroom_code;
  document.getElementById('parsename').innerText = parseroom_name;

  const dbRef = ref(database, `PARSEIT/administration/parseroom/${parseroom_id}/messages/`);
  const latestMessageQuery = query(dbRef, orderByKey());

  onValue(latestMessageQuery, (snapshot) => {
    document.getElementById('parseroom-body-wrapper').innerHTML = "";
    if (snapshot.exists()) {
      const snapshotData = snapshot.val();
      const reversedMessages = Object.entries(snapshotData).reverse();
      for (const [messageKey, messageData] of reversedMessages) {
        const from_id = messageData.from;
        const from_username = "@" + messageData.from_username;
        const to_id = messageData.to;
        const to_username = messageData.to_username;
        const sender_profile = messageData.sender_profile;
        const chat = messageData.description;

        if (from_id === user_parser) {
          if (to_username !== 'everyone') {
            addWhisper('parser', to_username, to_id, sender_profile);
          }
          else {
            addParserMessage(from_username, chat, sender_profile);
          }

        } else {
          if (to_username !== 'everyone') {
            addWhisper('sender', from_username, from_id, sender_profile);

          }
          else {
            addSenderMessage(from_username, chat, sender_profile);
          }

        }
      }
    }
  });



}
function addParserMessage(username, message, profileImage) {
  // Create main container
  const parserMessage = document.createElement('div');
  parserMessage.className = 'parser-message';

  // Create bubble chat section
  const bubbleChat = document.createElement('section');
  bubbleChat.className = 'bubble-chat';

  // Create username span
  const usernameSpan = document.createElement('span');
  usernameSpan.className = 'parser-username';
  usernameSpan.textContent = username;

  // Create message span
  const messageSpan = document.createElement('span');
  messageSpan.className = 'parser-message-chat';
  messageSpan.textContent = message;

  // Append username and message to bubble chat
  bubbleChat.appendChild(usernameSpan);
  bubbleChat.appendChild(messageSpan);

  // Create profile image
  const profileImg = document.createElement('img');
  profileImg.className = 'parser-profile';
  profileImg.src = profileImage;
  profileImg.alt = '';

  // Append bubble chat and profile image to main container
  parserMessage.appendChild(bubbleChat);
  parserMessage.appendChild(profileImg);

  // Append to document
  document.getElementById('parseroom-body-wrapper').appendChild(parserMessage);
}
function addSenderMessage(username, message, profileImage) {
  // Create main container
  const senderMessage = document.createElement('div');
  senderMessage.className = 'sender-message';

  // Create profile image
  const profileImg = document.createElement('img');
  profileImg.className = 'parser-profile';
  profileImg.src = profileImage;
  profileImg.alt = '';

  // Create bubble chat section
  const senderBubbleChat = document.createElement('section');
  senderBubbleChat.className = 'sender-bubble-chat';

  // Create username span
  const usernameSpan = document.createElement('span');
  usernameSpan.className = 'parser-username';
  usernameSpan.textContent = username;

  // Create message span
  const messageSpan = document.createElement('span');
  messageSpan.className = 'sender-message-chat';
  messageSpan.textContent = message;

  // Append username and message to bubble chat
  senderBubbleChat.appendChild(usernameSpan);
  senderBubbleChat.appendChild(messageSpan);

  // Append profile image and bubble chat to main container
  senderMessage.appendChild(profileImg);
  senderMessage.appendChild(senderBubbleChat);

  // Append to document
  document.getElementById('parseroom-body-wrapper').appendChild(senderMessage);
}
function addWhisper(type, username, id, profileImage) {
  const whisper = document.createElement('div');
  whisper.className = type === 'parser' ? 'parser-whisper' : 'sender-whisper';

  whisper.textContent = type === 'parser'
    ? `You whisper to ${username}`
    : `${username} whispered to you`;

  whisper.addEventListener('click', async () => {
    whisper_status = true;
    whisper_id = id;
    whisper_username = username;
    whisper_profile = profileImage;
    document.getElementById('parsecode').innerText = await getFullname(id);
    document.getElementById('parsename').innerText = username;
    await getWhispers();
    applyWhisperTheme();
  });
  document.getElementById('parseroom-body-wrapper').appendChild(whisper);
}

let whisper_status = false;
let whisper_id = '';
let whisper_username = '';
let whisper_profile = '';
document.getElementById("sendmessage-btn").addEventListener("click", async (event) => {
  await submitMessage();
});
document.addEventListener("keydown", async (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    if (whisper_status) {
      await submitWhisper();
    }
    else {
      await submitMessage();
    }

  }

  if (event.key === "Escape") {
    event.preventDefault();
    removeWhisperTheme();
    await getMessages();
  }
});
async function submitMessage() {
  let user_parser = localStorage.getItem("user-parser");
  let parseroom_id = localStorage.getItem("parser-parseroom");

  const messageInput = document.getElementById("parsermessage-txt").value;
  const username = await getparser_username(user_parser);
  const sender_profile = await activeProfile(user_parser);

  if (!messageInput) {
    return;
  }

  const newAnnouncement = {
    description: messageInput,
    from: user_parser,
    to: "everyone",
    to_username: "everyone",
    time: getMessageTime(),
    from_username: username,
    sender_profile: sender_profile,
  };

  const dbRef = ref(
    database,
    `PARSEIT/administration/parseroom/${parseroom_id}/messages/`
  );
  const newAnnouncementRef = push(dbRef);

  try {
    await set(newAnnouncementRef, newAnnouncement);
    document.getElementById("parsermessage-txt").value = "";
    document.getElementById("parsermessage-txt").style.height = "40px";
  } catch (error) {
    console.error("Error submitting announcement: ", error);
  }
  scrollToBottom();
  await getMessages();
}
async function submitWhisper() {
  let user_parser = localStorage.getItem("user-parser");
  let parseroom_id = localStorage.getItem("parser-parseroom");

  const messageInput = document.getElementById("parsermessage-txt").value;
  const username = await getparser_username(user_parser);
  const sender_profile = await activeProfile(user_parser);

  if (!messageInput) {
    return;
  }

  const newAnnouncement = {
    description: messageInput,
    from: user_parser,
    to: whisper_id,
    to_username: whisper_username,
    time: getMessageTime(),
    from_username: username,
    sender_profile: sender_profile,
  };

  const dbRef = ref(
    database,
    `PARSEIT/administration/parseroom/${parseroom_id}/messages/`
  );
  const newAnnouncementRef = push(dbRef);

  try {
    await set(newAnnouncementRef, newAnnouncement);
    document.getElementById("parsermessage-txt").value = "";
    document.getElementById("parsermessage-txt").style.height = "40px";
  } catch (error) {
    console.error("Error submitting announcement: ", error);
  }
  scrollToBottom();
  await getWhispers();
  applyWhisperTheme();
}

async function getWhispers() {
  let user_parser = localStorage.getItem("user-parser");
  let parseroom_id = localStorage.getItem("parser-parseroom");
  const dbRef = ref(database, `PARSEIT/administration/parseroom/${parseroom_id}/messages/`);
  const latestMessageQuery = query(dbRef, orderByKey());
  onValue(latestMessageQuery, (snapshot) => {
    document.getElementById('parseroom-body-wrapper').innerHTML = "";
    if (snapshot.exists()) {
      const snapshotData = snapshot.val();
      const reversedMessages = Object.entries(snapshotData).reverse();
      for (const [messageKey, messageData] of reversedMessages) {
        const from_id = messageData.from;
        const from_username = "@" + messageData.from_username;
        const to_id = messageData.to;
        const to_username = messageData.to_username;
        const sender_profile = messageData.sender_profile;
        const chat = messageData.description;

        if (from_id === user_parser && to_username !== 'everyone') {
          addParserMessage(from_username, chat, sender_profile);
        }

        if (to_username !== 'everyone' && to_id === user_parser) {
          addSenderMessage(from_username, chat, sender_profile);
        }


      }
    }
  });
}
function applyWhisperTheme() {
  document.getElementById("parseroom-body").style.backgroundColor = "#171717";
  document.getElementById("parseroom-header").style.backgroundColor = "#171717";
  document.getElementById("parsecode").style.backgroundColor = "#171717";
  document.getElementById("parsename").style.backgroundColor = "#171717";
  document.getElementById("parsecode").style.color = "#fefefe";
  document.getElementById("parsename").style.color = "#fefefe";

  document.getElementById("parseroom-header").style.boxShadow =
    "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px";
  document.getElementById("parseroom-footer").style.boxShadow =
    "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px";
  document.getElementById("parseroom-footer").style.backgroundColor = "#171717";
  document.getElementById("parsermessage-txt").style.backgroundColor =
    "#2f2f2f";
  document.getElementById("parsermessage-txt").style.color = "#fefefe";
  document.getElementById("parsermessage-txt").style.border =
    "0.4px solid #dcdcdc";
  document.getElementById("sendmessage-btn").style.display = "none";
  document.getElementById("whispermessage-btn").style.display = "block";
  document.querySelectorAll(".parser-username").forEach((element) => {
    element.style.display = "none";
  });
}
function removeWhisperTheme() {
  document.getElementById("parseroom-body").style.backgroundColor = "#fefefe";
  document.getElementById("parseroom-header").style.backgroundColor = "#fefefe";
  document.getElementById("parsecode").style.backgroundColor = "transparent";
  document.getElementById("parsename").style.backgroundColor = "transparent";
  document.getElementById("parsecode").style.color = "black";
  document.getElementById("parsename").style.color = "black";

  document.getElementById("parseroom-header").style.boxShadow =
    "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px";
  document.getElementById("parseroom-footer").style.boxShadow =
    "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px";
  document.getElementById("parseroom-footer").style.backgroundColor = "#fefefe";
  document.getElementById("parsermessage-txt").style.backgroundColor =
    "#f1f1f1d8";
  document.getElementById("parsermessage-txt").style.color = "black";
  document.getElementById("parsermessage-txt").style.border =
    "0.4px solid #dcdcdc";
  document.getElementById("sendmessage-btn").style.display = "block";
  document.getElementById("whispermessage-btn").style.display = "none";
  document.querySelectorAll(".parser-username").forEach((element) => {
    element.style.color = "black";
    element.style.opacity = "0.5";
  });
  document.getElementById("parsermessage-txt").value = "";
}

async function getFullname(studentid) {
  const dbRef = ref(database);
  return await get(child(dbRef, "PARSEIT/administration/students/" + studentid)).then((snapshot) => {
    if (snapshot.exists()) {
      if (snapshot.val().suffix === "none") {
        return `${snapshot.val().firstname} ${snapshot.val().lastname}`
      }
      else {
        return `${snapshot.val().firstname} ${snapshot.val().lastname} ${snapshot.val().suffix}`
      }
    }
  });
}

async function getTeacherFullname(acadRef, yrlvl, sem, subject, section) {

  const usernameRef = child(
    dbRef,
    `PARSEIT/administration/parseclass/${acadRef}/${yrlvl}/${sem}/${subject}/${section}/teacher_id`
  );
  const snapshot = await get(usernameRef);
  if (snapshot.exists()) {
    const currentData = snapshot.val();
    await getTeacherData(currentData);
  }
}
async function getTeacherData(id) {
  get(child(dbRef, "PARSEIT/administration/teachers/" + id)).then(
    (snapshot) => {
      if (snapshot.exists()) {
        let suffix = "";
        if (snapshot.val().suffix === "none") {
          suffix = "";
        }
        document.getElementById("cover-infodetail-instructor").innerHTML =
          "Instructor: " +
          snapshot.val().firstname +
          " " +
          snapshot.val().lastname +
          " " +
          suffix;
      }
    }
  );
}


document.getElementById("check_bulletin").addEventListener("click", async (event) => {
  await getAssignments();
  const info_div = document.getElementById("details-parseroom-wrapper");
  info_div.style.display = "none";

  const bulletin_wrapper = document.getElementById("bulletin-wrapper");
  bulletin_wrapper.style.display = "block";

  document.getElementById("bulletin-announcement").style.display = "none";
  document.getElementById("bulletin_announcement").style.backgroundColor = "#fefefe";
  document.getElementById("bulletin-assignment").style.display = "block";
  document.getElementById("bulletin_assignment").style.backgroundColor = "rgb(245, 245, 245)";
});

document.getElementById("bulletin-close-div").addEventListener("click", async (event) => {
  const info_div = document.getElementById("details-parseroom-wrapper");
  info_div.style.display = "block";

  const bulletin_wrapper = document.getElementById("bulletin-wrapper");
  bulletin_wrapper.style.display = "none";
});

async function getAssignments() {
  const type = localStorage.getItem("type-parser");
  const acadref = localStorage.getItem("parseroom-acadref");
  const yearlvl = localStorage.getItem("parseroom-yearlvl");
  const sem = localStorage.getItem("parseroom-sem");
  const subject = localStorage.getItem("parseroom-code");
  const section = localStorage.getItem("parseroom-section");
  const studentid = localStorage.getItem("user-parser");

  if (type === "teacher") {
    const assignmentRef = ref(
      database,
      `PARSEIT/administration/parseclass/${acadref}/${yearlvl}/${sem}/${subject}/${section}/assignment/`
    );
    onValue(assignmentRef, async (snapshot) => {
      const containerNotDone = document.getElementById("notdone-assignment");
      const containerDone = document.getElementById("done-assignment");
      containerNotDone.innerHTML = "";
      containerDone.innerHTML = "";
      if (snapshot.exists()) {
        const assignments = snapshot.val();

        for (const assignmentKey in assignments) {


          const assignment = assignments[assignmentKey];
          const assignment_title = assignment.header;
          if (assignment_title !== undefined) {
            const assignment_date = assignment.date;
            const assignment_duedate = assignment.duedate;
            let assignment_status = '';
            const wrapper = document.createElement("div");
            const usernameRef = child(dbRef, `PARSEIT/administration/parseclass/${acadref}/${yearlvl}/${sem}/${subject}/${section}/assignment/${assignmentKey}/completed/${user_parser}/submitted/`);
            const snapshot = await get(usernameRef);

            wrapper.className = "assignment-notdone-wrapper";
            wrapper.addEventListener("click", (event) => {
              window.location.href = `manageassignment.html?assignmentcode=${assignmentKey}`;
            });

            const iconSection = document.createElement("section");
            iconSection.className = "assignment-icon";

            const iconImg = document.createElement("img");
            iconImg.src = "assets/icons/clipboard.png";
            iconImg.className = "assignment-img";


            iconSection.appendChild(iconImg);

            const detailsSection = document.createElement("section");
            detailsSection.className = "assignment-details";

            const titleLabel = document.createElement("label");
            titleLabel.className = "assignment-title";
            titleLabel.textContent = assignment_title;

            const dateLabel = document.createElement("label");
            dateLabel.className = "assignment-date";
            dateLabel.textContent = `${formatDateTime(assignment_date)}`;

            const dueLabel = document.createElement("label");
            dueLabel.className = "assignment-due";
            dueLabel.textContent = `Due ${formatDateTime(assignment_duedate)}`;


            detailsSection.appendChild(titleLabel);
            detailsSection.appendChild(dateLabel);
            detailsSection.appendChild(dueLabel);

            wrapper.appendChild(iconSection);
            wrapper.appendChild(detailsSection);


            containerDone.appendChild(wrapper);
            const submission_date = new Date(snapshot.val());
            dueLabel.textContent = `Due ${formatDateTime(assignment_duedate)}`;


          }
        }
      } else {
        //console.log("No Assignments");
      }
    });
  }
}
async function getMaterials() {
  const type = localStorage.getItem("type-parser");
  const acadref = localStorage.getItem("parseroom-acadref");
  const yearlvl = localStorage.getItem("parseroom-yearlvl");
  const sem = localStorage.getItem("parseroom-sem");
  const subject = localStorage.getItem("parseroom-code");
  const section = localStorage.getItem("parseroom-section");
  const studentid = localStorage.getItem("user-parser");


  const assignmentRef = ref(
    database,
    `PARSEIT/administration/parseclass/${acadref}/${yearlvl}/${sem}/${subject}/${section}/materials/`
  );
  onValue(assignmentRef, async (snapshot) => {
    const containerNotDone = document.getElementById("bullettin-materials-cont");
    containerNotDone.innerHTML = "";
    if (snapshot.exists()) {
      const assignments = snapshot.val();

      for (const assignmentKey in assignments) {
        const assignment = assignments[assignmentKey];
        const assignment_title = assignment.header;
        if (assignment_title !== undefined) {
          const assignment_date = assignment.date;
          const wrapper = document.createElement("div");
          const usernameRef = child(dbRef, `PARSEIT/administration/parseclass/${acadref}/${yearlvl}/${sem}/${subject}/${section}/materials/${assignmentKey}/attachedfile`);
          const files = await get(usernameRef);
          console.log(files.val());

          wrapper.className = "material-notdone-wrapper";
          wrapper.addEventListener("click", (event) => {
            window.location.href = `viewmaterials.html?assignment=${assignmentKey}`;
          });

          const iconSection = document.createElement("section");
          iconSection.className = "assignment-icon";

          const iconImg = document.createElement("img");
          iconImg.src = "assets/icons/clipboard.png";
          iconImg.className = "done-assignment-img";

          iconSection.appendChild(iconImg);

          const detailsSection = document.createElement("section");
          detailsSection.className = "assignment-details";

          const titleLabel = document.createElement("label");
          titleLabel.className = "assignment-title";
          titleLabel.textContent = assignment_title;

          const dateLabel = document.createElement("label");
          dateLabel.className = "assignment-date";
          dateLabel.textContent = `${formatDateTime(assignment_date)}`;

          detailsSection.appendChild(titleLabel);
          detailsSection.appendChild(dateLabel);

          wrapper.appendChild(iconSection);
          wrapper.appendChild(detailsSection);
          containerNotDone.appendChild(wrapper);
        }
      }
    } else {
      console.log("No Assignments");
    }
  });

}

function formatDateTime(datetime) {
  const date = new Date(datetime);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-US', options);
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedTime = `${hours % 12 || 12}:${minutes} ${ampm}`;
  return `${formattedDate} (${formattedTime})`;
}


document.getElementById("bulletin_assignment").addEventListener("click", () => {
  showBulletinMenu("bulletin_assignment", "bulletin_announcement", "bulletin-assignment", "bulletin-announcement");
  // if (user_parser_type === "teacher") {
  //   document.getElementById("teacher-widget-div").style.display = "flex";
  // } else {
  //   document.getElementById("teacher-widget-div").style.display = "none";
  // }
});
document.getElementById("bulletin_announcement").addEventListener("click", async () => {
  showBulletinMenu("bulletin_announcement", "bulletin_assignment", "bulletin-announcement", "bulletin-assignment");
  // if (user_parser_type === "teacher") {
  //   document.getElementById("teacher-widget-div").style.display = "flex";
  // }
  // else {
  //   document.getElementById("teacher-widget-div").style.display = "none";
  // }
  await getMaterials();
});
function showBulletinMenu(selected, hidden, selecteddiv, hiddendiv) {
  document.getElementById(selected).style.borderRadius = "10px 10px 0px 0px";
  document.getElementById(selected).style.backgroundColor = "rgb(245, 245, 245)";

  document.getElementById(hidden).style.borderRadius = "0px 0px 0px 0px";
  document.getElementById(hidden).style.backgroundColor = "#fefefe";

  document.getElementById(selecteddiv).style.display = "block";
  document.getElementById(hiddendiv).style.display = "none";

}