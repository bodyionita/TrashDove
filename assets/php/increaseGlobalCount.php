<?php
	require_once('database.php');
	$conn = new mysqli($servername, $usn, $psw,$database);
	if($conn->connect_errno)$ans =  'There was a problem with connecting to our server. Please, try again!';
	else{
		
			$query="UPDATE counters SET value=value+".min(200,$_POST['count'])." WHERE name='globalCounter'";
			$conn->query($query);
	}
	
?>