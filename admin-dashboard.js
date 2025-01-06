document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.querySelector("#booking-table tbody");

    // Fetch all bookings
    function fetchBookings() {
        fetch("/admin/bookings")
            .then((response) => response.json())
            .then((bookings) => {
                tableBody.innerHTML = ""; // Clear the table
                bookings.forEach((booking) => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${booking.id}</td>
                        <td>${booking.name}</td>
                        <td>${booking.email}</td>
                        <td>${booking.checkin_date}</td>
                        <td>${booking.checkout_date}</td>
                        <td>${booking.room_type}</td>
                        <td>${booking.guests}</td>
                        <td>
                            <button class="update-btn" data-id="${booking.id}">Update</button>
                            <button class="delete-btn" data-id="${booking.id}">Delete</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });

                // Attach event listeners to Update/Delete buttons
                document.querySelectorAll(".update-btn").forEach((btn) => {
                    btn.addEventListener("click", handleUpdate);
                });
                document.querySelectorAll(".delete-btn").forEach((btn) => {
                    btn.addEventListener("click", handleDelete);
                });
            });
    }

    // Handle booking update
    function handleUpdate(event) {
        const id = event.target.dataset.id;
        const newName = prompt("Enter new name:");
        const newEmail = prompt("Enter new email:");
        const newCheckin = prompt("Enter new check-in date (YYYY-MM-DD):");
        const newCheckout = prompt("Enter new check-out date (YYYY-MM-DD):");
        const newRoomType = prompt("Enter new room type:");
        const newGuests = prompt("Enter new number of guests:");

        fetch(`/admin/bookings/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: newName,
                email: newEmail,
                checkin: newCheckin,
                checkout: newCheckout,
                roomType: newRoomType,
                guests: newGuests,
            }),
        })
            .then((response) => response.text())
            .then((message) => {
                alert(message);
                fetchBookings(); // Refresh the table
            });
    }

    // Handle booking delete
    function handleDelete(event) {
        const id = event.target.dataset.id;

        if (confirm("Are you sure you want to delete this booking?")) {
            fetch(`/admin/bookings/${id}`, {
                method: "DELETE",
            })
                .then((response) => response.text())
                .then((message) => {
                    alert(message);
                    fetchBookings(); // Refresh the table
                });
        }
    }

    // Initial fetch
    fetchBookings();
    
});
