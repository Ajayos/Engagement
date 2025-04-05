(function ($) {
  "use strict";
  $(".sakura-falling").sakura();
})(jQuery);

window.onload = function () {
  // Play the muted audio immediately on page load
  var audio = document.getElementById("my_audio");
  const input = document.getElementById("whatsappNumber");
  input.value = "+91";

  // After 2 seconds, unmute the audio
  setTimeout(function () {
    audio.play();
    audio.muted = false; // Unmute the audio
  }, 2000); // 2000 ms = 2 seconds
};
window.addEventListener("click", function () {
    const audio = document.getElementById("my_audio");
    audio.muted = false;
    audio.play().catch((err) => console.warn("Audio play blocked:", err));
  }, { once: true });
  

function openUpdatesWindow() {
  document.getElementById("updatesModal").style.display = "block";
}

function closeModal() {
  document.getElementById("updatesModal").style.display = "none";
  document.getElementById("step1").style.display = "block";
  document.getElementById("step2").style.display = "none";
  document.getElementById("whatsappNumber").value = "";
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
      style: {
        borderRadius: "8px",
      },
    }).showToast();
    return;
  }

  document.getElementById("step1").innerHTML = `
    <div class="loading-spinner"></div>
    `;

  axios
    .post(
      `http://192.168.1.22/userInfo/${btoa(encodeURIComponent(number)).replace(
        /=+$/,
        ""
      )}`
    )
    .then((response) => {
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
        <h3>${userData.name}</h3>
        <p><strong>About:</strong> ${userData.about}</p>
        <p><strong>Number:</strong> ${userData.number}</p>
        <button onclick="confirmSubscription('${userData.number}')">Confirm</button>
      </div>
    `;
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

      // Restore input UI
      document.getElementById("step1").innerHTML = `
      <h2>Subscribe for Updates</h2>
      <p>Please enter your WhatsApp number:</p>
      <input type="tel" id="whatsappNumber" value="${number}" />
      <button onclick="goToStep2()">Next</button>
    `;
    });
}

function confirmSubscription(number) {
  axios
    .post(
      `http://192.168.1.22/confirmSubscription/${btoa(
        encodeURIComponent(number)
      ).replace(/=+$/, "")}`
    )
    .then(() => {
      Toastify({
        text: `You're subscribed! We'll contact ${number}`,
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
    });
}
