const { Telegraf } = require('telegraf')
const bot = new Telegraf('1607080261:AAEK6uETpXRlMrP8XGvyLjy3G2DqpAjLSS0') //сюда помещается токен, который дал botFather
bot.start((ctx) => ctx.reply('Welcome')) //ответ бота на команду /start
bot.help((ctx) => ctx.reply('Send me a sticker')) //ответ бота на команду /help
bot.on('sticker', (ctx) => ctx.reply('')) //bot.on это обработчик введенного юзером сообщения, в данном случае он отслеживает стикер, можно использовать обработчик текста или голосового сообщения
bot.hears('hi', (ctx) => ctx.reply('Hey there')) // bot.hears это обработчик конкретного текста, данном случае это - "hi"

// For weather
// const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

//OpenWeatherMap API key
const appID = '9ddc63e285cf479f389da0faed18636b';

// OpenWeatherMap endpoint for getting weather by city name
const weatherEndpoint = (city) => (
    `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&&appid=${appID}`
  );

  // URL that provides icon according to the weather
const weatherIcon = (icon) => `http://openweathermap.org/img/w/${icon}.png`;


// Template for weather response
const weatherHtmlTemplate = (name, main, weather, wind, clouds) => (
    `Погода в <b>${name}</b>:
  <b>${weather.main}</b> - ${weather.description}
  Температура: <b>${main.temp} °C</b>
  Давление: <b>${main.pressure} hPa</b>
  Влажность: <b>${main.humidity} %</b>
  Ветер: <b>${wind.speed} meter/sec</b>
  Облачность: <b>${clouds.all} %</b>
  `
  );

//   const bot = new TelegramBot(token, {
//     polling: true
//   });

  // Function that gets the weather by the city name
const getWeather = (chatId, city, msg) => {
    const endpoint = weatherEndpoint(city);
  
    axios.get(endpoint).then((resp) => {
      const {
        name,
        main,
        weather,
        wind,
        clouds
      } = resp.data;

    //   console.log(`http://openweathermap.org/img/w/${weather[0].icon}.png`, 'weather')
    //   let image = `http://openweathermap.org/img/w/13n.png`;
  
    // msg.telegram.sendPhoto({ chatId: msg.chat.id, source: image})
    msg.telegram.sendMessage(
        chatId,
        weatherHtmlTemplate(name, main, weather[0], wind, clouds), {
          parse_mode: "HTML"
        }
      );
    }, error => {
      console.log("error", error);
      msg.telegram.sendMessage(
        chatId,
        `Ooops...I couldn't be able to get weather for <b>${city}</b>`, {
          parse_mode: "HTML"
        }
      );
    });
  }

let answerUserData;
let answerUserText;

let questionsAboutSeason = 
    {
        title:'Какое время года ?',
        buttons: [
            [{ text: 'Зима.', callback_data: 'winter' }],
            [{ text: 'Весна.', callback_data: 'spring' }],
            [{ text: 'Лето.', callback_data: 'summer' }],
            [{ text: 'Осень.', callback_data: 'autumn' }]
          ]
      }
let questionsAboutWeather =
      {
        title:'Какая на улице погода?',
        buttons: [
            [{ text: 'Холодно Брррр', callback_data: 'COOOOLD brrrr' }],
            [{ text: 'Не холодно', callback_data: 'Not cold' }],
            [{ text: 'Ну нахер, останусь дома', callback_data: 'oh sheeeet' }]
          ]
      }

var questions = [
    {
      title:'Сколько параметров можно передать функции ?',
      buttons: [
          [{ text: 'Ровно столько, сколько указано в определении функции.', callback_data: '0_1' }],
          [{ text: 'Сколько указано в определении функции или меньше.', callback_data: '0_2' }],
          [{ text: 'Сколько указано в определении функции или больше.', callback_data: '0_3' }],
          [{ text: 'Любое количество.', callback_data: '0_4' }]
        ],
      right_answer: 4
    },
    {
      title:'Чему равна переменная name?\nvar name = "пупкин".replace("п", "д")',
      buttons: [
          [{ text: 'дудкин', callback_data: '1_1' }],
          [{ text: 'дупкин', callback_data: '1_2' }],
          [{ text: 'пупкин', callback_data: '1_3' }],
          [{ text: 'ляпкин-тяпкин', callback_data: '1_4' }]
        ],
      right_answer: 2
    },
    {
      title:'Чему равно 0 || "" || 2 || true ?',
      buttons: [
          [{ text: '0', callback_data: '2_1' }],
          [{ text: '""', callback_data: '2_2' }],
          [{ text: '2', callback_data: '2_3' }],
          [{ text: 'true', callback_data: '2_4' }]
        ],
      right_answer: 3
    },
  ];

  let outerwear = [ 'Кофта синяя', 'Кофта белая', 'Кофта черная', 'Кофта коричневая', 'Кофта бежевая', 'Еще какая то кофта' ];
  let pants = [ 'Хрень какая не нравитья серьожкы', 'Отличные черные джинсы', 'Джогерры', 'Джинсы не очень', 'Штаны для работы', 'Юбка' ];
  let cap = [ 'Черная', 'Белая'];

  function getRandomQuestion(){
    return questions[Math.floor(Math.random()*questions.length)];
  }

  function getRandomOutWear() {
    return outerwear[Math.floor(Math.random()*outerwear.length)];
  }

  function getRandomPants() {
    return pants[Math.floor(Math.random()*pants.length)];
  }

  function getRandomCap() {
    return cap[Math.floor(Math.random()*cap.length)];
  }

  function newQuestion(msg){
    var arr = getRandomQuestion();
    var text = arr.title;
    var options = {
      reply_markup: JSON.stringify({
        inline_keyboard: arr.buttons,
        parse_mode: 'Markdown'
      })
    };
    chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;
    // bot.send(chat, text, options);
    msg.telegram.sendMessage(chat, text, options);

  }

  function whatIsSeason(msg) {
      let arr = questionsAboutSeason;
      var text = arr.title;
      var options = {
        reply_markup: JSON.stringify({
          inline_keyboard: arr.buttons,
          parse_mode: 'Markdown'
        })
      };
      chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;
      // bot.send(chat, text, options);
      msg.telegram.sendMessage(chat, text, options);
  }

  function whatisWeather(msg) {
    let arr = questionsAboutWeather;
    var text = arr.title;
    var options = {
      reply_markup: JSON.stringify({
        inline_keyboard: arr.buttons,
        parse_mode: 'Markdown'
      })
    };
    chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;
    // bot.send(chat, text, options);
    msg.telegram.sendMessage(chat, text, options);
}

