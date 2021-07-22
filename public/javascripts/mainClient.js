const totalAmount = document.querySelector('.totalResult');

// emiter написанный для данной корзины, не понятно что в средине, 
// но без него страницу приходится перегружать для обновления инфо заказа
const ownEmiter = function(){
    const list = {};
    this.on = (eventName, cb) => {
        if(!list[eventName]){
            list[eventName] = [];
        }

        list[eventName].push(cb);
    }

    this.emit = (eventName, data) => {
        if(!list[eventName]){
            return;
        }

        list[eventName].forEach(cb => {
            cb(data);
        });
    }
}

// созданное нами событие - по любому изменению (change) срабатвает on вместо addEventListener
const cartEmit = new ownEmiter();
cartEmit.on('change', () => {
    console.log('change');
});

//Model
// преобразовываем в json и отдаем в storage
const sendCartToStore = (data) => {
    const storeJson = JSON.stringify(data);
    localStorage.setItem('cart', storeJson);
}

// получаем товар в корзине из storage 
const getCartFromStore = () => {
    const dataJson = localStorage.getItem('cart') || '[]';
    const dataIncart = JSON.parse(dataJson); 
    return dataIncart;
}

// Controllers
// получаем список товара из БД (с сервера)
const getProducts = async () => {
const { data } = await axios.get('/product/list');     
return data;
} 

// добавляем товар в корзину (событие по кнопке buy)
const addToCard = (data) => {
    const cartData = getCartFromStore();                           // достаем данные из localStorage
    const { id } = data;
    const productIndex = cartData.findIndex(el => el.id === id);  // ищем товар с id по индексу товара в массиве
    //console.log(productIndex);
    if(productIndex === -1){                                      // если товар не найден, отдаем данніе и создаем кол-во 1
        cartData.push({ ...data, quantity: 1 });
    } 
    else {
        cartData[productIndex].quantity += 1;                     // если товар найден, добавляем к кол-ву +1
    }
    //console.log(cartData);
    sendCartToStore(cartData);                                    // отдаем обновленные данные в localStorage
    cartEmit.emit('change');                                      // при любом изменении товара в корзине срабатывает событие 'on' 
}

// добавить количество по кнопке +
const addQuantity = (data) => {
    const cartData = getCartFromStore();                           // достаем данные из localStorage
    const { id } = data;
    const productIndex = cartData.findIndex(el => el.id === id);  // ищем товар с id по индексу товара в массиве
    if(cartData[productIndex] === 0){                             // если товар не найден, отдаем данные и создаем кол-во 1
        cartData.splice(productIndex, 1);
    } else {
        cartData[productIndex].quantity += 1;                     // если товар найден, добавляем к кол-ву +1
    }

    sendCartToStore(cartData);                                    // отдаем обновленные данные в localStorage
    cartEmit.emit('change');                                      // при любом изменении товара в корзине срабатывает событие 'on'  
}

// уменьшить количество по кнопке -
const substractQuantity = (data) => {
    const cartData = getCartFromStore();                           // достаем данные из localStorage
    const { id } = data;
    const productIndex = cartData.findIndex(el => el.id === id);  // ищем товар с id по индексу товара в массиве
    if(cartData[productIndex] === 0){                             // если товар не найден, отдаем данные и создаем кол-во 1
        cartData.splice(productIndex, 1);
    } else {
        cartData[productIndex].quantity -= 1;                     // если товар найден, отнимаем от кол-ва -1
    }

    sendCartToStore(cartData);                                    // отдаем обновленные данные в localStorage
    cartEmit.emit('change');                                      // при любом изменении товара в корзине срабатывает событие 'on'  
}

// генерим карточку товара и отправляем список товара (карточку) на сраницу в div-itemsList
const renderItems = async () => {
    const itemsList = await getProducts();                         
    const html = itemsList.reduce((acc, item) => {
        acc = `${acc}<div class="card">
        <img src="${item.img}" alt="${item.id}"><br>
        <h2>${item.title}</h2>
        <div class="price">Price: ${item.price}$</div><br>
        <button type="button" class="btn-buy"
            data-id="${item.id}" 
            data-img="${item.img}"
            data-title="${item.title}" 
            data-price="${item.price}"
            >
        Add to cart
         </button>
        </div>`;
        return acc;
    }, '');

    const mainEl = document.querySelector('.itemsList');
    mainEl.innerHTML = html;

    mainEl.querySelectorAll('.btn-buy').forEach((el) => {
        el.addEventListener('click', (ev) => {
        //console.log(ev.target.dataset.id);
        const { dataset } = ev.target;
        const data = { ...dataset };        // вернет объект {id,title,price, img}
        // console.log(data);
        addToCard(data);
        });
    });
}


