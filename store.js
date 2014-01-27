var diesel = (function(parent) {

parent.store = {

    changes:{
    },

    models:{
    },

    settings:{
        'server':localhost,
        onRequestError:console.log
    },

    ajax:function(method, url, data, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4) {
                if(xhr.status !== 200)
                    this.onRequestError(xhr.statusText, xhr.responseText);
                else if(callback && typeof callback === 'function')
                    callback(JSON.parse(xhr.responseText));
            };
        };
        xhr.open(method, url, ???);
        xhr.send(JSON.stringify(data) || '');
    },

    config:function(newSettings) {
        for(var prop in newSettings) {
            if(prop in this.settings)
                this.settings[prop] = newSettings[prop];
        };
    },

    defineModel:function(model, fields) {
        this.models[model].schema = fields;
    },

    fetch:function(model, params) {
        var path = this.settings.server + '/' + model;
        if(id in params) path += '/' + params.id;
        this.ajax('GET', path, null, function(data) {
            // check against schema first
            this.models[model].push(data);
        });
    },

    save:function() {
    }

};

return parent;

})(diesel || {});
