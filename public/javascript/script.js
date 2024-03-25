console.log("This is scipt");

 // Function to create and display a toast
 function showToast(message) {
    console.log("inside showToast =========");
    // Create a new div element for the toast
    var toast = document.createElement('div');
    toast.id = 'toast';
    toast.textContent = message;

    // Append the toast to the body
    document.body.appendChild(toast);

    // Show the toast
    toast.style.display = 'block';

    // Hide the toast after a delay (e.g., 3 seconds)
    setTimeout(function() {
        toast.style.display = 'none';
    }, 5000);
}


