const selected = document.querySelector(".select-box__selected");
const optionsContainer = document.querySelector(".select-box__options-container");

const optionsList = document.querySelectorAll(".select-box__option");

selected.onclick = () => {
  optionsContainer.classList.toggle("active");
}

optionsList.forEach(o => {
  o.onclick = () => {
    selected.innerHTML = o.querySelector("label").innerHTML;
    optionsContainer.classList.remove("active");
  };
});