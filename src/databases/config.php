<?php
$host = "127.0.0.1:3309";
$user = "root";
$password = "";   // default in XAMPP
$database = "airesult";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>