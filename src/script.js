const moment = require('moment');

const convertMinutes = (time) =>
  Number(moment(time, 'HH:mm').format('H')) * 60 +
  Number(moment(time, 'HH:mm').format('m'));

const PROJECT_ID = {
  Creaticode: 'PvA6CHha8LShrTgDG',
  Regenesis: 'u2j4cpwNjKXaty6PJ',
  Amili: 'sTjwPvgdeRaygzKMg',
  Chatchilla: 'DhZvmyRsBRgY3z6ew',
  Ticketmaster: 'mv8AK6RsZb6ioTE3z',
};

const getDescription = async () => {
  const data = await fetch('https://whatthecommit.com/index.txt');
  return data.text();
};

const execute = async ({
  startDate = '2022-12-01',
  endDate = '2022-12-31',
  issueFormat = 'https://github.com/ZigvyCorp/ticket-office-extension',
  projectId = PROJECT_ID.Ticketmaster,
}) => {
  const baseEntry = {
    projectSelectedToAdd: projectId, // Regenesis
    timeOfSet: -420,
  };

  let currentDate = moment(startDate, 'YYYY-MM-DD');
  let dateSelected = currentDate.format('YYYY-MM-DD');

  while (dateSelected !== endDate) {
    dateSelected = currentDate.format('YYYY-MM-DD');

    // Except Saturday and Sunday
    if (![0, 6].includes(currentDate.day())) {
      const entries = [
        {
          start: convertMinutes('09:00'),
          end: convertMinutes('12:00'),
          issue: issueFormat,
          description: await getDescription(),
          dateSelected,
          ...baseEntry,
        },
        {
          start: convertMinutes('14:00'),
          end: convertMinutes('18:00'),
          issue: issueFormat,
          description: await getDescription(),
          dateSelected,
          ...baseEntry,
        },
      ];
      entries.forEach((entry) => Meteor.call('addManualTimeServer', entry));
      console.log('[Logged]', currentDate.format('DD/MM/YYYY'));

      //   entries.forEach((entry) => console.log(entry));
    }

    currentDate = currentDate.add(1, 'days');
  }
};

execute({
  startDate: '2023-03-07',
  endDate: '2023-03-31',
  issueFormat: 'https://github.com/ZigvyCorp/ticket-office-extension',
  projectId: PROJECT_ID.Ticketmaster,
}).then(() => console.log('Done'));
