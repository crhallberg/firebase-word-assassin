// Get room key
document.getElementById('code').innerHTML = window.location.hash.substr(1);
document.addEventListener(
  'config-loaded',
  function() {
    // Enter
    document.getElementById('enter').addEventListener(
      'click',
      function enterTheHouse() {
        const name = document.getElementById('name').value;
        if (!name) {
          alert('You lie. You are not no one.');
          return false;
        }
        const number = document.getElementById('phone').value;
        if (!number) {
          alert('You lie. You must have a little bird (phone).');
          return false;
        }
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', function send() {
          if (this.responseText == 'invalid') {
            alert('You lie about your little bird (numbers only please).');
            return false;
          }
          let playerRef = firebase
            .database()
            .ref('games/' + window.location.hash.substr(1) + '/players')
            .push()
            .set({
              name: name,
              bird: this.responseText
            })
            .then(() => {
              window.location.assign('./rules.html#' + name);
            });
        });
        xhr.open('GET', './encrypt.php?this=' + number);
        xhr.send();
        return false;
      },
      false
    );
  },
  false
);
