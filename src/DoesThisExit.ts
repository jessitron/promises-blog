
// throwing away a slow promise

sitAround(10).then(() => console.log("yawn"));

console.log("end of file reached");

// it prints "end of file" and then later "yawn" and then exits



function sitAround(seconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}
