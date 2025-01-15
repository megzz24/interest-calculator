function calculateSI(principal, rate, time) {
    return (principal * rate * time) / 100;
}

function calculateCI(principal, rate, time, frequency) {
    let map = {
        'Daily': 365,
        'Weekly': 52,
        'Monthly': 12,
        'Quarterly': 4,
        'Semi-Annually': 2,
        'Yearly': 1
    };

    let noOfPeriodsPerAnnum = map[frequency];
    let ratePerPeriod = rate / 100 / noOfPeriodsPerAnnum;
    let totalNoOfPeriods = noOfPeriodsPerAnnum * time;

    return principal * Math.pow((1 + ratePerPeriod), totalNoOfPeriods) - principal;
}

function updateOutput() {
    const choice = document.querySelector('input[name="choice"]:checked').value;
    const principal = parseFloat(document.getElementById("principal").value);
    const rate = parseFloat(document.getElementById("rate").value);
    const unit = document.getElementById("unit").value;
    const frequency = document.getElementById("frequency").value;
    const value = parseFloat(document.getElementById("value").value);

    let time = 0;
    switch (unit) {
        case "Days":
            time = value / 365;
            break;
        case "Weeks":
            time = value / 52;
            break;
        case "Months":
            time = value / 12;
            break;
        case "Quarters":
            time = value / 4;
            break;
        case "Years":
            time = value;
            break;
    }

    let interest = 0;
    if (choice === "simple") {
        interest = calculateSI(principal, rate, time);
    } else if (choice === "compound") {
        interest = calculateCI(principal, rate, time, frequency);
    }

    const output = document.getElementById('result');
    output.innerHTML = `
        <p><strong>Interest Earned:</strong> Rs. ${interest.toFixed(2)}</p>
        <p><strong>Principal Amount:</strong> Rs. ${principal}</p>
        <p><strong>Total Amount:</strong> Rs. ${(principal + interest).toFixed(2)}</p>
    `;

    generateChart(principal, interest);
}

function generateChart(principal, interest) {
    const ctx = document.getElementById('interestChart').getContext('2d');

    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Principal Amount', 'Interest Gained'],
            datasets: [{
                data: [principal, interest],
                backgroundColor: ['#F7A097', '#FBF595'],
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `Rs. ${tooltipItem.raw.toFixed(2)}`;
                        }
                    }
                }
            },
            aspectRatio: 1,
            width: 300,
            height: 300,
        }
    });
}

function updateVisibility() {
    const interestType = document.querySelector('input[name="choice"]:checked').value;
    const compound = document.getElementById('compound');

    if (interestType === 'compound') {
        compound.style.display = 'block';
    } else {
        compound.style.display = 'none';
    }
}

document.querySelectorAll('input[name="choice"]').forEach(radio => {
    radio.addEventListener('change', () => {
        updateVisibility();
        updateOutput();
    });
});
document.getElementById('principal').addEventListener('input', updateOutput);
document.getElementById('rate').addEventListener('input', updateOutput);
document.getElementById('unit').addEventListener('change', updateOutput);
document.getElementById('frequency').addEventListener('change', updateOutput);
document.getElementById('value').addEventListener('input', updateOutput);

window.onload = function() {
    updateVisibility();
    updateOutput();
};
