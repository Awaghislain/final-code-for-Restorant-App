

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
//         id: 158,
//         name: "Fried Rice",
//         image: "../friedrice.jpg",
//         stock: 2,
//         cooktime: 10,
//         price: 500,
//     },
// ];

// localStorage.setItem("products", JSON.stringify(products))


let products = []
let editProductId;
function getProductsFormDb() {
    fetch("https://restaurantapp-624c3-default-rtdb.firebaseio.com/products.json")
        .then((reponse) => reponse.json())
        .then((data) => {
            const dbProducts = []
            for (const key in data) {
                const tranformedItems = {
                    ...data[key],
                    id: key
                }
                dbProducts.push(tranformedItems)
            }
            products = dbProducts
            displayProducts(products)

        }).catch((error) => {

        })
}
getProductsFormDb()

//displayx table with xters on admin page
function displayProducts(productsItems) {
    const tablebody = document.getElementById("tablebody")
    tablebody.innerHTML = ""
    for (let item of productsItems) {
        const tablerow = document.createElement("tr")
        tablerow.innerHTML = `<td> <img class="imgplat1" src="${item.image}"></td>
                            <td>${item.name}</td>
                            <td>${item.price}FCFA</td>
                            <td>${item.stock}</td>
                            <td>${item.cooktime} min</td>
                            <td>
                            <div style ="display: flex; gap:0.5rem">
                            <div style = "cursor:pointer; font-size:1rem" onclick = "showForm('${item.id}')"><i class="fa-solid fa-pen"></i></div>
                            <div style = "cursor:pointer; font-size:1rem" onclick = "deleteProducts('${item.id}')"><i class="fa-solid fa-trash-can"></i></div>
                            </div>
                            </td>
                            `
        tablebody.appendChild(tablerow)

        //callx for products from Db
        localStorage.setItem("products", JSON.stringify(productsItems))
    }
}

displayProducts(products)

//use java to hide html content
function displayForm() {
    const containerRight = document.getElementById("containerRight")
    const displayFormBtn = document.getElementById("displayFormBtn")

    if (containerRight.style.display === "none") {
        displayFormBtn.innerHTML = "Close"
        containerRight.style.display = "block"
        displayFormBtn.style.backgroundColor = "red"
    } else {
        containerRight.style.display = "none"
        displayFormBtn.innerHTML = "Open"
        displayFormBtn.style.backgroundColor = "blue"
    }
}

//function btn to save new products when inputed by admin 
function saveProduct() {
    const image = document.getElementById("image")
    const price = document.getElementById("price")
    const name = document.getElementById("name")
    const stock = document.getElementById("stock")
    const cooktime = document.getElementById("cooktime")

    if (image.value === "" || price.value === "" || name.value === "" || stock.value === "" || cooktime.value === "") {
        alert("invalid form input")
        return
    }

    const newProduct = {
        name: name.value,
        image: image.value,
        stock: stock.value,
        cooktime: cooktime.value,
        price: price.value,
    }



    //pushx products to fire base 
    fetch("https://restaurantapp-624c3-default-rtdb.firebaseio.com/products.json", {
        method: "POST",
        body: JSON.stringify(newProduct)
    }).then((reponse) => {
        console.log(reponse)
        if (reponse.ok) {
            products.push(newProduct)

            displayProducts(products)
            emptyForm()
        } else {
            alert("error1")
        }
    }).catch((error) => {
        alert("error")
    })
}

// Delete products and update on fire base auto
function deleteProducts(productId) {

    // localStorage.setItem("products", JSON.stringify(products))

    fetch(`https://restaurantapp-624c3-default-rtdb.firebaseio.com/products/${productId}.json`, {
        method: "DELETE",
    }).then((reponse) => {
        console.log(reponse)
        if (reponse.ok) {
            const updateProduct = products.filter((product) => {
                return product.id !== productId
            });
            products = updateProduct
            displayProducts(updateProduct);
        } else {
            alert("error1")
        }
    }).catch((error) => {
        alert("error")
    })
}


//  using java to hide html content
function showForm(productId) {
    editProductId = productId
    const product = products.find((product) => {
        return product.id === productId
    })
    document.getElementById("editbutton").style.display = "block"
    document.getElementById("savebutton").style.display = "none"

    console.log(product)

    document.getElementById("containerRight").style.display = "block"
    document.getElementById("name").value = product.name
    document.getElementById("price").value = product.price
    document.getElementById("stock").value = product.stock
    document.getElementById("cooktime").value = product.cooktime
    document.getElementById("image").value = product.image
}

//emty content
function emptyForm() {
    document.getElementById("name").value = ""
    document.getElementById("price").value = ""
    document.getElementById("stock").value = ""
    document.getElementById("cooktime").value = ""
    document.getElementById("image").value = ""
}

//reset btn allows to reload content
function resetForm() {
    document.getElementById("editbutton").style.display = "none"
    document.getElementById("savebutton").style.display = "block"
    emptyForm()
}


function editProduct() {

    // Getting form data
    const image = document.getElementById("image").value
    const price = document.getElementById("price").value
    const name = document.getElementById("name").value
    const stock = document.getElementById("stock").value
    const cooktime = document.getElementById("cooktime").value

    //send alert if form is invalid
    if (image === "" || price === "" || name === "" || stock === "" || cooktime === "") {
        alert("invalid form input")
        return
    }
// pushx edit products to fire base
    fetch(`https://restaurantapp-624c3-default-rtdb.firebaseio.com/products/${editProductId}.json`, {
        method: "PATCH",
        body: JSON.stringify({
            name: name,
            price: price,
            cooktime: cooktime,
            stock: stock,
            image: image,
        })
    }).then((reponse) => {
        console.log(reponse)
        if (reponse.ok) {
            const index = products.findIndex((product) => {
                return product.id === editProductId
            });

            // Replace elements
            products[index].image = image
            products[index].price = price
            products[index].stock = stock
            products[index].cooktime = cooktime
            products[index].name = name

            displayProducts(products)
            emptyForm()
            editProductId = ""
        } else {
            alert("error1")
        }
    }).catch((error) => {
        alert("error")
    })
}


