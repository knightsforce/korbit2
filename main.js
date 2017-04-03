/**
 * Реализация API, не изменяйте ее
 * @param {string} url
 * @param {function} callback
 */
function getData(url, callback) {
    var RESPONSES = {
        '/brands': [
            {name: 'Adidas', shop: 'ASOS'},
            {name :'Monki', shop: 'QUELLE'},
            {name: 'Nike', shop: 'H&M'},
            {name: 'Levis', shop: 'Lamoda'},
            {name: 'Asics', shop: 'bonprix'},
            {name: 'Converse', shop: 'ASOS'}
        ],
        '/types': [
            {name: 'Blazers', brand: 'Adidas'},
            {name: 'Coats', brand: 'Monki'},
            {name: 'Dresses', brand: 'Nike'},
            {name: 'Hoodies', brand: 'Levis'},
            {name: 'Jackets', brand: 'Asics'},
            {name: 'Jeans', brand: 'Converse'},
        ],
        '/products': [
            {count: 140, name: 'Blazers'},
            {count: 20, name: 'Coats'},
            {count: 480, name: 'Dresses'},
            {count: 237, name: 'Hoodies'},
            {count: 101, name: 'Jackets'},
            {count: 156, name: 'Jeans'}
        ]
    };

    setTimeout(function () {
        var result = RESPONSES[url];
        if (!result) {
            return callback('Unknown url');
        }
        callback(null, result, url);
    }, Math.round(Math.random * 1000));
}

/**
 * Ваши изменения ниже
 */
var requests = ['/brands', '/types', '/products'];//Запросы
var responses = {};

for (var i = 0; i < requests.length; i++) {
    var request = requests[i];
    var callback = function (error, result, request) {
        /*
            1) Таймауты вызываются после основного потока.
            2) request берется из замыкания.
            3) На момет первого таймаута цикл завершится, но сборщик мусора не отработает,
            т.к. еще есть ссылка на внешние переменные.
            4) По этому i всегда = 3, requests[i] = '/products', данные перезаписываются, l.length != 3.
            5) Нужно передать request в callback, тогда обращение будет к аргументу функции, а не ко внешнему замыканию.
        */
        responses[request] = result;

        var l = Object.keys(responses);
        /*
            Object.keys быстрее 0 мс при 1 000 000 ключей, у for 679 мс.
        */
        /*
            Исходная реализация:
            var l = [];
            for (K in responses) {
                l.push(K);
            }
        */
        

        if (l.length == 3) {
            var c = [], cc = [], p = 0;
            for (var x = 0; x < responses['/brands'].length; x++) {
                if (responses['/brands'][x].shop === 'ASOS') {
                    c.push(responses['/brands'][x].name);
                }
            }

            for (x = 0; x < responses['/types'].length; x++) {
                for (var j = 0; j < c.length; j++) {
                    if (responses['/types'][x].brand === c[j]) {
                        cc.push(responses['/types'][x].name);
                    }
                }
            }

            for (x = 0; x < responses['/products'].length; x++) {
                for (var j = 0; j < cc.length; j++) {
                    if (responses['/products'][x].name === cc[j]) {
                        p += responses['/products'][x].count;
                    }
                }
            }

            console.log('Total products in ASOS: ' + p);
        }
    };

    getData(request, callback);
}