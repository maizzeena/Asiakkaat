<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<script src="scripts/main.js"></script>
<script src="scripts/login.js"></script>
<link rel="stylesheet" type="text/css" href="css/main.css">
<title>Kirjautuminen</title>
</head>
<body onload="loginForm.uid.focus();">
<div id="loginDiv">
	<form name="loginForm">
	<label>&nbsp;</label><span id="ilmo"></span><br>
	<label>Sähköposti:</label><input type="text" name="uid" id="uid"><br>
	<label>Salasana:</label><input type="password" name="pwd" id="pwd"><br>
	<label>&nbsp;</label><input type="button" value="Kirjaudu" onclick="hashPwd()"><br>
	<input type="hidden" name="hashedPwd" id="hashedPwd">
	</form>
</div>
</body>
</html>