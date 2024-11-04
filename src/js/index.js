/// <reference types="../@types/jquery" />
///////////////////////////////////////////////////////
// start aside
$("#toggleIcons i").on("click", function () {
    $("#toggleIcons i").removeClass("hidden")
    $(this).addClass("hidden")
})
$("#open").on("click", function () {
    $("aside").removeClass("translate-x-[calc(-100%+66px)]")
    $("#Search").animate({ top: "0px" }, 500)
    $("#Categories").animate({ top: "0px" }, 600)
    $("#Area").animate({ top: "0px" }, 700)
    $("#Ingredients").animate({ top: "0px" }, 800)
    $("#Contact").animate({ top: "0px" }, 900)
})
$("#close").on("click", function () {
    $("aside").addClass("translate-x-[calc(-100%+66px)]")
    $("#Search").animate({ top: "300px" }, 500)
    $("#Categories").animate({ top: "300px" }, 500)
    $("#Area").animate({ top: "300px" }, 500)
    $("#Ingredients").animate({ top: "300px" }, 500)
    $("#Contact").animate({ top: "300px" }, 500)
})
$(".taps a").on("click", function () {
    $("aside").addClass("translate-x-[calc(-100%+66px)]")
    $("#close").addClass("hidden")
    $("#open").removeClass("hidden")
    $("#Search").animate({ top: "300px" }, 500)
    $("#Categories").animate({ top: "300px" }, 500)
    $("#Area").animate({ top: "300px" }, 500)
    $("#Ingredients").animate({ top: "300px" }, 500)
    $("#Contact").animate({ top: "300px" }, 500)
    $("#nameInput").val("")
    $("#letterInput").val("")
    $("#searchPhotos").html(`<div
                                    class="search-loading hidden min-h-[calc(100vh-86px)] justify-center items-center absolute w-full h-full bg-[#0d0d0d] z-50 text-white text-[80px]">
                                    <i class="fa-solid fa-spinner fa-spin"></i>
                                </div>`
    )
})
$("#Search").on("click", function () {
    $(".all-sections").addClass("hidden")
    $("#serchSection").removeClass("hidden")
})
// end aside
// start default 
let data = []
async function searchDefault() {
    $(".loading").removeClass("hidden").addClass("flex")
    const api = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
    const response = await api.json();
    data = response.meals.slice(0, 20);
    displayMeals()
    $(".loading").removeClass("flex").addClass("hidden")
}
searchDefault()

function displayMeals() {
    let contain = ``
    for (var i = 0; i < data.length; i++) {
        contain += `
                    <div class="card rounded-[.375rem] hover:cursor-pointer overflow-hidden relative group" meal-id=${data[i].idMeal}>
                        <img src="${data[i].strMealThumb}" class="w-full" alt="${data[i].strMeal} image">
                        <div class="caption absolute p-[10px] top-0 left-0 right-0 bottom-0 bg-[#ffffffcf] flex items-center group-hover:translate-y-[0%] translate-y-[100%] transition-transform duration-[0.5s]">
                            <h3 class="text-[25px] font-semibold">${data[i].strMeal}</h3>
                        </div>
                    </div>
                `
    }
    $("#mealsphotos").html(contain)
    $(".card").on("click", function () {
        searchByID($(this).attr("meal-id"))
    })
}
// end default 
// start search by ID
async function searchByID(id) {
    $(".loading").removeClass("hidden").addClass("flex")
    const api = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const response = await api.json();
    let meal = response.meals[0]
    // for loop to check ingredients
    let ingredientsList = "";

    for (let i = 1; i <= 20; i++) {
        const ingredientKey = `strIngredient${i}`;
        const measureKey = `strMeasure${i}`;

        if (meal[ingredientKey]) {
            ingredientsList += `<li class="bg-[#cff4fc] p-[4px] m-[8px] rounded-[7px]">${meal[measureKey]} ${meal[ingredientKey]}</li>`;
        }
    }
    //end of foor loop
    // for loop to check tags
    let taglist = "";
    if (meal.strTags != null) {
        let tags = meal.strTags.split(",")
        for (let i = 0; i < tags.length; i++) {
            taglist += `
        <li class="bg-[#f8d7da] p-[4px] m-[8px] rounded-[7px]">${tags[i]}</li>
        `
        }
    }

    // end of check tags
    let contain = `<div class="flex flex-col md:flex-row py-[48px] md:px-[60px] text-[#f9f6f6]">
                <div class="md:w-[calc(100%/3)] w-full px-[12px]" id="detailsphoto">
                    <img src="${meal.strMealThumb}" class="w-full rounded-[.5rem]" alt="${meal.strMeal} thumbnail">
                    <h2 class="text-[29.7px] font-semibold">${meal.strMeal}</h2>
                </div>
                <div class="md:w-[calc((100%/3)*2)] w-full px-[12px]">
                    <h2 class="text-[29.7px] font-semibold mb-[8px]">Instructions</h2>
                    <p>${meal.strInstructions}</p>
                    <h3 class="text-[27px]"><span class="font-bold">Area : </span><span class="font-semibold capitalize">${meal.strArea}</span></h3>
                    <h3 class="text-[27px]"><span class="font-bold">Category : </span><span class="font-semibold capitalize">${meal.strCategory}</span></h3>
                    <h3 class="text-[27px] font-semibold">Recipes :</h3>
                    <ul class="flex flex-wrap text-[#055160] mb-[16px]" id="ingri">
                        ${ingredientsList}
                    </ul>
                    <h3 class="text-[28px] font-semibold mb-[10px]">Tags :</h3>
                    <ul class="flex flex-wrap text-[#842029] mb-[16px]" >
                        ${taglist}
                    </ul>
                    <a href="${meal.strSource}" target="_blank" class="bg-[#198754] hover:bg-[#157347] transition-colors py-[6px] px-[12px] rounded">Source</a>
                    <a href="${meal.strYoutube}" target="_blank" class="bg-[#dc3545] hover:bg-[#bb2d3b] transition-colors py-[6px] px-[12px] rounded">Youtube</a>
                </div>
            </div>
    
    `
    $("#details .container").html(contain)
    $(".all-sections").addClass("hidden")
    $("#details").removeClass("hidden")
    $(".loading").removeClass("flex").addClass("hidden")
}

