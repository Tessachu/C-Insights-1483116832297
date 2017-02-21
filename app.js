/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var express    = require('express'),
  app          = express(),
  watson       = require('watson-developer-cloud'),
  extend       = require('util')._extend,
  i18n         = require('i18next');

//i18n settings
require('./config/i18n')(app);

// Bootstrap application settings
require('./config/express')(app);

// Create the service wrapper
var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
var personality_insights = new PersonalityInsightsV3({
  username: '6a6ec604-cde3-490b-b43f-59e11e0b2579',
  password: 'h4iXz2TPscgU',
  version_date: '2016-12-30'
});

var params = {
  //content_items: require('./profile.json').contentItems,// Get the content items from the JSON file.
  text: $('#text textarea').first().val(),
  consumption_preferences: true,
  raw_scores: true,
  csv_headers: true,
  headers: {
    'accept-language': 'en',//desired language of response
    'accept': 'application/json',//desired content type of response: 'application/json'|text/csv'
    'content-type': 'text/plain;charset=utf-8',//request: 'text/plain;charset=utf-8'|'text/html;charset=utf-8'|'application/json'
    'content-language': 'en'
  }
};


app.post('/api/profile', function(req, res, next) {
	console.log('What is app.post?');
	var parameters = extend(req.body, { acceptLanguage : i18n.lng() });
  
  	personality_insights.profile(params, function(error, response) {
	  if (error) console.log('error:', error);
	  else console.log(JSON.stringify(response, null, 2));
	  }
	);
});