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

        const targetRole = document.querySelector('input[name="targetRole"]:checked');
        if (!targetRole) {
            console.error("Target role not selected");
            return;
        }

        fetch("/missing_skills_analysis", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                skills: selectedSkills.join(","),
                targetRole: targetRole.value,
            }),
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById("percent-covered").textContent = data.percent_covered;
            document.getElementById("skills-left").textContent = data.skills_left;
        })
        .catch(error => console.error("Error:", error));
    });

    function updateSelectedSkills() {
        const selectedSkills = Array.from(skillsSelect.selectedOptions).map(option => option.value);
        selectedSkillsContainer.innerHTML = `<p>Selected Skills: ${selectedSkills.join(", ")}</p>`;
    }
});
