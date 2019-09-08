<?php
if (!isset($_POST['name']) or empty($_POST['name'])) {
	$error1 = "Name can't be empty<br />";
} else $error1 = NULL;

if (!isset($_POST['phone']) or empty($_POST['phone'])) {
	$error2 = "Phone can't be empty<br />";
} else $error2 = NULL;

if (empty($error1) and empty($error2)) {

	function to_utf8($from_text) {
		return '=?UTF-8?B?'.base64_encode($from_text).'?='; //fix Кракозябрица в имени отправителя письма на почте Yandex
	}
	
	$name  = trim(strip_tags($_POST['name']));
	$phone   = trim(strip_tags($_POST['phone']));
	$email  = trim(strip_tags($_POST['email']));
	$message  = trim(strip_tags($_POST['message']));
	$form  = trim(strip_tags($_POST['form']));
	
	$to    = 'easergiu@gmail.com'; // send to ______ trim(strip_tags($_POST['send_to_email']));
	$title = 'New form data from site ______'; // Mail subject
	$body   = "
		<h3>Form data:</h3>
		<p>Name: {$name}</p>
		<p>Phone: {$phone}</p>
		<p>E-mail: {$email}</p>
		<p>Message: {$message}</p>
		<p>Form: {$form}</p>
	"; // Email content
	
	$headers = "MIME-Version: 1.0 \r\n";
	$headers .= "Content-Transfer-Encoding: 8bit \r\n";
	$headers .= "Content-type:text/html;charset=utf-8 \r\n"; //Encoding and type of content
	//$headers .= "From: " . to_utf8('Site name') . "<test@mserj.ru> \r\n"; // from
	//$headers .= "Bcc: test@gmail.com \r\n"; // send blind copy to _____
	//$headers .= "Cc: test@gmail.com \r\n"; // send copy to _____
	//$headers .= "Reply-To: test@mserj.ru \r\n"; // reply to _____
	$headers .= 'X-Mailer: PHP/' . phpversion();

	// sending
	if (mail($to, $title, $body, $headers)) { 
		echo "Sended!";
	} else { 
		echo "Error, try again!";
	};
	
} else {
	echo $error1.$error2;
}