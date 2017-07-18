<?php

header("Content-Type: text/plain");

require(__DIR__ . '/vendor/autoload.php');
$CONFIG = json_decode(file_get_contents(__DIR__ . '/config.json'));

if (!isset($_GET['game'])) {
    echo 'no game';
    return;
}

$words = file_get_contents($CONFIG->firebase->databaseURL . '/words.json');
$wordList = json_decode($words);
shuffle($wordList);

$json = file_get_contents($CONFIG->firebase->databaseURL . '/games/' . $_GET['game'] . '/players.json');
$players = json_decode($json);
if (count($players) === 0) {
    echo 'A man has no friends';
}

$order = [];
foreach($players as $player) {
    $order[] = $player;
}
echo $_GET['game'] . ' (' . count($order) . ")\n";
shuffle($order);

// Send texts
$client = new \Twilio\Rest\Client($CONFIG->twilio->sid, $CONFIG->twilio->token);
function sendSMS($number, $msg) {
    global $client, $CONFIG;
    // Use the client to do fun stuff like send text messages!
    $client->messages->create(
        $number,
        [
            'from' => $CONFIG->twilio->number,
            'body' => $msg
        ]
    );
}
foreach($order as $i => $player) {
    $number = openssl_decrypt($player->bird, 'rc4', $CONFIG->hash->key);
    $number = preg_replace('/ /', '', substr($number, strlen($CONFIG->hash->salt))); // Remove spaces and salt
    $number = preg_replace('/^1?(\d)/', '+1$1', $number); // +1
    $player->number = $number;
    $target = $order[$i === 0 ? count($order) - 1 : $i - 1]->name; // First targets the last, each targets previous
    sendSMS($number, 'Name: ' . $target);
    sendSMS($number, 'Means: ' . $wordList[$i]);
    echo $player->name . ': ' . $order[$i === 0 ? count($order) - 1 : $i - 1]->name . ' (' . $wordList[$i] . ")\n";
}
sleep(3); // These pauses ensure the texts come in the right order. And is creepier. :)
foreach($order as $i => $player) {
    sendSMS($player->number, $player->name . ' has been given a name and a Word of Means.');
}
sleep(3);
foreach($order as $i => $player) {
    sendSMS($player->number, 'In order to give the Gift and become No One, you must compel the bearer of your name to speak this Word. Come see a man if you are given the Gift first.');
}
sleep(3);
foreach($order as $i => $player) {
    sendSMS($player->number, 'Valar morghulis.');
}
