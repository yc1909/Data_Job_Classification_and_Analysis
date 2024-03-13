document.addEventListener("DOMContentLoaded", function () {
    const skillsSelect = document.getElementById("skills");
    const selectedSkillsContainer = document.getElementById("selected-skills-container");
    const searchInput = document.getElementById("search");
    const resultContainer = document.getElementById("result-container");

    skillsSelect.addEventListener("mousedown", function (e) {
        e.preventDefault();
        const scroll = this.scrollTop;
        const selected = e.target.selected;
        e.target.selected = !selected;
        this.scrollTop = scroll;
        const event = new Event("change");
        this.dispatchEvent(event);
        updateSelectedSkills();
    });

    skillsSelect.addEventListener("keydown", function (e) {
        if (e.key === "Control") {
            this.multiple = true;
        }
    });

    skillsSelect.addEventListener("keyup", function (e) {
        if (e.key === "Control") {
            this.multiple = false;
        }
    });

    searchInput.addEventListener("input", function () {
        const searchTerm = searchInput.value.toLowerCase();
        Array.from(skillsSelect.options).forEach(option => {
            const optionText = option.textContent.toLowerCase();
            option.style.display = optionText.includes(searchTerm) ? "block" : "none";
        });
        updateSelectedSkills();
    });

    document.getElementById("skillsForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const selectedSkills = Array.from(skillsSelect.selectedOptions).map(option => option.value);

        fetch("/prediction", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ skills: selectedSkills }),
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById("predicted-role").textContent = data.result;
            document.getElementById("prob-data-scientist").textContent = data.probabilities[0];
            document.getElementById("prob-data-analyst").textContent = data.probabilities[1];
            document.getElementById("prob-data-engineer").textContent = data.probabilities[2];
        })
        .catch(error => console.error("Error:", error));
    });

    function updateSelectedSkills() {
        const selectedSkills = Array.from(skillsSelect.selectedOptions).map(option => option.value);
        selectedSkillsContainer.innerHTML = `<p>Selected Skills: ${selectedSkills.join(", ")}</p>`;
    }
});
