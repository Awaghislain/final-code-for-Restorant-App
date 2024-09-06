
// let products = [
//     {
//         id: 154,
//         name: "White beans",
//         image: "../IMG-20240723-WA0003.jpg",
//         stock: 4,
//         cooktime: 15,
//         price: 5000,
//     },
//     {
//         id: 155,
//         name: "Ndole",
//         image: "../ndule.jpg",
//         stock: 6,
//         cooktime: 15,
//         price: 5000,
//     },
//     {
//         id: 156,
//         name: "Eru",
//         image: "../eru.jpg",
//         stock: 8,
//         cooktime: 30,
//         price: 3000,
//     },
//     {
//         id: 157,
//         name: "Katikati",
//         image: "../katikati.jpg",
//         stock: 2,
//         cooktime: 30,
//         price: 5000,
//     },
//     {
//         id: 157,
//         name: "Katikati",
//         image: "../katikati.jpg",
//         stock: 2,
//         cooktime: 30,
//         price: 5000,
//     },
//     {
//         id: 158,
//         name: "Achu",
//         image: "../Achu.jpg",
//         stock: 2,
//         cooktime: 10,
//         price: 500,
//     },
//     {
//         id: 158,
//         name: "Achu",
//         image: "../Achu.jpg",
//         stock: 2,
//         cooktime: 10,
//         price: 500,
//     },
// ];
// console.log(products)

let products = []
let editProductId;
let carts = []
// ferching for table id from Db
const id = localStorage.getItem("id")
// assingning id to a in it does not have any table using date and time in micro seconds
if(!id){
    localStorage.setItem("id",  "table" + Date.now())
}

function getCartFromDb() {
    const items = JSON.parse(localStorage.getItem("carts"))
    if (items) {
        carts = items
    }
    document.getElementById("count").innerHTML = carts.length
}
getCartFromDb()

// inputing data to a free online server firebase
function getProductsFormDb() {

    //    products =  JSON.parse(localStorage.getItem("products"))
    fetch("https://restaurantapp-624c3-default-rtdb.firebaseio.com/products.json")
    // converting data from online server to json data type
        .then((reponse) => reponse.json())
        .then((data) => {
            document.getElementById("loading").style.display = "none"
            const dbProducts = []
            for (const key in data) {
                const tranformedItems = {
                    ...data[key],
                    id: key
                }
                dbProducts.push(tranformedItems)
            }
            products = dbProducts

            //display the ff products on home page
            for (let item of products) {
                const product = `<div class="cart">
            <img class="plat1" src="${item.image}">

            <div class="descriplat1">
                <p class="dess">
                    ${item.name}
                </p>
                <p style = "">
                     stock:${item.stock}   
                </p>
                <p style = "color: black">
                🕒${item.cooktime} min
                <span class="prix1">${item.price}FCFA</span>
                </p>
                <div class="boutton" onclick = "addToCart('${item.id}')">
                  <i class="fa-solid fa-cart-plus" style ="color : white" ></i>
                </div>
            </div>
        </div>`

                const productDiv = document.getElementById("product_container")
                productDiv.insertAdjacentHTML("afterbegin", product)
            }

        }).catch((error) => {

        })
}
// executing the function getProductsFormDb
getProductsFormDb()

//add dish to cart page and give an alert or pop up mesege tellx user that dish is already added to cart page 
function addToCart(productId) {
    const product = products.find((product) => {
        return product.id === productId
    })

    const existingCartItem = carts.find((cartitem) => {
        return cartitem.productId === productId
    })

    // console.log(existingCartItem)
    if (existingCartItem) {
        return alert("Already added to cart")
    }

    //creatx a cart aray
    const cartItem = {
        productId: product.id,
        price: product.price,
        image: product.image,
        name: product.name,
        quantity: 1,
        user: "Junior",
    }
// pushing content of carts array to cart item
    carts.push(cartItem)
    document.getElementById("count").innerHTML = carts.length

    //storing cart content to local storage  
    localStorage.setItem("carts", JSON.stringify(carts))
}

// function to search food on home page with time enterval    
function searchFood() {
    setTimeout(() => {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const productContainer = document.getElementById('product_container');

        productContainer.innerHTML = ''; // Clear previous results

        products.forEach(product => {
            if (product.name.toLowerCase().includes(searchTerm)) {
                const productHTML = `<div class="cart">
                    <img class="plat1" src="${product.image}">
                    <div class="descriplat1">
                        <p class="dess">${product.name}</p>
                        <p>stock: ${product.stock}</p>
                        <p style="color: black">
                            🕒${product.cooktime} min
                            <span class="prix1">${product.price}FCFA</span>
                        </p>
                        <div class="boutton" onclick="addToCart(${product.id})">
                            <i class="fa-solid fa-cart-plus" style="color: white;"></i>
                        </div>
                    </div>
                </div>`;

                productContainer.insertAdjacentHTML('beforeend', productHTML);
            }
        });
    }, 2000)

}


