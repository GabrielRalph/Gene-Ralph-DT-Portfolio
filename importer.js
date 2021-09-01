let error = "";

async function getText(url){
    let res = await fetch(url);
    if (res.ok) {
      return await res.text();
    }else {
      error = res.statusText;
      return null
    }
}

async function loadText(textBox, name, folder_name){
  let text = await getText(folder_name + name + ".txt");
  if (text != null) {
    textBox.innerHTML = text;
  } else {
    alert(`text box "${name}" ${error}`);
  }
}

function loadTextBoxes(folder){
  let textBoxes = document.getElementsByClassName("text-box");
  for (let textBox of textBoxes) {

    let fname = textBox.innerHTML;
    fname = fname.replace(/^\s*/, "");
    fname = fname.replace(/\s*$/, "");
    loadText(textBox, fname, folder);
  }
}

function stringToCSVArray(string){
  let lines = string.split(/\r/);
  let csv = [];
  let cols = 0;
  for (let line of lines) {
    let row = line.split(/(?!\B"[^"]*),(?![^"]*"\B)/g);
    let nrow = [];
    for (let el of row) {
      nrow.push(el.replace(/(^")|("$)/g, ""));
    }
    if (nrow.length > cols) cols = nrow.length;
    csv.push(nrow);
  }

  return {csv: csv, cols: cols};
}

async function loadCSV(filepath) {
  let text = await getText(filepath);
  let csv = {csv: [], cols: 0};
  if (text != null) {
    console.log(text);
    csv = stringToCSVArray(text);
  }
  return csv;
}

async function loadTable(tableEl, name, folder_name) {
  let csv = await loadCSV(folder_name + name + ".csv");
  let cols = csv.cols;
  csv = csv.csv;
  let table = ""
  for (let row of csv) {
    table += '<tr>';

    let entry = "";
    let cs = 1;

    let addCell = () => {
      if (cs == 1) {
        table += `<td>${entry}</td>`
      } else {
        table += `<td class = "cs${cs}" colspan = '${cs}'>${entry}</td>`
      }
    }

    for (let cell of row) {
      if (entry == "") {
        entry = cell;
      } else {
        if (cell == "") {
          cs ++;
        }else {
          addCell();
          entry = cell;
          cs = 1;
        }
      }
    }
    addCell();
    table += '</tr>'
  }

  tableEl.innerHTML = table;

}

function loadTables(folder) {
  let tables = document.getElementsByTagName("TABLE");
  // console.log(tables);
  for (let table of tables) {
    console.log(table);
    let name = table.getAttribute("name");
    name = name.replace(/^\s*/, "");
    name = name.replace(/\s*$/, "");
    loadTable(table, name, folder);
  }
}

export {loadTextBoxes, loadTable, loadTables}
