(function ($) {
  "use strict";
  $(".sakura-falling").sakura();
})(jQuery);

const url = "https://472b-103-183-83-86.ngrok-free.app/v1";

window.onload = function () {
  const input = document.getElementById("whatsappNumber");
  input.value = "+91";
};

window.onblur = () => document.getElementById("my_audio").pause();
window.onfocus = () => document.getElementById("my_audio").play();

window.onkeydown = function (event) {
  if (event.key === "Escape") {
    closeModal();
  }
};

window.onresize = function () {
  const audio = document.getElementById("my_audio");
  audio.pause();
  setTimeout(() => {
    audio.play();
  }, 1000);
};

window.addEventListener(
  "click",
  function () {
    const audio = document.getElementById("my_audio");
    audio.muted = false;
    audio.play().catch((err) => console.warn("Audio play blocked:", err));
  },
  { once: true }
);

function openUpdatesWindow() {
  document.getElementById("updatesModal").style.display = "block";
}

function closeModal() {
  document.getElementById("updatesModal").style.display = "none";
  showStep1("+91");
}

function showStep1(number = "+91") {
  document.getElementById("step1").style.display = "block";
  document.getElementById("step2").style.display = "none";
  document.getElementById("step1").innerHTML = `
      <h2>Subscribe for Updates</h2>
      <p>Please enter your WhatsApp number:</p>
      <input type="tel" id="whatsappNumber" value="${number}" />
      <button id="step2Button">Next</button>
    `;
  document
    .getElementById("step2Button")
    .addEventListener("click", () => goToStep2());
}

function goToStep2() {
  const number = document.getElementById("whatsappNumber").value;
  const isValid = /^\+91\d{10}$/.test(number);

  if (!isValid) {
    Toastify({
      text: "Please enter a valid 10-digit number after +91",
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: "#ff5e57",
      style: { borderRadius: "8px" },
    }).showToast();
    return;
  }

  document.getElementById(
    "step1"
  ).innerHTML = `<div class="loading-spinner"></div>`;

  axios
    .post(
      `${url}/userInfo/${btoa(encodeURIComponent(number)).replace(/=+$/, "")}`
    )
    .then((response) => {
      console.log(response);
      const userData = response.data || {
        name: "Unknown User",
        about: "No about info available",
        number: number,
        profileImage: "./assets/img/profile.jpg",
      };

      document.getElementById("step1").style.display = "none";
      document.getElementById("step2").style.display = "block";

      document.getElementById("step2").innerHTML = `
          <h2>Is this you?</h2>
          <div class="profile-box">
            <img src="${userData.profileImage}" class="profile-img" />
            <p><strong>About:</strong> ${userData.about}</p>
            <p><strong>Number:</strong> ${userData.number}</p>
            <button id="confirmBtn">Confirm</button>
          </div>
        `;

      document
        .getElementById("confirmBtn")
        .addEventListener("click", () => confirmSubscription(userData.number));
    })
    .catch((error) => {
      console.error(error);
      Toastify({
        text: "Failed to fetch user data. Try again.",
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: "#dc3545",
      }).showToast();
      showStep1(number);
    });
}

function confirmSubscription(number) {
  const confirmBtn = document.getElementById("confirmBtn");
  if (confirmBtn) confirmBtn.disabled = true;
  axios
    .post(
      `${url}/confirmSubscription/${btoa(encodeURIComponent(number)).replace(
        /=+$/,
        ""
      )}`
    )
    .then((res) => {
      Toastify({
        text: res?.data?.message || " :)",
        duration: 4000,
        gravity: "bottom",
        position: "center",
        backgroundColor: "#28a745",
      }).showToast();
      closeModal();
    })
    .catch((err) => {
      console.error(err);
      Toastify({
        text: "Something went wrong while confirming. Try again.",
        duration: 4000,
        gravity: "bottom",
        position: "center",
        backgroundColor: "#dc3545",
      }).showToast();
      closeModal();
    })
    .finally(() => {
      if (confirmBtn) confirmBtn.disabled = false;
    });
}
