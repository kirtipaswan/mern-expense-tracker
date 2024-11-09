import _ from 'lodash';

export function getSum(transaction, type) {
    let sum = _(transaction)
        .groupBy("type")
        .map((objs, key) => {
            if (!type) return _.sumBy(objs, 'amount'); // Sum amounts if type is not specified
            return {
                'type': key,
                'color': objs[0].color, // Get color from the first object
                'total': _.sumBy(objs, 'amount') // Sum amounts for the current type
            };
        })
        .value();
    return sum;
}

export function getLabels(transactions) {
    const typeColors = {
        Investment: '#FF6384', // Red
        Expense: '#36A2EB', // Blue
        Savings: '#FFCE56' // Yellow
    };

    let amountSum = getSum(transactions, 'type');
    let Total = _.sumBy(amountSum, 'total'); // Get total of amounts

    let percent = _(amountSum)
        .map(obj => {
            const color = typeColors[obj.type] || '#FF6384'; // Use typeColors for colors
            return {
                type: obj.type,
                total: obj.total,
                color, // Assign the color
                percent: (100 * obj.total) / Total
            };
        })
        .value();

    return percent;
}

export function chart_Data(labelsData) {
    // Extract totals for each label
    const dataValue = labelsData.map(label => label.total);

    // Extract colors for each label, ensuring fallback to default colors
    const bg = labelsData.map(label => label.color || '#FF6384'); // Fallback to a default color

    const config = {
        labels: labelsData.map(label => label.type), // Transaction types for the chart labels
        datasets: [{
            data: dataValue, // Totals for chart data
            backgroundColor: bg, // Corresponding colors from labels
            hoverOffset: 4,
            borderRadius: 30,
            spacing: 10
        }]
    };

    return { data: config, options: { cutout: 115 } };
}

export function getTotal(transactions) {
    let investments = 0;
    let savings = 0;
    let expenses = 0;

    transactions.forEach(transaction => {
        if (transaction.type === 'Investment') {
            investments += transaction.amount;
        } else if (transaction.type === 'Savings') {
            savings += transaction.amount;
        } else if (transaction.type === 'Expense') {
            expenses += transaction.amount;
        }
    });

    const total = investments + savings - expenses; // Updated calculation
    console.log("Calculated Total:", total); // Log the total for debugging
    return total;
}
