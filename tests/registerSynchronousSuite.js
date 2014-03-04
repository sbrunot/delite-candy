define(["intern!object",
        "intern/node_modules/dojo/node!wd-sync",
        "intern/node_modules/dojo/topic"
        ], function (registerSuite, wdSync, topic) {

	var registerSynchronousSuite = function (/*Object*/suiteDescriptor) {
		// Register a suite of synchronous tests that uses the wd-sync API
		// The suite descriptor parameter contains the following information:
		//	- name: the name of the test suite
		//	- testPage: the path to the test page that the suite exercise
		//	- testPageLoadedCondition: the javascript condition that returns true on the test page when it is loaded
		//	- testPageLoadedTimeout: the timeout (in milliseconds) after which a test fails if the test page is not
		//loaded (default to 5000ms)
		//	- quitOnError: if falsy, the browser remains open with the test page on which a test has failed
		//	- test methods: functions that takes a wd-sync browser object as their unique parameter
		var asyncSuiteDescriptor = {name: suiteDescriptor.name};
		var testPage = suiteDescriptor.testPage;
		var testPageLoadedCondition = suiteDescriptor.testPageLoadedCondition;
		var testPageLoadedTimeout = suiteDescriptor.testPageLoadedTimeout || 5000;
		var quitOnError = suiteDescriptor.quitOnError;
		for (var test in suiteDescriptor) {
			(function (test) {
				if (suiteDescriptor.hasOwnProperty(test) && typeof suiteDescriptor[test] === "function") {
					asyncSuiteDescriptor[test] = function () {
						var client = wdSync.remote(),
						browser = client.browser,
						sync = client.sync,
						browserEnvironment = this.remote._desiredEnvironment, // the current browser environment
						proxyUrl = this.remote.proxyUrl,
						sessionId = this.remote.sessionId,
						coverageData;
						var dfd = this.async(10000);
						console.log("> running test '" + test + "'");
						sync(function () {
							try {
								browser.init(browserEnvironment);
								if (testPage) {
									browser.get(proxyUrl + testPage);
								}
								if (testPageLoadedCondition) {
									browser.waitForCondition(testPageLoadedCondition, testPageLoadedTimeout);
								}
								suiteDescriptor[test](browser);
								dfd.resolve();
							} catch (e) {
								dfd.reject(e);
							} finally {
								// retrieve and publish the coverage data
								coverageData = browser.execute(
						          "return typeof __internCoverage !== 'undefined' && JSON.stringify(__internCoverage)");
								if (coverageData) {
									topic.publish("/coverage", sessionId, JSON.parse(coverageData));
								}
								if (dfd.isRejected() && !quitOnError) {
									return;
								}
								browser.quit();
							}
						});
					};
				}
			}(test));
		}
		registerSuite(asyncSuiteDescriptor);
		console.log("> Test suite '" + asyncSuiteDescriptor.name + "' registered.");
	};

	return registerSynchronousSuite;
});