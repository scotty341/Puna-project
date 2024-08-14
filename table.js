document.addEventListener('DOMContentLoaded', function () {
    // Page Transition (unchanged)
    const transitionLayers = document.querySelectorAll('.transition-layer');
    const links = document.querySelectorAll('.nav__link');
    let direction = 'forward'; // Default direction

    function startTransition(url) {
        document.body.classList.add('transition-active');
        document.body.classList.remove('transition-reverse');
        setTimeout(() => {
            window.location.href = url;
        }, 1000); // Match the transition duration
    }

    function startReverseTransition() {
        document.body.classList.add('transition-reverse');
        document.body.classList.remove('transition-active');
        setTimeout(() => {
            window.location.reload(); // Reload to handle reverse transition on the same page
        }, 1000); // Match the transition duration
    }

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default action
            if (direction === 'forward') {
                startTransition(this.href);
            } else {
                startReverseTransition();
            }
        });
    });

    window.addEventListener('popstate', function () {
        direction = 'reverse'; // When going back, set direction to reverse
        startReverseTransition();
    });

    window.addEventListener('load', () => {
        document.body.classList.remove('transition-active', 'transition-reverse');
        direction = 'forward'; // Reset direction after page load
    });

    const pageContent = document.querySelector('.page-content');
    if (pageContent) {
        pageContent.classList.add('scale-up-animation');
        pageContent.addEventListener('animationend', () => {
            pageContent.classList.remove('scale-up-animation');
        });
    }

    // Table Functionality
    const search = document.querySelector('.input-group input');
    const tableRows = document.querySelectorAll('tbody tr');
    const tableHeadings = document.querySelectorAll('thead th');
    const pdfBtn = document.querySelector('#toPDF');
    const jsonBtn = document.querySelector('#toJSON');
    const csvBtn = document.querySelector('#toCSV');
    const excelBtn = document.querySelector('#toEXCEL');
    const customersTable = document.querySelector('#customers_table');

    // Search Table
    function searchTable() {
        const searchData = search.value.toLowerCase();
        tableRows.forEach((row, i) => {
            const cells = row.querySelectorAll('td');
            let shouldHide = true;

            cells.forEach(cell => {
                const cellText = cell.textContent.toLowerCase();
                if (cellText.includes(searchData)) {
                    shouldHide = false;
                }
            });

            row.classList.toggle('hide', shouldHide);
            row.style.setProperty('--delay', i / 25 + 's');
        });

        document.querySelectorAll('tbody tr:not(.hide)').forEach((visibleRow, i) => {
            visibleRow.style.backgroundColor = (i % 2 === 0) ? 'transparent' : '#0000000b';
        });
    }

    search.addEventListener('input', searchTable);

    // Updated Sorting Table
    function sortTable(columnIndex, sortAsc) {
        // Convert NodeList to Array
        const rowsArray = Array.from(tableRows);
    
        const sortedRows = rowsArray.sort((a, b) => {
            // Extract text content from the cells
            const cellA = a.querySelectorAll('td')[columnIndex].textContent.trim();
            const cellB = b.querySelectorAll('td')[columnIndex].textContent.trim();
    
            // Check if the column is numeric
            const isNumericColumn = !isNaN(parseFloat(cellA.replace(/[^0-9.-]/g, '')));
    
            if (isNumericColumn) {
                // Numeric sorting
                const numA = parseFloat(cellA.replace(/[^0-9.-]/g, ''));
                const numB = parseFloat(cellB.replace(/[^0-9.-]/g, ''));
                return sortAsc ? numA - numB : numB - numA;
            } else {
                // Text sorting
                const normalizedA = cellA.toLowerCase();
                const normalizedB = cellB.toLowerCase();
                
                // Use localeCompare for better string comparison
                const comparison = normalizedA.localeCompare(normalizedB, undefined, { sensitivity: 'base' });
                return sortAsc ? comparison : -comparison;
            }
        });
    
        // Rebuild the table body with sorted rows
        const tbody = document.querySelector('tbody');
        tbody.innerHTML = ''; // Clear existing rows
        sortedRows.forEach(row => tbody.appendChild(row)); // Append sorted rows
    }
    


    tableHeadings.forEach((head, i) => {
        let sortAsc = true;
        head.addEventListener('click', () => {
            tableHeadings.forEach(h => h.classList.remove('active'));
            head.classList.add('active');

            document.querySelectorAll('td').forEach(td => td.classList.remove('active'));
            tableRows.forEach(row => row.querySelectorAll('td')[i].classList.add('active'));

            head.classList.toggle('asc', sortAsc);
            sortAsc = !sortAsc;

            sortTable(i, sortAsc);
        });
    });
    
    // Convert Table to PDF (unchanged)
    function toPDF() {
        const htmlCode = `
        <!DOCTYPE html>
        <html>
        <head>
            <link rel="stylesheet" type="text/css" href="style.css">
        </head>
        <body>
            <main class="table" id="customers_table">${customersTable.innerHTML}</main>
        </body>
        </html>`;
        const newWindow = window.open();
        newWindow.document.write(htmlCode);
        setTimeout(() => {
            newWindow.print();
            newWindow.close();
        }, 400);
    }

    if (pdfBtn) pdfBtn.addEventListener('click', toPDF);

    // Convert Table to JSON (unchanged)
    function toJSON() {
        const tableData = [];
        const headers = Array.from(customersTable.querySelectorAll('th')).map(th => th.textContent.trim().toLowerCase());
        
        customersTable.querySelectorAll('tbody tr').forEach(row => {
            const rowObject = {};
            Array.from(row.querySelectorAll('td')).forEach((cell, index) => {
                const img = cell.querySelector('img');
                if (img) {
                    rowObject['customer image'] = decodeURIComponent(img.src);
                }
                rowObject[headers[index]] = cell.textContent.trim();
            });
            tableData.push(rowObject);
        });

        return JSON.stringify(tableData, null, 4);
    }

    function downloadFile(data, fileType, fileName = '') {
        const a = document.createElement('a');
        a.download = fileName;
        const mimeTypes = {
            'json': 'application/json',
            'csv': 'text/csv',
            'excel': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        };
        a.href = `data:${mimeTypes[fileType]};charset=utf-8,${encodeURIComponent(data)}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    if (jsonBtn) jsonBtn.addEventListener('click', () => {
        const json = toJSON();
        downloadFile(json, 'json');
    });

    // Convert Table to CSV (unchanged)
    function toCSV() {
        const headings = Array.from(customersTable.querySelectorAll('th')).map(th => th.textContent.trim().toLowerCase()).join(',') + ',image';
        const rows = Array.from(customersTable.querySelectorAll('tbody tr')).map(row => {
            const cells = Array.from(row.querySelectorAll('td'));
            const img = row.querySelector('img') ? decodeURIComponent(row.querySelector('img').src) : '';
            return cells.map(cell => cell.textContent.trim().replace(/,/g, '.')).join(',') + ',' + img;
        }).join('\n');

        return `${headings}\n${rows}`;
    }

    if (csvBtn) csvBtn.addEventListener('click', () => {
        const csv = toCSV();
        downloadFile(csv, 'csv', 'customer-orders');
    });

    // Convert Table to Excel (unchanged)
    function toExcel() {
        const headings = Array.from(customersTable.querySelectorAll('th')).map(th => th.textContent.trim().toLowerCase()).join('\t') + '\timage';
        const rows = Array.from(customersTable.querySelectorAll('tbody tr')).map(row => {
            const cells = Array.from(row.querySelectorAll('td'));
            const img = row.querySelector('img') ? decodeURIComponent(row.querySelector('img').src) : '';
            return cells.map(cell => cell.textContent.trim()).join('\t') + '\t' + img;
        }).join('\n');

        return `${headings}\n${rows}`;
    }

    if (excelBtn) excelBtn.addEventListener('click', () => {
        const excel = toExcel();
        downloadFile(excel, 'excel', 'customer-orders');
    });
});
