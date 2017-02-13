<?php
	$db = new PDO("mysql:dbname=localdb", "root", "");
	$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$rows = $db->query("UPDATE counters SET value=value+1 WHERE name='globalCounter'");
?>