'use strict';

import { ddpClient } from './ddpClient';
import './popup.css';
import moment from 'moment';
import StorageService from './storage';

const localStorage = new StorageService('local');
let isLoopRunning = false;

// ENUMS/DATA ==================================================================================================
const PROJECT_ID = {
  Creaticode: 'PvA6CHha8LShrTgDG',
  Regenesis: 'u2j4cpwNjKXaty6PJ',
  Amili: 'sTjwPvgdeRaygzKMg',
  Chatchilla: 'DhZvmyRsBRgY3z6ew',
  Ticketmaster: 'mv8AK6RsZb6ioTE3z',
  SurveyMaster: 'SoA9iGMgEYqtTY29P',
  WilliamBills: 'mHwHMpSbLMWkY8bEQ',
  HRForte: 'GpEuPumiQTJ6xoftb'
};

const METEOR_USER = 'METEOR_USER';

// UTILS ==================================================================================================
export const getCurrentTab = async () => {
  const tabs = await chrome.tabs.query({
    active: true,
    windowId: chrome.windows.WINDOW_ID_CURRENT,
  });

  return tabs[0];
};

const convertMinutes = (time) =>
  Number(moment(time, 'HH:mm').format('H')) * 60 +
  Number(moment(time, 'HH:mm').format('m'));

const getDescription = async () => {
  const data = await fetch('https://whatthecommit.com/index.txt');
  return data.text();
};

const logout = () => {
  ddpClient.logout();
  localStorage.remove(METEOR_USER);
};

const renderedProject = {};

const renderProjectOptions = (element, key) => {
  if (renderedProject[key]) return;

  renderedProject[key] = true;

  Object.keys(PROJECT_ID).forEach((projectName) => {
    const option = document.createElement('option');
    option.value = PROJECT_ID[projectName];
    option.innerHTML = projectName;

    element.append(option);
  });
};

