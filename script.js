const cardsContainer = document.querySelector('.places-list');
const itemTemplate = document.querySelector('.item_template').content;
const popupWindowCard = document.querySelector('.popup_card');
const popupWindowProfile = document.querySelector('.popup_profile');
const popupWindowImage = document.querySelector('.popup_image');
const openFormAdd = document.querySelector('.user-info__button_add');
const openFormEdit = document.querySelector('.user-info__button_edit');
const closeFormAdd = document.querySelector('.popup__close_card');
const closeFormEdit = document.querySelector('.popup__close_profile');
const closeFormImage = document.querySelector('.popup__close_image');
const popupButton = document.querySelector('.popup__button');



//Создаем карточку
function createCard(name, link) { 
  const card = itemTemplate.cloneNode(true);
  const cardName = card.querySelector('.place-card__name');
  const cardImage = card.querySelector('.place-card__image');
  cardName.textContent = name;
  cardImage.style.backgroundImage = `url(${link})`;
  addEventListeners(card);
  return card;
};

function likeCard(event) {
  event.target.classList.toggle('place-card__like-icon_liked');
};

function deleteCard(event) {
  event.target.closest('.place-card').remove();
};

function addEventListeners(card) {
  card.querySelector('.place-card__like-icon').addEventListener('click', likeCard);
  card.querySelector('.place-card__delete-icon').addEventListener('click', deleteCard);
  card.querySelector('.place-card__image').addEventListener('click', openImage);
};

function openImage(event) {
  if (event.target.closest('.place-card__image')){
  const formImage = document.querySelector('.popup__content_image');
  formImage.style = event.target.getAttribute('style');
  togglePopupWindowImage();
  }
};

//Добавление в контейнер
function renderCard(card) {
  cardsContainer.appendChild(card);
};

//Проходим функцией по массиву карточек
initialCards.forEach(function(item) { 
  renderCard(createCard(item.name, item.link));
});

// Открываем и закрываем формы
function togglePopupWindowCard() {
  popupWindowCard.classList.toggle('popup_is-opened');
};

function removePopupWindowCard() {
  popupWindowCard.classList.remove('popup_is-opened');
};

function togglePopupWindowProfile() {
  popupWindowProfile.classList.toggle('popup_is-opened');
};

function removePopupWindowProfile() {
  popupWindowProfile.classList.remove('popup_is-opened');
};

function togglePopupWindowImage() {
  popupWindowImage.classList.toggle('popup_is-opened');
};

function removePopupWindowImage() {
  popupWindowImage.classList.remove('popup_is-opened');
};

openFormAdd.addEventListener('click', togglePopupWindowCard);
openFormEdit.addEventListener('click', togglePopupWindowProfile);

closeFormAdd.addEventListener('click', removePopupWindowCard);
closeFormEdit.addEventListener('click', removePopupWindowProfile);
closeFormImage.addEventListener('click', removePopupWindowImage);


const formNew = document.forms.new;
const formProfile = document.forms.profile;

const errorMessages = {
  empty: 'Это обязательное поле',
  wrongLength: 'Должно быть от 2 до 30 символов',
  wrongUrl: 'Здесь должна быть ссылка',    
}

//Функция проверки поля на ошибки
function isValidate(input) {

  input.setCustomValidity(""); 

  if (input.validity.valueMissing) {
      input.setCustomValidity(errorMessages.empty);
    return false
  }  
   if (input.validity.tooShort || input.validity.tooLong) {
    input.setCustomValidity(errorMessages.wrongLength);
    return false
  } 
  if (input.validity.typeMismatch && input.type === 'url') {
    input.setCustomValidity(errorMessages.wrongUrl);
    return false
  } 
  if (input.validity.rangeOverflow) {
    let max = input.getAttribute('max');
    input.setCustomValidity(`Максимальное значение ${max}`);
    return false
  }
  return input.checkValidity();
}

//Функция добавления/удаления ошибки с input
function isFieldValid(input) { 
  console.log(input.validity);
  const errorElem = input.parentNode.querySelector(`#${input.id}-error`);
  const valid = isValidate(input);
  errorElem.textContent = input.validationMessage;
  return valid;
};

//Функция проверки формы на валидность
function isFormValid(event) {
  event.preventDefault();
  const inputs = [...event.currentTarget.querySelectorAll('input')];
  let valid = true;

  inputs.forEach((input) => {
    if (input.type !== 'submit' && input.type !== 'button') {
      if (!isFieldValid(input)) valid = false;
    }
  });
  return valid;
}

//Функции активации и деактивации кнопки
function setSubmitButtonState(button, state) {
  if (state) {
      button.removeAttribute('disabled');
      button.classList.remove(`popup__button_invalid`);
  } else {
      button.setAttribute('disabled', true);
      button.classList.add(`popup__button_invalid`);
  }
}

//Функция слушателя события на input 
function handlerInputForm(event){
  const submit = event.currentTarget.querySelector('.button');
  const [...inputs] = event.currentTarget.querySelectorAll('input') ;   
  isFieldValid(event.target);

  if (inputs.every(isValidate)) {
    setSubmitButtonState(submit, true);
  } else {
    setSubmitButtonState(submit, false);
  }
  if (isFieldValid(name) && isFieldValid(link)) {
    setSubmitButtonState(submit, true);
  } else {
    setSubmitButtonState(submit, false);
  }   
}

//Запись новой карточки
function addCard(event) {
  event.preventDefault();
  const currentForm = event.target;
  const isValid = isFormValid(currentForm);
  if (isValid) {
  const name = document.querySelector('.popup__input_type_name');
  const link = document.querySelector('.popup__input_type_link-url'); 
  const card = createCard(name.value, link.value);
  addEventListeners(card);
  renderCard(card);
  togglePopupWindowCard();
  removePopupWindowCard();
  formNew.reset(); 
  console.log('Форма успешно добавлена!');
  event.target.reset();
} else {
  console.log('Форма не прошла валидацию'); 
    }
};

formNew.addEventListener('submit', addCard);
formNew.addEventListener('input', handlerInputForm, true);

//Редактирвоание профиля
function editFormProfile(event) {
  event.preventDefault();
  const name = formProfile.elements.name;
  const aboutMe = formProfile.elements.aboutMe;  
  document.querySelector('.user-info__name').textContent = name.value;
  document.querySelector('.user-info__job').textContent = aboutMe.value;
  togglePopupWindowProfile();
  removePopupWindowProfile();
}

formProfile.addEventListener('submit', editFormProfile);
formProfile.addEventListener('input', handlerInputForm, true);
