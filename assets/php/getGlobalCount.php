<?php
	require_once('database.php');
	$conn = new mysqli($servername, $usn, $psw,$database);
	if($conn->connect_errno)$ans =  'There was a problem with connecting to our server. Please, try again!';
	else{
			$query="SELECT * FROM counters WHERE name='globalCounter'";
			$results = $conn->query($query);
			foreach ($results as $result)
				echo $result['value'];
	}
	
?>