// MAIN ==================================================================================================
(async function () {
  const projectElement = document.getElementById('projectId');
  const startElement = document.getElementById('start');
  const endElement = document.getElementById('end');
  const start2Element = document.getElementById('start2');
  const end2Element = document.getElementById('end2');
  const issueFormatElement = document.getElementById('issue');
  const issue2FormatElement = document.getElementById('issue2');
  const descriptionElement = document.getElementById('description');
  const description2Element = document.getElementById('description2');
  const dateSelectedElement = document.getElementById('dateSelected');
  const stopButton = document.getElementById('stop');
  const clearButton = document.getElementById('clear-log-button');
  const formError = document.getElementById('form-error');
  const formAutoError = document.getElementById('form-auto-error');
  const login = document.getElementById('login');
  const form = document.getElementById('form');
  const formAuto = document.getElementById('form-auto');
  const content = document.getElementById('content');
  const emailElement = document.getElementById('email');
  const passwordElement = document.getElementById('password');
  const loginButton = document.getElementById('login-button');
  const logoutButton = document.getElementById('logout-button');
  const loginError = document.getElementById('login-error');
  const autoToolButton = document.getElementById('auto-tool');
  const autoProjectElement = document.getElementById('a-projectId');
  const autoStartElement = document.getElementById('a-start');
  const autoEndElement = document.getElementById('a-end');
  const autoStart2Element = document.getElementById('a-start2');
  const autoEnd2Element = document.getElementById('a-end2');
  const autoIssueFormatElement = document.getElementById('a-issue');
  const autoFromElement = document.getElementById('a-from');
  const autoToElement = document.getElementById('a-to');
  const loggerElement = document.getElementById('logger');

  const now = new Date();
  const currentUser = await localStorage.get(METEOR_USER);

  const renderFormValue = () => {
    startElement.value = '09:00';
    endElement.value = '12:00';
    start2Element.value = '14:00';
    end2Element.value = '18:00';
    dateSelectedElement.value = now.toISOString().slice(0, 10);
    descriptionElement.value = '';
    issueFormatElement.value = 'https://github.com/ZigvyCorp/';
    issue2FormatElement.value = 'https://github.com/ZigvyCorp/';
  };

  const renderFormAutoValue = () => {
    autoStartElement.value = '09:00';
    autoEndElement.value = '12:00';
    autoStart2Element.value = '14:00';
    autoEnd2Element.value = '18:00';
    autoFromElement.value = now.toISOString().slice(0, 10);
    autoToElement.value = now.toISOString().slice(0, 10);
    autoIssueFormatElement.value = 'https://github.com/ZigvyCorp/';
  };

  formAuto.style.display = 'none';

  if (currentUser) {
    ddpClient.login({
      user: { email: currentUser.email },
      password: currentUser.password,
    });

    login.style.display = 'none';
  } else {
    content.style.display = 'none';
  }

  // Project
  stopButton.style.display = 'none';
  renderProjectOptions(projectElement, 0);
  renderFormValue();

  loginButton.addEventListener('click', (event) => {
    event.preventDefault();

    const email = emailElement.value;
    const password = passwordElement.value;

    ddpClient
      .login({
        user: { email },
        password,
      })
      .then((user) => {
        console.log(user);
        localStorage.set(METEOR_USER, { email, password });

        login.style.display = 'none';
        content.style.display = 'flex';
      })
      .catch((error) => {
        loginError.innerHTML = error.message;
        console.error('[ERROR] Login:: ', error);
      });
  });

  logoutButton.addEventListener('click', (event) => {
    event.preventDefault();

    logout();
    login.style.display = 'flex';
    content.style.display = 'none';
  });

  autoToolButton.addEventListener('click', (event) => {
    event.preventDefault();

    if (autoToolButton.classList.contains('active')) {
      autoToolButton.classList.remove('active');
      form.style.display = 'flex';
      formAuto.style.display = 'none';
    } else {
      autoToolButton.classList.add('active');
      form.style.display = 'none';
      formAuto.style.display = 'flex';

      renderProjectOptions(autoProjectElement, 1);
      renderFormAutoValue();
    }
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    formError.innerHTML = '';

    const projectId = projectElement.value;
    const start = startElement.value;
    const start2 = start2Element.value;
    const end = endElement.value;
    const end2 = end2Element.value;
    const dateSelected = dateSelectedElement.value;
    const description = descriptionElement.value;
    const description2 = description2Element.value;
    const issue = issueFormatElement.value;
    const issue2 = issue2FormatElement.value;

    const data = [
      {
        start: convertMinutes(start),
        end: convertMinutes(end),
        issue,
        description,
        dateSelected: moment(new Date(dateSelected), 'YYYY-MM-DD').format(
          'YYYY-MM-DD'
        ),
        projectSelectedToAdd: projectId,
        timeOfSet: -420,
      },
      {
        start: convertMinutes(start2),
        end: convertMinutes(end2),
        issue: issue2,
        description: description2,
        dateSelected: moment(new Date(dateSelected), 'YYYY-MM-DD').format(
          'YYYY-MM-DD'
        ),
        projectSelectedToAdd: projectId,
        timeOfSet: -420,
      },
    ];

    data.forEach((payload) => {
      ddpClient
        .call('addManualTimeServer', payload)
        .then((result) => console.log('Done', result))
        .catch((error) => {
          formError.innerHTML = error?.message;
          console.error('[ERROR] addManualTimeServer: ', error);
        });
    });
  });

  stopButton.addEventListener('click', (event) => {
    event.preventDefault();
    isLoopRunning = false;
    stopButton.style.display = 'none';
  });

  clearButton.addEventListener('click', (event) => {
    event.preventDefault();
    loggerElement.innerHTML = '';
  });

  formAuto.addEventListener('submit', function (event) {
    event.preventDefault();
    formAutoError.innerHTML = '';

    const projectId = autoProjectElement.value;
    const start = autoStartElement.value;
    const start2 = autoStart2Element.value;
    const end = autoEndElement.value;
    const end2 = autoEnd2Element.value;
    const from = autoFromElement.value;
    const to = moment(autoToElement.value, 'YYYY-MM-DD')
      .add(1, 'days')
      .format('YYYY-MM-DD');
    const issue = autoIssueFormatElement.value;

    const execute = async () => {
      isLoopRunning = true;
      stopButton.style.display = 'block';
      let currentDate = moment(from, 'YYYY-MM-DD');
      let dateSelected = currentDate.format('YYYY-MM-DD');

      while (dateSelected !== to) {
        if (!isLoopRunning) return;

        dateSelected = currentDate.format('YYYY-MM-DD');

        if (dateSelected === to) {
          isLoopRunning = false;
          stopButton.style.display = 'none';
        }

        // Except Saturday and Sunday
        if (![0, 6].includes(currentDate.day())) {
          const entries = [
            {
              start: convertMinutes(start),
              end: convertMinutes(end),
              issue,
              description: await getDescription(),
              dateSelected,
              projectSelectedToAdd: projectId,
              timeOfSet: -420,
            },
            {
              start: convertMinutes(start2),
              end: convertMinutes(end2),
              issue,
              description: await getDescription(),
              dateSelected,
              projectSelectedToAdd: projectId,
              timeOfSet: -420,
            },
          ];

          const tempCurrentDate = currentDate.format('DD/MM/YYYY');

          entries.forEach((entry) => {
            console.log(entry);
            ddpClient
              .call('addManualTimeServer', entry)
              .then((id) => {
                const p = document.createElement('p');
                p.innerHTML = `[LOGGED] ${tempCurrentDate} [${id}]`;
                loggerElement.append(p);
                console.log(`[LOGGED] ${tempCurrentDate} [${id}]`);
              })
              .catch((error) => {
                formAutoError.innerHTML = error.message;

                const p = document.createElement('p');
                p.classList.add('error');
                p.innerHTML = `[ERROR] ${tempCurrentDate} ${error.message}`;
                loggerElement.append(p);

                throw new Error(error);
              });
          });
        }

        currentDate = currentDate.add(1, 'days');
      }
    };

    execute();
  });
})();