// рисуем корзину со списком товара и отдаем на сраницу
const renderCart = async () => {
    const getCartItems = await getCartFromStore();   //достаем содержимое корзины
    //console.log(getCartItems)
    const htmlCart = getCartItems.reduce((acc, item) => {
        acc.itemsHtml.push(`
        <tr class="order" data-id="${item.id}">
            <td><img src="${item.img}" class="cart-img" alt="${item.id}"></td>
            <td><span>${item.title}</span></td>
            <td><button type="button" class="btn-minus" data-id="${item.id}"> - </button>
                <div>${item.quantity}</div>
                <button type="button" class="btn-add" data-id="${item.id}"> + </button></td>
            <td>${item.price}$</td>
        </tr>`);
        return acc;
    }, { itemsHtml: [] });

    
    const mainEl = document.querySelector('.tablesBody');        
    const order = `${htmlCart.itemsHtml.join('')}`;
    mainEl.innerHTML = order;
 

    mainEl.querySelectorAll('.btn-add').forEach((item) => {     // находим все кнопки + и для каждой работает это событие
        item.addEventListener('click', (ev) => {
            const { dataset } = ev.target; 
            const data = { ... dataset };                       // вернет объект {id, title, price, img}
            addQuantity(data);
        });
    });

    mainEl.querySelectorAll('.btn-minus').forEach((item) => {   // находим все кнопки - и для каждой работает это событие
        item.addEventListener('click', (ev) => {
        //console.log(ev.target.dataset);
        const { dataset } =ev.target;
        const data = {...dataset} 
        //console.log(data);
        substractQuantity(data);
        });
    });

    // выводим общую сумму заказа   
    const itemSum = getCartItems.reduce((acc, item) => {
        acc += (item.price * item.quantity);
        return acc;
    }, 0);
    // const totalAmount = document.querySelector('.totalResult');
    totalAmount.setAttribute('value', itemSum);             // добавляем элементу атрибут со значением суммы, которую мы просчитали
    //console.log(totalAmount) 
    totalAmount.innerHTML = itemSum;
    
} 


// функция запускатора других функций
const init = () => {
    renderItems();
    renderCart();
    cartEmit.on('change', renderCart);
}
init();



// форма со страницы заказа
const siteForm = document.forms.OrderInfo;
siteForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();

    const formData = new FormData(ev.target);
   
    const storeJson = localStorage.getItem('cart');
    //console.log(storeJson);
    const amountToPay = totalAmount.getAttribute('value');  // получаем значение, которое записали ранее через атрибут
    //console.log(amountToPay)
    formData.append('order', storeJson);
    formData.append('amount', amountToPay);

    const { data } = await axios.post('/order', formData);

     console.log('res:', data)
});






// const buyBtns = document.querySelectorAll('.btn-buy');

// buyBtns.forEach((el) => {

//     el.addEventListener('click', (ev) => {
//     //console.log(ev.target.dataset.id);
//     const { id, title, price } = ev.target.dataset;
//     // localStorage.setItem('store', id );                   // записываем в сторедж - указываем название ключа(store) и что записать(id),  store - так обозначили корзину
//     const dataJson = localStorage.getItem('store') || '[]';  // получаем id или пустой массив(обьект) в формате json
//     const data = JSON.parse(dataJson);                       // парсим из строки в удобный нам формат 
    
//     //data.push({ id: id, title: title, price: price });

//     const addToCard = () => {
//     console.log(price)
//     console.log(data[id])
//         if (data[id] !== undefined) {
//             data[id] += 1;
//             // sum += price;
//             // data.push({ id, qwt: data[id], sum: sum });
//         }
//         else {
//             data[id] = 1;
//             //data.push({ id, data[id], price });
//         }
//     }
//     addToCard();  
    
//     const storeJson = JSON.stringify( data );     // преобразовываем в Json 

//     localStorage.setItem('store', storeJson);

//     });

// });