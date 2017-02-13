<?php
	$servername='';
	$usn='';
	$psw='';
	$database='';

	foreach ($_SERVER as $key => $value) {
    	if (strpos($key, "MYSQLCONNSTR_localdb") !== 0) {
        	continue;
    	}
    
    	$servername = preg_replace("/^.*Data Source=(.+?);.*$/", "\\1", $value);
    	$database = preg_replace("/^.*Database=(.+?);.*$/", "\\1", $value);
    	$usn = preg_replace("/^.*User Id=(.+?);.*$/", "\\1", $value);
    	$psw = preg_replace("/^.*Password=(.+?)$/", "\\1", $value);
	}
	
	$conn = new mysqli($servername, $usn, $psw,$database);
	if($conn->connect_errno)$ans =  'There was a problem with connecting to our server. Please, try again!';
	else{
			$query="UPDATE counters SET value=value+1 WHERE name='globalCounter'";
			$conn->query($query);
	}
	
?>