function whatisWear() {
    const formData = `
        Сегодня ты оденешь:
        Верхняя одежда: ${getRandomOutWear()},
        Штаны: ${getRandomPants()},
        Шапка: ${getRandomCap()}.
    И только попробуй не одеть то, что выпало. По жопе получишь.
    `

    return formData;
}

bot.on('text', async (msg, match) => {
    let cityName = (msg.update.message.text).split(' ');
    if( msg.update.message.text == 'что мне сегодня надеть' ) {
        whatIsSeason(msg)
    } else if(cityName[0] == 'weather') {
        const chatId = msg.chat.id;
        const city = msg.update.message.text.split(' ')[1];
        
        if (city === undefined) {
            msg.telegram.sendMessage(
            chatId,
            `Please provide city name`
          );
          return;
        }
        getWeather(chatId, city, msg);
    } else {
        newQuestion(msg)
    }
// let messageUser = msg.message.text;
// if ( messageUser == 'test' ) {
//     console.log('test user')
//     msg.reply('Выберите любую кнопку:', questions)
// }

// console.log(JSON.parse(options.reply_markup).inline_keyboard, 'options')
    // if ( callback_data === '1' ) {
    //     text = 'You hit button 1';
    // }
    // console.log('no test user')
  })


bot.on('callback_query', (msg) => {
    answerUserData = msg.update.callback_query.data
    answerUserText = msg.update.callback_query.message.reply_markup.inline_keyboard
    // let answerUser = [];

    // answer = answerUserText.forEach( el => {
    // answer = el.find( textAnswear => textAnswear['callback_data'] === answerUserData );

    //     if ( answer != undefined ) {
    //         answerUser.push(answer['text'])
    //     }
    // })

    if ( msg.update.callback_query.data == 'winter' || msg.update.callback_query.data == 'spring' || msg.update.callback_query.data == 'summer' || msg.update.callback_query.data == 'autumn') {
        msg.telegram.sendMessage(msg.chat.id, 'Вы выбрали: '+ msg.update.callback_query.data);
        // msg.telegram.sendMessage(msg.chat.id, 'Вы выбрали: '+ msg.update.callback_query.data);  
        whatisWeather(msg);
        
    }
    
    if ( msg.update.callback_query.data == 'COOOOLD brrrr' || msg.update.callback_query.data == 'Not cold' || msg.update.callback_query.data == 'oh sheeeet' ) {
        msg.telegram.sendMessage(msg.chat.id, 'Вы выбрали: '+ msg.update.callback_query.data);  
        if (msg.update.callback_query.data == 'oh sheeeet') {
            msg.telegram.sendMessage(msg.chat.id, 'Вот умничка. Сиди дома!');
            
        } 

        if (msg.update.callback_query.data == 'COOOOLD brrrr') {
            msg.telegram.sendMessage(msg.chat.id, 'Нехрен без Серьожки на улицу выходить');
        }

        
        msg.telegram.sendMessage(msg.chat.id, whatisWear());
    }

})
//   bot.on('text', async (msg, match) => {
//     console.log(msg, 'message')

//     bot.sendMessage(msg.chat.id, 'Выберите любую кнопку:', options);
//   });
bot.launch() // запуск бота



// PHOTO
// bot.on('message', function (msg) {
//     var chatId = msg.chat.id; // Берем ID чата (не отправителя)
//     // Фотография может быть: путь к файлу, поток (stream) или параметр file_id
//     var photo = 'cats.png'; // в папке с ботом должен быть файл "cats.png"
//     bot.sendPhoto(chatId, photo, { caption: 'Милые котята' });
// });