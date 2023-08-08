const plusCard = document.querySelector('#plusCard');
const popupContainer = document.querySelector('#popup-container');
const saveBtn = document.querySelector('#save-btn');
const closeModalButton = document.querySelector('#close-modal');
const darkModeBtn = document.querySelector('#darkModeBtn');
const cardsContainer = document.querySelector('#cards-container');

plusCard.addEventListener('click', () => {
  popupContainer.classList.remove('hidden');
  document.querySelector('#modal-title').textContent = 'Add';
  saveBtn.dataset.mode = 'add';
  document.querySelector('#title').value = '';
  document.querySelector('#description').value = '';
});

saveBtn.addEventListener('click', () => {
  const title = document.querySelector('#title').value;
  const description = document.querySelector('#description').value;
  const isDarkMode = document.body.classList.contains('dark');

  if (title && description) {
    if (saveBtn.dataset.mode === 'add') {
      const card = createCard(title, description, isDarkMode);
      cardsContainer.appendChild(card);
    } else if (saveBtn.dataset.mode === 'edit') {
      const editedCardId = saveBtn.dataset.card;
      const editedCard = document.querySelector(
        `[data-card-id="${editedCardId}"]`
      );
      editCard(editedCard, title, description, isDarkMode);
    }
    updateLocalStorage(); 
    popupContainer.classList.add('hidden');
  }
});

closeModalButton.addEventListener('click', () => {
  popupContainer.classList.add('hidden');
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    popupContainer.classList.add('hidden');
  }
});

const createCard = (title, description, isDarkMode) => {
  const card = document.createElement('div');
  card.className = 'bg-white dark:bg-zinc-200 p-4 rounded-md shadow-md';
  card.setAttribute('data-card-id', Date.now());

  const titleElement = document.createElement('h2');
  titleElement.className =
    'text-lg font-bold text-zinc-500 mb-2 truncate';
  titleElement.textContent = title;

  const descriptionElement = document.createElement('p');
  descriptionElement.className = 'text-zinc-400 truncate';
  descriptionElement.textContent = description;

  const editButton = document.createElement('button');
  editButton.className =
    'bg-blue-500 text-white px-2 py-1 mt-4 rounded-md mr-2';
  const editIcon = document.createElement('span');
  editIcon.className = 'iconify';
  editIcon.setAttribute('data-icon', 'eva:edit-2-outline');
  editIcon.setAttribute('data-inline', 'false');
  editButton.appendChild(editIcon);
  editButton.addEventListener('click', () => {
    openEditModal(title, description, card);
  });

  const removeButton = document.createElement('button');
  removeButton.className = 'bg-red-500 text-white px-2 py-1 mt-4 rounded-md';
  const removeIcon = document.createElement('span');
  removeIcon.className = 'iconify';
  removeIcon.setAttribute('data-icon', 'ic:baseline-delete');
  removeIcon.setAttribute('data-inline', 'false');
  removeButton.appendChild(removeIcon);
  removeButton.addEventListener('click', () => {
    openDeleteConfirmationModal(title, card);
  });

  card.appendChild(titleElement);
  card.appendChild(descriptionElement);
  card.appendChild(editButton);
  card.appendChild(removeButton);

  return card;
}

const editCard = (card, newTitle, newDescription, isDarkMode) => {
  const titleElement = card.querySelector('h2');
  const descriptionElement = card.querySelector('p');
  titleElement.textContent = newTitle;
  descriptionElement.textContent = newDescription;
  card.classList.toggle('dark:bg-gray-900', isDarkMode);
}

const openEditModal = (title, description, card) => {
  popupContainer.classList.remove('hidden');
  document.querySelector('#title').value = title;
  document.querySelector('#description').value = description;
  document.querySelector('#modal-title').textContent = 'Edit';
  saveBtn.dataset.mode = 'edit';
  saveBtn.dataset.card = card.getAttribute('data-card-id');
}

const openDeleteConfirmationModal = (title, card) => {
  const confirm = window.confirm(`Do you want to delete the note "${title}"?`);
  if (confirm) {
    card.remove();
    updateLocalStorage();
  }
}

const updateLocalStorage = () => {
  const notes = [];
  const cards = cardsContainer.querySelectorAll('[data-card-id]');
  cards.forEach((card) => {
    const titleElement = card.querySelector('h2');
    const descriptionElement = card.querySelector('p');
    const isDarkMode = card.classList.contains('dark:bg-gray-900');
    const note = {
      title: titleElement.textContent,
      description: descriptionElement.textContent,
      isDarkMode: isDarkMode,
    };
    notes.push(note);
  });
  localStorage.setItem('notes', JSON.stringify(notes));

  const isDarkMode = document.body.classList.contains('dark');
  localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
}

window.addEventListener('load', () => {
  const isDarkMode = JSON.parse(localStorage.getItem('darkMode')) || false;
  if (isDarkMode) {
    document.body.classList.add('dark');
    const lightIcon = document.querySelector('#lightIcon');
    lightIcon.classList.add('hidden');
  }
  const existingNotes = JSON.parse(localStorage.getItem('notes')) || [];
  existingNotes.forEach((note) => {
    const card = createCard(note.title, note.description, note.isDarkMode);
    cardsContainer.appendChild(card);
  });
});

darkModeBtn.addEventListener('click', () => {
  const body = document.body;
  body.classList.toggle('dark');
  const isDarkMode = body.classList.contains('dark');
  saveToLocalStorage(null, null, isDarkMode);
  const lightIcon = document.querySelector('#lightIcon');
  lightIcon.classList.toggle('hidden');
});

const saveToLocalStorage = (title, description, isDarkMode) => {
  const existingNotes = JSON.parse(localStorage.getItem('notes')) || [];
  if (title && description) {
    existingNotes.push({ title, description, isDarkMode });
    localStorage.setItem('notes', JSON.stringify(existingNotes));
    return;
  } 
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
}
