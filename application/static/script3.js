let jsonData;

fetch('/static/separated_in_demand_skills_0.json')
    .then(response => response.json())
    .then(data => {
        jsonData = data;
        updateGraphs('datascientist');
    })
    .catch(error => console.error('Error fetching data:', error));

function updateGraphs(selectedJobRole) {
    const jobRoleData = jsonData[selectedJobRole];
    const softSkillsData = sortDataDescending(jobRoleData.soft_skills);
    const technologiesData = sortDataDescending(jobRoleData.technologies);
    const packagesData = sortDataDescending(jobRoleData.packages);

    const totalSkillsCount = getTotalSkillsCount(softSkillsData, technologiesData, packagesData);

    createBarGraph('softSkillsChart', 'Soft Skills', softSkillsData.labels, calculatePercentages(softSkillsData.values, totalSkillsCount));
    createBarGraph('technologiesChart', 'Technologies', technologiesData.labels, calculatePercentages(technologiesData.values, totalSkillsCount));
    createBarGraph('packagesChart', 'Packages', packagesData.labels, calculatePercentages(packagesData.values, totalSkillsCount));
}

function sortDataDescending(data) {
    const sortedData = Object.entries(data).sort((a, b) => b[1] - a[1]);
    return {
        labels: sortedData.map(entry => entry[0]),
        values: sortedData.map(entry => entry[1]),
    };
}

function getTotalSkillsCount(softSkillsData, technologiesData, packagesData) {
    return softSkillsData.values.reduce((acc, val) => acc + val, 0) +
        technologiesData.values.reduce((acc, val) => acc + val, 0) +
        packagesData.values.reduce((acc, val) => acc + val, 0);
}

function calculatePercentages(values, total) {
    return values.map(value => ((value / total) * 100).toFixed(2));
}

function createBarGraph(containerId, title, labels, values) {
    const trace = {
        x: labels,
        y: values,
        type: 'bar',
        marker: {
            color: 'rgb(65,105,225)',
        },
        width: 0.6,
    };

    const layout = {
        title: title,
        xaxis: {
            title: 'Skills',
            tickangle: -45,
            automargin: true,
            showticklabels: true,
            tickmode: 'auto',
            automargin: true,
        },
        yaxis: {
            title: 'Demand(in percentage)',
        },
        autosize: {
            margin: 50,
        },
    };

    Plotly.newPlot(containerId, [trace], layout);
}

document.addEventListener('DOMContentLoaded', function() {
    const dropdownOptions = document.querySelectorAll('.dropdown-option');
    dropdownOptions.forEach(option => {
        option.addEventListener('click', function() {
            const selectedJobRole = this.getAttribute('data-job-role');
            document.getElementById('jobRoleBtn').innerText = this.innerText;
            updateGraphs(selectedJobRole);
        });
    });
});
