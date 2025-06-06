// Get the canvas element
const ctx = document.getElementById('apStatusChart').getContext('2d');

// Data based on the image (Note: 88.8% + 8.5% = 97.3%. The yellow slice is 2.7%)
// The tooltip "损坏 8" likely represents a COUNT, not a percentage.
// We'll use percentages for the slices and customize the tooltip for '损坏'.
const chartData = {
    labels: ['在线', '离线', '损坏'], // Category names
    datasets: [{
        label: 'AP 设备状态', // General label for the dataset (used in default tooltips)
        data: [88.8, 8.5, 2.7],   // Percentages for slice sizes
        // Custom data for tooltips (e.g., counts) - can be accessed in callbacks
        counts: [null, null, 2.7], // Store the count '8' for '损坏'
        backgroundColor: [
            '#1DE9B6', // Color for 在线 (Teal/Cyan)
            '#2979FF', // Color for 离线 (Blue)
            '#FFEB3B'  // Color for 损坏 (Yellow)
        ],
        borderColor: '#ffffff', // Color of lines between slices
        borderWidth: 2         // Width of lines between slices
    }]
};

// Chart configuration
const chartOptions = {
    responsive: true, // Make chart resize with container
    maintainAspectRatio: false, // Allow chart height to be controlled by CSS
    plugins: {
        legend: {
            display: false // Hide default Chart.js legend, we use custom HTML
        },
        tooltip: {
            // Enabled by default, tooltips appear on hover
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Tooltip background
            titleFont: { size: 14 },
            bodyFont: { size: 12 },
            padding: 10,
            displayColors: true, // Show color box in tooltip
            boxPadding: 5,

            // --- Callback to customize tooltip content ---
            callbacks: {
                label: function(context) {
                    let label = context.label || ''; // e.g., '在线', '离线', '损坏'
                    let value = context.parsed || 0; // The percentage value (e.g., 88.8)
                    let dataset = context.dataset; // Access the dataset object

                    // Special case for '损坏' to show count like the image
                    if (label === '损坏') {
                        const count = dataset.counts[context.dataIndex]; // Get the count '8'
                        return `${label}: ${count}`; // Output: "损坏: 8"
                    }

                    // For other slices, show label and percentage
                    if (label) {
                        label += ': ';
                    }
                    label += value.toFixed(1) + '%'; // Output e.g., "在线: 88.8%"
                    return label;
                }
            }
        },
        // Optional: Add plugin to display labels/percentages directly on slices
        // You might need 'chartjs-plugin-datalabels' for advanced customization here
        // datalabels: {
        //     formatter: (value, ctx) => {
        //         return value.toFixed(1) + '%';
        //      },
        //     color: '#fff', // Color of text on slices
        // }
    },
    // Optional: Adjust starting angle, cutout for doughnut, etc.
    // rotation: -90, // Start angle (e.g., -90 degrees is 12 o'clock)
    // cutout: '50%', // Makes it a doughnut chart
};

// Create the pie chart
const apStatusChart = new Chart(ctx, {
    type: 'pie', // Type of chart
    data: chartData,
    options: chartOptions
    // If using datalabels plugin, add:
    // plugins: [ChartDataLabels]
});