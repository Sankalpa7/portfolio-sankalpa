export const projects = [
  {
    id: 1,
    title: 'ChatApp',
    description:
      'A real-time chat application built with React and Socket.io, powered by Chat Engine API. Features live messaging, user rooms, and a clean modern UI for seamless communication.',
    descriptionFi:
      'Reaaliaikainen chat-sovellus Reactilla ja Socket.io:lla (Chat Engine API). Sisältää live-viestit, huoneet ja modernin käyttöliittymän sujuvaan viestintään.',
    tags: ['React', 'Socket.io', 'Chat Engine API', 'CSS3'],
    category: 'Full Stack',
    color: '#06b6d4',
    demo: 'https://chatmesan.netlify.app/',
    code: 'https://github.com/Sankalpa7/React-chat-app',
    featured: true,
  },
  {
    id: 2,
    title: 'Voice Assistant App',
    description:
      'An AI-powered voice assistant inspired by Siri, built using Alan AI. Responds to natural language commands, answers questions, and navigates the web hands-free.',
    descriptionFi:
      'Tekoälyyn perustuva ääniohjausavustaja (Alan AI). Ymmärtää luonnollista kieltä, vastaa kysymyksiin ja mahdollistaa hands-free-selailun.',
    tags: ['React', 'Alan AI', 'NLP', 'JavaScript'],
    category: 'AI',
    color: '#a855f7',
    demo: 'https://alanvoice.netlify.app/',
    code: 'https://github.com/Sankalpa7/alanai-voice-assistant',
    featured: true,
  },
  {
    id: 3,
    title: 'Student Score Prediction',
    description:
      "ML project using supervised learning to predict students final grades. Implements Random Forest and Gaussian Naive Bayes models to identify struggling students early and help educators intervene in time.",
    descriptionFi:
      'Koneoppimisprojekti (ohjattu oppiminen) opiskelijoiden arvosanojen ennustamiseen. Random Forest ja Gaussian Naive Bayes auttavat tunnistamaan riskissä olevat opiskelijat ajoissa.',
    tags: ['Python', 'Scikit-learn', 'Random Forest', 'Pandas', 'Matplotlib', 'Jupyter'],
    category: 'Data',
    color: '#f97316',
    demo: 'https://github.com/Sankalpa7/Score-Prediction-data-analysis-and-visualization',
    code: 'https://github.com/Sankalpa7/Score-Prediction-data-analysis-and-visualization',
    featured: true,
  },
  {
    id: 4,
    title: 'Flight Data Web Scraper',
    description:
      'Python web scraper that extracts real-time flight data including prices, departure and arrival times, and airline details from a popular booking website. Built with Jupyter Notebooks.',
    descriptionFi:
      'Python-webscraper, joka kerää reaaliaikaista lentodataa (hinnat, lähtö- ja saapumisajat, lentoyhtiöt) suositulta varaussivustolta. Toteutettu Jupyterillä.',
    tags: ['Python', 'BeautifulSoup', 'Jupyter', 'Web Scraping', 'Pandas'],
    category: 'Data',
    color: '#22c55e',
    demo: 'https://github.com/Sankalpa7/Flight-Website-Web-scrapping',
    code: 'https://github.com/Sankalpa7/Flight-Website-Web-scrapping',
    featured: true,
  },
  {
    id: 5,
    title: 'Covid-19 Tracker',
    description:
      'A data visualization dashboard tracking global Covid-19 statistics with interactive bar graphs built with Chart.js showing cases, recoveries, and deaths by country.',
    descriptionFi:
      'Data-visualisointidashboard Covid-19-tilastoille. Interaktiiviset Chart.js -kaaviot näyttävät tartunnat, parantuneet ja kuolemat maittain.',
    tags: ['React', 'Chart.js', 'REST API', 'Data Visualization'],
    category: 'Data',
    color: '#ef4444',
    demo: 'https://sancovtrack.netlify.app/',
    code: 'https://github.com/Sankalpa7/react-covid-tracker',
    featured: false,
  },
  {
    id: 6,
    title: 'Weather App',
    description:
      'A clean responsive weather application using OpenWeather API. Displays real-time temperature, humidity, wind speed, and forecasts for any city worldwide.',
    descriptionFi:
      'Responsiivinen sääsovellus OpenWeather API:lla. Näyttää lämpötilan, kosteuden, tuulen ja ennusteen mille tahansa kaupungille.',
    tags: ['React', 'OpenWeather API', 'REST API', 'CSS3'],
    category: 'Frontend',
    color: '#38bdf8',
    demo: 'https://sanweather.netlify.app/',
    code: 'https://github.com/Sankalpa7/react-weather-app',
    featured: false,
  },
  {
    id: 7,
    title: 'Movie Database',
    description:
      'A comprehensive movie discovery platform fetching detailed info, ratings, and metadata for thousands of films using a movie database API.',
    descriptionFi:
      'Elokuvahakupalvelu, joka hakee yksityiskohtaiset tiedot, arviot ja metadatan tuhansille elokuville elokuvatietokanta-API:lla.',
    tags: ['React', 'Movie DB API', 'REST API', 'JavaScript'],
    category: 'Frontend',
    color: '#eab308',
    demo: 'https://moviesan.netlify.app/',
    code: 'https://github.com/Sankalpa7/react-moviedb',
    featured: false,
  },
  {
    id: 8,
    title: 'Quiz Game App',
    description:
      'An interactive quiz game themed around Who Wants to Be a Millionaire. Features difficulty levels, lifelines, score tracking, and a fully animated UI.',
    descriptionFi:
      'Interaktiivinen tietovisapeli (Miljonääri-teemalla). Vaikeustasot, oljenkorret, pisteseuranta ja animoitu käyttöliittymä.',
    tags: ['React', 'JavaScript', 'CSS3', 'Game Logic'],
    category: 'Frontend',
    color: '#8b5cf6',
    demo: 'https://kbcquiz.netlify.app',
    code: 'https://github.com/Sankalpa7/react-quiz-game',
    featured: false,
  },
  {
    id: 9,
    title: 'Grocery Note App',
    description:
      'A smart grocery list manager with full CRUD functionality. Add, edit, and delete items with a clean intuitive interface and built-in local storage persistence.',
    descriptionFi:
      'Älykäs ostoslistasovellus täydellä CRUD-toiminnallisuudella. Lisää, muokkaa ja poista tuotteita selkeässä käyttöliittymässä (localStorage).',
    tags: ['React', 'Local Storage', 'CRUD', 'JavaScript'],
    category: 'Frontend',
    color: '#10b981',
    demo: 'https://grocesome.netlify.app/',
    code: 'https://github.com/Sankalpa7/grocery-note',
    featured: false,
  },
]

export type Project = typeof projects[0]
