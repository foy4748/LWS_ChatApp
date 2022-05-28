//Grabbing DOMs
var modalWrapper = document.querySelector(".modal-wrapper");
var addConvBttn = document.querySelector("#addConv");
var modalClose = document.querySelector(".modal-close");

//Listening to CLICK events _____________________

//_____________________ SHOW MODAL _____________________//
addConvBttn.onclick = (e) => {
  e.preventDefault();
  modalWrapper.style.display = "inline-block";
};

//_____________________ CLOSE MODAL _____________________//
modalClose.onclick = (e) => {
  modalWrapper.style.display = "none";
};

//_____________________ CLOSE MODAL by clicking anywhere _____________________//
modalWrapper.onclick = (e) => {
  if (e.target.classList.contains("modal-wrapper"))
    modalWrapper.style.display = "none";
};

/*
window.onclick = (e) => {
  console.log();
};
*/