// end search by ID


// start search

let searchData = []
async function searchByName(name) {
    $(".search-loading").removeClass("hidden").addClass("flex")
    const api = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
    const response = await api.json();
    if (response.meals) {
        searchData = response.meals.slice(0, 20);
        displaySearch()
    }
    else {
        $("#searchPhotos").html("")
    }

    $(".search-loading").removeClass("flex").addClass("hidden")
}
$("#nameInput").on("input", function () {
    $("#searchPhotos").html(`<div
        class="search-loading hidden min-h-[calc(100vh-86px)] justify-center items-center absolute w-full h-full bg-[#0d0d0d] z-50 text-white text-[80px]">
        <i class="fa-solid fa-spinner fa-spin"></i>
    </div>`
    )
    searchByName($("#nameInput").val())
})
function displaySearch() {
    let contain = ``
    for (var i = 0; i < searchData.length; i++) {
        contain += `
                    <div class="card rounded-[.375rem] hover:cursor-pointer h-[fit-content] overflow-hidden relative group" meal-id=${searchData[i].idMeal}>
                        <img src="${searchData[i].strMealThumb}" class="w-full" alt="${searchData[i].strMeal} image">
                        <div class="caption absolute p-[10px] top-0 left-0 right-0 bottom-0 bg-[#ffffffcf] flex items-center group-hover:translate-y-[0%] translate-y-[100%] transition-transform duration-[0.5s]">
                            <h3 class="text-[25px] font-semibold">${searchData[i].strMeal}</h3>
                        </div>
                    </div>
                `
    }
    $("#searchPhotos").html(contain)
    $(".card").on("click", function () {
        $(".all-sections").addClass("hidden")
        searchByID($(this).attr("meal-id"))
    })
}

async function searchByFirstLetter(letter) {

    $(".search-loading").removeClass("hidden").addClass("flex")
    const api = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    const response = await api.json();
    if (response.meals) {
        searchData = response.meals.slice(0, 20);
        displaySearch()
    }
    else {
        $("#searchPhotos").html(`<div
                                    class="search-loading hidden min-h-[calc(100vh-86px)] justify-center items-center absolute w-full h-full bg-[#0d0d0d] z-50 text-white text-[80px]">
                                    <i class="fa-solid fa-spinner fa-spin"></i>
                                </div>`
        )
    }

    $(".search-loading").removeClass("flex").addClass("hidden")

}
$("#letterInput").on("input", function () {
    if ($("#letterInput").val() != "") {
        searchByFirstLetter($("#letterInput").val())
    }
    if ($("#letterInput").val() == "") {
        $("#searchPhotos").html(`<div
            class="search-loading hidden justify-center min-h-[calc(100vh-86px)] items-center absolute w-full h-full bg-[#0d0d0d] z-50 text-white text-[80px]">
            <i class="fa-solid fa-spinner fa-spin"></i>
        </div>`
        )
    }

})

// end search

