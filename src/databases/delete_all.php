<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

include 'config.php';

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit;
}

if ($conn->query("DELETE FROM plans")) {
    echo json_encode(["status" => "success", "message" => "All plans deleted"]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to delete plans: " . $conn->error]);
}

$conn->close();
?>