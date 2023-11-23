'use strict';

import { ddpClient } from './ddpClient';
import './popup.css';
import moment from 'moment';

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

const PROJECT_ID = {
  Creaticode: 'PvA6CHha8LShrTgDG',
  Regenesis: 'u2j4cpwNjKXaty6PJ',
  Amili: 'sTjwPvgdeRaygzKMg',
  Chatchilla: 'DhZvmyRsBRgY3z6ew',
  Ticketmaster: 'mv8AK6RsZb6ioTE3z',
  SurveyMaster: 'SoA9iGMgEYqtTY29P',
};

const getDescription = async () => {
  const data = await fetch('https://whatthecommit.com/index.txt');
  return data.text();
};

(function () {
  const now = new Date();

  const projectElement = document.getElementById('projectId');
  const startElement = document.getElementById('start');
  const endElement = document.getElementById('end');
  const descriptionElement = document.getElementById('description');
  const dateSelectedElement = document.getElementById('dateSelected');
  const issueFormatElement = document.getElementById('issue');
  const generateDescElement = document.getElementById('generate-description');
  const form = document.getElementById('form');

  // Project
  Object.keys(PROJECT_ID).forEach((projectName) => {
    const option = document.createElement('option');
    option.value = PROJECT_ID[projectName];
    option.innerHTML = projectName;

    projectElement.append(option);
  });

  // Start/End Date
  startElement.value = '09:00';
  endElement.value = '12:00';
  dateSelectedElement.value = now.toISOString().slice(0, 10);
  descriptionElement.value = '';
  issueFormatElement.value = 'https://github.com/ZigvyCorp/';

  generateDescElement.addEventListener('click', () => {
    getDescription().then((text) => {
      descriptionElement.value = text;
    });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const projectId = projectElement.value;
    const start = startElement.value;
    const end = endElement.value;
    const dateSelected = dateSelectedElement.value;
    const description = descriptionElement.value;
    const issue = issueFormatElement.value;

    const payload = {
      projectId,
      start,
      end,
      dateSelected,
      description,
      issue,
    };
    console.log(payload);

    getCurrentTab().then((tab) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: function (p) {
          console.log(p);
        },
        args: [payload],
      });
    });

    ddpClient
      .call('addManualTimeServer', {
        start: convertMinutes('09:00'),
        end: convertMinutes('12:00'),
        issue: 'HIHIHIHI',
        description: 'HAHAHAHA',
        dateSelected: moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD'),
        projectSelectedToAdd: PROJECT_ID.Creaticode, // Regenesis
        timeOfSet: -420,
      })
      .then((v) => {
        console.log('heyy', v);
      })
      .catch((error) => {
        console.log('e', error);
      });

    chrome.runtime.sendMessage(
      {
        type: 'SUBMIT',
        payload: {
          projectId,
          start,
          end,
          dateSelected,
          description,
          issue,
        },
      },
      (response) => {
        console.log(response.message);
      }
    );
  });
})();