// start category
let catData = []
async function category() {

    $(".loading").removeClass("hidden").addClass("flex")
    const api = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    const response = await api.json();
    catData = response.categories
    displayCategory()
    $(".loading").removeClass("flex").addClass("hidden")

}
$("#Categories").on("click", function () {
    $(".all-sections").addClass("hidden")
    $("#categoriesSection").removeClass("hidden")
    category()
})
function displayCategory() {
    let contain = ``
    for (var i = 0; i < catData.length; i++) {
        contain += `
                    <div class="card rounded-[.357rem] hover:cursor-pointer  overflow-hidden relative group" onclick="getCategoryMeals('${catData[i].strCategory}')">
                        <img src="${catData[i].strCategoryThumb}" class="w-full" alt="${catData[i].strCategory} thumbnail">
                        <div class="caption absolute p-[10px] top-0 left-0 right-0 bottom-0 bg-[#ffffffcf] flex flex-col text-center  group-hover:translate-y-[0%] translate-y-[105%] transition-transform duration-[0.5s]">
                            <h3 class="text-[25px] font-semibold">${catData[i].strCategory}</h3>
                            <p>${catData[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                        </div>
                    </div>
                `
    }
    $("#categoryPhotos").html(contain)
}
let categoryMeals = []
async function getCategoryMeals(category) {

    $(".loading").removeClass("hidden").addClass("flex")
    const api = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    const response = await api.json();
    categoryMeals = response.meals.slice(0, 20)
    displayCategoryMeals()
    $(".loading").removeClass("flex").addClass("hidden")
}
function displayCategoryMeals() {
    let contain = ``
    for (var i = 0; i < categoryMeals.length; i++) {
        contain += `
                    <div class="card rounded-[.375rem] hover:cursor-pointer  overflow-hidden relative group" onclick="searchByID('${categoryMeals[i].idMeal}')">
                        <img src="${categoryMeals[i].strMealThumb}" class="w-full" alt="${categoryMeals[i].strMeal} thumbnail">
                        <div class="caption absolute p-[10px] top-0 left-0 right-0 bottom-0 bg-[#ffffffcf] flex  items-center  group-hover:translate-y-[0%] translate-y-[105%] transition-transform duration-[0.5s]">
                            <h3 class="text-[25px] font-semibold">${categoryMeals[i].strMeal}</h3>
                        </div>
                    </div>
                `
    }
    $("#categoryPhotos").html(contain)
}
// end category
// start areas
let areasData = []
async function getAreas() {
    $(".loading").removeClass("hidden").addClass("flex")
    const api = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    const response = await api.json();
    areasData = response.meals
    displayAreas()
    $(".loading").removeClass("flex").addClass("hidden")

}

$("#Area").on("click", function () {
    $(".all-sections").addClass("hidden")
    $("#areaSection").removeClass("hidden")
    getAreas()
})
function displayAreas() {
    let contain = ``
    for (var i = 0; i < areasData.length; i++) {
        contain += `
                    <div class="area text-[#f9f6f6] flex flex-col items-center hover:cursor-pointer" onclick="getAreaMeals('${areasData[i].strArea}')">
                        <i class="fa-solid fa-house-laptop text-[70px]"></i>
                        <h3 class="text-[28px] mb-[8px] font-semibold">${areasData[i].strArea}</h3>
                    </div>
                    `
    }
    $("#areaPhotos").html(contain)
}
let areaMeals = []
async function getAreaMeals(area) {
    $(".loading").removeClass("hidden").addClass("flex")
    const api = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    const response = await api.json();
    areaMeals = response.meals.slice(0, 20)
    displayAreaMeals()
    $(".loading").removeClass("flex").addClass("hidden")
}
function displayAreaMeals() {
    let contain = ``
    for (var i = 0; i < areaMeals.length; i++) {
        contain += `
                    <div class="card rounded-[.375rem] hover:cursor-pointer  overflow-hidden relative group" onclick="searchByID('${areaMeals[i].idMeal}')">
                        <img src="${areaMeals[i].strMealThumb}" class="w-full" alt="${areaMeals[i].strMeal} thumbnail">
                        <div class="caption absolute p-[10px] top-0 left-0 right-0 bottom-0 bg-[#ffffffcf] flex  items-center  group-hover:translate-y-[0%] translate-y-[105%] transition-transform duration-[0.5s]">
                            <h3 class="text-[25px] font-semibold">${areaMeals[i].strMeal}</h3>
                        </div>
                    </div>
                `
    }
    $("#areaPhotos").html(contain)
}

// end areas
// start ingredients

