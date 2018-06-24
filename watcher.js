function Watcher(vm, expOrFn, callback) {
    this.callback = callback;
    this.vm = vm;

    this.expOrFn = expOrFn;
    this.depIds = {};

    if (typeof expOrFn === 'function') {
        this.getter = expOrFn;
    } else {
        this.getter = this.parseGetter(expOrFn);
    }

    this.value = this.get();

}

Watcher.prototype = {
    update: function() {
        this.run();
    },

    run: function() {
        var value = this.get();
        var oldValue = this.value;
        if (value !== oldValue) {
            this.value = value;
            this.callback(this.vm, value, oldValue);
        }

    },

    get: function() {
        Dep.target = this;
        var value = this.getter.call(this.vm, this.vm);
        Dep.target = null;
        return value;
    },

    addDep: function(dep) {
        if (!this.depIds[dep.id]) {
            dep.addSub(this);
            this.depIds[dep.id] = dep;
        }
    },

    parseGetter: function(exp) {
        if (/[^\w.$]/.test(exp)) return; 

        var exps = exp.split('.');

        return function(obj) {
            for (var i = 0, len = exps.length; i < len; i++) {
                if (!obj) return;
                obj = obj[exps[i]];
            }
            return obj;
        }
    }
}