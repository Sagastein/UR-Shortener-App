"use strict";

const shortlyInput = document.querySelector(".url-input");
const shortlyBtn = document.querySelector(".url-button");
const parentNode = document.querySelector(".search-result-block");
const errorMsg = document.querySelector(".error-msg");
const resetResults = document.querySelector(".reset-results");
const sectionThree = document.querySelector(".section-3");

let resultSkeleton = "";
let resultStorage = [];

function urlValidation(defaultUrl) {
  const urlRule =
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  if (defaultUrl.match(urlRule)) {
    return true;
  } else {
    return false;
  }
}

shortlyBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let inputValue = shortlyInput.value;

  if (!urlValidation(inputValue)) {
    errorMsg.classList.add("shown");
    shortlyInput.classList.add("shown");
    errorMsg.innerHTML = "Please enter a link";
  } else {
    errorMsg.classList.remove("shown");
    shortlyInput.classList.remove("shown");

    fetch(`https://api.shrtco.de/v2/shorten?url=` + inputValue)
      .then((response) => response.json())
      .then((response) => {
        if (response.ok) {
          let shortlyCode = response.result.code;

          resultSkeleton = `<div class="result">
          <p class="inserted-link">${inputValue}</p>
          <hr class="result-block-hr">
          <div class="results">
            <p class="short-code">shrtco.de/${shortlyCode}</p>
            <button class="copy-btn">Copy</button>
          </div>
          </div>`;

          if (sessionStorage.getItem("resultsStorage") !== null) {
            resultStorage = [
              resultSkeleton,
              sessionStorage.getItem("resultsStorage"),
            ].reverse();
            parentNode.innerHTML = [resultStorage].join().replaceAll(",", "");

            sessionStorage.setItem(
              "resultsStorage",
              [resultStorage].join().replaceAll(",", "")
            );
            resetResults.classList.add("active");
          } else {
            parentNode.innerHTML = resultSkeleton;

            resultStorage.push(resultSkeleton);
            sessionStorage.setItem("resultsStorage", resultStorage);
            resetResults.classList.add("active");
          }
        }
      });
  }
});

parentNode.addEventListener("click", function (e) {
  e.stopPropagation();
  let copyBtn;
  if (e.target.parentNode !== null) {
    copyBtn = e.target.parentNode.querySelector(".copy-btn");
  }

  if (e.target.classList.value === "copy-btn") {
    let textToCopy =
      e.target.parentNode.querySelector(".short-code").textContent;
    navigator.clipboard.writeText(textToCopy);
  } else {
    return null;
  }

  copyBtn.textContent = "Copied!";
  copyBtn.style.backgroundColor = "var(--dark-violet)";
  setTimeout(function () {
    copyBtn.textContent = "Copy";
    copyBtn.style.backgroundColor = "var(--cyan)";
  }, 1000);
});

sectionThree.addEventListener("click", (e) => {
  if (e.target.classList.value === resetResults.classList.value) {
    sessionStorage.clear();
    parentNode.innerHTML = "";
    shortlyInput.value = "";
    resultStorage = [];
    resetResults.classList.remove("active");
  } else sectionThree.removeEventListener("click");
});

window.addEventListener("load", () => {
  if (sessionStorage.getItem("resultsStorage") !== null) {
    parentNode.innerHTML = sessionStorage.getItem("resultsStorage");
    resetResults.classList.add("active");
  } else {
    parentNode.innerHTML = "";
  }
});

const burgerIcon = document.querySelector(".fa-bars");
const navMenu = document.querySelector(".menu-section");
const mainElement = document.querySelector(".main-container");

const menuToggle = () => navMenu.classList.toggle("show");

const removeMenu = () => navMenu.classList.remove("show");

burgerIcon.addEventListener("click", function () {
  menuToggle();
});

mainElement.addEventListener("click", function () {
  removeMenu();
});