let ingreData = []
async function getIngredients() {
    $(".loading").removeClass("hidden").addClass("flex")
    const api = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    const response = await api.json();
    ingreData = response.meals.slice(0, 20)
    displayIngerdients()
    $(".loading").removeClass("flex").addClass("hidden")

}
$("#Ingredients").on("click", function () {
    $(".all-sections").addClass("hidden")
    $("#ingreSection").removeClass("hidden")
    getIngredients()
})

function displayIngerdients() {
    let contain = ``
    for (var i = 0; i < ingreData.length; i++) {
        contain += `
                    <div class="area text-[#f9f6f6] flex flex-col items-center text-center hover:cursor-pointer"
                    onclick="getIngreMeals('${ingreData[i].strIngredient}')">
                        <i class="fa-solid fa-drumstick-bite text-[70px]"></i>
                        <h3 class="text-[28px] mb-[8px] font-semibold">${ingreData[i].strIngredient}</h3>
                        <p>${ingreData[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
                    </div>
                    `
    }
    $("#ingrePhotos").html(contain)
}
let ingreMeals = []
async function getIngreMeals(ingredient) {
    $(".loading").removeClass("hidden").addClass("flex")
    const api = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    const response = await api.json();
    ingreMeals = response.meals.slice(0, 20)
    displayIngreMeals()
    $(".loading").removeClass("flex").addClass("hidden")
}
function displayIngreMeals() {
    let contain = ``
    for (var i = 0; i < ingreMeals.length; i++) {
        contain += `
                    <div class="card rounded-[.375rem] hover:cursor-pointer  overflow-hidden relative group" onclick="searchByID('${ingreMeals[i].idMeal}')">
                        <img src="${ingreMeals[i].strMealThumb}" class="w-full" alt="${ingreMeals[i].strMeal} thumbnail">
                        <div class="caption absolute p-[10px] top-0 left-0 right-0 bottom-0 bg-[#ffffffcf] flex  items-center  group-hover:translate-y-[0%] translate-y-[105%] transition-transform duration-[0.5s]">
                            <h3 class="text-[25px] font-semibold">${ingreMeals[i].strMeal}</h3>
                        </div>
                    </div>
                `
    }
    $("#ingrePhotos").html(contain)
}
// end ingredients

// START CONTACT
$("#Contact").on("click", function () {
    $(".all-sections").addClass("hidden")
    $("#contactSection").removeClass("hidden")
})
function nameValidation() {
    let regex = /^[a-zA-Z][a-zA-Z ]+$/gi;
    let myString = $("#nameInputContact").val();
    if (regex.test(myString)) {
        $("#nameInputContact + p").addClass("hidden")
        return true;
    }
    else {
        $("#nameInputContact + p").removeClass("hidden")
        return false;
    }
}
function emailValidation() {
    let regex = /^[\w`~!#$%^&*\-+=\?\/\|'{}]+@[a-zA-Z\-]+\.[a-zA-Z]{2,}$/gi;
    let myString = $("#emailInput").val();
    if (regex.test(myString)) {
        $("#emailInput + p").addClass("hidden")
        return true;
    }
    else {
        $("#emailInput + p").removeClass("hidden")
        return false;
    }
}
function phoneValidation() {
    let regex = /^\+?[0-9]{10,12}$/gi;
    let myString = $("#phoneInput").val();
    if (regex.test(myString)) {
        $("#phoneInput + p").addClass("hidden")
        return true;
    }
    else {
        $("#phoneInput + p").removeClass("hidden")
        return false;
    }
}
function ageValidation() {
    let regex = /^[1-9][0-9]?$|^100$/gi;
    let myString = $("#ageInput").val();
    if (regex.test(myString)) {
        $("#ageInput + p").addClass("hidden")
        return true;
    }
    else {
        $("#ageInput + p").removeClass("hidden")
        return false;
    }
}
function passValidation() {
    let regex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/gi;
    let myString = $("#passwordInput").val();
    if (regex.test(myString)) {
        $("#passwordInput + p").addClass("hidden")
        return true;
    }
    else {
        $("#passwordInput + p").removeClass("hidden")
        return false;
    }
}
function repassValidation() {

    if ($("#passwordInput").val() == $("#repasswordInput").val()) {
        $("#repasswordInput + p").addClass("hidden")
        return true;
    }
    else {
        $("#repasswordInput + p").removeClass("hidden")
        return false;
    }
}

$("#contactSection input").on("input", function () {
    if (nameValidation() && emailValidation() && phoneValidation() && ageValidation() && passValidation() && repassValidation()) {
        $("#submit").removeAttr("disabled")
    }
    else {
        $("#submit").attr("disabled", "true")
    }

})

// END CONTACT