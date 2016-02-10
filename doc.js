var fs = require('fs');

var configController = require('./controllers/config/controllers');

console.log('Generating README.md:');

fs.writeFile(
    './README.md',
    getDoc(),
    function (err) {
        if (err) {
            return console.log(err);
        }
        console.log('Done!');
    }
);

function getDoc() {
    return [
        '# BeBeerAPI',
        '## API Reference',
        getControllers()
    ].join('\n');
}

function getControllers() {
    return Object
        .keys(configController)
        .map(function (controllerName) {
            return [
                '### ' + controllerName,
                getActions(controllerName)
            ].join('\n');
        }).join('\n');
}

function getActions(controllerName) {
    var controller = require('./controllers/' + controllerName + 'Controller');
    var actions = configController[controllerName];
    return actions
        .map(getAction(controller, controllerName))
        .join('\n');
}

function getAction(controller, controllerName) {
    return function (actionConfig) {
        var action = controller[actionConfig.action];
        return [
            '#### ' + actionConfig.action,
            action.description,
            '\n',
            'URL: ```' + action.method.toUpperCase() + ' ' + action.url + '```',
            getSchema(controllerName, actionConfig.action)
        ].join('\n');
    }
}

function getSchema(controllerName, actionName) {
    var inputSchema = require('./controllers/schemas/input/' + controllerName + 'Input')[actionName];

    if (!inputSchema || !inputSchema.properties) {
        return '';
    }

    var params = inputSchema.properties.params;
    var body = inputSchema.properties.body;
    var result = [];
    if (params) {
        result.push([
            '##### URL parameters',
            getSchemaPart(params.properties)
        ].join('\n'));
    }
    if (body) {
        result.push([
            '##### Request body',
            getSchemaPart(body.properties)
        ].join('\n'));
    }
    return result.join('\n');
}

function getSchemaPart(schemaPart) {
    return Object
        .keys(schemaPart)
        .map(function (key) {
            return [
                '###### ' + key,
                '```',
                getSchemaPartDescription(schemaPart[key]),
                '```'
            ].join('\n');
        }).join('\n');
}

function getSchemaPartDescription(part) {
    return Object
        .keys(part)
        .map(function (key) {
            return key + ': ' + getFieldDefinition(part[key]);
        })
        .join('\n');
}

function getFieldDefinition(def) {
    if (typeof def === 'string') {
        return '\'' + def + '\'';
    }
    return def;
}