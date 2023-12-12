const faker = require('faker');


function regenerateTable() {
    const region = document.getElementById('region').value;
    const errorCount = document.getElementById('errorCount').value;
    const seed = document.getElementById('seed').value;
    tableData = generateTable(region, errorCount, seed);
    currentPage = 1;
    renderTable();
}
function generateRandomSeed() {
    const seedInput = document.getElementById('seed');
    seedInput.value = Math.floor(Math.random() * 1000);
    regenerateTable();
}
function updateInputValue(value) {
    document.getElementById("errorCountInput").value = value;
    regenerateTable()
}
    let currentPage = 1;
    const pageSize = 20;
    let tableData = [];

    document.getElementById('regenerate').addEventListener('click', function() {
      const region = document.getElementById('region').value;
      const errorCount = parseInt(document.getElementById('errorCount').value);
      const seed = document.getElementById('seed').value;

      tableData = generateTable(region, errorCount, seed);
      currentPage = 1;
      renderTable();
    });

    document.getElementById('randomSeed').addEventListener('click', function() {
      const seedInput = document.getElementById('seed');
      seedInput.value = Math.floor(Math.random() * 1000);
    });

    function generateTable(region, errorCount, seed) {
      const data = [];
      for (let i = 0; i < pageSize * currentPage; i++) {
        const row = {
          'Номер': faker.random.number(),
          'Случайный идентификатор': faker.random.uuid(),
          'ФИО': generateName(region),
          'Адрес': generateAddress(region),
          'Телефон': generatePhoneNumber(region),
        };

        if (i < pageSize * currentPage - errorCount) {
          data.push(row);
        } else {
          if(region=='США'){
            const errorRow = {
            'Номер': generateInvalidData('number'),
            'Случайный идентификатор': generateInvalidData('uuid'),
            'ФИО': generateInvalidData('name'),
            'Адрес': generateInvalidData('address'),
            'Телефон': generateInvalidData('phone'),
          };
          data.push(errorRow);
          }else{
            const errorRow = {
            'Номер': generateInvalidDataSHA('number'),
            'Случайный идентификатор': generateInvalidDataSHA('uuid'),
            'ФИО': generateInvalidDataSHA('name'),
            'Адрес': generateInvalidDataSHA('address'),
            'Телефон': generateInvalidDataSHA('phone'),
          };
          data.push(errorRow);
          }
          
        }
      }
      return data;
    }

    function generateInvalidData(type) {
      switch (type) {
        case 'number':
          return faker.random.number();
        case 'uuid':
          return faker.random.uuid();
        case 'name':
          return generateName('Беларусь');
        case 'address':
          return generateAddress('Беларусь');
        case 'phone':
          return generatePhoneNumber('Беларусь');
      }
    }

    function generateInvalidDataSHA(type) {
      switch (type) {
        case 'number':
          return faker.random.number();
        case 'uuid':
          return faker.random.uuid();
        case 'name':
          return generateName('США');
        case 'address':
          return generateAddress('США');
        case 'phone':
          return generatePhoneNumber('США');
      }
    }

    function generateName(region) {
      switch (region) {
        case 'США':
          faker.setLocale('en');
          return faker.name.findName();
        case 'Польша':
          faker.setLocale('pl');
          return faker.name.findName();
        case 'Беларусь':
          faker.setLocale('ru');
          return faker.name.findName();
        default:
          return faker.name.findName();
    }
  }

    function generateAddress(region) {
        switch (region) {
            case 'США':
                faker.setLocale('en');
                return faker.address.streetAddress();
            case 'Польша':
                faker.setLocale('pl');
                return faker.address.streetAddress();
            case 'Беларусь':
                faker.setLocale('ru');
                return faker.address.streetAddress();
            default:
                return faker.address.streetAddress();
        }
    }

    function generatePhoneNumber(region) {
        switch (region) {
            case 'США':
                return formatPhoneNumber(faker.phone.phoneNumber('##########'), '1-###-###-####');
            case 'Польша':
                return formatPhoneNumber(faker.phone.phoneNumber('#########'), '## ### ## ##');
            case 'Беларусь':
                return formatPhoneNumber(faker.phone.phoneNumber('#########'), '+375 29 ###-##-##');
            default:
                return faker.phone.phoneNumber();
        }
    }

    function formatPhoneNumber(phoneNumber, format) {
        const digits = phoneNumber.replace(/\D/g, '');
        let formattedNumber = '';
        let digitIndex = 0;

        for (let i = 0; i < format.length; i++) {
            if (format[i] === '#') {
                formattedNumber += digits[digitIndex] || '';
                digitIndex++;
            } else {
                formattedNumber += format[i];
            }
        }

        return formattedNumber;
    }

    function renderTable() {
        const tableElement = document.getElementById('table');
        tableElement.innerHTML = '';

        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        const headerRow = document.createElement('tr');
        for (const key in tableData[0]) {
            const th = document.createElement('th');
            th.textContent = key;
            headerRow.appendChild(th);
        }
        thead.appendChild(headerRow);

        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = currentPage * pageSize;

        for (let i = startIndex; i < endIndex; i++) {
            if (i >= tableData.length) {
                break;
            }
            const rowData = tableData[i];
            const row = document.createElement('tr');
            for (const key in rowData) {
                const cell = document.createElement('td');
                cell.textContent = rowData[key];
                row.appendChild(cell);
            }
            tbody.appendChild(row);
        }

        tableElement.appendChild(thead);
        tableElement.appendChild(tbody);

        window.addEventListener('scroll', loadMoreData);
    }

    function loadMoreData() {
    const tableElement = document.getElementById('table');
    const windowBottom = window.pageYOffset + window.innerHeight;
    const tableBottom = tableElement.offsetTop + tableElement.scrollHeight;

    if (windowBottom >= tableBottom) {
        currentPage += 10;
        renderTable();
    }
  }