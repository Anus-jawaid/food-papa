// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, collection, getDocs, getDoc, addDoc, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyCmEnWGCZQT2Twc8co-m5PAgy99bbbXTcU",
    authDomain: "food-daddy-c48f5.firebaseapp.com",
    projectId: "food-daddy-c48f5",
    storageBucket: "food-daddy-c48f5.appspot.com",
    messagingSenderId: "379326523690",
    appId: "1:379326523690:web:4143a2988fc134a0a5d653"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Register User
function registerUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            Swal.fire({
                title: "User Registered Successfully",
                text: userCredential.user.email,
                icon: "success"
            }).then((result) => {
                if (result.isConfirmed) {
                    location.href = "./login.html";
                }
            });
        })
        .catch((error) => {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.message
            });
        });
}
window.registerUser = registerUser;

// Login User
function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            Swal.fire({
                title: "Login Successful",
                text: userCredential.user.email,
                icon: "success"
            }).then((result) => {
                if (result.isConfirmed) {
                    location.href = "./admin.html";
                }
            });
        })
        .catch((error) => {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.message
            });
        });
}
window.loginUser = loginUser;

// Auth State Check
onAuthStateChanged(auth, (user) => {
    if (user) {
        if (location.pathname.endsWith("index.html") || location.pathname.endsWith("./login.html")) {
            location.href = "./admin.html";
        }
    }
});

// Logout User
function logoutUser() {
    signOut(auth)
        .then(() => {
            Swal.fire({
                title: "Logout Successful",
                icon: "success"
            }).then((result) => {
                if (result.isConfirmed) {
                    location.href = "./login.html";
                }
            });
        })
        .catch((error) => {
            Swal.fire({
                icon: "error",
                title: "Logout Failed",
                text: error.message
            });
        });
}
window.logoutUser = logoutUser;

// Save Product
async function saveProduct() {
    const productid = document.getElementById("productId").value;
    const productname = document.getElementById("productName").value;
    const productprice = document.getElementById("productPrice").value;
    const productdes = document.getElementById("productDescription").value;
    const productimage = document.getElementById("productImage").value;

    try {
        const docRef = await addDoc(collection(db, "items"), {
            productid,
            productname,
            productprice,
            productdes,
            productimage
        });

        Swal.fire({
            title: "Product Added Successfully",
            text: `ID: ${docRef.id}`,
            icon: "success"
        });
        productList();
    } catch (e) {
        console.error("Error adding product:", e);
    }
}
window.saveProduct = saveProduct;

// Product List
const product = document.getElementById("productlist");
if (product) {
    productList();
}

async function productList() {
    const querySnapshot = await getDocs(collection(db, "items"));
    product.innerHTML = "";

    querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        product.innerHTML += `
            <div class="col-md-4">
                <div class="product-card">
                    <img src="${data.productimage}" class="img-fluid" alt="Product Image">
                    <div class="p-3">
                        <h5>${data.productname}</h5>
                        <p>${data.productdes}</p>
                        <h6>Price: ${data.productprice}</h6>
                        <button onclick='saveEdit("${docSnap.id}")' class="btn btn-info me-2">Edit</button>
                        <button onclick='del("${docSnap.id}")' class="btn btn-danger">Delete</button>
                    </div>
                </div>
            </div>`;
    });
}

// Delete Product
async function del(id) {
    await deleteDoc(doc(db, "items", id));
    Swal.fire({
        title: "Product Deleted",
        icon: "success"
    });
    productList();
}
window.del = del;

// Edit Product
let currentEditId = null;

async function saveEdit(id) {
    const docSnap = await getDoc(doc(db, "items", id));
    const data = docSnap.data();

    currentEditId = id;

    document.getElementById("editProductId").value = id;
    document.getElementById("editProductName").value = data.productname;
    document.getElementById("editProductPrice").value = data.productprice;
    document.getElementById("editProductDescription").value = data.productdes;
    document.getElementById("editProductImage").value = data.productimage;

    new bootstrap.Modal(document.getElementById("editProductModal")).show();
}
window.saveEdit = saveEdit;

// Update Product
async function updateProduct() {
    const id = currentEditId;
    const updatedName = document.getElementById("editProductName").value;
    const updatedPrice = document.getElementById("editProductPrice").value;
    const updatedDescription = document.getElementById("editProductDescription").value;
    const updatedImage = document.getElementById("editProductImage").value;

    try {
        await updateDoc(doc(db, "items", id), {
            productname: updatedName,
            productprice: updatedPrice,
            productdes: updatedDescription,
            productimage: updatedImage
        });

        Swal.fire({
            title: "Product Updated",
            icon: "success"
        });

        bootstrap.Modal.getInstance(document.getElementById("editProductModal")).hide();
        productList();
    } catch (error) {
        console.error("Error updating product:", error);
    }
}
window.updateProduct = updateProduct;

// User Side: Load Products
const userdiv = document.getElementById("userdiv");
if (userdiv) {
    userdata();
}

async function userdata() {
    const querySnapshot = await getDocs(collection(db, "items"));
    userdiv.innerHTML = "";

    querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        userdiv.innerHTML += `
            <div class="col-md-3">
                <div class="product-card">
                    <img src="${data.productimage}" alt="Product Image">
                    <div class="p-3">
                        <h5>${data.productname}</h5>
                        <p>${data.productdes}</p>
                        <h6>Price: ${data.productprice}</h6>
                        <button class="btn btn-primary" onclick='addcrt("${docSnap.id}", "${data.productname}", "${data.productprice}", "${data.productdes}", "${data.productimage}")'>Add To Cart</button>
                    </div>
                </div>
            </div>`;
    });
}

// Cart Logic
let num = 0;
const cart = document.getElementById("cart");

async function addcrt(productid, productname, productprice, productdes, productimage) {
    try {
        await addDoc(collection(db, "cart"), {
            id: productid,
            name: productname,
            price: productprice,
            des: productdes,
            image: productimage
        });

        Swal.fire({
            title: "Added to Cart",
            icon: "success"
        });

        num++;
        if (cart) {
            cart.innerHTML = num;
        }
    } catch (e) {
        console.error("Error adding to cart:", e);
    }
}
window.addcrt = addcrt;



let ShowCart = document.getElementById('showCart');
async function cartData() {
     const querySnapshot = await getDocs(collection(db, "cart"));
    querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        ShowCart.innerHTML += `
            <div class="col-md-3">
                <div class="product-card">
                    <img src="${data.image}" class="img-fluid" alt="Product Image">
                    <div class="p-3">
                        <h5>${data.name}</h5>
                        <p>${data.des}</p>
                        <h6>Price: ${data.price}</h6>
                        
                    </div>
                    <div class="d-flex justify-content-around">
                    <button class="btn btn-warning"> + </button>
                    <button class="btn btn-danger"> - </button>
                    </div>
                </div>

            </div>`;
    });
}
if(ShowCart){
    cartData();
}