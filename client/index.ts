enum Direction {
    add, remove, update
}

interface Event {
  type : Direction
}

interface Context {
  fillRect(x:string,y:string,w:string,h:string);
}

const canvas = document.querySelector("canvas");
const context : Context = canvas.getContext("2d");
context.fillRect(0, 0, canvas.width, canvas.height);

const add : Event = {
  type : Direction.add
}
console.log(add);

const remove : Event = {
  type : Direction.remove
}
console.log(remove);

const update : Event = {
  type : Direction.update
}
console.log(update);