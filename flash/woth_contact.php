<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Contact Form</title>

<script type="text/javascript">
<!--

function validate_form ( )
{
    valid = true;
	errors = 0;

    if ( document.contactform.msgfrom.value == "" )
    {
        errors = errors + 1;
        valid = false;
    }

	if ( document.contactform.msgname.value == "" )
    {
        errors = errors + 2;
        valid = false;
    }

	if ( document.contactform.msgbody.value == "" )
    {
        errors = errors + 4;
        valid = false;
    }

	if ( valid == false )
	{
	 alert("There is at least one field with error");
		 switch (errors)
		{
		case 1:
  		alert("Error with: Email Field")
  		break
		case 2:
  		alert("Error with: Name Field")
  		break
		case 3:
  		alert("Error with: Email Field, Name Field")
  		break
		case 4:
  		alert("Error with: Message Field")
  		break
		case 5:
  		alert("Error with: Email Field, Message Field")
  		break
		case 6:
  		alert("Error with: Name Field, Message Field")
  		break
		case 7:
  		alert("Error with: Name Field, Email Field, Message Field")
  		break
		}
	}
    return valid;
}

//-->
</script>

<style type="text/css">
<!--
body {
	background-image: url(images/greyback.jpg);
	background-repeat: repeat-x;
}
.style2 {font-family: Arial, Helvetica, sans-serif}
.style3 {font-size: medium}
.style4 {color: #FFFFFF}
-->
</style></head>

<body>

<form action="woth_send.php" method="post" name="contactform" class="style2 style3 style4" id="contactform" onsubmit="return validate_form ( );">

<?php
$ipi = getenv("REMOTE_ADDR");
$httprefi = getenv ("HTTP_REFERER");
$httpagenti = getenv ("HTTP_USER_AGENT");
?>

<input type="hidden" name="ip" value="<?php echo $ipi ?>" />
<input type="hidden" name="httpref" value="<?php echo $httprefi ?>" />
<input type="hidden" name="httpagent" value="<?php echo $httpagenti ?>" />

  <p>Name:
    <label>
    <input type="text" name="msgname" id="msgname" />
    </label>
    Email: 
        <label>
    <input type="text" name="msgfrom" id="msgfrom" />
    </label>
  </p>
  <p>Subject: 
    <label>
    <input name="msgsubject" type="text" id="msgsubject" size="55" />
    </label>
  </p>
  <p>Message:</p>
  <p><label></label>
    <label>
    <textarea name="msgbody" cols="60" rows="15" id="msgbody"></textarea>
    </label>
  </p>
  <p>
    <label>
    <input type="submit" name="sm" id="sm" value="Send" />
    </label>
  </p>
</form>
</body>
</html>
