let growthChart;

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

function calculateSIP(monthlyAmount, annualRate, years) {
    const monthlyRate = annualRate / 12 / 100;
    const totalMonths = years * 12;
    const maturityAmount = monthlyAmount * (((1 + monthlyRate) ** totalMonths - 1) / monthlyRate) * (1 + monthlyRate);
    const principalAmount = monthlyAmount * totalMonths;
    return { maturityAmount, principalAmount };
}

function calculateLumpSum(amount, annualRate, years) {
    const maturityAmount = amount * ((1 + annualRate / 100) ** years);
    const principalAmount = amount;
    return { maturityAmount, principalAmount };
}

function updateCalculations() {
    const investmentType = document.querySelector('input[name="investmentType"]:checked').value;
    const amount = parseFloat(document.getElementById('amount').value) || 0;
    const rate = parseFloat(document.getElementById('rate').value) || 0;
    const years = parseInt(document.getElementById('years').value) || 0;

    let result;
    if (investmentType === 'sip') {
        result = calculateSIP(amount, rate, years);
    } else {
        result = calculateLumpSum(amount, rate, years);
    }

    const interestAmount = result.maturityAmount - result.principalAmount;

    document.getElementById('maturityAmount').textContent = formatCurrency(result.maturityAmount);
    document.getElementById('principalAmount').textContent = formatCurrency(result.principalAmount);
    document.getElementById('interestAmount').textContent = formatCurrency(interestAmount);

    updateChart(result.principalAmount, result.maturityAmount, years, investmentType, amount, rate);
}

function updateChart(principal, maturity, years, type, amount, rate) {
    const ctx = document.getElementById('growthChart').getContext('2d');

    if (growthChart) {
        growthChart.destroy();
    }

    const interestEarned = maturity - principal;

    growthChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Principal Invested', 'Interest Earned'],
            datasets: [{
                data: [principal, interestEarned],
                backgroundColor: ['#6b7280', '#10b981'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#e0e0e0',
                        font: {
                            size: 14
                        }
                    },
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed;
                            return `${context.label}: ₹${value.toLocaleString('en-IN')}`;
                        }
                    }
                }
            }
        }
    });
}


function calculateInvestment() {
    alert('Ready to start your investment journey! This would typically redirect to an investment platform.');
}

function resetCalculator() {
    document.getElementById('amount').value = 10000;
    document.getElementById('rate').value = 12;
    document.getElementById('years').value = 10;
    document.getElementById('sip').checked = true;
    updateCalculations();
}


// Event listeners
document.getElementById('amount').addEventListener('input', updateCalculations);
document.getElementById('rate').addEventListener('input', updateCalculations);
document.getElementById('years').addEventListener('input', function() {
    document.getElementById('yearDisplay').textContent = this.value;
    updateCalculations();
});

document.querySelectorAll('input[name="investmentType"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const amountLabel = document.querySelector('label[for="amount"]');
        if (this.value === 'sip') {
            amountLabel.textContent = 'Monthly SIP Amount';
        } else {
            amountLabel.textContent = 'Lump Sum Amount';
        }
        updateCalculations();
    });
});

// Initialize calculator when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateCalculations();
});

