export function generateStyledTable(dataObject) {
  let html = `
    <table style="border-collapse: collapse; width: 100%; margin-top: 20px; font-family: Arial, sans-serif;">
      <thead>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Property</th>
          <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Value</th>
        </tr>
      </thead>
      <tbody>
  `;

  // Add properties to the table
  for (let prop in dataObject.propiedades) {
    html += `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${prop}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${dataObject.propiedades[prop]}</td>
      </tr>
    `;
  }

  // Add units to the table
  html += `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${dataObject.datos.unidades}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">&nbsp;</td>
      </tr>
  `;

  // Add nested table for "valores"
  html += `
      <tr>
        <td colspan="2" style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Values</td>
      </tr>
      <tr>
        <td colspan="2" style="padding: 8px;">
          <table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
            <thead>
              <tr>
  `;

  // Add headers dynamically based on properties under "valores"
  for (let prop in dataObject.datos.valores) {
    html += `<th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">${prop}</th>`;
  }

  html += `
              </tr>
            </thead>
            <tbody>
  `;

  // Add values to the nested table
  for (let i = 0; i < dataObject.datos.valores.hora.length; i++) {
    html += "<tr>";
    for (let prop in dataObject.datos.valores) {
      html += `<td style="border: 1px solid #ddd; padding: 8px; vertical-align: top;">${dataObject.datos.valores[prop][i]}</td>`;
    }
    html += "</tr>";
  }

  // Close the nested table and outer table
  html += `
            </tbody>
          </table>
        </td>
      </tr>
      </tbody>
    </table>
  `;

  return html;
}

export function objetoATablaVertical(objeto) {
  // Create table element
  var table = document.createElement("table");

  // Add a class for styling
  table.classList.add("styled-table");

  // Create style tag
  var style = document.createElement("style");
  style.innerHTML = `
      .styled-table {
        border-collapse: collapse;
        width: 100%;
      }
  
      .styled-table td, .styled-table th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
      }
  
      .styled-table th {
        background-color: #f2f2f2;
        vertical-align: top; /* Align header cells at the top */
      }
  
      .styled-table td {
        vertical-align: top; /* Align content cells at the top */
      }
    `;

  // Append style tag to the head of the document
  document.head.appendChild(style);

  // Create data rows
  var tbody = table.createTBody();

  // Recursive function to process each key-value pair
  function processKeyValue(key, value) {
    var row = tbody.insertRow();

    var keyCell = row.insertCell();
    keyCell.textContent = key;

    var valueCell = row.insertCell();

    // Check if the value is an object and recursively create a table
    if (typeof value === "object" && value !== null) {
      valueCell.innerHTML = objetoATablaVertical(value);
    } else {
      valueCell.textContent = value;
    }
  }

  // Iterate over object properties
  for (var key in objeto) {
    var value = objeto[key];

    // Process each key-value pair
    processKeyValue(key, value);
  }

  return table.outerHTML;
}

// CUTRE....
export function objetoATablaHorizontal(objeto) {
  // Create table element
  var table = document.createElement("table");

  // Create data rows
  var tbody = table.createTBody();

  // Iterate over object properties
  for (var key in objeto) {
    var value = objeto[key];

    // Create a new row for each key-value pair
    var row = tbody.insertRow();

    // Create a cell for the key (name of the item)
    var keyCell = row.insertCell();
    keyCell.textContent = key;

    // Create a cell for the value and display it horizontally
    var valueCell = row.insertCell();
    valueCell.innerHTML =
      typeof value === "object" && value !== null
        ? objetoATablaHorizontal(value) // Recursively create a new table for objects
        : value;
  }

  return table.outerHTML;
}

// Muestra objetos
export function objetoDatosATabla(weatherData) {
  // Extracting data labels from the object
  const dataLabels = Object.keys(weatherData);

  // Creating the HTML table header
  let htmlTable =
    "<table class='styled-table'><tr><th>" +
    dataLabels.join("</th><th>") +
    "</th></tr>";

  // Extracting data and creating table rows
  for (let i = 0; i < weatherData[dataLabels[0]].length; i++) {
    const rowData = dataLabels.map((label) => weatherData[label][i]);
    htmlTable += "<tr><td>" + rowData.join("</td><td>") + "</td></tr>";
  }

  htmlTable += "</table>";

  // Create style tag
  var style = document.createElement("style");
  style.innerHTML = `
      .styled-table {
        border-collapse: collapse;
        width: 100%;
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
      }
  
      .styled-table th {
        background-color: #f2f2f2;
      }
    `;

  // Append style tag to the head of the document
  document.head.appendChild(style);

  return htmlTable;
}
