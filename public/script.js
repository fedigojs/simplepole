// script.js
document.addEventListener("DOMContentLoaded", initializeNameSelector);

async function fetchJsonData() {
  const response = await fetch("/data.json");
  return await response.json();
}

async function initializeNameSelector() {
  try {
    const items = await fetchJsonData();
    const nameSelector = document.getElementById("nameSelector");

    // Очистка текущих опций
    nameSelector.innerHTML = "";

    // Заполнение выпадающего списка именами из JSON
    items.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.name;
      option.textContent = item.name;
      nameSelector.appendChild(option);
    });
  } catch (error) {
    console.error("Ошибка при инициализации селектора имен:", error);
  }
}

async function addRowBySelectedName() {
  try {
    const selectedName = document.getElementById("nameSelector").value;
    const items = await fetchJsonData();
    const item = items.find((i) => i.name === selectedName);

    if (item) {
      const tableBody = document
        .getElementById("myTable")
        .getElementsByTagName("tbody")[0];
      const rowIndex = tableBody.rows.length + 1; // Получение порядкового номера строки
      const newRow = tableBody.insertRow();

      addCell(newRow, rowIndex); // Здесь мы добавляем порядковый номер строки
      addCell(newRow, item.name);
      //   addCell(newRow, item.tvalue);
      addCellWithImage(newRow, item.image);
      addCell(newRow, item.description, true); // Предполагаем, что описание содержит HTML
    } else {
      alert("Выбранный элемент не найден в данных.");
    }
  } catch (error) {
    console.error("Ошибка при добавлении строки:", error);
  }
}

function addCell(row, text, isHtml = false) {
  const newCell = row.insertCell();
  if (isHtml) {
    newCell.innerHTML = text;
  } else {
    newCell.textContent = text;
  }
}

function addCellWithImage(row, imagePath) {
  const cellImage = row.insertCell();
  const imgElement = document.createElement("img");
  imgElement.src = imagePath;
  imgElement.alt = "Image";
  imgElement.style.width = "100px"; // Установите желаемый размер изображения
  cellImage.appendChild(imgElement);
}

async function generatePDF() {
  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();
  doc.text("Информация:", 10, 10);

  // Добавление информации о Name, Division, Category
  doc.text(
    `Name: ${document.getElementById("name").textContent || ""}`,
    10,
    20
  );
  doc.text(
    `Division: ${document.getElementById("division").textContent || ""}`,
    10,
    30
  );
  doc.text(
    `Category: ${document.getElementById("category").textContent || ""}`,
    10,
    40
  );

  // Теперь добавим таблицу
  // Заметьте: Для сложных таблиц с библиотекой jsPDF может потребоваться использовать плагин 'autotable'
  // Если у вас сложная таблица с множеством столбцов или стилей, рассмотрите использование autotable

  // Простой способ добавления таблицы - это ручное добавление каждой ячейки
  const table = document.getElementById("myTable");
  const headers = Array.from(table.querySelectorAll("th")).map(
    (th) => th.textContent
  );
  const rows = Array.from(table.querySelectorAll("tbody tr")).map((tr) =>
    Array.from(tr.querySelectorAll("td")).map((td) => td.textContent)
  );

  // Добавление заголовков таблицы
  doc.text(headers.join(" "), 10, 50);

  // Добавление строк таблицы
  rows.forEach((row, i) => {
    doc.text(row.join(" "), 10, 60 + i * 10);
  });

  // Сохранение документа
  doc.save("document.pdf");
}
