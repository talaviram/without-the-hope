<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Untitled Document</title>
<style type="text/css">
<!--
body {
	background-image: url(images/greyback.jpg);
	background-repeat: repeat-x;
}
.style1 {
	font-family: Arial, Helvetica, sans-serif;
	color: #FFFFFF;
}
-->
</style></head>

<body>

<span class="style1">
<?php

$ip = $_POST['ip']; 
$httpref = $_POST['httpref']; 
$httpagent = $_POST['httpagent']; 
$msgname = $_POST['msgname']; 
$msgfrom = $_POST['msgfrom']; 
$msgsubject = $_POST['msgsubject'];
$msgbody = $_POST['msgbody'];

if(!$visitormail == "" && (!strstr($msgfrom,"@") || !strstr($msgfrom,"."))) 
{
echo "<h2>Use Back - Enter valid e-mail</h2>\n"; 
$badinput = "<h2>Feedback was NOT submitted</h2>\n";
echo $badinput;
}

if(empty($msgname) || empty($msgfrom) || empty($msgsubject )) {
echo "<h2>Use Back - fill in all fields</h2>\n";
}

$todayis = date("l, F j, Y, g:i a") ;

$subject = $msgsubject; 

$msgbody = stripcslashes($msgbody); 

$message = " $todayis [EST] \n
Message: $msgbody \n 
From: $msgname ($msgfrom)\n
Additional Info : IP = $ip \n
Browser Info: $httpagent \n
Referral : $httpref \n
";

$from = "From: $visitormail\r\n";


mail("talaviram@gmail.com", $subject, $message, $from);

?>
</span>
<p align="center" class="style1">
<br />
Thank You : <?php echo $msgname ?> ( <?php echo $msgfrom ?> ) 
<br />
Your message has been sent.
<br /> 
<form class="style1">
  <div align="center">
    <input type=button value="Close" onClick="javascript:window.close();">
  </div>
</form> 
</p>
</body>
</html>
