export class MyVue {
    constructor(config) {
        this.template = document.querySelector(config.el);
        this.data = config.data;
    }
}

//let effects = [];
let effects = new Map();

let currentEffect = null;
function effect(fn) {
    //vue做了依赖收集
    //effects.push(fn);

    currentEffect = fn;
    fn();
    currentEffect =null;
}
//只能对对象，不能使用值类型
function reactive(object) {
    let observed = new Proxy(object, {
        get(obj, prop) {
            //console.log(obj, prop);
            if(currentEffect) {
                if(!effects.has(obj)) {
                    effects.set(obj, new Map);
                }
                if(!effects.get(obj).has(prop)) {
                    effects.get(obj).set(prop, new Array);
                }
                effects.get(obj).get(prop).push(currentEffect);
            }
            return obj[prop];
        },
        set(obj,prop,val) {

            obj[prop] = val;

            if(effects.has(obj) && effects.get(obj).has(prop)) {

                for(let effect of effects.get(obj).get(prop)) {
                    effect();
                }
            }
            //每次set会执行所有的effect？
            //多个effect共用一个effects;
            //for(let effect of effects) {
                //effect();
            //}
            return val;
        }
    })
    return observed;
}
let dummy;
const counter = reactive({num:0});
effect(() =>(dummy = counter.num));
console.log(dummy);
counter.num = 7;
console.log(dummy);
//let o2 = reactive({a:1});