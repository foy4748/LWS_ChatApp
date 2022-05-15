const modal = document.querySelector("#add-user-modal");
const form = document.querySelector("#add-user-form");

function closeModal() {
  modal.style.display = "none";
}
function openModal() {
  modal.style.display = "block";
}

//TOASTS
const successToast = Toastify({
  text: "USER was Successfully added. Reloading the list...",
  duration: 2000,
});

const deleteToast = Toastify({
  text: "USER was Successfully DELETED. Reloading the list...",
  duration: 3000,
});

const deleteERRORToast = Toastify({
  text: "Couldn't delete user!!",
  duration: 3000,
});

//Prepare the form data
form.onsubmit = async function (e) {
  e.preventDefault();
  const formData = new FormData(form);

  let response = await fetch("/users", {
    method: "POST",
    body: formData,
  });
  let result = await response.json();

  if (result.errors) {
    Object.keys(result.errors).forEach((fieldname) => {
      form[fieldname].classList.add("error");

      const errorPlaceHolder = document.querySelector(`.${fieldname}-error`);
      errorPlaceHolder.textContent = result.errors[fieldname].msg;
      errorPlaceHolder.style.display = "block";
    });
  } else {
    successToast.showToast();
    closeModal();
    document.querySelector("p.error").style.display = "none";

    //Reloading the page after adding a user
    setTimeout(() => {
      location.reload();
    }, 1000);
  }
};

async function deleteUSER(userId) {
  const response = await fetch(`/users/${userId}`, {
    method: "DELETE",
  });
  const result = await response.json();
  if (!result.error) {
    deleteToast.showToast();
    //Reloading the page after deleting a user
    setTimeout(() => {
      location.reload();
    }, 1000);
  } else {
    deleteERRORToast.showToast();
  }
}
