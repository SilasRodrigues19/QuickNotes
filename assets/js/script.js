const plusCard = document.querySelector('#plusCard');
const popupContainer = document.querySelector('#popup-container');
const saveBtn = document.querySelector('#save-btn');
const closeModalButton = document.querySelectorAll('.close-modal');
const darkModeBtn = document.querySelector('#darkModeBtn');
const cardsContainer = document.querySelector('#cards-container');
const modalTitle = document.querySelector('#modal-title');
const noteTitle = document.querySelector('#title');
const noteDescription = document.querySelector('#description');

const showFeedback = () => {
  const feedbackContainer = document.querySelector('#feedback-container');
  const feedbackDuration = 3000;
  const feedbackHideDuration = 5000;

  feedbackContainer.classList.remove('left-[-100%]');
  feedbackContainer.classList.add('left-5');

  setTimeout(() => {
    feedbackContainer.classList.remove('left-5');
    feedbackContainer.classList.add('left-[-100%]');

    setTimeout(() => {
      feedbackContainer.classList.add('hidden');
    }, feedbackHideDuration);
  }, feedbackDuration);
}


plusCard.addEventListener('click', () => {
  popupContainer.classList.remove('hidden');
  modalTitle.textContent = 'Add your note';
  saveBtn.dataset.mode = 'add';
  noteTitle.value = '';
  noteDescription.value = '';
});

saveBtn.addEventListener('click', () => {
  const title = noteTitle.value;
  const description = noteDescription.value;

  if (title && description) {
    if (saveBtn.dataset.mode === 'add') {
      const card = createCard(title, description);
      cardsContainer.appendChild(card);
      showFeedback();
    } else if (saveBtn.dataset.mode === 'edit') {
      const editedCardId = saveBtn.dataset.card;
      const editedCard = document.querySelector(
        `[data-card-id="${editedCardId}"]`
      );
      editCard(editedCard, title, description);
    }
    updateLocalStorage(); 
    popupContainer.classList.add('hidden');
    return
  } 

  if(noteTitle.value.trim() === '') noteTitle.focus();

});

closeModalButton.forEach((close) => {
  close.addEventListener('click', () => {
    popupContainer.classList.add('hidden');
  });
})


document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    popupContainer.classList.add('hidden');
  }
});

const createCard = (title, description) => {
  const card = document.createElement('div');
  card.className =
    'bg-primary-light dark:bg-primary-dark p-4 rounded-md rounded-md shadow-md hover:shadow-lg cursor-pointer';
  card.setAttribute('data-card-id', Date.now());

  card.addEventListener('click', () => openEditModal(title, description, card));

  const titleElement = document.createElement('h2');
  titleElement.className =
    'text-lg font-semibold  text-gray-800 dark:text-gray-200 mb-2 truncate';
  titleElement.textContent = title;

  const descriptionElement = document.createElement('p');
  descriptionElement.className = 'text-gray-600 dark:text-gray-400 truncate';
  descriptionElement.textContent = description;

  const wrapperButtons = document.createElement('div');
  wrapperButtons.className = 'flex items-center gap-2 my-4';
  
  const editButton = document.createElement('button');
  editButton.className =
    'bg-blue-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-blue-600 ring-2 ring-blue-400 outline-none transition-colors';
  const editIcon = document.createElement('span');
  editIcon.className = 'iconify';
  editIcon.setAttribute('data-icon', 'eva:edit-2-outline');
  editIcon.setAttribute('data-inline', 'false');
  editButton.appendChild(editIcon);
  editButton.addEventListener('click', () => {
    openEditModal(title, description, card);
  });

  const removeButton = document.createElement('button');
  removeButton.className =
    'bg-red-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-red-600 ring-2 ring-red-400 outline-none transition-colors';
  const removeIcon = document.createElement('span');
  removeIcon.className = 'iconify';
  removeIcon.setAttribute('data-icon', 'ic:baseline-delete');
  removeIcon.setAttribute('data-inline', 'false');
  removeButton.appendChild(removeIcon);
  removeButton.addEventListener('click', e => {
    e.stopPropagation();
    openDeleteConfirmationModal(title, card);
  });

  card.appendChild(titleElement);
  card.appendChild(descriptionElement);
  card.appendChild(wrapperButtons);
  wrapperButtons.appendChild(editButton);
  wrapperButtons.appendChild(removeButton);

  return card;
}

const editCard = (card, newTitle, newDescription) => {
  const titleElement = card.querySelector('h2');
  const descriptionElement = card.querySelector('p');
  titleElement.textContent = newTitle;
  descriptionElement.textContent = newDescription;
}

const openEditModal = (title, description, card) => {
  popupContainer.classList.remove('hidden');
  noteTitle.value = title;
  noteDescription.value = description;
  modalTitle.textContent = `Editing ${title}`;
  saveBtn.dataset.mode = 'edit';
  saveBtn.dataset.card = card.getAttribute('data-card-id');
}

const openDeleteConfirmationModal = (title, card) => {

  const actionButtons = Swal.mixin({
    customClass: {
      confirmButton:
        'bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded w-full max-w-md',
    },
    buttonsStyling: false,
  });


  Swal.fire({
    title: `Do you want to delete the note "${title}"?`,
    showCancelButton: true,
    confirmButtonColor: '#3b83f6',
    cancelButtonColor: '#ef4444',
    confirmButtonText: 'Yes, delete it',
    cancelButtonText: 'No, cancel',
  }).then((result) => {
    if (result.isConfirmed) {
        actionButtons.fire(
        'Deleted!',
        'Your note has been deleted.',
        'success'
      )
      card.remove();
      updateLocalStorage();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      actionButtons.fire(
        'Cancelled',
        'Your note has not been deleted :)',
        'error'
      );
    }
  });
};


const updateLocalStorage = () => {
  const notes = [];
  const cards = cardsContainer.querySelectorAll('[data-card-id]');
  cards.forEach((card) => {
    const titleElement = card.querySelector('h2');
    const descriptionElement = card.querySelector('p');
    const note = {
      title: titleElement.textContent,
      description: descriptionElement.textContent,
    };
    notes.push(note);
  });
  localStorage.setItem('notes', JSON.stringify(notes));

  const isDarkMode = document.body.classList.contains('dark');
  localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
}

window.addEventListener('load', () => {
  const isDarkMode = JSON.parse(localStorage.getItem('isDarkMode')) || false;
  if (isDarkMode) {
    document.body.classList.add('dark');
    const lightIcon = document.querySelector('#lightIcon');
    lightIcon.classList.add('hidden');
  }
  const existingNotes = JSON.parse(localStorage.getItem('notes')) || [];
  existingNotes.forEach((note) => {
    const card = createCard(note.title, note.description);
    cardsContainer.appendChild(card);
  });
});

darkModeBtn.addEventListener('click', () => {
  const body = document.body;
  body.classList.toggle('dark');
  const isDarkMode = body.classList.contains('dark');
  localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
  const lightIcon = document.querySelector('#lightIcon');
  lightIcon.classList.toggle('hidden');
});

const saveToLocalStorage = (title, description, isDarkMode) => {
  const existingNotes = JSON.parse(localStorage.getItem('notes')) || [];
  if (title && description) {
    existingNotes.push({ title, description });
    localStorage.setItem('notes', JSON.stringify(existingNotes));
    return;
  } 
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
}
