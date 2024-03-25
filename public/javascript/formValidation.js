console.log("This is validation");

// let nameValidation = document.getElementById("nameValidation")
// let emailValidation = document.getElementById("emailValidation")
// let mobileValidation = document.getElementById("mobileValidation")
// let passwordValidation = document.getElementById("passwordValidation")
// let passwordConfirm = document.getElementById("passwordConfirm")

// nameValidation.style.display = "none";
// emailValidation.style.display = "none";
// mobileValidation.style.display = "none";
// passwordValidation.style.display = "none";
// passwordConfirm.style.display = "none";
// var nameValidation = document.getElementById("nameValidation").value
// !/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value)


function formValidation() {
    nameValidation.style.display = "none";
    emailValidation.style.display = "none";
    mobileValidation.style.display = "none";
    passwordValidation.style.display = "none";
    passwordConfirm.style.display = "none";

    let registerName = document.getElementById("register-name").value;

    let registerNumber = document.getElementById("register-number").value;

    let registerEmail = document.getElementById("register-email-2").value;

    let registerPassword = document.getElementById("register-password-2").value;

    let pattern = /[a-zA-Z]/;

    if (!/^[a-zA-Z]+$/.test(registerName) && registerName !== "") {
        nameValidation.style.display = "block";
    }
    if ((pattern.test(registerNumber) || registerNumber.length < 10 || registerNumber.length > 10 || registerNumber[0] == 0) && registerNumber !== "") {
        mobileValidation.style.display = "block";
    }
    if ((registerPassword.length < 4 || registerPassword.length > 16) && registerPassword !== "") {
        passwordValidation.style.display = "block";
    }

    if (!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(registerEmail) && registerEmail !== "") {
        emailValidation.style.display = "block";
    }
}

function numbercrosscheck() {
    let registerPassword1 = document.getElementById("register-password-1").value;
    let registerPassword2 = document.getElementById("register-password-2").value;
    if (registerPassword1 !== registerPassword2) {
        passwordConfirm.style.display = "block";
    }
}


