document.addEventListener('DOMContentLoaded', function () {
    // Page Transition
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
        tableRows.forEach((row, i) => {
            const tableData = row.textContent.toLowerCase();
            const searchData = search.value.toLowerCase();
            row.classList.toggle('hide', tableData.indexOf(searchData) < 0);
            row.style.setProperty('--delay', i / 25 + 's');
        });

        document.querySelectorAll('tbody tr:not(.hide)').forEach((visibleRow, i) => {
            visibleRow.style.backgroundColor = (i % 2 === 0) ? 'transparent' : '#0000000b';
        });
    }

    search.addEventListener('input', searchTable);

    // Sorting Table
    function sortTable(column, sortAsc) {
        [...tableRows].sort((a, b) => {
            const firstRow = a.querySelectorAll('td')[column].textContent.toLowerCase();
            const secondRow = b.querySelectorAll('td')[column].textContent.toLowerCase();
            return sortAsc ? (firstRow < secondRow ? 1 : -1) : (firstRow < secondRow ? -1 : 1);
        }).forEach(sortedRow => document.querySelector('tbody').appendChild(sortedRow));
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

    // Convert Table to PDF
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

    // Convert Table to JSON
    function toJSON() {
        const tableData = [];
        const tHeadings = customersTable.querySelectorAll('th');
        const tRows = customersTable.querySelectorAll('tbody tr');
        const headers = Array.from(tHeadings).map(th => th.textContent.trim().split(' ').slice(0, -1).join(' ').toLowerCase());

        tRows.forEach(row => {
            const rowObject = {};
            row.querySelectorAll('td').forEach((cell, index) => {
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

    // Convert Table to CSV
    function toCSV() {
        const tHeads = customersTable.querySelectorAll('th');
        const tbodyRows = customersTable.querySelectorAll('tbody tr');
        const headings = Array.from(tHeads).map(th => th.textContent.trim().split(' ').slice(0, -1).join(' ').toLowerCase()).join(',') + ',image name';
        const tableData = Array.from(tbodyRows).map(row => {
            const cells = row.querySelectorAll('td');
            const img = decodeURIComponent(row.querySelector('img').src);
            const dataWithoutImg = Array.from(cells).map(cell => cell.textContent.replace(/,/g, ".").trim()).join(',');
            return `${dataWithoutImg},${img}`;
        }).join('\n');
        return `${headings}\n${tableData}`;
    }

    if (csvBtn) csvBtn.addEventListener('click', () => {
        const csv = toCSV();
        downloadFile(csv, 'csv', 'customer orders');
    });

    // Convert Table to Excel
    function toExcel() {
        const tHeads = customersTable.querySelectorAll('th');
        const tbodyRows = customersTable.querySelectorAll('tbody tr');
        const headings = Array.from(tHeads).map(th => th.textContent.trim().split(' ').slice(0, -1).join(' ').toLowerCase()).join('\t') + '\timage name';
        const tableData = Array.from(tbodyRows).map(row => {
            const cells = row.querySelectorAll('td');
            const img = decodeURIComponent(row.querySelector('img').src);
            const dataWithoutImg = Array.from(cells).map(cell => cell.textContent.trim()).join('\t');
            return `${dataWithoutImg}\t${img}`;
        }).join('\n');
        return `${headings}\n${tableData}`;
    }

    if (excelBtn) excelBtn.addEventListener('click', () => {
        const excel = toExcel();
        downloadFile(excel, 'excel');
    });
});
