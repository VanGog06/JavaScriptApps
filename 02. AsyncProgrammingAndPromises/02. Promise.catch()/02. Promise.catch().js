console.log("Before promise");

new Promise(function(resolve, reject){
    setTimeout(function() {
        reject("fail");
    }, 500);
})
.then(function(result) {
    console.log("Then returned " + result);
})
.catch(function(error) {
    console.log("Catch returned " + error);
});

console.log("After promise");