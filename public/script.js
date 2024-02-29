// script.js
document.addEventListener("DOMContentLoaded", async function () {
  await filterNamesByDirection(); // Это заполнит nameSelector при загрузке

  document
    .getElementById("scategory")
    .addEventListener("change", filterNamesByDirection);
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
  const selectedCategory = document.getElementById("scategory").value;
  const items = await fetchJsonData();
  const nameSelector = document.getElementById("nameSelector");
  nameSelector.innerHTML = ""; // Очистка текущих опций

  // Сначала фильтруем по Розряду
  let filteredByCategory = items.filter((item) => {
    return selectedCategory ? item.scategory === selectedCategory : true;
  });

  // Затем фильтруем отфильтрованные элементы по Напрямку
  let filteredItems = filteredByCategory.filter((item) => {
    switch (selectedDirection) {
      case "id1": // Пілон
        return item.id >= 1 && item.id <= 25;
      case "id2": // Кільце
        return item.id >= 26 && item.id <= 45;
      case "id3": // Полотна
        return item.id >= 46 && item.id <= 65;
      default:
        return true; // Если направление не выбрано, не применяем фильтр по направлению
    }
  });

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
