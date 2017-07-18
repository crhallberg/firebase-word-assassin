document.addEventListener(
  'config-loaded',
  function() {
    const obj = {
      time: new Date().getTime(),
      players: []
    };
    // Create new game
    let gameKey;
    if (!window.location.hash) {
      console.log('random hash');
      const newGameRef = firebase.database().ref('games').push();
      newGameRef.set(obj);
      gameKey = newGameRef.key;
    } else {
      gameKey = window.location.hash.substr(1);
      firebase.database().ref('games/' + gameKey).once('value').then(exists => {
        console.log(exists.val());
        if (!exists.val()) {
          console.log('making new');
          firebase.database().ref('games').child(gameKey).set(obj);
        } else {
          console.log('exists');
        }
      });
    }
    const qrBase = 'http://chart.apis.google.com/chart?cht=qr&chs=300x300&chl=';
    document.getElementById('main').innerHTML =
      '<img src="' +
      qrBase +
      encodeURIComponent(
        window.location.href.replace(/\/qr.html.*$/, '/signin.html#' + gameKey)
      ) +
      '"/>';
    document.getElementById('code').innerHTML = gameKey;

    document.getElementById('start').addEventListener(
      'click',
      function begin() {
        if (!document.getElementById('ready').checked) {
          alert('A man is ready, is he not?');
          return;
        }
        window.location.assign('./begin.php?game=' + gameKey);
      },
      false
    );

    // For fun
    function checkCount() {
      firebase
        .database()
        .ref('games/' + gameKey + '/players')
        .once('value')
        .then(json => {
          if (json.val()) {
            document.getElementById('count').innerHTML = Object.keys(
              json.val()
            ).length;
          } else {
            document.getElementById('count').innerHTML = 0;
          }
        });
    }
    setInterval(checkCount, 5000);
    checkCount();
  },
  false
);
