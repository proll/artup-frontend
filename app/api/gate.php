<?php
echo get_data("http://weheartpics.com".$_REQUEST["method"]);



/* gets the data from a URL */
function get_data($url)
{


		unset($_REQUEST["method"]);

		$arr = array();

		foreach ($_REQUEST as $key => $value) {
				$arr[] = "$key=$value";
		}

		$var_str = implode("&", $arr);

  $ch = curl_init();
  $timeout = 5;

		$userAgent = "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)";
		curl_setopt($ch, CURLOPT_USERAGENT, $userAgent);
		curl_setopt($ch, CURLOPT_FAILONERROR, true);
		// curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
		curl_setopt($ch, CURLOPT_AUTOREFERER, true);
		curl_setopt($ch, CURLOPT_TIMEOUT, 10);
		curl_setopt($ch,CURLOPT_URL,$url);
		curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
		// curl_setopt($ch, CURLOPT_HEADER, 1);
		curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,$timeout);
		curl_setopt($ch, CURLOPT_POST, 1);
		// from all
		// no_more      false
		// page 3
		// page_count   253
		// thumb_size   1
		curl_setopt($ch, CURLOPT_POSTFIELDS, "$var_str");
		  $data = curl_exec($ch);
		  curl_close($ch);
		  return $data;
}
?>
