import "Shared/isPhoneNumber";
const mountPoint = document.getElementById("app");

if (mountPoint) {
  mountPoint.appendChild(document.createTextNode("Hello"));
  mountPoint.style.backgroundColor = "skyblue";
}
