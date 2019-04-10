//calculate total price
exports.total = function(price,qty) {
    return (qty * arrSum(price)) + (qty * arrSum(price) * 0.05);
}
//calculate sum of each
function arrSum(arr) {
    return arr.reduce(function(a,b){
        return a + b
    }, 0);
}