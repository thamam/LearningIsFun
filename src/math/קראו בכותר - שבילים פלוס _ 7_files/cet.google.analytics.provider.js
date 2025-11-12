(function (doc, head, body) {
	var getEnvironment = function () {
		var env = window.CetSSOEnvironment;
		var host = window.location.host;
		if (host.indexOf('.dev.') > -1) {
			env = 'dev';
		} else if (host.indexOf('.testing.') > -1) {
			env = 'testing';
		}
		return env;
	}
	var currentSite = function () {
		return window.location.hostname.replace(getEnvironment() + ".", "");
	}

	var codes = {
		"ebag.cet.ac.il": '',
		"ar.ebag.cet.ac.il": '',
		"ebaghigh.cet.ac.il": '',
		"ofek4class.cet.ac.il": '',
		"mytestbox.cet.ac.il": '',
		"testbox.cet.ac.il": '',
		"ebagcourses.cet.ac.il": '',
		"ar.ebagcourses.cet.ac.il": '',
		"smarttest.cet.ac.il": '',
		"ar.smarttest.cet.ac.il": '',
		"mindcet.cet.ac.il": '',
		"links.cet.ac.il": '',
		"myebag.cet.ac.il": '',
		"arlearners.cet.ac.il": '',
		"ar.mindsonstem.cet.ac.il": '',
		"mindsonstem.cet.ac.il": '',
		"horizon.cet.ac.il": '',
		"ivritil.cet.ac.il": '',
		"discovery.cet.ac.il": '',
		"vsionglobal.cet.ac.il": '',
		"nobel.cet.ac.il": '',
		"tal.cet.ac.il": '',
		"lo.cet.ac.il": '',
		"mybag.ebag.cet.ac.il": '',
		"mybag.mytestbox.cet.ac.il": '',
		"school.kotar.cet.ac.il": 'G-20FYN479ER',
		"ar.school.kotar.cet.ac.il": 'G-VCK0MH549T',
		"kotar.cet.ac.il": 'G-GHJVFY66EW',
		"productplayer.cet.ac.il": '',
		"cybersquad-he.cet.ac.il": '',
		"cybersquad.cet.ac.il": '',
		"kefel3.cet.ac.il": '',
		"kesem2.cet.ac.il": ''
	}

	var gtagScript = doc.createElement('script');
  gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + codes[currentSite()];
	gtagScript.async = true;
  body ? body.appendChild(gtagScript) : head.appendChild(gtagScript);
  
  var dataLayerScript = doc.createElement('script');
  dataLayerScript.text = "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '"+ codes[currentSite()] +"');"
  body ? body.appendChild(dataLayerScript) : head.appendChild(dataLayerScript);
})(document, document.head, document.body);


