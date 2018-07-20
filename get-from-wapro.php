<?php
$src = $_GET['src'];
$f = curl_init();
curl_setopt($f, CURLOPT_URL, $src);
curl_setopt($f, CURLOPT_USERAGENT, 'Mozilla/5.0 (X11; U; pl-PL; rv:1.9) Gecko/2008061015 Firefox/3.0)');
curl_setopt($f, CURLOPT_FOLLOWLOCATION, 1);
curl_setopt($f, CURLOPT_RETURNTRANSFER,1);
$return = curl_exec($f);
echo $return;
curl_close($f);
?>
