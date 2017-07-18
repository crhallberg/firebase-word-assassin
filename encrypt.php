<?php

header("Content-Type: text/plain");

$CONFIG = json_decode(file_get_contents(__DIR__ . '/config.json'));

if (!isset($_GET['this']) || !preg_match('/^[\d ]+$/', $_GET['this'])) {
    echo 'invalid';
    return;
}
echo openssl_encrypt($CONFIG->hash->salt . $_GET['this'], 'rc4', $CONFIG->hash->key);
