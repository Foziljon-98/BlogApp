
//DOM
const $container = document.querySelector('.cardContainer');
const $submit = document.querySelector('.submit');
const $inputAuthor = document.querySelector('.inputAuthor');
const $inputTitle = document.querySelector('.inputTitle');
const $inputImg = document.querySelector('.inputImg');
const $inputBody = document.querySelector('.inputBody');


const $prevBtn = document.querySelector('.prevBtn');
const $nextBtn = document.querySelector('.nextBtn');
const $page = document.querySelector('.page');
const LIMIT = 10;
let PAGE = 1;
let pageCounter = 1;
let offsetCounter = 1;
const TOTAL_POSTS = 12;
const TOTAL_PAGES = Math.floor(TOTAL_POSTS / LIMIT);







window.addEventListener('load', () =>{

    fetch('http://2.57.186.103:5000/api/posts/') 
    .then(response => response.json()
    )
    .then(res => {
        const temp = res.data.map(item => cardTemplate(item)).join('');
        $container.innerHTML = temp;
    })
    .catch(() => {
        console.log('Not Found');
    })
})


function cardTemplate(item){
    return `
        <div style="
          background: linear-gradient(
            rgba(0, 0, 0, 0.6), 
            rgba(0, 0, 0, 0.6)
          ), url(${item.img}) center / cover;" class="blog-item">
            <h3 class="blog-title">${item.title}</h3>
            <div class="blogBody">
                <p class="blog-body">${item.body}</p>
            </div>
            <div class="date-content">
                <span class="blog-date">${item.date}</span>
                <span class="blog-author">${item.author}</span>
            </div>
            <div class="buttons">
                <button onclick="deleteBlog('${item._id}', 'url')" class="delBtn">Delete blog</button>
                <button onclick="editBlog('${item._id}')" class="editBtn">Edit blog</button>  
            </div>
        </div>
    `
}



// Отправка постов на базу
$submit.addEventListener('click', e => {
    e.preventDefault();

    if(!$inputBody.nodeValue && $inputImg.value && $inputTitle.value && $inputAuthor){
        if($inputBody.value.length > 250){
            alert('Описание не должно превышать 250 символов!');
        }else{
            fetch('http://2.57.186.103:5000/api/posts', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                }, 
                body: JSON.stringify({
                    title: $inputTitle.value,
                    body: $inputBody.value,
                    author: $inputAuthor.value,
                    date: new Date(),
                    img: $inputImg.value
                })
            })
            .then(res => res.json())
            .then(r => {
                console.log(r);
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
            })            
        }
    }else{
        alert('Не все поля заполнены')
    }
})



//Удалить посты
function deleteBlog(id){
    const askDelete = confirm('Are u sure?');
    if(askDelete){
        fetch(`http://2.57.186.103:5000/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json'
        }, 
        })
        .then(res => res.json())
        .then(r => {
            window.location.reload()
        })
        .catch(err => {
            console.log(err);
        })
    }
}


// Изменит посты
function editBlog(id){
    const askEdit = confirm('Are u sure?');
    if(askEdit){
        fetch('http://2.57.186.103:5000/api/posts/', {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json'
        }, 
        body: JSON.stringify({
            _id: id,
            title: prompt('New Title'),
            body: prompt('New body'),
            author: prompt('New author'),                 
            img: prompt ('New img URL'),
        })
        })
        .then(res => res.json())
        .then(r => {
            window.location.reload()
        })
        .catch(err => {
            console.log(err);
        })            
    }
}





// // Pagination

const getRequestPag = (query, cb) =>{
    const baseURL = 'http://2.57.186.103:5000/api/posts/';
    const xhr = new XMLHttpRequest();

    xhr.open('GET', `${baseURL}?${query}`);
    // 'posts', `offset=${offsetCounter += LIMIT}&limit=${LIMIT}

    xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.response);
        cb(response);
    })
    xhr.addEventListener('error', err => {
        console.log('Возникла ошибка!');
    })
    xhr.send();
}




// Pagination

window.addEventListener('load', () => {
    $page.innerHTML = pageCounter;
    $prevBtn.setAttribute('disabled',true);
});


$nextBtn.addEventListener('click', e => {
    e.preventDefault();
    $prevBtn.removeAttribute('disabled');
    if(pageCounter >= 1 && pageCounter <= TOTAL_PAGES){
        if(pageCounter === TOTAL_PAGES){
            $nextBtn.setAttribute('disabled', true);
            getRequestPag(`page=${offsetCounter += PAGE}&limit=${LIMIT}`, res => {                
                pageCounter++;
                $page.innerHTML = pageCounter;
                const temp = res.data.map(item => cardTemplate(item)).join('');
                $container.innerHTML = temp;
            })
        }else{
            getRequestPag(`page=${offsetCounter += PAGE}&limit=${LIMIT}`, res => {
                pageCounter++;
                $page.innerHTML = pageCounter;
                const temp = res.data.map(item => cardTemplate(item)).join('');
                $container.innerHTML = temp;
            })
        }
    }
})



$prevBtn.addEventListener('click', e => {
    e.preventDefault();
    if(pageCounter >= 1){
        pageCounter--;
        if(pageCounter === 1){
            $prevBtn.setAttribute('disabled', true);
            offsetCounter = 0;
            getRequestPag( `page=${offsetCounter -= PAGE}&limit=${LIMIT}`, res =>{
                $page.innerHTML = pageCounter;
                const temp = res.data.map(item => cardTemplate(item)).join('');
                $container.innerHTML = temp;
            })
        }else{
            getRequestPag(`page=${offsetCounter -= PAGE}&limit=${LIMIT}`, res => {
                $nextBtn.removeAttribute('disabled');
                $page.innerHTML = pageCounter;
                const temp = res.data.map(item => cardTemplate(item)).join('');
                $container.innerHTML = temp;
            })
        }
    }
})