(function () {
  if (!window.cet || !window.cet.microservices || !window.cet.microservices.apiready) {
    window.cet = window.cet || {};
    cet.microservices = cet.microservices || {};

    let apiready = new Promise(function (resolve, reject) {
      var scriptElement = document.createElement("script");
      scriptElement.addEventListener('load', resolve);
      scriptElement.addEventListener('error', reject);
      var origin = document.currentScript.src.split('/', 3).join('/');
      scriptElement.src = origin + "/provider/ApiProvider.js?8dde3d47317f400";
      document.head.appendChild(scriptElement);
    });
    cet.microservices.apiready = apiready;
  }
  let selfUrl = document.currentScript.src;
  cet.microservices.apiready.then(() => {
    cet.microservices.api.system.addService(selfUrl);
  });
})();

// define the namespaces
if (!window.cet) {
	window.cet = {};
}
if (!window.cet.microservices) {
	window.cet.microservices = {};
}
if (!window.cet.microservices.bigData) {
  window.cet.microservices.bigData = (() => {

    const rawEventSchema = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "The Root Schema",
  "description": "The CET event schema",
  "definitions": {},
  "$id": "http://example.com/root.json",
  "$comment": "for properties where the original event sent by client has a different type, add originalObjectSchema.type",
  "type": "object",
  "properties": {
    "id": {
      "title": "The Id Schema",
      "$id": "#/properties/id",
      "type": "string",
      "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
    },
    "version": {
      "title": "The Version Schema",
      "$id": "#/properties/version",
      "type": "string",
      "minLength": 1
    },
    "user_id": {
      "title": "The User_id Schema",
      "$id": "#/properties/user_id",
      "type": "string",
      "minLength": 1,
      "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
    },
    "verb": {
      "title": "The Verb Schema",
      "$id": "#/properties/verb",
      "type": "string",
      "enum": [
        "selected",
        "asked_next",
        "swipe",
        "rated",
        "added",
        "additional_exercise",
        "answered",
        "asked",
        "asked_assistance_alternative",
        "asked_check",
        "asked_generate",
        "asked_open_assistance",
        "asked_show_answer",
        "asked_showHint",
        "cleared",
        "commented",
        "didnt_understand",
        "exited",
        "experienced_paused",
        "experienced_played",
        "experienced_stopped",
        "launched",
        "loaded",
        "logged_in",
        "logged_out",
        "peeked",
        "personalized",
        "pressed",
        "removed",
        "resumed",
        "screened",
        "set",
        "shared",
        "show_grade",
        "sso",
        "submitted",
        "suspended",
        "tagged",
        "understand",
        "unpeeked",
        "unshared",
        "updated",
        "voided",
        "completed"
      ]
    },
    "object_id": {
      "title": "The Object_id Schema",
      "$id": "#/properties/object_id",
      "type": "string",
      "minLength": 1
    },
    "object_name": {
      "title": "The Object_name Schema",
      "$id": "#/properties/object_name",
      "type": "string",
      "minLength": 1
    },
    "object_type": {
      "title": "The Object_type Schema",
      "$id": "#/properties/object_type",
      "type": "string",
      "enum": [
        "school",
        "cmi.interaction",
        "media",
        "inputControl",
        "link",
        "lo",
        "page",
        "webpage",
        "forum-topic",
        "forum-reply",
        "forum",
        "course",
        "book",
        "user",
        "slide",
        "statementRef",
        "audio",
        "mark",
        "online_meeting",
        "task",
        "favorite",
        "api",
        "note",
        "role",
        "group",
        "class",
        "environment",
        "application",
        "game"
      ]
    },
    "registration": {
      "title": "The Registration Schema",
      "$id": "#/properties/registration",
      "type": "string",
      "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
    },
    "content_language": {
      "title": "The Content_language Schema",
      "$id": "#/properties/content_language",
      "type": "string",
      "minLength": 1
    },
    "index": {
      "title": "The Index Schema",
      "$id": "#/properties/index",
      "type": "integer",
      "minimum": 0.0,
      "maximum": 9.223372036854776E+18
    },
    "client_user_agent": {
      "title": "The Client_user_agent Schema",
      "$id": "#/properties/client_user_agent",
      "type": "string"
    },
    "client_ip": {
      "title": "The Client_ip Schema",
      "$id": "#/properties/client_ip",
      "type": "string",
      "format": "ipv4"
    },
    "product": {
      "title": "The Product Schema",
      "$id": "#/properties/product",
      "type": "string",
      "minLength": 1
    },
    "context_referrer": {
      "title": "The Context_referrer Schema",
      "$id": "#/properties/context_referrer",
      "anyOf": [
        {
          "type": "string",
          "format": "uri"
        },
        {
          "type": "string",
          "maxLength": 0
        }
      ]
    },
    "user_role": {
      "title": "The User_role Schema",
      "$id": "#/properties/user_role",
      "type": "string",
      "enum": [
        "admin",
        "other",
        "student",
        "teacher",
        "coordinator",
        "guest",
        "unknown"
      ]
    },
    "timestamp": {
      "title": "The Timestamp Schema",
      "$id": "#/properties/timestamp",
      "type": "string",
      "format": "date-time"
    },
    "timestamp_long": {
      "title": "The Timestamp_long Schema",
      "$id": "#/properties/timestamp_long",
      "type": "integer",
      "minimum": 0.0,
      "maximum": 9.223372036854776E+18
    },
    "interaction_type": {
      "title": "The Interaction_type Schema",
      "$id": "#/properties/interaction_type",
      "type": "string"
    },
    "object_fields_type": {
      "title": "The Object_fields_type Schema",
      "$id": "#/properties/object_fields_type",
      "originalObjectSchema": {
        "type": "object"
      },
      "type": "object"
    },
    "object_fields_graded": {
      "title": "The Object_fields_graded Schema",
      "$id": "#/properties/object_fields_graded",
      "originalObjectSchema": {
        "type": "object"
      },
      "type": "object"
    },
    "object_link": {
      "title": "The Object_link Schema",
      "$id": "#/properties/object_link",
      "type": "string"
    },
    "object_current_time": {
      "title": "The Object_current_time Schema",
      "$id": "#/properties/object_current_time",
      "type": "string"
    },
    "object_additional_information": {
      "title": "The Object_additional_information Schema",
      "$id": "#/properties/object_additional_information",
      "originalObjectSchema": {
        "type": "object"
      },
      "type": "object"
    },
    "attachments": {
      "title": "The attachments Schema",
      "$id": "#/properties/attachments",
      "originalObjectSchema": {
        "type": "object"
      },
      "type": "object"
    },
    "task_id": {
      "title": "The task_id Schema",
      "$id": "#/properties/task_id",
      "type": "string",
      "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
    },
    "task_published_date": {
      "title": "The task_published_date Schema",
      "$id": "#/properties/task_published_date",
      "type": "string",
      "format": "date-time"
    },
    "task_type": {
      "title": "The task_type Schema",
      "$id": "#/properties/task_type",
      "type": "string"
    },
    "group_id": {
      "title": "The group_id Schema",
      "$id": "#/properties/group_id",
      "type": "string",
      "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
    },
    "environment_id": {
      "title": "The environment_id Schema",
      "$id": "#/properties/environment_id",
      "type": "string",
      "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
    },
    "audience_id": {
      "title": "The audience_id Schema",
      "$id": "#/properties/audience_id",
      "type": "string",
      "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
    },
    "school_id": {
      "title": "The school_id Schema",
      "$id": "#/properties/school_id",
      "type": "string",
      "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
    },
    "lo_id": {
      "title": "The lo_id Schema",
      "$id": "#/properties/lo_id",
      "type": "string",
      "pattern": "^[0-9a-fA-F]{24}$|^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
    },
    "lo_major": {
      "title": "The lo_major Schema",
      "$id": "#/properties/lo_major",
      "type": "string"
    },
    "lo_minor": {
      "title": "The lo_minor Schema",
      "$id": "#/properties/lo_minor",
      "type": "string"
    },
    "content_grouping_id": {
      "title": "The content_grouping_id Schema",
      "$id": "#/properties/content_grouping_id",
      "type": "string",
      "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})|([0-9]+)$"
    },
    "content_parent_id": {
      "title": "The content_parent_id Schema",
      "$id": "#/properties/content_parent_id",
      "type": "string",
      "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
    },
    "page_id": {
      "title": "The page_id Schema",
      "$id": "#/properties/page_id",
      "type": "string"
    },
    "question_id": {
      "title": "The question_id Schema",
      "$id": "#/properties/question_id",
      "type": "string"
    },
    "session_id": {
      "title": "The session_id Schema",
      "$id": "#/properties/session_id",
      "type": "string"
    },
    "content_age_group": {
      "title": "The content_age_group Schema",
      "$id": "#/properties/content_age_group",
      "type": "string"
    },
    "content_subject": {
      "title": "The content_subject Schema",
      "$id": "#/properties/content_subject",
      "type": "string"
    },
    "context_additional_information": {
      "title": "The context_additional_information Schema",
      "$id": "#/properties/context_additional_information",
      "originalObjectSchema": {
        "type": "object"
      },
      "type": "object"
    },
    "current_hyperlink": {
      "title": "The current_hyperlink Schema",
      "$id": "#/properties/current_hyperlink",
      "type": "string",
      "format": "uri"
    },
    "adaptive_engine": {
      "title": "The adaptive_engine Schema",
      "$id": "#/properties/adaptive_engine",
      "type": "string"
    },
    "response": {
      "title": "The response Schema",
      "$id": "#/properties/response",
      "type": "string"
    },
    "score_scaled": {
      "title": "The score_scaled Schema",
      "$id": "#/properties/score_scaled",
      "type": "number",
      "minimum": 0.0,
      "maximum": 100.0
    },
    "score_raw": {
      "title": "The score_raw Schema",
      "$id": "#/properties/score_raw",
      "type": "number",
      "minimum": 0.0,
      "maximum": 100.0
    },
    "score_max": {
      "title": "The score_max Schema",
      "$id": "#/properties/score_max",
      "type": "number",
      "minimum": 0.0,
      "maximum": 100.0
    },
    "success": {
      "title": "The success Schema",
      "$id": "#/properties/success",
      "type": "boolean"
    },
    "completion": {
      "title": "The completion Schema",
      "$id": "#/properties/completion",
      "type": "boolean"
    },
    "fields_response": {
      "title": "The fields_response Schema",
      "$id": "#/properties/fields_response",
      "originalObjectSchema": {
        "type": "object"
      },
      "type": "object"
    },
    "fields_score": {
      "title": "The fields_score Schema",
      "$id": "#/properties/fields_score",
      "originalObjectSchema": {
        "type": "object"
      },
      "type": "object"
    },
    "geogebra": {
      "title": "The geogebra Schema",
      "$id": "#/properties/geogebra",
      "originalObjectSchema": {
        "type": "object"
      },
      "type": "object"
    },
    "result_additional_information": {
      "title": "The result_additional_information Schema",
      "$id": "#/properties/result_additional_information",
      "originalObjectSchema": {
        "type": "object"
      },
      "type": "object"
    }
  },
  "required": [
    "user_id",
    "verb",
    "object_id",
    "object_name",
    "object_type",
    "product",
    "context_referrer",
    "user_role"
  ]
}; // rawEventSchema inserted by server
    const schemaDescription = {
  "version": "1.0",
  "jsonProperties": [
    "object_fields_type",
    "object_fields_graded",
    "object_additional_information",
    "attachments",
    "context_additional_information",
    "fields_response",
    "fields_score",
    "geogebra",
    "result_additional_information"
  ]
}; // schemaDescription inserted by server
    const fieldsSizeLimit = {
  "id":50,
  "timestamp":50,
  "version":50,
  "user_id":50,
  "verb":50,
  "object_id":2000,
  "object_name":2000,
  "object_type":50,
  "interaction_type":50,
  "object_fields_type":10000,
  "object_fields_graded":10000,
  "object_link":2000,
  "object_current_time":50,
  "object_additional_information":10000,
  "registration":50,
  "task_id":50,
  "task_published_date":50,
  "task_type":50,
  "group_id":50,
  "environment_id":50,
  "audience_id":50,
  "school_id":50,
  "lo_id":50,
  "lo_major":10,
  "lo_minor":10,
  "content_language":10,
  "content_grouping_id":50,
  "content_parent_id":50,
  "page_id":50,
  "question_id":100,
  "session_id":50,
  "client_user_agent":500,
  "client_ip":50,
  "content_age_group":50,
  "content_subject":100,
  "product":50,
  "context_referrer":2000,
  "user_role":50,
  "context_additional_information":10000,
  "current_hyperlink":2000,
  "response":10000,
  "fields_response":10000,
  "fields_score":10000,
  "geogebra":10000,
  "result_additional_information":10000,
  "adaptive_engine":50
}; // fieldsSizeLimit inserted by server
    const disableAllEvents = false; // disableAllEvents inserted by server

    const settings = {
      apiUrl: "/bigdataapi/",
      //validatorUrl: "/bigdataapi/resources/ValidateJson.js", // for debug
      validatorUrl: "/bigdataapi/resources/ValidateJson.min.js", 
      rateLimit: {
        maxParallelConnections: 6 // we use keep-alive which raises a limit 0f 6 parallel connections in most browsers
      },
      ignoreUserAgents: [["YandexBot/3.0","http://yandex.com/bots"],["Googlebot/2.1","http://www.google.com/bot.html"],["AdsBot-Google-Mobile","http://www.google.com/mobile/adsbot.html"],["SemrushBot/6~bl","http://www.semrush.com/bot.html"],["AhrefsBot/6.1","http://ahrefs.com/robot/"],["YandexMobileBot/3.0","http://yandex.com/bots"],["AdsBot-Google","http://www.google.com/adsbot.html"]], // list is inserted by server
      errors: {
        timeoutForLog: 1000 // log blocked events after timeoutForLog ms of idle time after failure or success.
      }
    };

    const generateUUID = function () {
      var d = new Date().getTime();
      if (window.performance && typeof window.performance.now === "function") {
        d += performance.now(); //use high-precision timer if available
      }
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
      });
      return uuid;
    };

    var registrationId = generateUUID();

    const getServerTime = function (index) {
      return cet.microservices.apiready.then(() => {
        var url = settings.apiUrl + "Time/GetServerTime?registration=" + registrationId;
        if (index != null && index != undefined)
          url += "&index=" + index;
        return window.cet.microservices.api.get(url, { responseFormat: window.cet.microservices.api.responseFormat.text }).then(milisecondsStr => {
          //Calculate timestamp difference
          var miliseconds = parseInt(milisecondsStr);
          var clientTime = new Date();
          var serverTime = new Date(miliseconds);

          settings.clientTime = clientTime;
          settings.serverTime = serverTime;
          settings.timeDelta = clientTime - serverTime;
        });
      });
    }

    var timeReady = getServerTime();

    // small closure to track and fix client clock changes
    var clientTimeControl = (function () {
      const TestInterval = 1000;
      const ForbiddenTimeSpan = 10000;

      var lastTickTime;
      var timer;
      var gapHandler;
      const verifyTime = function () {
        return new Promise((resolve, reject) => {
          lastTickTime = new Date();
          timer = setTimeout(() => {
            ensureValidTime(new Date());
            resolve();
          }, TestInterval);
        });
      }

      const verifyTimeRecursively = function () {
        // the promise returned is never resolved.
        return new Promise(resolve => {
          verifyTime().then(() => {
            return verifyTimeRecursively()
          });
        });
      }

      const start = function (onGap) {
        gapHandler = onGap;
        return verifyTimeRecursively();
      }

      const pause = function () {
        clearTimeout(timer);
      }

      const restart = function () {
        clearTimeout(timer);
        verifyTimeRecursively();
      }

      const ensureValidTime = function (time) {
        // if time was changed since last tick, fix timeDelta and restart timer.
        //console.debug('ensureValidTime: ', time > lastTickTime && time - lastTickTime < ForbiddenTimeSpan);
        if (time < lastTickTime || (time - lastTickTime) > ForbiddenTimeSpan) {
          pause();
          gapHandler(time - lastTickTime - TestInterval); // take always the full interval to avoid events disordering
          restart();
        }
      }

      return {
        start,
        ensureValidTime
      };
    })();

    const fixTimeDelta = function (timeGap) {
      //console.debug('found time gap of ' + timeGap + '. resetting time...');
      timeReady = getServerTime();
    }
    timeReady.then(clientTimeControl.start.bind(this, fixTimeDelta), () => { });

    //var scriptElement = document.createElement("script");
    //scriptElement.src = "https://api.ipify.org?format=jsonp&callback=getIP";
    //document.head.appendChild(scriptElement);
    //// set callback
    // window.getIP = function(json) {
    //  settings.ip = json.ip;
    //}

    // load event validator script. if failed - don't fail the promise, pass success as parameter to resolver.
    var validatorLoaded = cet.microservices.apiready.then(() => cetms.loadApi(settings.validatorUrl).then(() => true, () => false));

    // the validator does not follow the json.schema standard... see https://github.com/kriszyp/json-schema/issues/38
    const fixSchemaForValidator = function (schema) {
      // 'required' is a list in parent, but the validator expects a boolean in the property.
      if (schema.required) {
        for (var i = 0; i < schema.required.length; i++) {
          schema.properties[schema.required[i]].required = true;
        }
      }
      return schema;
    }

    var finalSchema = fixSchemaForValidator(rawEventSchema);

    const validateEvent = function (event, schema) {
      // first clean json of 'undefined' (not standard json)
      for (var name in event) {
        if (event.hasOwnProperty(name)) {
          if (event[name] === undefined)
            delete event[name];
        }
      }
      // validate
      var validationResult = jsonSchema.validate(event, schema);
      if (validationResult.valid) {
        return {
          valid: true
        };
      }
      else {
        // concatenate errors
        var errors = validationResult.errors;
        var messages = [];
        for (var i = 0; i < errors.length; i++) {
          var err = errors[i];
          // build value up to 100 chars
          var val = "";
          try {
            val = String(event[err.property]);
            if (val.length > 100) {
              val = val.substr(0, 100) + "...";
            }
          }
          catch { }
          messages.push("Error in " + err.property + " {" + String(val) + "}: " + err.message);
        }

        return {
          valid: false,
          message: messages.join("\n") // TODO: separator
        };
      }
    }

    // construct enums from schema
    const generateEnum = function (property, schema) {
      var list = schema.properties[property].enum;
      if (!list)
        return {};
      var enumObj = {};
      for (var i = 0; i < list.length; i++) {
        var val = list[i];
        enumObj[val.replace(/[\.-]/g, '_')] = val;
      }
      return enumObj;
    }

    const applySizeLimit = function (event, fieldsSizeLimit) {
      for (var key in event) {
        if (fieldsSizeLimit[key] > 0)
          if (event[key] && event[key].length > fieldsSizeLimit[key])
            event[key] = event[key].substr(0, fieldsSizeLimit[key]);
      }
    }

    const enums = {
      verbs: generateEnum("verb", finalSchema),
      objectTypes: generateEnum("object_type", finalSchema),
      userRoles: generateEnum("user_role", finalSchema)
    };

    window.bde = window.bde || enums;

    const messages = (() => {

      var registrationCurrentIndex = -1;

      // index for registration
      var nextIndex = function () {
        registrationCurrentIndex++;
        return registrationCurrentIndex;
      };

      const validateUserAgent = function (userAgent) {
        for (var i = 0; i < settings.ignoreUserAgents.length; i++) {
          var testAgent = settings.ignoreUserAgents[i];
          if (userAgent.indexOf(testAgent[0]) >= 0 || userAgent.indexOf(testAgent[1]) >= 0)
            return false;
        }
        return true;
      }

      const validUserAgent = validateUserAgent(navigator.userAgent);

      var connectionPool = new ConnectionPool(settings.rateLimit.maxParallelConnections);
      var errorLogger = new ErrorLogger(settings.errors.timeoutForLog, settings.apiUrl + "Diagnostics/EventErrors?registration=" + registrationId);

      let wordsMeet = /([^^])([A-Z])/g; // search uppercase char after any character not in the beginning of text, capture both (Safari iOS does not support look behind)
      const camelCaseTOLowdashSeparated = function(camelCase)
      {
        if (!camelCase) return camelCase;
        return camelCase.replace(wordsMeet, "$1_$2").toLowerCase();
      }

      // the main function
      const sendCetEvent = (table, verb, objectId, objectName, objectType, product, contextReferrer, userRole, userId, optionalData) => {

        if (disableAllEvents)
          return Promise.resolve();

        if (!validUserAgent)
          return Promise.resolve();

        return new Promise((resolve, reject) => {

          optionalData = optionalData || {};

          // 1. prepare rawEvent (client data wrapped with final property names)
          var baseEvent = { verb, objectId, objectName, objectType, product, contextReferrer, userRole, userId };
          var rawEvent = {};
          for (var key in baseEvent)
            rawEvent[camelCaseTOLowdashSeparated(key)] = baseEvent[key];
          for (key in optionalData)
            rawEvent[camelCaseTOLowdashSeparated(key)] = optionalData[key];

          // 2. validate
          // wait for validator script to load, but if failed - skip validation.
          validatorLoaded.then(validatorReady => {
            if (validatorReady) {
              var validationResult = validateEvent(rawEvent, finalSchema);
              // if invalid, throw an error and reject this promise
              if (!validationResult.valid) {
                var err = new BigDataError(validationResult.message, "ValidationError");
                errorLogger.queueBlockedEventForLog(err, table, registrationId, registrationCurrentIndex, (optionalData || {}).sessionId, userId, verb, product, contextReferrer, objectType, objectId, objectName);

                reject(err);
                return;
              }
            }

            // 2* webclient only: test rate limit
            var connectionAvailable = connectionPool.captureConnection();
            if (!connectionAvailable) {
              // rejected. add to next log
              var err = new BigDataError("Cannot send more than " + settings.rateLimit.maxParallelConnections + " parallel events.", "RateLimitError");
              errorLogger.queueBlockedEventForLog(err, table, registrationId, registrationCurrentIndex, (optionalData || {}).sessionId, userId, verb, product, contextReferrer);

              reject(err);
              return;
            }

            // Now the event is valid. set its unique index.
            var newIndex = nextIndex();

            // 2** webclient only: validate client time
            timeReady = timeReady.then(() => {
              // check client time and fix timeDelta if changed.
              clientTimeControl.ensureValidTime(new Date());
              return Promise.resolve();
            }, (ex) => {
              // previous getServerTime failed. retry getServerTime now
              return getServerTime(newIndex).then(() => {
                clientTimeControl.start(fixTimeDelta);
                return Promise.resolve();
              });
            });

            try {
              // 3. stringify json properties
              var cetEvent = rawEvent;
              var jsonProps = schemaDescription.jsonProperties;
              for (var i = 0; i < jsonProps.length; i++) {
                if (cetEvent[jsonProps[i]] != undefined)
                  cetEvent[jsonProps[i]] = JSON.stringify(cetEvent[jsonProps[i]]);
              }

              // 4. add system properties
              cetEvent.id = generateUUID();
              cetEvent.version = schemaDescription.version;
              cetEvent.client_user_agent = navigator.userAgent;
              //cetEvent.client_ip = settings.ip;
              cetEvent.registration = registrationId;
              cetEvent.index = newIndex;

              applySizeLimit(cetEvent, fieldsSizeLimit);

              return timeReady.then(() => {

                try {
                  var clientTimestamp = new Date();
                  var timestamp = new Date(clientTimestamp.valueOf());
                  timestamp.setMilliseconds(timestamp.getMilliseconds() - settings.timeDelta);
                  cetEvent.timestamp = timestamp.toISOString();
                  cetEvent.timestamp_long = timestamp.getTime();
                  //console.debug('updated time: ', cetEvent.timestamp);
                  var timelog = clientTimestamp.toISOString().replace("T", "_").replace(/:/g, "-"); // readable with no need for escaping

                  // 5. wrap the event
                  var eventsData = {
                    partition: userId.toLowerCase(),
                    table: table,
                    events: [
                      cetEvent
                    ]
                  };

                  // 6. send
                  var url = settings.apiUrl + "Events/SendEvent?registration=" + registrationId + "&index=" + cetEvent.index + "&time=" + timelog;
                  var sendEventSettings = { keepAlive: true, contentType: cetms.contentType.text };

                  cetms.post(url, JSON.stringify(eventsData), sendEventSettings).then((result) => {
                    console.log(result);
                    resolve({ id: cetEvent.id, index: cetEvent.index });
                    errorLogger.logErrorsWhenIdle();
                  }).catch(ex => {
                    // catches errors in post promise
                    console.error(ex);
                    var err = new BigDataError("bigdata.SendCetEvent failed. " + ex.message, ex.name || "SendEventError", ex.stack)
                    errorLogger.queueFailedEventForLog(err, table, cetEvent);
                    reject(err);
                  })
                    .finally(() => {
                      connectionPool.releaseConnection();
                    });
                }
                catch (ex) {
                  // catches errors in preparing to post
                  console.error(ex);
                  connectionPool.releaseConnection();
                  var err = new BigDataError("bigdata.SendCetEvent failed. " + ex.message, ex.name || "SendEventError", ex.stack)
                  errorLogger.queueFailedEventForLog(err, table, cetEvent);
                  reject(err);
                }
              }).catch(ex => {
                // catches errors in GetServerTime (timeReady promise). no need to log.
                console.error(ex);
                connectionPool.releaseConnection();
                reject(new BigDataError("bigdata.SendCetEvent could not get server time.", "StartupError"));
              });
            }
            catch (ex) {
              // catches errors in preparing the event data
              console.error(ex);
              connectionPool.releaseConnection();
              var err = new BigDataError("bigdata.SendCetEvent failed. " + ex.message, "SendEventError", ex.stack)
              errorLogger.queueFailedEventForLog(err, table, cetEvent);
              reject(err);
            }
          });
        });
      };

      const sendLearningEvent = (verb, objectId, objectName, objectType, product, contextReferrer, userRole, userId, optionalData) => {
        return sendCetEvent("Learning", verb, objectId, objectName, objectType, product, contextReferrer, userRole, userId, optionalData);
      };

      const sendUiUsageEvent = (verb, objectId, objectName, objectType, product, contextReferrer, userRole, userId, optionalData) => {
        return sendCetEvent("UIUsage", verb, objectId, objectName, objectType, product, contextReferrer, userRole, userId, optionalData);
      };

      const getProviderInfo = () => {
        return {
          registrationId: registrationId
        };
      };

      // rate limit objects
      //====================

      /**
       * Tool to limit open connections (or any pool)
       * @param {any} maxParallelConnections the number of connections in the pool
       */
      function ConnectionPool(maxParallelConnections) {
        this.availableConnections = maxParallelConnections;
      }
      /**
       * take a connection if available
       */
      ConnectionPool.prototype.captureConnection = function () {
        //console.debug("connections available: " + this.availableConnections);
        if (this.availableConnections > 0) {
          this.availableConnections--;
          return true;
        }

        return false;
      }

      /**
       * return connection to pool
       */
      ConnectionPool.prototype.releaseConnection = function () {
        this.availableConnections++;
      }

      /**
       * Error logging. Sends log of events rejected (before sending, for validation or rate-limit) or failed.
       * @param {any} timeoutForLog time to wait after failure or success before logging errors
       * @param {any} urlForLog end point to log the errors
       */
      function ErrorLogger(timeoutForLog, urlForLog) {
        this.timeoutForLog = timeoutForLog;
        this.urlForLog = urlForLog;

        this.queuedErrors = [];
        this.loggingErrors = false; // flag: log is on the way, do not send new logs.
        this.errorsLogTimeout = null;
      }

      /**
       * add rejected event to next log.
       */
      ErrorLogger.prototype.queueBlockedEventForLog = function (error, table, registration, lastIndex, sessionId, userId, verb, product, contextReferrer, objectType, objectId, objectName) {
        this.queuedErrors.push({
          error: error,
          event: { table, registration, lastIndex, clientTime: new Date().toISOString(), sessionId, userId, verb, product, contextReferrer, objectType, objectId, objectName, userAgent: navigator.userAgent }
        });
        this.logErrorsWhenIdle();
      }

      /**
       * add failed event to next log.
       */
      ErrorLogger.prototype.queueFailedEventForLog = function (error, table, cetEvent) {
        this.queuedErrors.push({
          error: {
            name: error.name,
            message: error.message,
            stack: error.innerStack || error.stack
          },
          event: {
            table: table,
            registration: cetEvent.registration,
            index: cetEvent.index,
            timestamp: cetEvent.timestamp,
            session_id: cetEvent.session_id,
            user_id: cetEvent.user_id,
            verb: cetEvent.verb,
            product: cetEvent.product,
            context_referrer: cetEvent.context_referrer,
            client_user_agent: cetEvent.client_user_agent
          }
        });
        this.logErrorsWhenIdle();
      }

      /**
       * send queued blocked events to log when there is a pause of timeoutForLog in coming events (use on success or failure)
       */
      ErrorLogger.prototype.logErrorsWhenIdle = function () {
        if (this.errorsLogTimeout) {
          clearTimeout(this.errorsLogTimeout);
          this.ErrosLogTimeout = null;
        }
        this.ErrosLogTimeout = setTimeout(this.logErrors.bind(this), this.timeoutForLog);
      }

      /**
       * send queued blocked events to log now.
       */
      ErrorLogger.prototype.logErrors = function () {
        // this function is called after sendEvent success or on timeout set on rateLimit violation.
        //console.debug("blocked events length: " + this.queuedErrors.length + ", loggingErrors: " + this.loggingErrors);
        if (this.loggingErrors || this.queuedErrors.length == 0)
          return Promise.resolve();

        // clear timeout
        this.loggingErrors = true;
        if (this.errorsLogTimeout) {
          clearTimeout(this.errorsLogTimeout);
          this.errorsLogTimeout = null;
        }
        // copy te list and clear
        var errorsToSend = this.queuedErrors.slice(); // copy
        this.queuedErrors = []; // clear list
        // log
        return cetms.post(this.urlForLog, errorsToSend, { responseFormat: window.cet.microservices.api.responseFormat.EMPTY })
          .catch(() => {
            // restore queuedErrors list, preserve newly added events
            this.queuedErrors = errorsToSend.concat(this.queuedErrors);
            // reset timeout
            this.logErrorsWhenIdle();
          })
          .finally(() => {
            this.loggingErrors = false;
          });
      }

      //===========================================
      // bigData.messages object: return public api.

      return {
        sendLearningEvent,
        sendUiUsageEvent,
        getProviderInfo
      };


    })();

    // bigData object: return public api.
    return {
      messages,
      enums
    };
  })();
}

// bigdata custom error
function BigDataError(message, name, innerStack) {
  Error.call(this, message);
  this.name = name || "BigDataError";
  this.message = message;
  if (innerStack)
    this.innerStack = innerStack;
  // skip in stack trace
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, BigDataError);
  }
}
BigDataError.prototype = Object.create(Error.prototype);
BigDataError.constructor = BigDataError;