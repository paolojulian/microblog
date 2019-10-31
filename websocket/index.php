<?php
    $ch = curl_init('http://127.0.0.1:8080');
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    $jsonData = json_encode([
        'id' => 11,
        'message' => 'Someone has liked your <a href="/profiles/chefpipz">post</a>'
    ]);
    $query = http_build_query(['data' => $jsonData]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $query);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <form action="<?=$_SERVER['PHP_SELF']; ?>"
        method="POST"
    >
        <button type="submit">Test</button>
    </form>
</body>
</html>