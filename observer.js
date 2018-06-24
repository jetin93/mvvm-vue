var obj = {name: 'jiating'};

function obeserve(value) {
    if (typeof value !== 'object') {
        return;
    }
    return new Obeserver(value);
}

function Obeserver(data) {
    this.data = data;
    this.walk(data);
}

Obeserver.prototype = {
    walk: function(data) {
        var that = this;
        Object.keys(data).forEach(function(key) {
            this.convert(data[key], key);
        })
    },
    convert: function(value, key) {
        this.defineReactive(this.data ,value, key)
    },
    defineReactive: function(data,value, key) {
        var dep = new Dep();
        obeserve(value);

        Object.defineProperty(data, key, {
            configurable: false, // 不能再define了
            enumerable: true, // 
            set: function(newValue) {
                console.log('哈哈哈，监听到值的变化啦，' + value + '===>' + newValue)
                value = newValue;
                obeserve(newValue); // 如果新值是object的话 进行监听

                // 通知订阅者
                dep.notify();
            },
            get: function() {
                if (Dep.target) {
                    dep.depend();
                }
                return value;
            }
        })
    }
}



var uid = 0;

function Dep() {
    this.id = uid++;
    this.subs = [];
}

Dep.prototype = {
    addSub: function(sub) {
        this.subs.push(sub);
    },
    depend: function() {
        Dep.target.addDep(this);
    },
    notify: function() {
        this.subs.forEach(function(sub) {
            sub.update();
        })
    },
    removeSub: function(sub) {
        var index = this.subs.indexOf(sub);
        if (index !== -1) {
            this.subs.splice(index, 1);
        }
    }
}

Dep.target = null;
