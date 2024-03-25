console.log("This is Toast")

const notifications = document.querySelector(".notifications"),
buttons = document.querySelectorAll(".buttons .btnN");

const toastDetails = {
    timer: 5000,
    success: {
        icon: 'fa-circle-check',
        text: 'Success: This is a success toast.',
    },
    error: {
        icon: 'fa-circle-xmark',
        text: 'Error: This is an error toast.',
    },
    warning: {
        icon: 'fa-triangle-exclamation',
        text: 'Warning: This is a warning toast.',
    },
    info: {
        icon: 'fa-circle-info',
        text: 'Info: This is an information toast.',
    }
}

const removeToast = (toast) => {
    toast.classList.add("hide");
    if(toast.timeoutId) clearTimeout(toast.timeoutId); // Clearing the timeout for the toast
    setTimeout(() => toast.remove(), 500); // Removing the toast after 500ms
}

const createToast = (id) => {
    console.log("inside createToast")
    console.log(id)
    // Getting the icon and text for the toast based on the id passed
    const { icon, text } = toastDetails[id];

    console.log(notifications)
    const toast = document.createElement("li"); // Creating a new 'li' element for the toast
    console.log(toast)
    toast.className = `toast ${id}`; // Setting the classes for the toast
    console.log(icon)
    console.log(text);
    // Setting the inner HTML for the toast
    toast.innerHTML = `<div class="column">
                         <i class="fa-solid ${icon}"></i>
                         <span>${text}</span>
                      </div>
                      <i class="fa-solid fa-xmark" onclick="removeToast(this.parentElement)"></i>`;
    notifications.appendChild(toast); // Append the toast to the notification ul
    // Setting a timeout to remove the toast after the specified duration
    toast.timeoutId = setTimeout(() => removeToast(toast), toastDetails.timer);
}

// Adding a click event listener to each button to create a toast when clicked
buttons.forEach(btnN => {
console.log("hiiiiabc")
    btnN.addEventListener("click", () => createToast(btnN.id));
});

function abc(a){
    // console.log("hiiiiabc")
    createToast(a)
}
