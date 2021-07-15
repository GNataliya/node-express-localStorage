const buyBtns = document.querySelectorAll('.btn-buy');

buyBtns.forEach((el) => {

    el.addEventListener('click', (ev) => {
    //console.log(ev.target.dataset.id);
    const { id, title, price } = ev.target.dataset;
    // localStorage.setItem('store', id );                   // записываем в сторедж - указываем название ключа(store) и что записать(id),  store - так обозначили корзину
    const dataJson = localStorage.getItem('store') || '[]';  // получаем id или пустой массив(обьект) в формате json
    const data = JSON.parse(dataJson);                       // парсим из строки в удобный нам формат 
    
    //data.push({ id: id, title: title, price: price });

    const addToCard = () => {
    console.log(price)
    console.log(data[id])
        if (data[id] !== undefined) {
            data[id] += 1;
            // sum += price;
            // data.push({ id, qwt: data[id], sum: sum });
        }
        else {
            data[id] = 1;
            //data.push({ id, data[id], price });
        }
    }
    addToCard();  
    
    const storeJson = JSON.stringify( data );     // преобразовываем в Json 

    localStorage.setItem('store', storeJson);

    });

});