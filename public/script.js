// script.js
document.addEventListener("DOMContentLoaded", async function () {
  await filterNamesByDirection(); // Это заполнит nameSelector при загрузке
  document
    .getElementById("direction")
    .addEventListener("change", filterNamesByDirection);
});

async function fetchJsonData() {
  const response = await fetch("/data.json");
  return await response.json();
}

// Фильтрация и обновление списка nameSelector на основе выбранного направления
async function filterNamesByDirection() {
  const selectedDirection = document.getElementById("direction").value;
  const items = await fetchJsonData();
  const nameSelector = document.getElementById("nameSelector");
  nameSelector.innerHTML = ""; // Очистка текущих опций

  let filteredItems;
  // Определите промежутки ID для каждого направления
  switch (selectedDirection) {
    case "id1": // Пілон
      filteredItems = items.filter((item) => item.id >= 1 && item.id <= 25);
      break;
    case "id2": // Кільце
      filteredItems = items.filter((item) => item.id >= 26 && item.id <= 44);
      break;
    case "id3": // Полотна
      filteredItems = items.filter((item) => item.id >= 45 && item.id <= 64);
      break;
    default:
      console.error("Невідомий напрямок:", selectedDirection);
      return;
  }

  // Заполнение выпадающего списка отфильтрованными позициями
  filteredItems.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.name;
    option.textContent = item.code; // Используйте поле, которое вы хотите отобразить
    nameSelector.appendChild(option);
  });
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
      const newRow = tableBody.insertRow();

      addCell(newRow, tableBody.rows.length); // Номер строки
      addCell(newRow, item.code); // Код
      addCell(newRow, item.name); // Имя
      addCellWithImage(newRow, item.image); // Изображение
      addCell(newRow, item.tValue); // Тех цінність
      addCell(newRow, item.description.join(" "), true); // Описание с HTML
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
  imgElement.style.width = "150px"; // Установите желаемый размер изображения
  cellImage.appendChild(imgElement);
}

function removeLastRow() {
  const tableBody = document
    .getElementById("myTable")
    .getElementsByTagName("tbody")[0];
  if (tableBody.rows.length > 0) {
    tableBody.deleteRow(-1); // Удаляет последнюю строку таблицы
  } else {
    alert("В таблице нет строк для удаления.");
  }
}
