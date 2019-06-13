let a = [36, 40, 43, 1, 2, 3, 4, 5, 6, 7, 2, 323];
let b = [36, 40, 43,5];
let c = [];
for (let key in b) {
    let c = a.filter(item => {
        return item != b[key]
    });
    a = c;
}
console.log(a);