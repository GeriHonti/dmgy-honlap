document.addEventListener("DOMContentLoaded", function () {
    fetch("data/data.json")
        .then(response => response.json())
        .then(data => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            let upcomingEvents = [];
            let pastEvents = [];

            data.forEach(event => {
                const eventDate = new Date(event.date);
                eventDate.setHours(0, 0, 0, 0);

                if (eventDate >= today) {
                    upcomingEvents.push(event);
                } else {
                    pastEvents.push(event);
                }
            });

            upcomingEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
            pastEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

            populateList("upcoming-list", upcomingEvents);
            populateList("past-list", pastEvents);
        })
        .catch(error => console.error("Error loading data:", error));
});

function populateList(listId, events) {
    const list = document.getElementById(listId);
    list.innerHTML = "";

    events.forEach(event => {
        let listItem = document.createElement("li");
        listItem.classList.add("fancy-list-item", event["card-color"]);

        listItem.innerHTML = `
            <div class="date">${formatDate(event.date)}</div>
            <div class="name">${event["preacher-name"]}</div>
            <div class="additional-names">
                <strong>Közreműködők:</strong>
                <ul>${event.contributors.map(contributor => `<li>${contributor}</li>`).join("")}</ul>
            </div>
        `;

        if (event["preach-text"]) {
            listItem.setAttribute("data-text", event["preach-text"]);
            listItem.classList.add("clickable");

            listItem.onclick = function () {
                openPopup(listItem);
            };

            let icon = document.createElement("span");
            icon.innerHTML = "📖";
            icon.classList.add("read-icon");
            icon.onclick = function (event) {
                event.stopPropagation();
                openPopup(listItem);
            };

            listItem.appendChild(icon);
        }

        list.appendChild(listItem);
    });
}

function openPopup(element) {
    const text = element.getAttribute("data-text");
    if (text) {
        document.getElementById("popup-text").innerHTML = text;
        document.getElementById("popup").style.display = "flex";
    }
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

function formatDate(dateString) {
    const months = [
        "január", "február", "március", "április", "május", "június",
        "július", "augusztus", "szeptember", "október", "november", "december"
    ];
    let date = new Date(dateString);
    return `${date.getFullYear()}. ${months[date.getMonth()]} ${date.getDate()}.`;
}
